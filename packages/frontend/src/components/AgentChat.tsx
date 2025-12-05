"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AgentChat() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your DeFi Vault Assistant. I can help you check your balance, deposit LINK tokens, withdraw shares, and view public vault information.\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ]);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ---------------------------
  // MAIN SEND HANDLER
  // ---------------------------
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const userInputBackup = input;
    setInput("");
    setIsLoading(true);

    try {
      // CALL YOUR AGENT API ROUTE IN NEXT.JS
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInputBackup,
          sessionId,
          wallet: address, // INCLUDE WALLET
        }),
      });

      const data = await response.json();

      if (data.sessionId) setSessionId(data.sessionId);

      // ADD AGENT MESSAGE FIRST
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // ---------------------------
      // HANDLE UNSIGNED TRANSACTION
      // ---------------------------
      if (data.unsignedTx && walletClient) {
        console.log("Unsigned TX received from agent:", data.unsignedTx);

        // USER SIGNS TX WITH THEIR WALLET
        const txHash = await walletClient.sendTransaction(data.unsignedTx);

        const txMessage: Message = {
          role: "assistant",
          content: `🚀 Transaction submitted!\n\n**Tx Hash:** ${txHash}\n\nYou can track it on the block explorer.`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, txMessage]);
      }
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        role: "assistant",
        content: "⚠️ Something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // UI
  if (!isConnected) {
    return (
      <div className="text-center py-12 text-gray-400">
        Please connect your wallet to chat with the AI agent
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 rounded-lg border border-gray-800">
      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your vault balance, deposit, withdraw…"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          />

          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
