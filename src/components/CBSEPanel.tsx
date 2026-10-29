import React, { useState } from 'react';
import {
  Mode,
  CircleParams,
  SquareParams,
  RectangleParams,
  TriangleParams,
  RhombusParams,
  ParallelogramParams,
  ParabolaParams,
  SlopeParams,
} from '../types';
import { CBSE_CHAPTERS, generateLiveCBSEProblem, EXHIBITION_QUIZZES } from '../data/cbseCurriculum';
import { BookOpen, Award, CheckCircle2, XCircle, Copy, Check } from 'lucide-react';

interface CBSEPanelProps {
  mode: Mode;
  circleParams: CircleParams;
  squareParams: SquareParams;
  rectangleParams: RectangleParams;
  triangleParams: TriangleParams;
  rhombusParams: RhombusParams;
  parallelogramParams: ParallelogramParams;
  parabolaParams: ParabolaParams;
  slopeParams: SlopeParams;
}

export const CBSEPanel: React.FC<CBSEPanelProps> = ({
  mode,
  circleParams,
  squareParams,
  rectangleParams,
  triangleParams,
  rhombusParams,
  parallelogramParams,
  parabolaParams,
  slopeParams,
}) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'solver' | 'quiz'>('syllabus');
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const chapters = CBSE_CHAPTERS[mode] || [];
  const quizzes = EXHIBITION_QUIZZES[mode] || [];

  // Triangle side lengths for problem generator
  const triA = Math.hypot(triangleParams.x3 - triangleParams.x2, triangleParams.y3 - triangleParams.y2);
  const triB = Math.hypot(triangleParams.x1 - triangleParams.x3, triangleParams.y1 - triangleParams.y3);
  const triC = Math.hypot(triangleParams.x2 - triangleParams.x1, triangleParams.y2 - triangleParams.y1);

  const liveProblem = generateLiveCBSEProblem(mode, {
    radius: circleParams.r,
    side: squareParams.side,
    width: rectangleParams.width,
    height: rectangleParams.height,
    triSides: [triA, triB, triC],
    d1: rhombusParams.d1,
    d2: rhombusParams.d2,
    base: parallelogramParams.base,
    pHeight: parallelogramParams.height,
    vertexH: parabolaParams.h,
    vertexK: parabolaParams.k,
    archA: parabolaParams.a,
    angleDeg: slopeParams.angleDeg,
    dx: Math.abs(slopeParams.x2 - slopeParams.x1),
    dy: Math.abs(slopeParams.y2 - slopeParams.y1),
    hypotenuse: Math.hypot(slopeParams.x2 - slopeParams.x1, slopeParams.y2 - slopeParams.y1),
    unit: 'm',
  });

  const handleSelectQuiz = (quizId: string, optionIdx: number) => {
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [quizId]: optionIdx,
    }));
  };

  const handleCopySolution = () => {
    const text = `${liveProblem.title}\n\nQuestion:\n${liveProblem.question}\n\nGiven:\n${liveProblem.given.join(
      '\n'
    )}\n\nFormulas Used:\n${liveProblem.formula.join('\n')}\n\nWorking Steps:\n${liveProblem.steps.join(
      '\n'
    )}\n\nAnswer: ${liveProblem.answer}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 p-4 shadow-xl text-slate-200">
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 font-display">
            CBSE Curriculum Reference ({mode.toUpperCase()})
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'syllabus'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NCERT Syllabus
          </button>
          <button
            onClick={() => setActiveTab('solver')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'solver'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Problem Solver
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'quiz'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exhibition Quiz
          </button>
        </div>
      </div>

      {/* TAB 1: SYLLABUS & THEOREMS */}
      {activeTab === 'syllabus' && (
        <div className="flex flex-col gap-3.5 max-h-[480px] overflow-y-auto pr-1">
          {chapters.map((ch) => (
            <div
              key={ch.id}
              className="bg-slate-950/80 rounded-lg border border-slate-800/90 p-3.5 flex flex-col gap-2.5 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-800/60 pb-2">
                <div>
                  <h3 className="text-sm font-semibold text-cyan-300">{ch.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{ch.classGrade}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ch.subject}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400/90">{ch.boardExamWeightage}</span>
                  </div>
                </div>
                <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              </div>

              {/* Core Concepts */}
              <div className="text-xs">
                <span className="text-slate-400 font-medium block mb-1">Prescribed NCERT Topics:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300 ml-1">
                  {ch.coreConcepts.map((concept, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {concept}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Theorems / Formulas */}
              <div className="bg-slate-900/90 p-2.5 rounded border border-cyan-950 text-xs">
                <span className="text-cyan-400 font-semibold block mb-1">Key NCERT Theorems & Formulas:</span>
                <div className="space-y-1 font-mono text-slate-200 text-[11px] leading-relaxed">
                  {ch.keyTheorems.map((thm, idx) => (
                    <p key={idx} className="bg-slate-950/50 p-1.5 rounded border border-slate-800/60">
                      {thm}
                    </p>
                  ))}
                </div>
              </div>

              {/* Real World Connection */}
              <div className="text-[11px] text-slate-400 italic">
                <strong className="text-slate-300 not-italic">Everyday Object Application: </strong>
                {ch.realWorldApplication}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LIVE PROBLEM SOLVER */}
      {activeTab === 'solver' && (
        <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
          <div className="bg-slate-950/90 rounded-lg border border-cyan-900/40 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                {liveProblem.title}
              </span>
              <button
                onClick={handleCopySolution}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                title="Copy complete solution"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Steps'}</span>
              </button>
            </div>

            {/* Question */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-100 font-medium leading-relaxed">
              {liveProblem.question}
            </div>

            {/* Given */}
            <div className="text-xs">
              <span className="text-slate-400 font-semibold block mb-1">Given from Vision Detection:</span>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-800/80 font-mono text-[11px] space-y-0.5 text-slate-300">
                {liveProblem.given.map((g, i) => (
                  <div key={i}>• {g}</div>
                ))}
              </div>
            </div>

            {/* Formula */}
            <div className="text-xs">
              <span className="text-cyan-400 font-semibold block mb-1">Applicable NCERT Formulas:</span>
              <div className="bg-slate-900/50 p-2 rounded border border-cyan-950 font-mono text-[11px] space-y-0.5 text-cyan-200">
                {liveProblem.formula.map((f, i) => (
                  <div key={i}>• {f}</div>
                ))}
              </div>
            </div>

            {/* Working */}
            <div className="text-xs">
              <span className="text-slate-300 font-semibold block mb-1">Step-by-Step Working:</span>
              <div className="space-y-1.5">
                {liveProblem.steps.map((st, i) => (
                  <div
                    key={i}
                    className="bg-slate-900/80 p-2 rounded border border-slate-800 font-mono text-[11px] text-slate-200 leading-relaxed"
                  >
                    {st}
                  </div>
                ))}
              </div>
            </div>

            {/* Answer */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-lg text-xs font-semibold text-emerald-300 text-center font-mono">
              Final Answer: {liveProblem.answer}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ */}
      {activeTab === 'quiz' && (
        <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
          <div className="text-xs text-slate-400 flex items-center justify-between pb-1">
            <span>Test understanding of {mode} geometry</span>
            <span className="font-mono text-cyan-400">
              {Object.keys(selectedQuizAnswers).length}/{quizzes.length} Answered
            </span>
          </div>

          {quizzes.map((q, idx) => {
            const chosen = selectedQuizAnswers[q.id];
            const isAnswered = chosen !== undefined;
            const isCorrect = isAnswered && chosen === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-slate-950/80 rounded-lg border border-slate-800 p-3 flex flex-col gap-2.5 text-xs"
              >
                <div className="font-semibold text-slate-200 leading-relaxed flex items-start gap-2">
                  <span className="text-cyan-400 font-mono">Q{idx + 1}.</span>
                  <span>{q.question}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {q.options.map((opt, optIdx) => {
                    let btnClass = 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800';
                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnClass = 'bg-emerald-950/60 text-emerald-200 border-emerald-500/60 font-semibold';
                      } else if (optIdx === chosen) {
                        btnClass = 'bg-rose-950/60 text-rose-200 border-rose-500/60';
                      } else {
                        btnClass = 'bg-slate-900/40 text-slate-500 border-slate-800/40';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectQuiz(q.id, optIdx)}
                        className={`text-left p-2 rounded border transition-colors flex items-center justify-between text-xs ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1.5" />
                        )}
                        {isAnswered && optIdx === chosen && optIdx !== q.correctIndex && (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div
                    className={`p-2 rounded text-[11px] leading-relaxed border ${
                      isCorrect
                        ? 'bg-emerald-950/30 text-emerald-300 border-emerald-900/50'
                        : 'bg-rose-950/30 text-rose-300 border-rose-900/50'
                    }`}
                  >
                    <strong className="block font-semibold mb-0.5">{isCorrect ? 'Correct!' : 'Incorrect:'}</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
