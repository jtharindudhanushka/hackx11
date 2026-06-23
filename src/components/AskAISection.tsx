"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
  showMenu?: boolean;
  tier?: number;
  source?: string;
};

const tierLabels: Record<number, string> = {
  0: "GREETING",
  1: "GUARD",
  2: "CACHE",
  4: "FAQ",
  5: "VECTOR",
  6: "LLM",
};

// Safe client-side markdown formatter for React to render bold text and external links
function formatMessageText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const tokenRegex = /(\[.*?\]\(.*?\))|(\*\*.*?\*\*)/g;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let key = 0;
    let match;

    while ((match = tokenRegex.exec(line)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        elements.push(<span key={key++}>{line.substring(lastIndex, matchIndex)}</span>);
      }

      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        const boldText = token.slice(2, -2);
        elements.push(<strong key={key++} className="font-semibold text-white">{boldText}</strong>);
      } else {
        const linkMatch = /\[(.*?)\]\((.*?)\)/.exec(token);
        if (linkMatch) {
          const textVal = linkMatch[1];
          const urlVal = linkMatch[2];
          elements.push(
            <a 
              key={key++} 
              href={urlVal} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#5BB8FF] hover:underline font-medium"
            >
              {textVal}
            </a>
          );
        } else {
          elements.push(<span key={key++}>{token}</span>);
        }
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      elements.push(<span key={key++}>{line.substring(lastIndex)}</span>);
    }

    return (
      <span key={lineIdx} className="block min-h-[1em]">
        {elements.length > 0 ? elements : line}
      </span>
    );
  });
}

export default function AskAISection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "user",
      text: "Does our product need to be fully built by the time we register?",
    },
    {
      sender: "ai",
      text: "No, it does not. At the registration stage, you only need to submit your idea and a structured proposal outlining the problem, solution, and impact. A working prototype is only required later, by the ideaX Semi-Finals on October 3. Take your time to refine the core concept first!",
      showMenu: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [debugActive, setDebugActive] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mount logic to prepare session id and debug state
  useEffect(() => {
    // Generate unique session ID matching widget.js
    const newSessionId = "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    setSessionId(newSessionId);

    // Check debug mode params or local storage
    const urlParams = new URLSearchParams(window.location.search);
    const isDebug = urlParams.has("debug") || (localStorage.getItem("hackx_debug") === "true");
    setDebugActive(isDebug);
  }, []);

  // Scroll inside the chat container instead of scrolling the page viewport
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Append user message to state
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsLoading(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: text,
          session_id: sessionId
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Too many requests. Please wait a moment.");
        }
        throw new Error("API call failed");
      }

      const data = await response.json();
      const aiReply = data.answer || data.reply || data.response || "I didn't receive a response.";
      
      setMessages((prev) => [
        ...prev, 
        { 
          sender: "ai", 
          text: aiReply, 
          tier: data.tier,
          source: data.source
        }
      ]);
    } catch (error: any) {
      console.error("Error calling chatbot API:", error);

      // Smart local fallback to keep the user engaged when API is offline
      let fallbackReply = "I'm having trouble connecting to the hackX chatbot service right now. Please try again later or reach out to our coordinators directly.";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("team") || lowerText.includes("member") || lowerText.includes("group") || lowerText.includes("size")) {
        fallbackReply = "Teams must consist of **2 to 5 members**. All team members must be currently enrolled undergraduates from the same university or higher education institute.";
      } else if (lowerText.includes("fee") || lowerText.includes("cost") || lowerText.includes("free") || lowerText.includes("pay")) {
        fallbackReply = "hackX 11.0 is **completely free** to enter! There are no registration fees or hidden prerequisites.";
      } else if (lowerText.includes("date") || lowerText.includes("timeline") || lowerText.includes("deadline") || lowerText.includes("when")) {
        fallbackReply = "Here is the key timeline for **hackX 11.0**:\n\n• **June 23**: Registrations Open\n• **July 31**: Proposal Submission & Video Submission\n• **Sep – Oct**: designX Expert Workshops\n• **October 3**: ideaX Semi-Finals\n• **November 11**: Grand Finals (Tentative)";
      } else if (lowerText.includes("register") || lowerText.includes("sign up") || lowerText.includes("apply")) {
        fallbackReply = "You can register for hackX 11.0 by clicking any of the **Register Now** buttons on this website. Registrations close when proposals are due on **July 31**.";
      } else if (lowerText.includes("criteria") || lowerText.includes("compete") || lowerText.includes("eligible")) {
        fallbackReply = "All currently enrolled undergraduates from Sri Lankan universities or higher education institutes are eligible. Innovation from all disciplines (tech, business, science, etc.) is welcome as long as there is a technology-driven solution.";
      } else if (lowerText.includes("designx") || lowerText.includes("workshop")) {
        fallbackReply = "designX is an exclusive 4-part workshop series for semi-finalists, covering business modelling, startup structuring, and market validation, led by industry experts.";
      } else if (lowerText.includes("contact") || lowerText.includes("coordinators") || lowerText.includes("email") || lowerText.includes("phone")) {
        fallbackReply = "For official queries, you can reach out directly:\n\n• **Ashan Perera** (President): president@hackx.lk | +94 77 000 0001\n• **Dilmi Rathnayake** (Secretary): secretary@hackx.lk\n• **Kavinda Silva** (Tech): tech@hackx.lk";
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "ai", text: fallbackReply }]);
        setIsLoading(false);
      }, 750);
      return;
    }
    
    setIsLoading(false);
  };

  const handleMenuClick = (item: string) => {
    handleSendMessage(item);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue("");
    handleSendMessage(text);
  };

  return (
    <section id="ask-ai" className="relative w-full bg-[#010814] py-16 md:py-20 overflow-hidden z-10 border-t border-white/5">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 60, -60, 0], y: [0, 60, -60, 0], scale: [1, 1.2, 0.8, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-[#1A6FD4] opacity-[0.06] blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -40, 40, 0], y: [0, -40, 40, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-[#5BB8FF] opacity-[0.05] blur-[100px] rounded-full" 
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(91,184,255,0.1)]">
            <div className="w-2 h-2 rounded-full bg-[#5BB8FF] animate-pulse" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">
              AI Assistant
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ask Mascot Anything</h2>
          <p className="text-lg text-white/60 font-light max-w-2xl mx-auto text-center">
            Chat with our AI Assistant to get instant answers about hackX 11.0
          </p>
        </motion.div>

        {/* AI Chat Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-3xl p-[1px] group"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/20 via-white/5 to-transparent opacity-50" />
          
          <div className="relative rounded-[23px] bg-[#010814]/80 backdrop-blur-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col h-[520px]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A6FD4] to-[#5BB8FF] flex items-center justify-center shadow-[0_0_10px_#5BB8FF]">
                  <span className="text-white font-bold text-xs">AI</span>
                </div>
                <span className="text-sm font-semibold text-white tracking-wide">Mascot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Chat Body - Prevent Lenis Scroll Hijack and Bind Custom Scroll Ref */}
            <div 
              ref={chatContainerRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
              {messages.map((msg, index) => {
                const isUser = msg.sender === "user";
                return (
                  <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div 
                      className={`max-w-[85%] px-5 py-4 rounded-2xl ${
                        isUser 
                          ? "rounded-tr-none bg-white/10 backdrop-blur-md text-white border border-white/5" 
                          : "rounded-tl-none bg-[#1A6FD4]/10 backdrop-blur-md border border-[#5BB8FF]/20 text-white/90 shadow-[0_0_20px_rgba(26,111,212,0.15)]"
                      } text-sm font-light leading-relaxed`}
                    >
                      {formatMessageText(msg.text)}

                      {/* Initial Quick Menu Options */}
                      {msg.showMenu && (
                        <div className="mt-4 flex flex-col gap-2 max-w-[280px]">
                          {[
                            "Registration",
                            "Eligibility",
                            "Timeline",
                            "Rules & Guidelines",
                            "HackX",
                            "HackX Jr",
                            "Contact",
                          ].map((item) => (
                            <button
                              type="button"
                              key={item}
                              onClick={() => handleMenuClick(item)}
                              className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all text-left cursor-pointer group"
                            >
                              <span>{item}</span>
                              <span className="text-[#5BB8FF] group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Debug badge indicator */}
                      {debugActive && msg.tier !== undefined && (
                        <div className="mt-2.5 flex items-center">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#5BB8FF] font-bold text-[9px] tracking-wider uppercase">
                            ⚡ {msg.tier === 6 && msg.source === "retrieved_chunks" ? "FALLBACK" : (tierLabels[msg.tier] || "SYSTEM")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] px-5 py-4 rounded-2xl rounded-tl-none bg-[#1A6FD4]/10 backdrop-blur-md border border-[#5BB8FF]/20 text-white/90 text-sm font-light leading-relaxed shadow-[0_0_20px_rgba(26,111,212,0.1)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5BB8FF] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5BB8FF] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5BB8FF] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies for next query, shown only when not loading and there's at least one user query */}
            {!isLoading && messages.length > 1 && (
              <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01]">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-2">Do you want further clarifications?</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Registration",
                    "Eligibility",
                    "Timeline",
                    "Rules & Guidelines",
                    "HackX",
                    "HackX Jr",
                    "Contact",
                  ].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleMenuClick(item)}
                      className="px-3 py-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-white/70 hover:text-white cursor-pointer transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white/[0.02] border-t border-white/5">
              <div className="relative flex items-center bg-black/40 border border-white/10 rounded-full px-4 py-2 focus-within:border-[#5BB8FF]/50 focus-within:bg-[#041A3A]/40 transition-colors">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question about hackX..." 
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm px-2 py-2 placeholder:text-white/30"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1A6FD4] to-[#5BB8FF] flex items-center justify-center hover:opacity-90 transition-opacity shrink-0 disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <p className="text-center mt-3 text-[10px] text-white/30 uppercase tracking-widest">
                Powered by AI. For official queries, contact the relative coordinators.
              </p>
            </form>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
