export const runtime = "nodejs";

import OpenAI from "openai";

const openAIClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.AI_API_KEY,
});
const geminiClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEMINI_API_KEY,
});

const OPENAI_MODEL = "openai/gpt-oss-20b:free";
const GEMINI_MODEL = "google/gemini-2.0-flash-exp:free";

async function generateOpenAI(transcript, model = OPENAI_MODEL) {
  try {
    const completion = await openAIClient.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a medical assistant. Convert the patient's conversation into a structured SOAP note." },
        { role: "user", content: transcript },
      ],
      temperature: 0.3,
    });
    return completion.choices?.[0]?.message?.content ?? "";
  } catch (err) {
    handleAPIError(err, "OpenAI");
  }
}

async function generateGemini(transcript, model = GEMINI_MODEL, retries = 3) {
  let attempt = 0;
  const baseDelay = 800;

  while (attempt < retries) {
    try {
      const completion = await geminiClient.chat.completions.create({
        model,
        messages: [
        { role: "system", content: "You are a medical assistant. Convert the patient's conversation into a structured SOAP note." },
          { role: "user", content: [{ type: "text", text: transcript }] },
        ],
        temperature: 0.3,
      });
      return completion.choices?.[0]?.message?.content ?? "";
    } catch (err) {
      attempt++;
      const retryable = isRetryable(err);

      console.warn(`generateGemini attempt ${attempt} failed:`, err?.message || err);

      if (!retryable || attempt >= retries) {
        handleAPIError(err, "Gemini");
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("generateGemini: exhausted retries");
}

function isRetryable(err) {
  const msg = String(err?.message || "").toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("rate limit") ||
    msg.includes("timeout") ||
    msg.includes("503") ||
    msg.includes("5xx") ||
    msg.includes("provider returned error")
  );
}

function handleAPIError(err, providerName) {
  const status = err?.status || err?.statusCode;
  const msg = String(err?.message || err);

  if (status === 401 || status === 403 || msg.toLowerCase().includes("invalid api key")) {
    throw new Error(`${providerName}: Invalid API key`);
  } else if (status === 429 || msg.toLowerCase().includes("rate limit")) {
    throw new Error(`${providerName}: Rate limit exceeded, please try again later`);
  } else {
    throw new Error(`${providerName}: Temporary failure, please try again`);
  }
}

function simpleBLEU(reference, candidate) {
  const refTokens = (reference || "").trim().split(/\s+/).filter(Boolean);
  const candTokens = (candidate || "").trim().split(/\s+/).filter(Boolean);
  if (candTokens.length === 0) return 0;
  const matches = candTokens.filter((t) => refTokens.includes(t));
  return matches.length / candTokens.length;
}
// Token-level Accuracy
function simpleAccuracy(reference, candidate) {
  const refTokens = (reference || "").trim().split(/\s+/).filter(Boolean);
  const candTokens = (candidate || "").trim().split(/\s+/).filter(Boolean);
  if (!refTokens.length) return 0;
  const minLen = Math.min(refTokens.length, candTokens.length);
  let correct = 0;
  for (let i = 0; i < minLen; i++) {
    if (refTokens[i] === candTokens[i]) correct++;
  }
  return correct / refTokens.length;
}

// Cosine Similarity using token frequency vectors
function cosineSimilarity(reference, candidate) {
  const refTokens = (reference || "").trim().split(/\s+/).filter(Boolean);
  const candTokens = (candidate || "").trim().split(/\s+/).filter(Boolean);
  const allTokens = Array.from(new Set([...refTokens, ...candTokens]));

  const vecA = allTokens.map(t => refTokens.filter(x => x === t).length);
  const vecB = allTokens.map(t => candTokens.filter(x => x === t).length);

  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  return magA && magB ? dot / (magA * magB) : 0;
}

export async function POST(req) {
  try {
    const { transcript, reference, models } = await req.json();

    if (!transcript || !models?.length) {
      return new Response(JSON.stringify({ error: "Missing transcript or models" }), { status: 400 });
    }

    const results = [];

    for (const model of models) {
      let soapNote = "";
      let error = null;

      try {
        if (String(model).toLowerCase().includes("gemini")) {
          soapNote = await generateGemini(transcript);
        } else {
          soapNote = await generateOpenAI(transcript);
        }
      } catch (err) {
        console.error(`Failed to generate SOAP note for model ${model}:`, err.message || err);
        error = err.message || String(err);
      }

      const bleu = reference ? simpleBLEU(reference, soapNote) : 0;
      const accuracy = reference ? simpleAccuracy(reference, soapNote) : 0;
      const cosine = reference ? cosineSimilarity(reference, soapNote) : 0;

      results.push({
        model,
        soapNote: soapNote || "",
        metrics: { 
          bleu: Number(bleu.toFixed(3)),
          accuracy: Number(accuracy.toFixed(3)),
          cosine: Number(cosine.toFixed(3))
        },
        error,
      });

      await new Promise((r) => setTimeout(r, 350));
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Route error:", err);
    return new Response(JSON.stringify({ error: err?.message || "Failed to generate" }), { status: 500 });
  }
}
