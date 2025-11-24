'use client';

import Link from 'next/link';
import { WavyBackground } from '@/components/ui/wavy-background';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <WavyBackground className="max-w-4xl mx-auto relative min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 px-4 pb-40 -translate-y-10">
        <Badge variant="outline" className="text-sm px-4 py-1 bg-white/10 backdrop-blur-sm border-white/20 text-white">
          Onboarding Demo
        </Badge>
        <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold text-center">
          Yatırım Yolculuğunuz Buradan Başlıyor
        </h1>
        <p className="text-base md:text-xl text-white/80 text-center max-w-2xl">
          Birkaç soruyla yatırımcı profilinizi oluşturun ve kişiselleştirilmiş fon önerilerinize ulaşın
        </p>
        <Link href="/chat" prefetch={true}>
          <Button size="lg" className="mt-4 text-base">
            Şimdi Dene
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Bottom Card */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center px-4">
        <div className="w-full max-w-md">
          <div className="relative h-full rounded-2xl border border-white/20 p-2">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-black/40 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-fit rounded-lg border border-white/30 p-2 shrink-0">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="font-sans text-xl font-semibold text-white">
                    Bu demo nasıl yapıldı?
                  </h3>
                  <p className="font-sans text-sm text-white/70">
                    SPK uygunluk testini chat-native deneyime dönüştürme sürecini keşfedin
                  </p>
                </div>
              </div>
              <Link href="/about" className="w-full">
                <Button variant="secondary" size="default" className="w-full">
                  Şimdi Oku
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </WavyBackground>
  );
}
