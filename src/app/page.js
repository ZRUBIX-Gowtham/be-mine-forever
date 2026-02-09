"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stars, Gift, Music } from "lucide-react";
import confetti from "canvas-confetti";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [hasClickedYes, setHasClickedYes] = useState(false);
  const [hearts, setHearts] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    const generatedHearts = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${(i * 13) % 100}%`,
      size: 15 + (i % 20),
      duration: 5 + (i % 7),
      delay: i * 0.3,
    }));
    setHearts(generatedHearts);
  }, []);

  const moveButton = () => {
    if (hasClickedYes) return;
    const nudge = 100; // Snappy jump
    const angle = Math.random() * Math.PI * 2;
    setNoButtonPosition(prev => {
      let nextX = prev.x + Math.cos(angle) * nudge;
      let nextY = prev.y + Math.sin(angle) * nudge;

      // Strict limits to stay inside the 500px container
      const limitX = 140;
      const limitY = 120;

      if (Math.abs(nextX) > limitX) nextX = (nextX > 0 ? limitX : -limitX);
      if (Math.abs(nextY) > limitY) nextY = (nextY > 0 ? limitY : -limitY);
      return { x: nextX, y: nextY };
    });
  };

  const handleMouseMove = (e) => {
    if (hasClickedYes) return;
    const button = document.getElementById("no-button");
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const distance = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
    if (distance < 70) moveButton();
  };

  const handleYes = () => {
    setHasClickedYes(true);
    const duration = 5 * 1000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#ff4d6d", "#ff758f"] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#ff4d6d", "#ff758f"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  if (!isMounted) return <div className="min-h-screen bg-[#fff5f7]" />;

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#fff5f7] relative overflow-hidden font-sans p-4">

      {/* Background Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: "110vh", x: heart.left, opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.4, 0.4, 0] }}
            transition={{ duration: heart.duration, repeat: Infinity, ease: "linear", delay: heart.delay }}
            className="absolute"
          >
            <Heart size={heart.size} fill="#ff4d6d" color="transparent" />
          </motion.div>
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        layout
        className="relative z-10 w-full max-w-[500px] bg-white/60 backdrop-blur-2xl rounded-[40px] border-4 border-white shadow-[0_32px_64px_-16px_rgba(255,77,109,0.2)] flex flex-col items-center p-6 md:p-10 text-center"
      >
        <AnimatePresence mode="wait">
          {!hasClickedYes ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center w-full gap-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-[#ff4d6d] p-5 rounded-3xl shadow-lg shadow-[#ff4d6d]/40"
              >
                <Heart size={48} fill="white" color="white" />
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl dancing-text font-bold text-[#4a0416] leading-tight">
                  Will you be my Valentine?
                </h1>
                <p className="text-[#c9184a] text-lg font-medium opacity-80">
                  You&apos;re the missing pixel in my life! 👾
                </p>
              </div>

              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="flex items-center justify-center gap-6 mt-4 w-full h-32 relative"
              >
                <motion.button
                  onClick={handleYes}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-8 py-3 bg-[#ff4d6d] text-white rounded-2xl font-bold text-lg shadow-xl z-50 transition-colors hover:bg-[#ff758f]"
                >
                  Yes! 💖
                </motion.button>

                <div className="relative">
                  <motion.button
                    id="no-button"
                    onMouseEnter={moveButton}
                    onClick={moveButton}
                    onTouchStart={moveButton}
                    animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
                    transition={{ type: "spring", stiffness: 600, damping: 30 }}
                    className="px-8 py-3 bg-white text-[#ff4d6d] border-2 border-[#ff4d6d] rounded-2xl font-bold text-lg shadow-lg z-40"
                  >
                    No 😢
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center w-full gap-8"
            >
              <div className="relative">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
                  <Heart size={120} fill="#ff4d6d" color="white" className="drop-shadow-2xl" />
                </motion.div>
                <Stars className="absolute -top-4 -right-4 text-yellow-400 animate-pulse" size={40} />
              </div>

              <div className="space-y-4">
                <h2 className="text-6xl md:text-8xl dancing-text font-bold text-[#ff4d6d]">
                  I Knew it! ❤️
                </h2>
                <p className="text-xl md:text-2xl text-[#4a0416] font-bold">
                  You make my heart skip a beat!
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full bg-white/40 p-5 rounded-3xl border border-white/60 flex items-center justify-center gap-3"
              >
                <Gift className="text-[#ff4d6d]" size={24} />
                <p className="text-[#c9184a] font-bold">You are the best thing that ever happened to me! ❤️</p>
              </motion.div>

              <div className="flex items-center gap-2 opacity-40 pt-4 border-t border-black/5 w-full justify-center">
                <Music size={14} />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  Our song is just beginning
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <footer className="absolute bottom-6 text-[#ffb3c1] font-bold tracking-widest text-[10px] uppercase pointer-events-none">
        MADE WITH LOVE ❤️
      </footer>
    </main>
  );
}
