import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
    PaperPlaneTilt, 
    X, 
    ChatCircle,
    Sparkle,
    User,
    ArrowClockwise
} from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

const normalizeBackendUrl = (url) => {
  const fallback = 'https://as-intel.onrender.com';
  if (url === undefined || url === null || url === '' || url === 'undefined' || typeof url !== 'string') {
    return `${fallback}/api`;
  }

  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed || trimmed.toLowerCase() === 'undefined') {
    return `${fallback}/api`;
  }

  const base = trimmed.toLowerCase().endsWith('/api') ? trimmed : `${trimmed}/api`;
  return base;
};

const API = normalizeBackendUrl(process.env.REACT_APP_BACKEND_URL);

const suggestedPrompts = [
    "What are the top selling products?",
    "Why did revenue drop?",
    "Who are our best customers?",
];

const ChatMessage = ({ message, isUser }) => {
    return (
        <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
            <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                isUser ? 'bg-secondary' : 'bg-primary/10'
            }`}>
                {isUser ? (
                    <User size={14} weight="bold" className="text-secondary-foreground" />
                ) : (
                    <Sparkle size={14} weight="fill" className="text-primary" />
                )}
            </div>
            <div className={`max-w-[85%] ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'} text-sm`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content.split('\n').map((line, i) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                            return <strong key={i} className="block">{line.slice(2, -2)}</strong>;
                        }
                        if (line.match(/^\d+\.\s\*\*/)) {
                            const parts = line.match(/^(\d+\.)\s\*\*(.+?)\*\*(.*)$/);
                            if (parts) {
                                return (
                                    <p key={i} className="ml-2 text-xs">
                                        <span className="font-mono text-muted-foreground">{parts[1]}</span>
                                        <strong> {parts[2]}</strong>
                                        <span>{parts[3]}</span>
                                    </p>
                                );
                            }
                        }
                        if (line.startsWith('•')) {
                            return <p key={i} className="ml-3 text-xs">{line}</p>;
                        }
                        return <p key={i}>{line}</p>;
                    })}
                </div>
            </div>
        </div>
    );
};

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your Analytics Assistant. Ask me about products, revenue, or customers!"
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(`${API}/chat`, { message: userMessage.content });
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: response.data.response 
            }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "Sorry, I'm having trouble. Please try again." 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handlePromptClick = (prompt) => {
        setInput(prompt);
        inputRef.current?.focus();
    };

    const handleReset = () => {
        setMessages([{
            role: 'assistant',
            content: "Hi! I'm your Analytics Assistant. Ask me about products, revenue, or customers!"
        }]);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                data-testid="chat-widget-toggle"
                className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-105 ${isOpen ? 'scale-0' : 'scale-100'}`}
            >
                <ChatCircle size={28} weight="fill" />
            </button>

            {/* Chat Panel */}
            <div 
                className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] transition-all duration-300 ${
                    isOpen 
                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
                data-testid="chat-widget-panel"
            >
                <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
                        <div className="flex items-center gap-2">
                            <Sparkle size={20} weight="fill" />
                            <span className="font-semibold text-sm">AS Intelligence Assistant</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleReset}
                                className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
                                data-testid="chat-reset-btn"
                            >
                                <ArrowClockwise size={16} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
                                data-testid="chat-close-btn"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="h-[350px]" ref={scrollRef}>
                        <div className="p-4 space-y-4" data-testid="chat-messages">
                            {messages.map((message, index) => (
                                <ChatMessage 
                                    key={index} 
                                    message={message} 
                                    isUser={message.role === 'user'} 
                                />
                            ))}
                            {loading && (
                                <div className="flex gap-2 animate-fade-in">
                                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                                        <Sparkle size={14} weight="fill" className="text-primary animate-pulse" />
                                    </div>
                                    <div className="chat-bubble-assistant py-2">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Suggested Prompts */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-3 border-t border-border pt-3" data-testid="chat-suggestions">
                            <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Try asking:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {suggestedPrompts.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePromptClick(prompt)}
                                        data-testid={`chat-prompt-${index}`}
                                        className="px-2 py-1 text-[11px] rounded border border-border bg-background hover:bg-muted transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t border-border">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your data..."
                                disabled={loading}
                                data-testid="chat-input"
                                className="flex-1 h-9 text-sm"
                            />
                            <Button 
                                type="submit" 
                                size="sm"
                                disabled={!input.trim() || loading}
                                data-testid="chat-send-btn"
                                className="h-9 w-9 p-0"
                            >
                                <PaperPlaneTilt size={16} weight="bold" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatWidget;
