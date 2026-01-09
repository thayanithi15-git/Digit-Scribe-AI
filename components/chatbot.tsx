'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle,
    X,
    Send,
    Minimize2,
    Loader2,
} from 'lucide-react';

/* ---------------- TYPES ---------------- */

interface Message {
    id: string;
    type: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

/* ---------------- CONFIG ---------------- */

const AI_CHATBOT_CONFIG = {
    apiKey: process.env.NEXT_PUBLIC_CHATBOT_API_KEY!,
    apiUrl: process.env.NEXT_PUBLIC_CHATBOT_API_URL!,
    botName: 'DigitScribe Assistant',
};

/* ---------------- FALLBACK KNOWLEDGE BASE ---------------- */

const GENERAL_CHAT = {
    greetings: ['hi', 'hello', 'hey', 'how are you', 'good morning', 'good evening'],
    responses: [
        "😊 I'm doing great! How can I help you today?",
        "Hello! I'm here to help you with digit and text recognition.",
        "Hi there! Ask me anything about OCR, handwriting, or digits.",
    ],
};

const KNOWLEDGE_BASE = {
    digit: {
        keywords: ['digit', 'number', '0-9'],
        response: `🔢 Digit Recognition – Step by Step

1️⃣ Draw a digit (0–9) on the canvas  
2️⃣ Image is converted to grayscale  
3️⃣ Pixels are normalized (0–1)  
4️⃣ CNN model analyzes patterns  
5️⃣ Softmax layer predicts digit  
6️⃣ Confidence score is shown  

📌 Accuracy: ~99% for clean digits`,
    },
    ocr: {
        keywords: ['ocr', 'text', 'image to text'],
        response: `📄 OCR Process – Step by Step

1️⃣ Upload an image  
2️⃣ Image preprocessing (resize, denoise)  
3️⃣ Text regions detected  
4️⃣ Characters recognized  
5️⃣ Confidence calculated  
6️⃣ Text returned as output  

📌 Best for clear images`,
    },
    handwriting: {
        keywords: ['handwriting', 'draw', 'written'],
        response: `✍️ Handwriting Recognition Steps

1️⃣ User draws text  
2️⃣ Canvas image captured  
3️⃣ Image normalized  
4️⃣ Neural network processes strokes  
5️⃣ Characters recognized  
6️⃣ Output shown with confidence`,
    },
    default: {
        response: `👋 Hi! I'm DigitScribe Assistant

Ask me about:
• Digit recognition  
• OCR process  
• Handwriting recognition  
• How conversion works  

Try:
👉 "How does digit recognition work?"`,
    },
};

/* ---------------- COMPONENT ---------------- */

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'bot',
            text: KNOWLEDGE_BASE.default.response,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    /* ---------------- HELPERS ---------------- */

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const findFallback = (question: string) => {
        const q = question.toLowerCase();
        for (const item of Object.values(KNOWLEDGE_BASE)) {
            if (
                'keywords' in item &&
                item.keywords.some((k) => q.includes(k))
            ) {
                return item.response;
            }
        }
        return KNOWLEDGE_BASE.default.response;
    };

    const getGeneralResponse = (question: string): string | null => {
        const q = question.toLowerCase();
        if (GENERAL_CHAT.greetings.some(g => q.includes(g))) {
            return GENERAL_CHAT.responses[
                Math.floor(Math.random() * GENERAL_CHAT.responses.length)
            ];
        }
        return null;
    };

    /* ---------------- SEND MESSAGE ---------------- */

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // ✅ 1. Handle general chat FIRST
        const generalReply = getGeneralResponse(input);
        if (generalReply) {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    text: generalReply,
                    timestamp: new Date(),
                },
            ]);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(AI_CHATBOT_CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${AI_CHATBOT_CONFIG.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: `Answer clearly with steps if applicable: ${input}`,
                }),
            });

            const data = await response.json();

            const botText =
                data?.[0]?.generated_text || findFallback(input);

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    text: botText,
                    timestamp: new Date(),
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    text: findFallback(input),
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col z-50"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex justify-between">
                            <span className="font-semibold">
                                {AI_CHATBOT_CONFIG.botName}
                            </span>
                            <button onClick={() => setIsOpen(false)} className='cursor-pointer'>
                                <X />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex ${m.type === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`px-4 py-2 text-black border border-gray-200 rounded-xl max-w-xs text-sm ${m.type === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border'
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 text-gray-500">
                                    <Loader2 className="animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleSendMessage()
                                }
                                placeholder="Ask about digits, OCR..."
                                className="flex-1 text-black focus:border-blue-500 border-2 border-gray-200 focus:outline-0 rounded-lg px-3 py-2 text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-700 hover:bg-blue-800 cursor-pointer text-white flex flex-col items-center justify-center w-[2.5rem] h-[2.5rem] rounded-lg"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Open chat"
                className="
        fixed bottom-6 right-6 z-50
        w-16 h-16 rounded-full
        bg-gradient-to-r from-blue-600 to-indigo-600
        text-white
        flex items-center justify-center

        shadow-xl
        transition-all duration-300 ease-out

        hover:scale-110
        hover:shadow-2xl
        hover:shadow-blue-500/40

        active:scale-95

        animate-float cursor-pointer
      "
            >
                <MessageCircle size={28} />
            </button>
        </>
    );
}
