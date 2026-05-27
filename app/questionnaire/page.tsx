"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
/* ══════════════════════════════════════
   TYPES
══════════════════════════════════════ */
interface Question {
  id: number;
  emoji: string;
  tag: string;
  question: string;
  options: string[];
  accent: string;
  accentDeep: string;
  meshA: string;
  meshB: string;
}

interface ResultsPageProps {
  answers: string[];
  onRestart: () => void;
}

interface OptionBtnProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  accent: string;
  accentDeep: string;
  index: number;
}

/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const questions: Question[] = [
  {
    id: 0, emoji: "🩸", tag: "Menstrual Health",
    question: "Do you experience irregular periods?",
    options: ["Yes", "No"],
    accent: "#F472B6", accentDeep: "#BE185D",
    meshA: "#F472B630", meshB: "#BE185D1a",
  },
  {
    id: 1, emoji: "✨", tag: "Skin Health",
    question: "Do you have acne issues?",
    options: ["Rarely", "Sometimes", "Frequently"],
    accent: "#FB923C", accentDeep: "#C2410C",
    meshA: "#FB923C30", meshB: "#C2410C1a",
  },
  {
    id: 2, emoji: "⚖️", tag: "Body Weight",
    question: "Have you experienced weight gain recently?",
    options: ["Yes", "No"],
    accent: "#A78BFA", accentDeep: "#6D28D9",
    meshA: "#A78BFA30", meshB: "#6D28D91a",
  },
  {
    id: 3, emoji: "🌿", tag: "Hair Growth",
    question: "Do you have excessive hair growth?",
    options: ["Yes", "No"],
    accent: "#34D399", accentDeep: "#065F46",
    meshA: "#34D39930", meshB: "#065F461a",
  },
  {
    id: 4, emoji: "😴", tag: "Energy Levels",
    question: "Do you feel tired frequently?",
    options: ["Yes", "No"],
    accent: "#60A5FA", accentDeep: "#1D4ED8",
    meshA: "#60A5FA30", meshB: "#1D4ED81a",
  },
  {
    id: 5, emoji: "💫", tag: "Mental Wellness",
    question: "Do you experience mood swings?",
    options: ["Rarely", "Sometimes", "Frequently"],
    accent: "#F9A8D4", accentDeep: "#9D174D",
    meshA: "#F9A8D430", meshB: "#9D174D1a",
  },
];

/* ══════════════════════════════════════
   RESULTS PAGE
══════════════════════════════════════ */
function ResultsPage({ answers, onRestart }: ResultsPageProps) {
  const riskScore = [
    answers[0] === "Yes" ? 2 : 0,
    answers[1] === "Frequently" ? 2 : answers[1] === "Sometimes" ? 1 : 0,
    answers[2] === "Yes" ? 2 : 0,
    answers[3] === "Yes" ? 2 : 0,
    answers[4] === "Yes" ? 1 : 0,
    answers[5] === "Frequently" ? 2 : answers[5] === "Sometimes" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const maxScore = 11;
  const pct = Math.round((riskScore / maxScore) * 100);

  const level =
    pct >= 70
      ? { label: "High Risk", color: "#F472B6", deep: "#BE185D", msg: "Several PCOS indicators are present. We strongly recommend consulting a gynecologist or endocrinologist." }
      : pct >= 40
      ? { label: "Moderate Risk", color: "#FB923C", deep: "#C2410C", msg: "Some PCOS symptoms may be present. Consider discussing these with your healthcare provider." }
      : { label: "Low Risk", color: "#34D399", deep: "#065F46", msg: "Few PCOS indicators detected. Keep monitoring your health and maintain a balanced lifestyle." };

  const tags = [
    { label: "Irregular Periods", active: answers[0] === "Yes", emoji: "🩸" },
    { label: "Acne Issues", active: answers[1] !== "Rarely", emoji: "✨" },
    { label: "Weight Gain", active: answers[2] === "Yes", emoji: "⚖️" },
    { label: "Excess Hair", active: answers[3] === "Yes", emoji: "🌿" },
    { label: "Fatigue", active: answers[4] === "Yes", emoji: "😴" },
    { label: "Mood Swings", active: answers[5] !== "Rarely", emoji: "💫" },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh", position: "relative",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ma { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(38px,-26px) scale(1.09)} }
        @keyframes mb { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-28px,32px) scale(1.07)} }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "linear-gradient(135deg,#07070e 0%,#0d0818 38%,#100b1b 65%,#080b13 100%)" }} />
      <div style={{ position: "fixed", top: "-18%", left: "-12%", width: "62vw", height: "62vw", maxWidth: 720, borderRadius: "50%", background: `radial-gradient(circle,${level.color}25 0%,transparent 65%)`, filter: "blur(75px)", pointerEvents: "none", zIndex: 1, animation: "ma 13s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "-16%", right: "-12%", width: "56vw", height: "56vw", maxWidth: 680, borderRadius: "50%", background: `radial-gradient(circle,${level.deep}18 0%,transparent 65%)`, filter: "blur(75px)", pointerEvents: "none", zIndex: 1, animation: "mb 15s ease-in-out infinite" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`, backgroundSize: "44px 44px" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", background: "radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,0.6) 100%)" }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 468, padding: "0 14px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%", borderRadius: 26,
            background: "rgba(255,255,255,0.055)",
            backdropFilter: "blur(44px) saturate(180%)",
            WebkitBackdropFilter: "blur(44px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "26px 22px 22px",
            boxShadow: `0 28px 75px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.1)`,
            position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg,transparent,${level.deep},${level.color},${level.deep},transparent)`, borderRadius: "0 0 4px 4px" }} />

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              style={{ fontSize: 44, marginBottom: 10 }}
            >
              🩺
            </motion.div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 700, color: "white", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 6 }}>
              Assessment Results
            </h1>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: ".05em", textTransform: "uppercase", fontWeight: 600 }}>PCOS Symptom Check</p>
          </div>

          {/* Risk Level Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              textAlign: "center", marginBottom: 20,
              padding: "16px", borderRadius: 18,
              background: `linear-gradient(135deg,${level.deep}25,${level.color}20)`,
              border: `1.5px solid ${level.color}40`,
              boxShadow: `0 8px 30px ${level.color}20`,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: level.color, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>{level.label}</div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 40, fontWeight: 700, color: "white", lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>risk indicators</div>
          </motion.div>

          {/* Progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ width: "100%", height: 8, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg,${level.deep},${level.color})`, boxShadow: `0 0 12px ${level.color}80` }}
              />
            </div>
          </div>

          {/* Symptoms grid */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>Symptoms Detected</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {tags.map((t, i) => (
                <motion.div
                  key={t.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 11px", borderRadius: 12,
                    background: t.active ? `${level.color}15` : "rgba(255,255,255,0.04)",
                    border: t.active ? `1px solid ${level.color}40` : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span style={{ fontSize: 13 }}>{t.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: t.active ? 600 : 400, color: t.active ? level.color : "rgba(255,255,255,0.3)", lineHeight: 1.2 }}>{t.label}</span>
                  {t.active && <span style={{ marginLeft: "auto", fontSize: 9, color: level.color }}>●</span>}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              padding: "13px 15px", borderRadius: 14, marginBottom: 18,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{level.msg}</p>
          </motion.div>

          {/* Disclaimer */}
          <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.5, marginBottom: 16 }}>
            ⚕️ This is not a medical diagnosis. Always consult a qualified healthcare professional.
          </p>

          {/* Restart */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRestart}
            style={{
              width: "100%", padding: "13px", borderRadius: 99, border: "none",
              cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              color: "white", letterSpacing: "0.01em",
              background: `linear-gradient(135deg,${level.deep},${level.color})`,
              boxShadow: `0 6px 22px ${level.color}50`,
            }}
          >
            Retake Assessment ↩
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   OPTION BUTTON
══════════════════════════════════════ */
function OptionBtn({ label, selected, onClick, accent, accentDeep, index }: OptionBtnProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.07, duration: 0.32 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        width: "100%", padding: "13px 16px", borderRadius: 14,
        border: selected ? `1.5px solid ${accent}65` : "1.5px solid rgba(255,255,255,0.09)",
        background: selected ? `linear-gradient(135deg,${accentDeep}2a,${accent}25)` : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "border 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
        boxShadow: selected ? `0 4px 20px ${accent}28` : "none",
      }}
    >
      <span style={{ fontSize: 14, fontWeight: selected ? 600 : 400, color: selected ? accent : "rgba(255,255,255,0.6)", fontFamily: "inherit", letterSpacing: "-0.01em", transition: "color 0.2s" }}>
        {label}
      </span>
      <div
        style={{
          width: 20, height: 20, borderRadius: "50%",
          border: selected ? `2px solid ${accent}` : "2px solid rgba(255,255,255,0.18)",
          background: selected ? `linear-gradient(135deg,${accentDeep},${accent})` : "rgba(255,255,255,0.04)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.2s",
          boxShadow: selected ? `0 0 8px ${accent}60` : "none",
        }}
      >
        {selected && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />}
      </div>
    </motion.button>
  );
}

/* ══════════════════════════════════════
   MAIN QUESTIONNAIRE
══════════════════════════════════════ */
export default function Questionnaire() {
  const router = useRouter();
  const [current, setCurrent]     = useState<number>(0);
  const [selected, setSelected]   = useState<string>("");
  const [answers, setAnswers]     = useState<string[]>([]);
  const [dir, setDir]             = useState<number>(1);
  const [showResults, setShowResults]   = useState<boolean>(false);
  const [finalAnswers, setFinalAnswers] = useState<string[]>([]);

  const q        = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const answered = answers.filter(Boolean).length;

  const next = () => {
    if (!selected) return;
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    if (current < questions.length - 1) {
      setDir(1);
      setCurrent((p) => p + 1);
      setSelected(updated[current + 1] ?? "");
    } else {
      // ✅ Pass answers via URL so ResultClient receives real data
      router.push(`/result?data=${encodeURIComponent(JSON.stringify(updated))}`);
    }
  };

  const prev = () => {
    if (current > 0) {
      setDir(-1);
      setCurrent((p) => p - 1);
      setSelected(answers[current - 1] ?? "");
    }
  };

  const viewResults = () => {
    const filled = [...answers];
    if (selected) filled[current] = selected;
    setFinalAnswers(filled);
    setShowResults(true);
  };

  const restart = () => {
    setCurrent(0);
    setSelected("");
    setAnswers([]);
    setDir(1);
    setShowResults(false);
    setFinalAnswers([]);
  };

  if (showResults) return <ResultsPage answers={finalAnswers} onRestart={restart} />;

  return (
    <div
      style={{
        minHeight: "100dvh", maxHeight: "100dvh", overflow: "hidden",
        position: "relative", fontFamily: "'DM Sans', sans-serif",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ma  { 0%,100%{transform:translate(0,0) scale(1)}   50%{transform:translate(38px,-26px) scale(1.09)} }
        @keyframes mb  { 0%,100%{transform:translate(0,0) scale(1)}   50%{transform:translate(-28px,32px) scale(1.07)} }
        @keyframes mc  { 0%,100%{transform:translate(0,0)}            50%{transform:translate(20px,18px)} }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "linear-gradient(135deg,#07070e 0%,#0d0818 38%,#100b1b 65%,#080b13 100%)" }} />
      <div style={{ position: "fixed", top: "-18%", left: "-12%", width: "62vw", height: "62vw", maxWidth: 720, borderRadius: "50%", background: `radial-gradient(circle,${q.meshA} 0%,transparent 65%)`, filter: "blur(75px)", pointerEvents: "none", zIndex: 1, animation: "ma 13s ease-in-out infinite", transition: "background 0.8s ease" }} />
      <div style={{ position: "fixed", bottom: "-16%", right: "-12%", width: "56vw", height: "56vw", maxWidth: 680, borderRadius: "50%", background: `radial-gradient(circle,${q.meshB} 0%,transparent 65%)`, filter: "blur(75px)", pointerEvents: "none", zIndex: 1, animation: "mb 15s ease-in-out infinite", transition: "background 0.8s ease" }} />
      <div style={{ position: "fixed", top: "38%", left: "36%", width: "40vw", height: "40vw", maxWidth: 500, borderRadius: "50%", background: `radial-gradient(circle,${q.meshA} 0%,transparent 70%)`, filter: "blur(82px)", pointerEvents: "none", zIndex: 1, animation: "mc 11s ease-in-out infinite", opacity: 0.45, transition: "background 0.8s ease" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`, backgroundSize: "44px 44px" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", background: "radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,0.6) 100%)" }} />

      {/* TOP NAV */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 20px",
          background: "rgba(7,7,14,0.75)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${q.accentDeep},${q.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "background 0.6s ease", boxShadow: `0 4px 14px ${q.accent}45` }}>🩺</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontFamily: "'Fraunces',serif", letterSpacing: "-0.01em", lineHeight: 1.1 }}>PCOS Check</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 500, letterSpacing: ".04em" }}>Symptom Assessment</div>
          </div>
        </div>

        <AnimatePresence>
          {answered > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85, x: 12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={viewResults}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "8px 15px", borderRadius: 99,
                background: `linear-gradient(135deg,${q.accentDeep},${q.accent})`,
                border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                color: "white", letterSpacing: "0.01em",
                boxShadow: `0 4px 18px ${q.accent}50`,
              }}
            >
              View Results <span style={{ fontSize: 11, opacity: 0.85 }}>→</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* CARD */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 468, padding: "0 14px", marginTop: 58 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 * dir, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14 * dir, scale: 0.98 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%", borderRadius: 26,
              background: "rgba(255,255,255,0.055)",
              backdropFilter: "blur(44px) saturate(180%)",
              WebkitBackdropFilter: "blur(44px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "22px 20px 18px",
              boxShadow: `0 28px 75px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.1),0 0 0 1px rgba(255,255,255,0.03)`,
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg,transparent,${q.accentDeep},${q.accent},${q.accentDeep},transparent)`, borderRadius: "0 0 4px 4px", transition: "background 0.6s ease" }} />
            <div style={{ position: "absolute", top: -50, right: -50, width: 155, height: 155, borderRadius: "50%", background: `${q.accent}10`, pointerEvents: "none", transition: "background .6s" }} />
            <div style={{ position: "absolute", bottom: -40, left: -40, width: 120, height: 120, borderRadius: "50%", background: `${q.accentDeep}09`, pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <motion.div
                key={`tag-${current}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: `${q.accent}1a`, border: `1px solid ${q.accent}40` }}
              >
                <span style={{ fontSize: 12 }}>{q.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: q.accent, letterSpacing: ".08em", textTransform: "uppercase" }}>{q.tag}</span>
              </motion.div>
              <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                {current + 1}<span style={{ color: "rgba(255,255,255,0.15)", margin: "0 3px" }}>/</span>{questions.length}
              </span>
            </div>

            <div style={{ width: "100%", height: 3, borderRadius: 99, background: "rgba(255,255,255,0.07)", marginBottom: 20, overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg,${q.accentDeep},${q.accent})`, boxShadow: `0 0 10px ${q.accent}80`, transition: "background 0.6s ease" }}
              />
            </div>

            <motion.h2
              key={`q-${current}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(19px,3.6vw,24px)", fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 16, letterSpacing: "-0.02em" }}
            >
              {q.question}
            </motion.h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
              {q.options.map((opt, i) => (
                <OptionBtn
                  key={opt}
                  label={opt}
                  selected={selected === opt}
                  onClick={() => setSelected(opt)}
                  accent={q.accent}
                  accentDeep={q.accentDeep}
                  index={i}
                />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={prev}
                disabled={current === 0}
                style={{ background: "none", border: "none", cursor: current === 0 ? "default" : "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: current === 0 ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.42)", padding: "8px 4px", transition: "color 0.2s" }}
              >
                ← Back
              </button>

              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {questions.map((_, i) => (
                  <div
                    key={i}
                    style={{ height: 4, borderRadius: 99, width: i === current ? 22 : 6, background: i === current ? `linear-gradient(90deg,${q.accentDeep},${q.accent})` : i < current ? `${q.accent}55` : "rgba(255,255,255,0.1)", boxShadow: i === current ? `0 0 8px ${q.accent}70` : "none", transition: "all .35s cubic-bezier(.34,1.56,.64,1)" }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={selected ? { scale: 1.05 } : {}}
                whileTap={selected ? { scale: 0.96 } : {}}
                onClick={next}
                style={{ padding: "11px 20px", borderRadius: 99, border: "none", cursor: selected ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: 13, fontWeight: 700, color: selected ? "white" : "rgba(255,255,255,0.15)", background: selected ? `linear-gradient(135deg,${q.accentDeep},${q.accent})` : "rgba(255,255,255,0.06)", boxShadow: selected ? `0 6px 22px ${q.accent}50` : "none", transition: "all 0.25s ease", letterSpacing: "0.01em" }}
              >
                {current === questions.length - 1 ? "See Results ✨" : "Next →"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ display: "flex", justifyContent: "center", marginTop: 14 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 99, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: q.accent, boxShadow: `0 0 7px ${q.accent}`, transition: "background 0.5s, box-shadow 0.5s" }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.32)", letterSpacing: ".04em" }}>
              Question {current + 1} of {questions.length}
              {answered > 0 && (
                <span style={{ color: q.accent, marginLeft: 5, transition: "color 0.5s" }}>· {answered} answered</span>
              )}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}