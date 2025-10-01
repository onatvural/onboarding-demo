'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, Square, User, Plus } from 'lucide-react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

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

  const startNewConversation = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex justify-center relative">
      <ShootingStars />
      <StarsBackground />
      <div className="w-full max-w-[920px] flex flex-col h-screen py-8 px-4 relative z-10">
        {/* New Conversation Button */}
        <Button
          onClick={startNewConversation}
          className="absolute top-8 right-4 h-10 w-10 rounded-lg"
          variant="outline"
        >
          <Plus className="h-5 w-5" />
        </Button>

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
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4">
                            <code className="relative rounded font-mono text-sm" {...props}>
                              {children}
                            </code>
                          </pre>
                        )
                      ),
                      p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>,
                      ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
                      ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                      h1: ({ children }) => <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{children}</h1>,
                      h2: ({ children }) => <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">{children}</h2>,
                      h3: ({ children }) => <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>,
                      h4: ({ children }) => <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{children}</h4>,
                      blockquote: ({ children }) => <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      a: ({ href, children }) => (
                        <a href={href} className="font-medium text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer">
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
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="resize-none border-0 px-6 py-4 pr-16 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] max-h-[200px]"
              rows={1}
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
              {isLoading ? <Square className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
