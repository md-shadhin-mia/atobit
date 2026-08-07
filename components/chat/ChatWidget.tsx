'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

const SUGGESTIONS = [
    'Help me build a reading habit',
    'How do I stay consistent?',
    'I keep missing my streak — what should I do?',
];

const GREETING: ChatMessage = {
    role: 'assistant',
    content:
        "Hi! I'm your Atobit Habit Coach 👋 I can help you design habits that stick, get past slumps, or answer any question. What are you working on?",
};

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
    const [input, setInput] = useState('');
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const scrollToBottom = useCallback(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streaming, scrollToBottom]);

    useEffect(() => {
        if (!open) return;
        textareaRef.current?.focus();
    }, [open]);

    const appendStream = useCallback((text: string) => {
        setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last?.role === 'assistant' && copy.length > 1) {
                copy[copy.length - 1] = { ...last, content: last.content + text };
            } else {
                copy.push({ role: 'assistant', content: text });
            }
            return copy;
        });
    }, []);

    const sendMessage = useCallback(
        async (raw?: string) => {
            const text = (raw ?? input).trim();
            if (!text || streaming) return;

            setInput('');
            setError(null);
            const history: ChatMessage[] = [...messages, { role: 'user', content: text }];
            setMessages(history);

            const abort = new AbortController();
            abortRef.current = abort;
            setStreaming(true);

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: history }),
                    signal: abort.signal,
                });

                if (!response.ok || !response.body) {
                    const bodyText = await response.text().catch(() => '');
                    throw new Error(bodyText || `Request failed (${response.status})`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let received = false;

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const events = buffer.split('\n\n');
                    buffer = events.pop() ?? '';

                    for (const event of events) {
                        if (!event.startsWith('data: ')) continue;
                        const data = JSON.parse(event.slice(6));

                        if (data.token) {
                            received = true;
                            appendStream(data.token);
                        }
                        if (data.error) {
                            throw new Error(data.error);
                        }
                        if (data.done) {
                            if (!received) appendStream('...');
                            return;
                        }
                    }
                }

                if (!received) appendStream('...');
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                const message = err instanceof Error ? err.message : 'Something went wrong';
                setError(message);
                appendStream(`⚠️ ${message}`);
            } finally {
                setStreaming(false);
                abortRef.current = null;
                scrollToBottom();
            }
        },
        [input, streaming, messages, appendStream, scrollToBottom]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void sendMessage();
        }
    };

    const closeWidget = useCallback(() => {
        abortRef.current?.abort();
        setOpen(false);
    }, []);

    return (
        <>
            <motion.button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close chat' : 'Open chat'}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-colors hover:bg-indigo-700 active:scale-95"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <X size={24} />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <MessageCircle size={24} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 sm:right-6"
                        style={{ height: 'min(32rem, calc(100vh - 8rem))' }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-white">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                                <Sparkles size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold leading-tight">Habit Coach</p>
                                <p className="flex items-center gap-1.5 text-xs text-indigo-100">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                                    {streaming ? 'Thinking...' : 'Online'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeWidget}
                                aria-label="Close chat"
                                className="rounded-full p-1.5 text-indigo-100 transition-colors hover:bg-white/20 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-3.5 py-4">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                                >
                                    <div
                                        className={cn(
                                            'max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm',
                                            msg.role === 'user'
                                                ? 'rounded-br-md bg-indigo-600 text-white'
                                                : 'rounded-bl-md border border-gray-100 bg-white text-gray-800'
                                        )}
                                    >
                                        {msg.content}
                                        {msg.role === 'assistant' && i === messages.length - 1 && streaming && (
                                            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-indigo-500 align-middle" />
                                        )}
                                    </div>
                                </div>
                            ))}

                            {streaming && messages[messages.length - 1]?.role === 'user' && (
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-gray-100 bg-white px-4 py-3 shadow-sm">
                                        <Loader2 size={14} className="animate-spin text-indigo-500" />
                                        <span className="text-sm text-gray-500">Thinking...</span>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Suggestions */}
                        {messages.length <= 1 && !streaming && (
                            <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-white px-3.5 pt-3">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => void sendMessage(s)}
                                        className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="flex items-end gap-2 border-t border-gray-100 bg-white p-3">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder="Ask your habit coach..."
                                aria-label="Message"
                                className="max-h-28 flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => void sendMessage()}
                                disabled={!input.trim() || streaming}
                                aria-label="Send message"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
