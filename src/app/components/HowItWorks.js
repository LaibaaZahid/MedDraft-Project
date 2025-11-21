"use client";

export default function HowItWorks() {
  const steps = [
    {
      title: "1. Upload Files",
      desc: "Upload the transcript (.txt) and the reference SOAP note (.txt). Make sure both files are selected before proceeding.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
    },
    {
      title: "2. Select Models",
      desc: "Choose one or more AI models (OpenAI / Gemini). You can compare outputs by selecting multiple models.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M6 6v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M18 6v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: "3. Generate SOAP Notes",
      desc: "Click Generate to run the selected models on the uploaded transcript. AI-generated SOAP notes will appear in the results panel.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M5 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: "4. Evaluate",
      desc: "Click Evaluate to compute metrics and compare model outputs (BLEU, etc.). Use the chart to choose the best result.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M12 16V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M17 16v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full py-20 flex justify-center">
      {/* Main card container */}
      <div className="max-w-6xl w-full bg-[#d8edff] rounded-3xl p-10 border-4 border-[#ccf1f9] shadow-[30px_30px_30px_rgba(0,0,0,0.3)]">
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8">How It Works</h2>
        <p className="text-center text-blue-600 mb-10 max-w-3xl mx-auto">
          A simple 4-step flow to convert conversations into structured SOAP notes using multiple AI models — upload, choose, generate and evaluate.
        </p>

        {/* Inner step cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <article
              key={s.title}
              className={`group relative bg-white/90 border border-blue-100 rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl`}
              style={{ animation: `fadeUp .6s ease forwards`, animationDelay: `${i * 120}ms`, opacity: 0 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-sky-400 text-white shadow">
                  {s.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800">{s.title}</h3>
              </div>

              <p className="text-sm text-slate-600 mb-6">{s.desc}</p>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-xs bg-linear-to-r from-sky-100 to-blue-100 px-3 py-1 rounded-full border border-blue-200 text-blue-700 shadow-sm">
                  Step {i + 1}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* animations */}
      <style jsx>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(18px) scale(0.995); }
          60% { opacity: 1; transform: translateY(-6px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
