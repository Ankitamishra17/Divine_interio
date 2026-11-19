"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Eye, EyeOff, ArrowRight, ArrowLeft, User, Lock, AlertCircle, Loader2 } from "lucide-react";

const REMEMBER_KEY = "admin_remembered_username";
const OPEN_MS = 1700; // door swing + light flood, then redirect

const TIPS = [
  "Layer your lighting: ambient, task and accent.",
  "Hang art so its centre sits near eye level.",
  "Repeat a material three times and the room feels calm.",
  "Leave about 45 cm between sofa and coffee table.",
  "Warm 2700K bulbs make wood and brass glow.",
];

/* ------------------------------------------------------------------ */
/* Small decorative pieces (all inline SVG, no new dependencies)       */
/* ------------------------------------------------------------------ */

function Styles() {
  return (
    <style jsx global>{`
      @keyframes riseIn {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes lampOn {
        0% { opacity: 0; }
        35% { opacity: 0.25; }
        50% { opacity: 0.1; }
        100% { opacity: 1; }
      }
      @keyframes lampSway {
        0%, 100% { transform: rotate(-1.2deg); }
        50% { transform: rotate(1.2deg); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(7px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(3px); }
      }
      @keyframes spoke {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(260%); }
      }
      @keyframes tipIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes swingDash {
        to { stroke-dashoffset: -24; }
      }
      @keyframes doorBreath {
        0%, 100% { transform: rotateY(0deg); }
        42%, 62% { transform: rotateY(-44deg); }
      }
      @keyframes splashGlow {
        0%, 100% { opacity: 0.55; }
        50% { opacity: 1; }
      }

      .login-card { animation: riseIn 0.7s ease-out; }
      .login-card.shake { animation: shake 0.45s ease-in-out; }
      .lamp-glow { animation: lampOn 1.6s ease-out 0.2s both; }
      .lamp-bulb { animation: lampOn 1.6s ease-out 0.2s both; }
      .lamp-sway { transform-origin: 50% 0; animation: lampSway 6s ease-in-out infinite; }
      .spoke { animation: spoke 0.9s ease-in-out infinite; }
      .swing-arc { stroke-dasharray: 3 3; animation: swingDash 4s linear infinite; }
      .tip-in { animation: tipIn 0.5s ease-out; }
      .progress-shimmer { animation: shimmer 1.1s ease-in-out infinite; }

      /* ---- Door: the sign-in card is the door leaf, hinged on the left ---- */
      .door-stage { perspective: 1600px; perspective-origin: 78% 50%; }
      .door-leaf {
        transform-origin: left center;
        transition: transform 1.15s cubic-bezier(0.7, 0, 0.2, 1);
        will-change: transform;
      }
      .door-open .door-leaf { transform: rotateY(-84deg); }
      .door-room { opacity: 0; transition: opacity 0.5s ease 0.05s; }
      .door-open .door-room { opacity: 1; }
      .door-shade { opacity: 0; transition: opacity 1.1s ease; }
      .door-open .door-shade { opacity: 1; }

      /* Light floods the screen right before we leave the page */
      .flood { opacity: 0; transition: opacity 0.7s ease-in; }
      .flood.on { opacity: 1; transition-delay: 0.95s; }

      /* ---- Loading splash: a door that keeps cracking open ---- */
      .splash-stage { perspective: 700px; perspective-origin: 80% 50%; }
      .splash-door { transform-origin: left center; animation: doorBreath 3.2s ease-in-out infinite; }
      .splash-light { animation: splashGlow 3.2s ease-in-out infinite; }

      .autofill-fix:-webkit-autofill,
      .autofill-fix:-webkit-autofill:hover,
      .autofill-fix:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px white inset !important;
        -webkit-text-fill-color: #3d1f0d !important;
        transition: background-color 5000s ease-in-out 0s;
      }

      @media (prefers-reduced-motion: reduce) {
        .login-card, .login-card.shake, .lamp-glow, .lamp-bulb, .lamp-sway,
        .spoke, .swing-arc, .tip-in, .progress-shimmer, .splash-door, .splash-light { animation: none; }
        .door-leaf { transition: opacity 0.3s ease; }
        .door-open .door-leaf { transform: none; opacity: 0; }
        .flood.on { transition-delay: 0s; transition-duration: 0.3s; }
      }
    `}</style>
  );
}

/** Loading screen: a closed arched door that slowly cracks open with light behind it */
function DoorSplash() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-7 bg-[#292622]" role="status" aria-live="polite">
      <div className="splash-stage relative w-[104px] h-[150px]">
        <div
          className="splash-light absolute inset-0 rounded-t-full rounded-b-md"
          style={{ background: "radial-gradient(ellipse at 50% 35%, #FFF3D6 0%, #F2CE82 40%, #dba343 80%)" }}
        />
        <div className="splash-door absolute inset-0 rounded-t-full rounded-b-md bg-[#F7F3ED] border border-[#dba343]/40 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-3 rounded-t-full rounded-b-[3px] border border-[#3D1F0D]/15" />
          <span className="absolute right-2.5 top-1/2 w-2 h-2 rounded-full bg-[#dba343]" />
        </div>
      </div>
      <p className="text-[12px] text-[#F7F3ED]/55">Checking your session…</p>
      <Styles />
    </div>
  );
}

/** Architectural fanlight above the door; spokes pulse while signing in, fills with light when unlocked */
function Fanlight({ active, open }) {
  const spokes = Array.from({ length: 7 }, (_, i) => {
    const a = Math.PI - ((i + 1) * Math.PI) / 8;
    return {
      x1: 44 + 11 * Math.cos(a),
      y1: 44 - 11 * Math.sin(a),
      x2: 44 + 39 * Math.cos(a),
      y2: 44 - 39 * Math.sin(a),
    };
  });
  return (
    <svg aria-hidden="true" viewBox="0 0 88 48" className="w-[64px] h-auto text-[#dba343]" fill="none">
      <path
        d="M4 44A40 40 0 0 1 84 44Z"
        stroke="currentColor"
        strokeWidth="1"
        style={{ fill: open ? "rgba(219,163,67,0.55)" : "rgba(219,163,67,0.10)", transition: "fill 0.6s ease" }}
      />
      <path d="M33 44A11 11 0 0 1 55 44Z" stroke="currentColor" strokeWidth="1" />
      {spokes.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke="currentColor"
          strokeWidth="0.9"
          className={active ? "spoke" : ""}
          style={active ? { animationDelay: `${i * 90}ms` } : undefined}
          opacity={active ? undefined : 0.75}
        />
      ))}
      <path d="M0 44H88" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** What you see through the open door: warm room, wood floor, sofa, floor lamp, framed art */
function RoomBehindDoor() {
  return (
    <div
      aria-hidden="true"
      className="door-room absolute inset-0 rounded-t-full rounded-b-3xl overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 30%, #FFF6DF 0%, #F4D48E 36%, #dba343 72%, #8f5f1a 100%)" }}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-[20%]"
        style={{
          backgroundColor: "#4a2a10",
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.35)), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 38px)",
        }}
      />
      <svg viewBox="0 0 300 210" preserveAspectRatio="xMidYMax meet" className="absolute bottom-[19%] left-0 w-full h-auto" fill="none">
        {/* framed art */}
        <rect x="108" y="22" width="84" height="62" rx="2" fill="rgba(61,31,13,0.08)" stroke="rgba(61,31,13,0.7)" strokeWidth="2" />
        <path d="M126 76V52a16 16 0 0 1 32 0v24Z" fill="rgba(61,31,13,0.55)" />
        <circle cx="172" cy="42" r="8" fill="rgba(61,31,13,0.35)" />
        {/* sofa */}
        <g fill="rgba(61,31,13,0.88)">
          <rect x="62" y="120" width="176" height="60" rx="14" />
          <rect x="52" y="150" width="196" height="36" rx="10" />
          <rect x="44" y="132" width="22" height="54" rx="10" />
          <rect x="234" y="132" width="22" height="54" rx="10" />
          <rect x="62" y="186" width="8" height="12" rx="2" />
          <rect x="230" y="186" width="8" height="12" rx="2" />
        </g>
        <path d="M150 128V176" stroke="rgba(219,163,67,0.35)" strokeWidth="1.5" />
        {/* floor lamp */}
        <g fill="rgba(61,31,13,0.88)" stroke="rgba(61,31,13,0.88)">
          <path d="M270 66V198" strokeWidth="3" />
          <path d="M254 66L286 66L280 38L260 38Z" />
          <ellipse cx="270" cy="198" rx="14" ry="3" />
        </g>
        <path d="M0 199H300" stroke="rgba(61,31,13,0.5)" strokeWidth="1" />
      </svg>
    </div>
  );
}

/** Architect's floor plan, with the door swing arc drawn in */
function FloorPlan() {
  return (
    <svg aria-hidden="true" viewBox="0 0 170 132" className="w-full h-auto text-[#dba343]" fill="none" stroke="currentColor" strokeWidth="1.1">
      {/* outer walls with a doorway gap on the bottom wall */}
      <path d="M44 110H10V10H160V110H70" strokeWidth="2" />
      {/* partition */}
      <path d="M88 10V62H160" strokeWidth="1.4" />
      {/* window */}
      <path d="M26 8H64M26 12H64" strokeWidth="0.9" />
      {/* door leaf + swing arc */}
      <path d="M44 110V84" strokeWidth="1.4" />
      <path d="M44 84A26 26 0 0 1 70 110" className="swing-arc" strokeWidth="0.9" opacity="0.9" />
      {/* sofa + table */}
      <rect x="18" y="22" width="48" height="16" rx="3" opacity="0.8" />
      <circle cx="42" cy="54" r="7" opacity="0.8" />
      {/* bed */}
      <rect x="100" y="18" width="48" height="34" rx="2" opacity="0.8" />
      <path d="M100 26H148" opacity="0.6" />
      {/* dimension line */}
      <path d="M10 120H160M10 116V124M160 116V124" strokeWidth="0.8" opacity="0.8" />
      <text x="85" y="130" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" opacity="0.85">
        6.4 m
      </text>
    </svg>
  );
}

const SWATCHES = [
  { name: "Walnut", style: { backgroundColor: "#3D1F0D", backgroundImage: "repeating-linear-gradient(100deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 7px)" } },
  { name: "Brass", style: { backgroundColor: "#dba343", backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.28), transparent 55%)" } },
  { name: "Linen", style: { backgroundColor: "#F7F3ED", backgroundImage: "repeating-linear-gradient(0deg, rgba(61,31,13,0.06) 0 1px, transparent 1px 3px)" } },
  { name: "Sage", style: { backgroundColor: "#7C8B6E" } },
  { name: "Clay", style: { backgroundColor: "#A9674A" } },
  { name: "Slate", style: { backgroundColor: "#2B2622", backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%)" } },
];

function SwatchBoard() {
  return (
    <div aria-hidden="true" className="grid grid-cols-3 gap-1.5">
      {SWATCHES.map((s) => (
        <div key={s.name}>
          <div className="h-10 rounded-[3px] border border-[#F7F3ED]/10" style={s.style} />
          <p className="mt-1 text-[8.5px] text-center text-[#F7F3ED]/45">{s.name}</p>
        </div>
      ))}
    </div>
  );
}

/** Picture frame hung on a wire from a brass nail */
function Frame({ label, className = "", children }) {
  return (
    <div aria-hidden="true" className={`absolute hidden xl:block w-[196px] ${className}`}>
      <svg viewBox="0 0 196 34" className="w-full h-[30px] text-[#dba343]/50 -mb-[2px]" fill="none" stroke="currentColor" strokeWidth="0.8">
        <path d="M98 4L38 34M98 4L158 34" />
        <circle cx="98" cy="4" r="2.4" fill="#dba343" stroke="none" />
      </svg>
      <div className="rounded-[3px] border border-[#dba343]/35 bg-[#F7F3ED]/[0.035] p-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)]">
        {children}
        <p className="mt-2.5 pt-2 border-t border-[#dba343]/15 text-[10px] text-[#F7F3ED]/40">{label}</p>
      </div>
    </div>
  );
}

function Plant() {
  const leaves = [
    { r: -52, s: 0.75 },
    { r: -30, s: 0.95 },
    { r: -9, s: 1.1 },
    { r: 12, s: 1.0 },
    { r: 33, s: 0.9 },
    { r: 54, s: 0.7 },
  ];
  return (
    <svg aria-hidden="true" viewBox="0 0 120 200" className="absolute hidden lg:block left-[3%] bottom-[50px] w-[120px] h-auto opacity-80" fill="none">
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(60 146) rotate(${l.r}) scale(${l.s})`}>
          <path d="M0 0C14 -28 14 -70 0 -104C-14 -70 -14 -28 0 0Z" fill={i % 2 ? "#4c5a40" : "#5b6b4d"} />
          <path d="M0 0V-96" stroke="rgba(247,243,237,0.15)" strokeWidth="1" />
        </g>
      ))}
      <rect x="34" y="144" width="52" height="8" rx="2" fill="#2a1810" stroke="#dba343" strokeOpacity="0.4" strokeWidth="0.8" />
      <path d="M38 152H82L76 196H44Z" fill="#2a1810" stroke="#dba343" strokeOpacity="0.25" strokeWidth="0.8" />
    </svg>
  );
}

function ArmchairAndLamp() {
  return (
    <svg aria-hidden="true" viewBox="0 0 220 210" className="absolute hidden lg:block right-[3%] bottom-[50px] w-[210px] h-auto opacity-80" fill="none">
      {/* floor lamp */}
      <path d="M36 50V198" stroke="#dba343" strokeOpacity="0.5" strokeWidth="2" />
      <path d="M20 50L52 50L46 22L26 22Z" fill="rgba(219,163,67,0.22)" stroke="#dba343" strokeOpacity="0.6" strokeWidth="1" />
      <ellipse cx="36" cy="198" rx="14" ry="3" fill="#2a1810" />
      {/* armchair */}
      <g fill="#2a1810" stroke="#dba343" strokeOpacity="0.3" strokeWidth="0.9">
        <rect x="96" y="84" width="96" height="70" rx="18" />
        <rect x="90" y="132" width="108" height="34" rx="10" />
        <rect x="82" y="112" width="20" height="54" rx="9" />
        <rect x="184" y="112" width="20" height="54" rx="9" />
        <rect x="96" y="166" width="7" height="30" rx="2" />
        <rect x="185" y="166" width="7" height="30" rx="2" />
      </g>
      <path d="M144 96V128" stroke="#dba343" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AdminLoginPage() {
  const { admin, loading, login } = useAuth();
  const router = useRouter();
  const passwordRef = useRef(null);
  const redirectTimer = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [error, setError] = useState("");
  // idle -> auth (checking credentials) -> unlocked (success beat) -> opening (door swings, then redirect)
  const [phase, setPhase] = useState("idle");
  const [shaking, setShaking] = useState(false);
  const [tip, setTip] = useState(0);

  // Door opens straight away if a valid session already exists
  const hasSession = !loading && Boolean(admin) && phase === "idle";
  const isOpen = phase === "opening" || hasSession;
  const busy = phase !== "idle" || isOpen;
  const hasError = Boolean(error);

  const scheduleRedirect = useCallback(() => {
    if (redirectTimer.current) return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    redirectTimer.current = setTimeout(() => router.replace("/admin"), reduce ? 450 : OPEN_MS);
  }, [router]);

  useEffect(() => {
    return () => {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
    };
  }, []);

  useEffect(() => {
    if (hasSession) scheduleRedirect();
  }, [hasSession, scheduleRedirect]);

  // Restore remembered username (convenience only; password is never stored)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setUsername(saved);
        setRemember(true);
      }
    } catch {}
  }, []);

  // After a failed attempt, put the cursor straight back in the password field
  useEffect(() => {
    if (error) passwordRef.current?.focus();
  }, [error]);

  // Rotating studio notes in the footer
  useEffect(() => {
    const id = setInterval(() => setTip((t) => (t + 1) % TIPS.length), 6000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    setPhase("auth");
    try {
      await login(username.trim(), password);
      try {
        if (remember) localStorage.setItem(REMEMBER_KEY, username.trim());
        else localStorage.removeItem(REMEMBER_KEY);
      } catch {}
      setPhase("unlocked");
      await new Promise((r) => setTimeout(r, 450)); // short "unlocked" beat before the door swings
      setPhase("opening");
      scheduleRedirect();
    } catch (err) {
      setError(err?.message || "Sign in failed. Check your username and password, then try again.");
      setPassword("");
      setPhase("idle");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  // While the session is being checked: a door that slowly cracks open
  if (loading) return <DoorSplash />;

  const inputBase =
    "autofill-fix w-full py-3 bg-white border rounded-xl text-sm text-[#3D1F0D] placeholder:text-[#3D1F0D]/25 hover:border-[#3D1F0D]/25 focus:outline-none focus:border-[#dba343] focus:ring-[3px] focus:ring-[#dba343]/15 disabled:opacity-60 transition-all";
  const inputBorder = hasError ? "border-red-300" : "border-[#3D1F0D]/12";

  const subtitle =
    phase === "auth"
      ? "Checking your keys…"
      : phase === "unlocked" || isOpen
      ? "Unlocked. Opening your studio…"
      : "Sign in to manage your projects and posts.";

  return (
    <div className="relative min-h-screen flex flex-col bg-[#292622] overflow-hidden text-[#F7F3ED]">
      {/* ---------- Room: walls, moulding, wainscot ---------- */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {/* wall paneling: faint vertical joints */}
   
        {/* crown moulding */}
        {/* wainscot with chair rail */}
      
      </div>

      {/* wall art (large screens only) */}
 
      <Plant />
      <ArmchairAndLamp />

  

      <main className="relative flex-1 flex flex-col items-center px-4 pb-10">
        {/* Light from the pendant lamp */}
        <div
          aria-hidden="true"
          className="lamp-glow absolute left-1/2 top-4 -translate-x-1/2 w-[720px] h-[720px] max-w-none rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(219,163,67,0.20), rgba(219,163,67,0.06) 45%, transparent 68%)" }}
        />

        {/* Pendant lamp (sways very slightly) */}
        <svg aria-hidden="true" viewBox="0 0 120 92" className="lamp-sway relative w-[96px] h-auto shrink-0 text-[#dba343]" fill="none">
          <path d="M60 0V52" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <path d="M36 78A24 24 0 0 1 84 78Z" stroke="currentColor" strokeWidth="1" fill="rgba(219,163,67,0.16)" />
          <path d="M34 78H86" stroke="currentColor" strokeWidth="1" />
          <circle className="lamp-bulb" cx="60" cy="84" r="3" fill="#F7F3ED" />
        </svg>

        {/* Doorway: frame, room behind, and the door leaf (the sign-in card) */}
        <div className="relative w-full max-w-[400px] mt-5">
          <div className={`door-stage relative ${isOpen ? "door-open" : ""}`}>
            {/* architrave */}


            <RoomBehindDoor />

            <section
              className={`door-leaf login-card relative z-10 rounded-t-full rounded-b-3xl bg-[#F7F3ED] text-[#3D1F0D] px-6 sm:px-10 pt-20 sm:pt-24 pb-8 sm:pb-9 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)] ${shaking ? "shake" : ""}`}
              style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(219,163,67,0.16), transparent 62%)" }}
            >
              {/* shade that darkens the leaf as it swings away */}
              <div aria-hidden="true" className="door-shade absolute inset-0 rounded-t-full rounded-b-3xl bg-gradient-to-r from-black/5 to-black/55 pointer-events-none" />

              {/* hinges + lever handle */}
              {["top-[36%]", "top-[58%]", "top-[82%]"].map((pos) => (
                <span
                  key={pos}
                  aria-hidden="true"
                  className={`absolute -left-[3px] ${pos} w-[5px] h-7 rounded-sm bg-gradient-to-b from-[#f0c46a] via-[#dba343] to-[#b8871f]`}
                />
              ))}
              <span
                aria-hidden="true"
                className="absolute -right-[5px] top-[56%] w-[10px] h-12 rounded-full bg-gradient-to-b from-[#f0c46a] via-[#dba343] to-[#b8871f] shadow-[0_4px_10px_-2px_rgba(0,0,0,0.4)]"
              />

              {/* fanlight */}
       

              <h1 className="font-display text-[1.75rem] sm:text-[2.1rem] text-center leading-tight mb-1.5">Welcome back</h1>
              <p className="text-[13px] sm:text-[13.5px] text-center text-[#3D1F0D]/60 mb-7" role="status" aria-live="polite">
                {subtitle}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-[12px] text-[#3D1F0D]/65 font-semibold mb-1.5">
                    Username
                  </label>
                  <div className="relative group">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D1F0D]/30 group-focus-within:text-[#dba343] transition-colors" />
                    <input
                      id="username"
                      className={`${inputBase} ${inputBorder} pl-10 pr-3.5`}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="admin"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      autoFocus
                      required
                      disabled={busy}
                      aria-invalid={hasError}
                      aria-describedby={hasError ? "login-error" : undefined}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-[12px] text-[#3D1F0D]/65 font-semibold mb-1.5">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D1F0D]/30 group-focus-within:text-[#dba343] transition-colors" />
                    <input
                      id="password"
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      className={`${inputBase} ${inputBorder} pl-10 pr-11`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      onKeyUp={(e) => setCapsOn(!!e.getModifierState?.("CapsLock"))}
                      onBlur={() => setCapsOn(false)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      disabled={busy}
                      aria-invalid={hasError}
                      aria-describedby={hasError ? "login-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#3D1F0D]/40 hover:text-[#3D1F0D]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343]/60 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {capsOn && (
                    <p className="mt-1.5 text-[11.5px] text-[#B8871F]" role="status">
                      Caps Lock is on.
                    </p>
                  )}
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit pt-1 group/check">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    disabled={busy}
                    className="peer sr-only"
                  />
                  <span className="w-[18px] h-[18px] rounded-[5px] border border-[#3D1F0D]/25 bg-white flex items-center justify-center transition-all peer-checked:bg-[#dba343] peer-checked:border-[#dba343] peer-focus-visible:ring-[3px] peer-focus-visible:ring-[#dba343]/30 group-hover/check:border-[#dba343]/70">
                    <svg
                      viewBox="0 0 12 12"
                      className={`w-2.5 h-2.5 text-[#1A0F08] transition-opacity ${remember ? "opacity-100" : "opacity-0"}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
                    </svg>
                  </span>
                  <span className="text-[12.5px] text-[#3D1F0D]/65">Remember my username</span>
                </label>

                {hasError && (
                  <div id="login-error" role="alert" className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3.5 py-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="group relative overflow-hidden w-full flex items-center justify-center gap-2 bg-[#dba343] text-[#1A0F08] py-3.5 rounded-xl text-xs tracking-[0.15em] uppercase font-semibold mt-5 hover:bg-[#D9A93A] active:bg-[#B8871F] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#dba343]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED] disabled:cursor-not-allowed disabled:hover:bg-[#dba343] transition-all shadow-[0_8px_20px_-6px_rgba(200,151,43,0.5)]"
                >
                  {phase === "auth" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin motion-reduce:animate-none" />
                      Verifying…
                    </>
                  ) : phase === "unlocked" || isOpen ? (
                    <>
                      <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
                      </svg>
                      Unlocked
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </>
                  )}
                  {phase === "auth" && (
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-[#1A0F08]/15 overflow-hidden">
                      <span className="progress-shimmer block h-full w-2/5 bg-[#1A0F08]/50" />
                    </span>
                  )}
                </button>
              </form>
            </section>
          </div>

          {/* Doormat */}
         
        </div>
      </main>

      {/* Skirting board / floor line */}
      <footer className="relative z-10 border-t border-[#dba343]/20 bg-[#1f1c19]">
        <div className="flex items-center justify-between gap-6 px-5 sm:px-7 py-4">
          <p key={tip} className="tip-in hidden sm:block text-[12px] text-[#F7F3ED]/50 max-w-md leading-relaxed">
            <span className="text-[#dba343]/80">Studio note: </span>
            {TIPS[tip]}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] text-[#F7F3ED]/60 hover:text-[#dba343] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343]/50 transition-colors sm:ml-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to website
          </Link>
        </div>
      </footer>

      {/* Light floods the screen as the door finishes opening */}
      <div
        aria-hidden="true"
        className={`flood ${isOpen ? "on" : ""} fixed inset-0 z-50 pointer-events-none flex items-center justify-center`}
        style={{ background: "radial-gradient(circle at 50% 45%,  #292622  0%,  #292622  55%,  #292622  100%)" }}
      >
        <p className="font-display text-2xl text-[#fff]">Welcome in</p>
      </div>

      <Styles />
    </div>
  );
}