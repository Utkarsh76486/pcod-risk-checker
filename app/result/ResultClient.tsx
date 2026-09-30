"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ══════════════════════════════════════
   QUESTION META
══════════════════════════════════════ */
const questionMeta = [
  { emoji: "🩸", tag: "Irregular Periods",  accent: "#F472B6", accentDeep: "#BE185D", highAnswers: ["Yes"] },
  { emoji: "✨", tag: "Acne",               accent: "#FB923C", accentDeep: "#C2410C", highAnswers: ["Frequently"], mediumAnswers: ["Sometimes"] },
  { emoji: "⚖️", tag: "Weight Gain",        accent: "#A78BFA", accentDeep: "#6D28D9", highAnswers: ["Yes"] },
  { emoji: "🌿", tag: "Excess Hair",        accent: "#34D399", accentDeep: "#065F46", highAnswers: ["Yes"] },
  { emoji: "😴", tag: "Fatigue",            accent: "#60A5FA", accentDeep: "#1D4ED8", highAnswers: ["Yes"] },
  { emoji: "💫", tag: "Mood Swings",        accent: "#F9A8D4", accentDeep: "#9D174D", highAnswers: ["Frequently"], mediumAnswers: ["Sometimes"] },
];

/* ══════════════════════════════════════
   RISK CONFIG  (pct = 0-100)
══════════════════════════════════════ */
function getConfig(pct: number) {
  if (pct <= 30) return {
    level: "Low Risk", emoji: "🌸", headline: "You're Looking Good!",
    subtext: "Minimal PCOS indicators. Keep monitoring your health regularly.",
    accentA: "#34D399", accentB: "#059669",
    meshA: "#34D39932", meshB: "#6EE7B722", meshC: "#A7F3D018",
  };
  if (pct <= 65) return {
    level: "Moderate Risk", emoji: "⚡", headline: "Worth Paying Attention To",
    subtext: "Some symptoms may warrant a closer look. Consult a gynaecologist.",
    accentA: "#FBBF24", accentB: "#D97706",
    meshA: "#FBBF2432", meshB: "#FDE68A22", meshC: "#FEF3C718",
  };
  return {
    level: "High Risk", emoji: "🔴", headline: "Please Consult a Doctor",
    subtext: "Several PCOS symptoms detected. Schedule an appointment soon.",
    accentA: "#F87171", accentB: "#DC2626",
    meshA: "#F8717132", meshB: "#FCA5A522", meshC: "#FEE2E218",
  };
}

/* ══════════════════════════════════════
   SCORE RING
══════════════════════════════════════ */
function ScoreRing({ pct, accentA, accentB }: {
  pct: number; accentA: string; accentB: string;
}) {
  const [n, setN] = useState(0);
  const r = 42, circ = 2 * Math.PI * r;

  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1200, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * pct));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  return (
    <div style={{ position: "relative", width: 106, height: 106, flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: -10, borderRadius: "50%",
        background: `radial-gradient(circle,${accentA}38 0%,transparent 68%)`,
        animation: "ringPulse 2.6s ease-in-out infinite",
      }} />
      <svg width={106} height={106} viewBox="0 0 106 106" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={53} cy={53} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <motion.circle
          cx={53} cy={53} r={r} fill="none" stroke="url(#rg)"
          strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        />
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentB} />
            <stop offset="100%" stopColor={accentA} />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Fraunces',serif", color: "white", lineHeight: 1 }}>{n}%</span>
        <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", marginTop: 2 }}>risk</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN
══════════════════════════════════════ */
export default function ResultClient() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [ml, setMl] = useState<{ risk_probability: number } | null>(null);
  const [mlLoading, setMlLoading] = useState(false);

  // URL se answers padho
  useEffect(() => {
    try {
      const raw = new URLSearchParams(window.location.search).get("data");
      if (raw) {
        const p = JSON.parse(decodeURIComponent(raw));
        if (Array.isArray(p)) setAnswers(p);
      }
    } catch {}
    setReady(true);
  }, []);

  // ML model se prediction lo
  useEffect(() => {
    if (!ready || answers.length === 0) return;
    const ctrl = new AbortController();
    setMlLoading(true);
    fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: Array.from({ length: 6 }, (_, i) => answers[i] ?? null),
      }),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.risk_probability === "number") setMl(d);
      })
      .catch(() => {})
      .finally(() => setMlLoading(false));
    return () => ctrl.abort();
  }, [ready, answers]);

  const symptoms = questionMeta.map((m, i) => {
    const ans = answers[i] || "No";
    const hi  = (m.highAnswers   || []).includes(ans);
    const med = ((m as any).mediumAnswers || []).includes(ans);
    return { ...m, ans, sev: hi ? "high" : med ? "medium" : "low" as "high"|"medium"|"low" };
  });

  const score   = symptoms.reduce((a, s) => a + (s.sev === "high" ? 1 : s.sev === "medium" ? 0.5 : 0), 0);
  const total   = questionMeta.length;
  const rulePct = Math.round((score / total) * 100);
  const pct     = ml ? Math.round(ml.risk_probability) : rulePct;  // ML fail ho to purana score
  const cfg     = getConfig(pct);

  if (!ready) return null;

  return (
    <div style={{
      minHeight: "100dvh", maxHeight: "100dvh",
      overflow: "hidden", position: "relative",
      fontFamily: "'DM Sans',sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes ringPulse{0%,100%{opacity:.45;transform:scale(1)}50%{opacity:.85;transform:scale(1.07)}}
        @keyframes ma{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(38px,-28px) scale(1.1)}}
        @keyframes mb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,34px) scale(1.07)}}
        @keyframes mc{0%,100%{transform:translate(0,0)}50%{transform:translate(22px,20px)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        .float{animation:float 3.6s ease-in-out infinite}
      `}</style>

      <div style={{ position:"fixed",inset:0,zIndex:0,background:"linear-gradient(135deg,#07070e 0%,#0d0818 38%,#100b1b 65%,#080b13 100%)" }} />

      <div style={{ position:"fixed",top:"-18%",left:"-12%",width:"62vw",height:"62vw",maxWidth:720,borderRadius:"50%",background:`radial-gradient(circle,${cfg.meshA} 0%,transparent 65%)`,filter:"blur(75px)",pointerEvents:"none",zIndex:1,animation:"ma 13s ease-in-out infinite",transition:"background .9s" }} />
      <div style={{ position:"fixed",bottom:"-16%",right:"-12%",width:"56vw",height:"56vw",maxWidth:680,borderRadius:"50%",background:`radial-gradient(circle,${cfg.meshB} 0%,transparent 65%)`,filter:"blur(75px)",pointerEvents:"none",zIndex:1,animation:"mb 15s ease-in-out infinite",transition:"background .9s" }} />
      <div style={{ position:"fixed",top:"38%",left:"36%",width:"42vw",height:"42vw",maxWidth:520,borderRadius:"50%",background:`radial-gradient(circle,${cfg.meshC} 0%,transparent 70%)`,filter:"blur(82px)",pointerEvents:"none",zIndex:1,animation:"mc 11s ease-in-out infinite",opacity:.6 }} />

      <div style={{ position:"fixed",inset:0,zIndex:2,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",backgroundSize:"44px 44px" }} />
      <div style={{ position:"fixed",inset:0,zIndex:2,pointerEvents:"none",background:"radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.55) 100%)" }} />

      {/* ══════════════ CARD ══════════════ */}
      <motion.div
        initial={{ opacity:0, y:26, scale:0.96 }}
        animate={{ opacity:1, y:0,  scale:1   }}
        transition={{ duration:.5, ease:[0.22,1,0.36,1] }}
        style={{
          position:"relative",zIndex:10,
          width:"100%",maxWidth:468,
          margin:"0 14px",
          borderRadius:26,
          background:"rgba(255,255,255,0.055)",
          backdropFilter:"blur(44px) saturate(180%)",
          WebkitBackdropFilter:"blur(44px) saturate(180%)",
          border:"1px solid rgba(255,255,255,0.1)",
          boxShadow:`0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.03)`,
          overflow:"hidden",
        }}
      >
        <div style={{ height:3, background:`linear-gradient(90deg,transparent,${cfg.accentB},${cfg.accentA},${cfg.accentB},transparent)`, transition:"background .7s" }} />

        <div style={{ position:"absolute",top:-55,right:-55,width:160,height:160,borderRadius:"50%",background:`${cfg.accentA}10`,pointerEvents:"none",transition:"background .7s" }} />
        <div style={{ position:"absolute",bottom:-45,left:-45,width:130,height:130,borderRadius:"50%",background:`${cfg.accentB}08`,pointerEvents:"none" }} />

        <div style={{ padding:"20px 20px 18px" }}>

          {/* Top row */}
          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:.12}}
            style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}
          >
            <div style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:99,background:`${cfg.accentA}1a`,border:`1px solid ${cfg.accentA}40` }}>
              <span style={{fontSize:10}}>🩺</span>
              <span style={{fontSize:9.5,fontWeight:700,color:cfg.accentA,letterSpacing:".09em",textTransform:"uppercase"}}>PCOS Assessment</span>
            </div>
            <div style={{ padding:"5px 11px",borderRadius:99,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.09)",fontSize:10.5,fontWeight:600,color:"rgba(255,255,255,0.35)" }}>Results</div>
          </motion.div>

          {/* Hero: ring + headline */}
          <div style={{ display:"flex",gap:16,alignItems:"center",marginBottom:16 }}>
            <ScoreRing pct={pct} accentA={cfg.accentA} accentB={cfg.accentB} />
            <div style={{flex:1,minWidth:0}}>
              <motion.div className="float" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}}
                style={{fontSize:28,lineHeight:1,marginBottom:7}}>{cfg.emoji}</motion.div>
              <motion.h1
                initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:.27}}
                style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(16px,3.2vw,20px)",fontWeight:700,color:"white",lineHeight:1.25,letterSpacing:"-0.02em",marginBottom:8}}
              >{cfg.headline}</motion.h1>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.34}}
                style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:99,background:`linear-gradient(135deg,${cfg.accentB}28,${cfg.accentA}35)`,border:`1.5px solid ${cfg.accentA}45`}}
              >
                <div style={{width:5,height:5,borderRadius:"50%",background:cfg.accentA,boxShadow:`0 0 6px ${cfg.accentA}`}} />
                <span style={{fontSize:11,fontWeight:700,color:cfg.accentA,letterSpacing:".03em"}}>{cfg.level}</span>
              </motion.div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
                {mlLoading ? "Analysing with AI model…" : ml ? "Predicted by ML model" : "Based on symptom score"}
              </div>
            </div>
          </div>

          {/* Subtext */}
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}}
            style={{fontSize:12,color:"rgba(255,255,255,0.42)",lineHeight:1.6,marginBottom:16,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,0.07)"}}
          >{cfg.subtext}</motion.p>

          {/* Symptom grid 3×2 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:16}}>
            {symptoms.map((s, i) => {
              const hi  = s.sev === "high";
              const med = s.sev === "medium";
              return (
                <motion.div key={i}
                  initial={{opacity:0,y:10,scale:.92}}
                  animate={{opacity:1,y:0,scale:1}}
                  transition={{delay:.48+i*.065,duration:.33,ease:[0.22,1,0.36,1]}}
                  style={{
                    borderRadius:13,padding:"9px 7px 8px",
                    background: hi ? `linear-gradient(135deg,${s.accentDeep}28,${s.accent}22)` : "rgba(255,255,255,0.04)",
                    border: hi ? `1px solid ${s.accent}45` : med ? `1px solid ${s.accent}20` : "1px solid rgba(255,255,255,0.07)",
                    boxShadow: hi ? `0 4px 14px ${s.accent}20` : "none",
                    display:"flex",flexDirection:"column",alignItems:"center",gap:4,textAlign:"center",
                  }}
                >
                  <span style={{fontSize:16}}>{s.emoji}</span>
                  <span style={{fontSize:9,fontWeight:600,color:hi?s.accent:"rgba(255,255,255,0.38)",lineHeight:1.3,letterSpacing:".01em"}}>{s.tag}</span>
                  <div style={{
                    padding:"2px 7px",borderRadius:99,
                    background: hi?`${s.accent}22`:"rgba(255,255,255,0.05)",
                    fontSize:8,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",
                    color: hi?s.accent:med?s.accent+"99":"rgba(255,255,255,0.22)",
                  }}>
                    {hi?"Noted":med?"Mild":"Clear"}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Disclaimer + Retake */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9}}
            style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.07)"}}
          >
            <p style={{fontSize:10,color:"rgba(255,255,255,0.26)",lineHeight:1.5,flex:1}}>
              <span style={{color:"rgba(255,255,255,0.42)",fontWeight:600}}>Disclaimer:</span> Not a medical diagnosis. Always consult a qualified doctor.
            </p>
            <motion.a
              href="/"
              whileHover={{scale:1.05}} whileTap={{scale:.96}}
              style={{
                display:"inline-flex",alignItems:"center",gap:5,
                padding:"10px 17px",borderRadius:99,
                background:`linear-gradient(135deg,${cfg.accentB},${cfg.accentA})`,
                boxShadow:`0 6px 20px ${cfg.accentA}48`,
                color:"white",fontSize:11.5,fontWeight:700,
                letterSpacing:"0.01em",textDecoration:"none",
                whiteSpace:"nowrap",flexShrink:0,
              }}
            >← Retake</motion.a>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}