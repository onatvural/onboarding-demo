'use client';

import Link from 'next/link';
import { WavyBackground } from '@/components/ui/wavy-background';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <WavyBackground className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center space-y-6 px-4">
        <Badge variant="outline" className="text-sm px-4 py-1 bg-white/10 backdrop-blur-sm border-white/20 text-white">
          BETA SPACE FİNANS
        </Badge>
        <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold text-center">
          Yapay Zeka Asistanımız ile Tanışın
        </h1>
        <p className="text-base md:text-xl text-white/80 text-center max-w-2xl">
          Beta Space Finans hizmetlerine dair bir çok sorunuzun cevabını artık 7/24 kolayca sorabilirsiniz
        </p>
        <Link href="/chat" prefetch={true}>
          <Button size="lg" className="mt-4 text-base">
            Asistanı Kullanmaya Başla
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </WavyBackground>
  );
}
