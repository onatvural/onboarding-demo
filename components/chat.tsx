'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowUp, Square, User, Plus, ExternalLink, ArrowLeft } from 'lucide-react';
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BotIcon } from '@/components/bot-icon';
import { BotIconAnimated } from '@/components/bot-icon-animated';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import type { ConversationObject } from '@/lib/schemas';
import { GeistMono } from 'geist/font/mono';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  object?: Partial<ConversationObject>;
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [investmentDialogOpen, setInvestmentDialogOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasAutoStarted = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        scrollToBottom();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleStreamingRequest = async (userMessage: string) => {
    setIsLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages.filter(m => m.role === 'user' || m.content), { role: 'user', content: userMessage }].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last incomplete line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const partialObject = JSON.parse(line) as Partial<ConversationObject>;

              // Update the last assistant message with the partial object
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];

                if (lastMessage?.role === 'assistant') {
                  lastMessage.content = partialObject.text || '';
                  lastMessage.object = partialObject;
                }

                return newMessages;
              });
            } catch (e) {
              console.warn('JSON parse error:', line);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Streaming error:', error);
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'assistant' && !lastMessage.content) {
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

  const handleAutoStart = async () => {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '',
    };

    setMessages([assistantMessage]);
    await handleStreamingRequest('Başla');
  };

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

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
    };

    setMessages((prev) => [...prev, assistantMessage]);

    await handleStreamingRequest(input.trim());
  };

  const handleButtonClick = async (buttonText: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: buttonText,
    };

    setMessages((prev) => [...prev, userMessage]);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
    };

    setMessages((prev) => [...prev, assistantMessage]);

    await handleStreamingRequest(buttonText);
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
    setShowSubtitle(false);
    hasAutoStarted.current = false;
  };

  return (
    <div className="min-h-screen flex justify-center relative">
      <ShootingStars />
      <StarsBackground />
      <div className="w-full max-w-[920px] flex flex-col h-screen py-8 px-4 relative z-10">
        {/* Back Button */}
        <Link href="/">
          <Button
            className="absolute top-8 left-4 h-10 w-10 rounded-lg"
            variant="outline"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        {/* New Conversation Button */}
        <Button
          onClick={startNewConversation}
          className="absolute top-8 right-4 h-10 w-10 rounded-lg"
          variant="outline"
        >
          <Plus className="h-5 w-5" />
        </Button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <TextGenerateEffect
            words="Hoş Geldiniz!"
            className="text-3xl text-muted-foreground text-center mt-0"
            duration={0.3}
            onComplete={() => {
              setTimeout(() => {
                setShowSubtitle(true);
              }, 700);
            }}
          />
          {showSubtitle && (
            <TextGenerateEffect
              words="Size bugün nasıl yardımcı olabilirim?"
              className="text-base font-normal text-muted-foreground text-center mt-0"
              duration={0.3}
              onComplete={() => {
                if (!hasAutoStarted.current && messages.length === 0) {
                  hasAutoStarted.current = true;
                  handleAutoStart();
                }
              }}
            />
          )}
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto mb-4 mt-8 space-y-6 pr-2 custom-scrollbar">
          {messages.map((message, index) => (
            <div key={message.id}>
              <div
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

              {/* Render Buttons if available */}
              {message.role === 'assistant' && message.object?.buttons && message.object.buttons.length > 0 && index === messages.length - 1 && !isLoading && (
                <div className="ml-[42px] mt-4">
                  <div className="flex flex-wrap gap-2 max-w-2xl">
                    {message.object.buttons.map((btn, btnIndex) => (
                      <motion.div
                        key={btn}
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.5, delay: btnIndex * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => handleButtonClick(btn)}
                          className="min-w-[120px] px-4"
                        >
                          {btn}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Render Summary if conversation is complete */}
              {message.role === 'assistant' && message.object?.isComplete && message.object?.summary && (
                <div className="ml-[42px] mt-6 space-y-6">
                  {/* Risk Profile Badge */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Risk Profiliniz</h3>
                    <Badge variant="secondary" className="text-sm">
                      {message.object.summary.riskProfili}
                    </Badge>
                  </div>

                  {/* Fund Cards */}
                  {message.object.summary.onerilecekFonlar && message.object.summary.onerilecekFonlar.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Sizin İçin Önerilen Fonlar</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {message.object.summary.onerilecekFonlar.map((fon) => (
                          <Card key={fon.id || Math.random()} className="flex flex-col">
                            <CardHeader>
                              <div className="flex items-start justify-between gap-2">
                                {fon.ad && <CardTitle className="text-base leading-tight">{fon.ad}</CardTitle>}
                                {fon.risk && (
                                  <Badge variant="outline" className="shrink-0 text-xs">
                                    {fon.risk}
                                  </Badge>
                                )}
                              </div>
                              {fon.kategori && <CardDescription>{fon.kategori}</CardDescription>}
                            </CardHeader>
                            <CardContent className="flex-1 space-y-2 text-sm">
                              {fon.getiri && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Yıllık Getiri:</span>
                                  <span className="font-semibold text-green-600">%{fon.getiri}</span>
                                </div>
                              )}
                              {fon.minimumTutar && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Minimum Tutar:</span>
                                  <span className="font-medium">{fon.minimumTutar.toLocaleString('tr-TR')} TL</span>
                                </div>
                              )}
                              {fon.aciklama && (
                                <p className="text-xs text-muted-foreground mt-3 line-clamp-3">
                                  {fon.aciklama}
                                </p>
                              )}
                            </CardContent>
                            <CardFooter className="flex gap-2">
                              {fon.detayUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  asChild
                                >
                                  <a href={fon.detayUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Detay
                                  </a>
                                </Button>
                              )}
                              {fon.ad && (
                                <Button
                                  size="sm"
                                  className={fon.detayUrl ? "flex-1" : "w-full"}
                                  onClick={() => {
                                    setSelectedFund(fon);
                                    setInvestmentDialogOpen(true);
                                  }}
                                >
                                  Yatırım Yap
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="relative mb-2">
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

        {/* Credit Link */}
        <a
          href="https://www.linkedin.com/in/onatvural/"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs text-muted-foreground text-right block hover:text-foreground transition-colors ${GeistMono.className}`}
        >
          Bunu Kim Yaptı?
        </a>
      </div>

      {/* Investment Dialog */}
      <Dialog open={investmentDialogOpen} onOpenChange={setInvestmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yatırım Yap</DialogTitle>
            <DialogDescription>
              {selectedFund?.ad} fonuna yatırım yapmak için bilgilerinizi girin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Yatırım Tutarı (TL)
              </label>
              <input
                id="amount"
                type="number"
                min={selectedFund?.minimumTutar || 1000}
                placeholder={selectedFund?.minimumTutar ? `Minimum: ${selectedFund.minimumTutar.toLocaleString('tr-TR')} TL` : 'Minimum: 1.000 TL'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Ad Soyad
              </label>
              <input
                id="name"
                type="text"
                placeholder="Adınız ve soyadınız"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefon
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {selectedFund && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Fon Bilgileri:</p>
                {selectedFund.ad && <p className="text-muted-foreground">• {selectedFund.ad}</p>}
                {selectedFund.getiri && <p className="text-muted-foreground">• Yıllık Getiri: %{selectedFund.getiri}</p>}
                {selectedFund.risk && <p className="text-muted-foreground">• Risk: {selectedFund.risk}</p>}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvestmentDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={() => {
              alert('Yatırım talebiniz alındı! Bir temsilcimiz en kısa sürede sizinle iletişime geçecektir.');
              setInvestmentDialogOpen(false);
            }}>
              Yatırım Talebini Gönder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
