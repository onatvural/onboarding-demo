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
import { ArrowUp, Square, User, Plus, ExternalLink, ArrowLeft, CheckCircle2, TrendingUp, Shield, BadgeCheck } from 'lucide-react';
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BotIcon } from '@/components/bot-icon';
import { BotIconAnimated } from '@/components/bot-icon-animated';
import { FundChart } from '@/components/fund-chart';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { OnboardingForm } from '@/components/onboarding-form';
import { LoadingCard } from '@/components/loading-card';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { StreamingTypewriter } from '@/components/ui/streaming-typewriter';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [investmentDialogOpen, setInvestmentDialogOpen] = useState(false);
  const [investmentSuccessOpen, setInvestmentSuccessOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showFormReady, setShowFormReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasAutoStarted = useRef(false);

  // Prevent hydration mismatch for background effects
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detect keyboard height on mobile
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const viewport = window.visualViewport;

    const handleViewportResize = () => {
      const currentKeyboardHeight = window.innerHeight - viewport.height;
      setKeyboardHeight(currentKeyboardHeight > 0 ? currentKeyboardHeight : 0);
    };

    viewport.addEventListener('resize', handleViewportResize);
    return () => viewport.removeEventListener('resize', handleViewportResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll during streaming (but not when input is focused)
  useEffect(() => {
    if (isLoading && !isInputFocused) {
      const interval = setInterval(() => {
        scrollToBottom();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading, isInputFocused]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Auto-focus input on keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if dialog is open or loading
      if (investmentDialogOpen || isLoading) return;

      // Skip if input is already focused
      if (document.activeElement === textareaRef.current) return;

      // Skip if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Skip special keys
      const specialKeys = ['Tab', 'Escape', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Home', 'End', 'PageUp', 'PageDown'];
      if (specialKeys.includes(e.key) || e.key.startsWith('F')) return;

      // Focus input for printable characters
      if (e.key.length === 1 && textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [investmentDialogOpen, isLoading]);

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

  const handleFormSubmit = async (formData: any) => {
    setIsProcessing(true);

    // Create user message showing form was submitted
    const formSummary = `Vade: ${formData.vade}, Ürün: ${formData.urun}, Nitelikli: ${formData.nitelikli}, Likidite: ${formData.nakit}, Karakter: ${formData.karakter}, İlgi: ${formData.ilgi}`;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: formSummary,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add assistant message placeholder
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Optimize timing: Start API at 5s, keep loading until 6s
    // User sees all flip messages while API processes in background
    let apiCallPromise: Promise<any> | null = null;

    setTimeout(() => {
      apiCallPromise = handleStreamingRequest(formSummary);
    }, 5000);

    // Keep loading animation visible for 6 seconds total
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Wait for API if it hasn't finished yet (shouldn't take long)
    if (apiCallPromise) {
      await apiCallPromise;
    }

    setIsProcessing(false);
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
    setShowFormReady(false);
    hasAutoStarted.current = false;
    // Immediately trigger auto-start after clearing
    handleAutoStart();
  };

  // Auto-start conversation when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      hasAutoStarted.current = true;
      handleAutoStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex justify-center relative">
      {isMounted && (
        <>
          <ShootingStars />
          <StarsBackground />
        </>
      )}

      {/* Fixed Header Buttons */}
      <div className="fixed top-2 sm:top-8 left-0 right-0 z-20 flex justify-between px-4 max-w-[920px] mx-auto">
        <Link href="/">
          <Button
            className="h-10 w-10 rounded-lg"
            variant="outline"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Button
          onClick={startNewConversation}
          className="h-10 w-10 rounded-lg"
          variant="outline"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full max-w-[920px] flex flex-col h-screen relative z-10">
        {/* Messages Thread */}
        <div
          className="flex-1 overflow-y-auto pt-[72px] sm:pt-[96px] px-4 space-y-6 sm:pr-6 custom-scrollbar"
          style={{ paddingBottom: `${80 + keyboardHeight}px` }}
        >
          {messages.map((message, index) => (
            <div key={message.id}>
              <div
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <>
                    {index === messages.length - 1 && isLoading ? (
                      <BotIconAnimated className="h-[30px] w-[30px] shrink-0 mt-1 animate-pulse" />
                    ) : (
                      <BotIcon className="hidden sm:block h-[30px] w-[30px] shrink-0 mt-1" />
                    )}
                  </>
                )}
                <div
                  className={`max-w-[80%] google-sans-flex ${
                    message.role === 'user'
                      ? 'text-primary-foreground px-4 py-2 rounded-lg'
                      : 'text-foreground'
                  }`}
                  style={
                    message.role === 'user'
                      ? { backgroundImage: 'linear-gradient(to right, #cfd2cd, #c6c5c1, #bcb9b6, #b2adac, #a6a2a2)' }
                      : undefined
                  }
                >
                  {message.role === 'assistant' ? (
                    message.object?.isComplete ? (
                      <TextGenerateEffect
                        words={message.content}
                        className="google-sans-flex font-normal"
                        duration={0.3}
                        filter={false}
                      />
                    ) : (
                      <StreamingTypewriter
                        content={message.content}
                        speed={80}
                        className="google-sans-flex font-normal"
                        onComplete={() => {
                          if (message.object?.showForm) {
                            setShowFormReady(true);
                          }
                        }}
                      />
                    )
                  ) : (
                    message.content
                  )}
                </div>
                {message.role === 'user' && (
                  <User className="hidden sm:block h-6 w-6 shrink-0 mt-1" />
                )}
              </div>

              {/* Render Static Form if showForm is true (after typewriter completes) */}
              {message.role === 'assistant' && message.object?.showForm && index === messages.length - 1 && !isLoading && showFormReady && (
                <div className="sm:ml-[42px] mt-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <OnboardingForm onSubmit={handleFormSubmit} isProcessing={isProcessing} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Show Loading State During Form Processing */}
              <AnimatePresence mode="wait">
                {message.role === 'assistant' && index === messages.length - 1 && isProcessing && !message.object?.isComplete && (
                  <div className="sm:ml-[42px] mt-6">
                    <LoadingCard />
                  </div>
                )}
              </AnimatePresence>

              {/* Render Buttons only for Steps 0-1 (name and confirmation) */}
              {message.role === 'assistant' &&
               message.object?.buttons &&
               message.object.buttons.length > 0 &&
               (message.object.step === 0 || message.object.step === 1) &&
               index === messages.length - 1 &&
               !isLoading && (
                <div className="sm:ml-[42px] mt-4">
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

              {/* Render Summary if conversation is complete with animations */}
              {message.role === 'assistant' && message.object?.isComplete && message.object?.summary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="sm:ml-[42px] mt-6 space-y-6"
                >
                  {/* Risk Profile Badge */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Risk Profiliniz</h3>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="text-sm">
                        {message.object.summary.riskProfili}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Dengeli getiri ve risk profili için uygun fonlar
                      </p>
                    </div>
                  </div>

                  {/* Fund Cards */}
                  {message.object.summary.onerilecekFonlar && message.object.summary.onerilecekFonlar.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Sizin İçin Önerilen Fonlar</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {message.object.summary.onerilecekFonlar.map((fon, fonIndex) => (
                          <motion.div
                            key={fon.id || Math.random()}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 + fonIndex * 0.1 }}
                          >
                            <Card className="flex flex-col h-[380px] p-4">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                {fon.ad && <CardTitle className="text-base leading-tight">{fon.ad}</CardTitle>}
                                {fon.risk && (
                                  <Badge variant="outline" className="shrink-0 text-xs">
                                    {fon.risk}
                                  </Badge>
                                )}
                              </div>
                              {fon.kategori && <CardDescription className="mb-3">{fon.kategori}</CardDescription>}

                              <div className="mb-3">
                                <FundChart fundIndex={fonIndex} />
                              </div>

                              <div className="flex-1 space-y-1 text-sm">
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
                                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                    {fon.aciklama}
                                  </p>
                                )}
                              </div>

                              {fon.ad && (
                                <Button
                                  size="sm"
                                  className="w-full mt-4"
                                  onClick={() => {
                                    setSelectedFund(fon);
                                    setInvestmentDialogOpen(true);
                                  }}
                                >
                                  Detaylar
                                </Button>
                              )}
                          </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Area */}
        <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="max-w-[920px] mx-auto px-4 py-2 sm:py-3">
            <div className="relative border border-input rounded-lg bg-background flex items-center">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
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

            {/* Credit Link */}
            <a
              href="https://www.linkedin.com/in/onatvural/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs text-muted-foreground text-center block hover:text-foreground transition-colors mt-2 ${GeistMono.className}`}
            >
              Bunu Kim Yaptı?
            </a>
          </div>
        </form>
      </div>

      {/* Investment Dialog */}
      <Dialog open={investmentDialogOpen} onOpenChange={(open) => {
        setInvestmentDialogOpen(open);
        if (!open) setInvestmentAmount('');
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle className="sr-only">Yatırım Formu</DialogTitle>
          {/* 1. HERO SECTION - Fund highlight */}
          <div className="text-center pb-4 border-b">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BadgeCheck className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-green-600">Profilinize Uygun</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Tam Size Göre</h2>

            {selectedFund && (
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
                {selectedFund.ad && (
                  <p className="font-semibold text-lg mb-1">{selectedFund.ad}</p>
                )}
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedFund.aciklama || "Güvenli ve likit yatırım aracı"}
                </p>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {selectedFund.getiri && (
                    <div className="bg-green-500/10 rounded-md p-2">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-600">%{selectedFund.getiri}</span>
                      </div>
                      <p className="text-xs text-green-600 mt-0.5">Enflasyon üzeri</p>
                    </div>
                  )}
                  {selectedFund.risk && (
                    <div className="bg-blue-500/10 rounded-md p-2 flex flex-col items-center justify-center">
                      <div className="flex items-center justify-center gap-1">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-600">{selectedFund.risk}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. FORM SECTION - Action area */}
          <div className="py-4 space-y-3">
            <h3 className="font-medium text-sm">Formu doldurun, sizi en kısa sürede arayalım</h3>

            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₺</span>
                <input
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  value={investmentAmount}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, '');
                    if (rawValue) {
                      const formatted = Number(rawValue).toLocaleString('tr-TR');
                      setInvestmentAmount(formatted);
                    } else {
                      setInvestmentAmount('');
                    }
                  }}
                  placeholder={selectedFund?.minimumTutar ? `Min: ${selectedFund.minimumTutar.toLocaleString('tr-TR')}` : 'Yatırım Tutarı'}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <input
                id="name"
                type="text"
                placeholder="Ad Soyad"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <input
                id="phone"
                type="tel"
                placeholder="Telefon (05XX XXX XX XX)"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* KVKK Checkbox */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="kvkk"
                className="mt-1 h-4 w-4 rounded border-input"
              />
              <label htmlFor="kvkk" className="text-xs text-muted-foreground leading-tight">
                <a href="#" className="underline hover:text-foreground">KVKK Aydınlatma Metni</a> ve <a href="#" className="underline hover:text-foreground">Açık Rıza Metni</a>&apos;ni okudum, kabul ediyorum.
              </label>
            </div>
          </div>

          {/* 3. TRUST SECTION - Merve at bottom */}
          <div className="flex items-center gap-3 pt-3 border-t">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/merve.jpeg"
                alt="Merve Akçiçek"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground/70 tracking-wider">FON MÜŞTERİ TEMSİLCİSİ</p>
              <p className="font-medium text-sm">Merve Akçiçek</p>
              <p className="text-xs text-muted-foreground">Sizi en kısa sürede arayacak</p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setInvestmentDialogOpen(false)}>
              İptal
            </Button>
            <Button
              className="bg-[#3a6ea5] hover:bg-[#004e98] text-white"
              onClick={() => {
              setInvestmentDialogOpen(false);
              setInvestmentSuccessOpen(true);
            }}>
              Gönder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Investment Success Dialog */}
      <Dialog open={investmentSuccessOpen} onOpenChange={setInvestmentSuccessOpen}>
        <DialogContent className="sm:max-w-[500px] text-center">
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </motion.div>
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl">Başarıyla Gönderildi!</DialogTitle>
            <DialogDescription className="mt-2">
              Yatırım talebiniz başarıyla alındı. Merve hanım en kısa sürede sizinle iletişime geçecektir.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-2 text-sm text-muted-foreground">
            <p>📧 E-posta veya SMS aracılığıyla size ulaşılacak</p>
            <p>📞 Sorularınız için istediğiniz zaman iletişime geçebilirsiniz</p>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-[#3a6ea5] hover:bg-[#004e98] text-white"
              onClick={() => setInvestmentSuccessOpen(false)}
            >
              Tamamla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
