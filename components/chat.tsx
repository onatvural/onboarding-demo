'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Square, User } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BotIcon } from '@/components/bot-icon';
import { BotIconAnimated } from '@/components/bot-icon-animated';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to get response: ${response.status} ${errorText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const text = decoder.decode(value, { stream: true });
        accumulatedText += text;

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex].role === 'assistant') {
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: accumulatedText,
            };
          }
          return newMessages;
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant' && !lastMessage.content) {
            lastMessage.content = 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.';
          }
          return newMessages;
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center relative">
      <ShootingStars />
      <StarsBackground />
      <div className="w-full max-w-[920px] flex flex-col h-screen py-8 px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 space-y-4">
          <Badge variant="outline" className="text-sm px-4 py-1">
            YAPI KREDİ PORTFÖY
          </Badge>
          <h1 className="text-3xl font-bold text-center">
            Yapay Zeka Asistanımız ile Tanışın
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            Yapı Kredi Portföy hizmetlerine dair bir çok sorunuzun cevabını artık 7/24 kolayca sorabilirsiniz
          </p>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2 custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <>
                  {index === messages.length - 1 && isLoading ? (
                    <BotIconAnimated className="h-[30px] w-[30px] shrink-0 mt-1" />
                  ) : (
                    <BotIcon className="h-[30px] w-[30px] shrink-0 mt-1" />
                  )}
                </>
              )}
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground px-4 py-2 rounded-lg'
                    : 'text-foreground'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({ node, inline, className, children, ...props }: any) => (
                        inline ? (
                          <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm" {...props}>
                            {children}
                          </code>
                        )
                      ),
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="ml-2">{children}</li>,
                      h1: ({ children }) => <h1 className="text-2xl font-bold mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      a: ({ href, children }) => (
                        <a href={href} className="text-primary underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
              {message.role === 'user' && (
                <User className="h-6 w-6 shrink-0 mt-1" />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative border border-input rounded-lg bg-background flex items-center">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="resize-none border-0 px-6 py-4 pr-16 focus-visible:ring-0 focus-visible:ring-offset-0 flex items-center"
              rows={3}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
            />
            <Button
              type={isLoading ? 'button' : 'submit'}
              onClick={isLoading ? stopGeneration : undefined}
              disabled={!input.trim() && !isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg"
            >
              {isLoading ? <Square className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
