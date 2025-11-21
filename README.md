# MedDraft App – Transcript vs Reference Evaluation

MedDraft is a lightweight web application that compares a transcript against a reference text using OpenAI or Gemini models. It generates evaluation metrics and provides visual charts for deeper analysis.

##  Live Demo
https://med-draft-project.vercel.app/

## Overview
MedDraft allows users to:
- Input transcript and reference SOAP notes
- Select an AI model (OpenAI or Gemini via OpenRouter)
- Generate evaluation metrics (accuracy, BLEU-like score, cosine similarity)
- View detailed comparison charts
- Clear all results with a single button

Built with **Next.js**, **React**, and **Tailwind CSS**.


## Installation (Optional – for local run)

```bash
 git clone https://github.com/LaibaaZahid/MedDraft-Project.git
 cd MedDraft-Project
 npm install
 npm run dev
```
then open
```bash
http://localhost:3000
```
## Notes & Limitations

- Free-tier limits on OpenRouter may cause:
  - Low rate limits
  - Occasional provider errors
- Some models may respond slower depending on load
- ROUGE/BERTScore are not included due to module instability in Next.js

## Create a .env file in the project root and Add your API keys like this:

```bash
 AI_API_KEY=your_openai_key_here
 GEMINI_API_KEY=your_gemini_key_here
```

