import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sendMessage, QUICK_PROMPTS } from '../../services/aiService.js';
import { useNutrition } from '../../context/NutritionContext.jsx';
import { useGoal } from '../../context/GoalContext.jsx';
import { useUser } from '../../context/UserContext.jsx';

function nl2br(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: "Hi! I'm NutriAI 🌿 Ask me about your nutrition, hydration, or wellness goals." },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const { consumed, waterMl, workoutDone } = useNutrition();
  const { score, streak, goals } = useGoal();
  const { profile } = useUser();

  function scrollBottom() {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 50);
  }

  async function handleSend(text) {
    const msg = (text ?? input).trim();
    if (!msg || typing) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: msg };
    setMessages((m) => [...m, userMsg]);
    setTyping(true);
    scrollBottom();

    const context = {
      name: profile?.name,
      calories: consumed.calories,
      calorieTarget: goals?.calories,
      protein: consumed.protein,
      proteinGoal: goals?.proteinG,
      water: waterMl,
      waterGoal: goals?.waterMl,
      workoutDone,
      score,
      streak,
      sleepMin: profile?.sleepGoalMin,
      sleepGoal: goals?.sleepMin,
    };

    try {
      const reply = await sendMessage(msg, context);
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'bot', text: reply }]);
    } finally {
      setTyping(false);
      scrollBottom();
    }
  }

  return (
    <>
      {/* Floating action button */}
      <button
        className="ai-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open NutriAI chat"
        aria-expanded={open}
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-panel"
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            {/* Header */}
            <div className="ai-panel__head">
              <span>🌿 NutriAI</span>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
            </div>

            {/* Messages */}
            <div className="ai-panel__scroll" ref={scrollRef} aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`ai-msg ai-msg--${m.role}`}>
                  <div dangerouslySetInnerHTML={{ __html: nl2br(m.text) }} />
                </div>
              ))}
              {typing && (
                <div className="ai-msg ai-msg--bot typing">
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              )}
            </div>

            {/* Quick prompts */}
            <div className="ai-quick">
              {QUICK_PROMPTS.slice(0, 3).map((q) => (
                <button key={q} className="ai-quick__btn" onClick={() => handleSend(q)}>
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form className="ai-input" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask NutriAI anything…"
                aria-label="Chat input"
                disabled={typing}
              />
              <button type="submit" className="btn btn--primary btn--sm" disabled={!input.trim() || typing}>
                ↑
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
