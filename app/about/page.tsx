'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import Lottie from 'lottie-react';
import scrollAnimation from '@/public/scroll-down.json';

export default function About() {
  const [isMounted, setIsMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <Link href="/">
          <Button variant="outline" size="icon" className="h-10 w-10 border-white/20 text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Star Background - client only */}
        {isMounted && (
          <>
            <StarsBackground className="absolute inset-0" />
            <ShootingStars className="absolute inset-0" />
          </>
        )}

        {/* Parallax container */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          {/* Text with blur fade-in */}
          <motion.h2
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-2xl sm:text-4xl font-medium text-white text-center px-6"
          >
            Hoş Geldin 👋, ismini öğrenebilir miyim?
          </motion.h2>
        </div>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4.5, times: [0, 0.33, 0.67, 1], delay: 1.5 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
        >
          <Lottie
            animationData={scrollAnimation}
            loop={true}
            className="w-24 h-24"
          />
        </motion.div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <article className="space-y-6">

          {/* Main Title */}
          <h1 className="text-[24px] sm:text-[30px] font-bold leading-tight">
            Zorunlu Bir Adımı Değerli Bir Deneyime Çevirmek
          </h1>

          {/* Introduction */}
          <p className="text-[15px] text-white/70 leading-relaxed">
            Form doldurmak müşteri kaybettirir. Peki ya sohbet?
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Kullanıcı deneyimi alanında 10 yılı devirmiş bir ekip olarak, teknoloji değişse de bazı temel doğruların değişmediğini biliyoruz. Ancak yapay zeka (LLM) hayatımıza girdiğinde kendimize şunu sorduk: Bugüne kadar "mecburen" yaptığımız sıkıcı akışları, bu yeni teknolojiyle gerçekten keyifli bir hale getirebilir miyiz?
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Beta Space Studio olarak SPK uyumluluk testleri gibi en "çetrefilli" konuyu ele aldık ve bu süreçte neler öğrendiğimizi, neleri önemsediğimizi sizinle paylaşmak istedik.
          </p>

          {/* Section 1 */}
          <h2 className="text-[17px] sm:text-[19px] font-semibold mt-10">
            Kullanıcıyı Akıştan Koparmamak
          </h2>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Probleme yaklaşırken masaya koyduğumuz ilk kural, bir UX tasarımcısı olarak belki de en büyük hassasiyetimizdi: Kullanıcıyı akıştan koparma.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Geleneksel bankacılık deneyimlerinde en sık gördüğümüz hata, kullanıcının sohbet ederken bir anda "Formu doldurmak için tıklayın" denilerek bambaşka bir sayfaya (redirect) fırlatılmasıdır. Bu, mobil deneyimde dikkati dağıtan ve insanı soğutan bir an. Bizim hedefimiz ise kullanıcının o yapay zeka ile kurduğu diyalog çemberinden hiç çıkmamasıydı.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            <strong className="text-white/90">Her Şey Sohbetin İçinde:</strong> SPK formlarını harici bir sayfa yerine, mesaj balonlarının arasına, sanki sohbetin doğal bir parçasıymış gibi (Inline) yerleştirdik.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            <strong className="text-white/90">Akıcı Geçiş:</strong> Form bittiği an, sistem "bekleyin" demeden arka planda hesaplamasını yapıp sonucu getiriyor.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            <strong className="text-white/90">Final:</strong> Ve en önemlisi, yapay zeka işini bitirdiğinde kullanıcıyı boşluğa bırakmıyor; "Benim yetkim buraya kadar, şimdi seni işin uzmanına bağlıyorum" diyerek insani bir köprü kuruyor.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Buradaki amaç şov yapmak değil; sadece kullanıcının zihnini yoran o "sayfalar arası geçiş" yükünü ortadan kaldırmaktı.
          </p>

          {/* Section 2 */}
          <h2 className="text-[17px] sm:text-[19px] font-semibold mt-10">
            İnsan Taklidi Yapmadan İnsancıl Olmak
          </h2>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Karşımızdakinin bir yapay zeka olduğunu biliyoruz, kullanıcı da biliyor. Bu yüzden "insan taklidi" yapmaya çalışmak yerine, "nazik bir asistan" hissiyatı yaratmaya odaklandık.
          </p>

          <video
            src="/welcome-message.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-screen relative left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 sm:w-full rounded-none sm:rounded-lg"
          />

          <p className="text-[15px] text-white/70 leading-relaxed">
            Burada küçük ama deneyimi yumuşatan detaylar devreye girdi:
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            <strong className="text-white/90">İsim Hafızası:</strong> Sohbet başladığında isminizi öğrenip, ikinci cümlesinde size isminizle hitap etmesi basit ama etkili bir bağ kurma yöntemi.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            <strong className="text-white/90">Haddini Bilmek:</strong> Yapay zeka size önerileri sunduktan sonra, yatırım tavsiyesi vermeye kalkışmıyor. Tam tersine, konuyu bir insan temsilciye devrederek güven tazeliyor.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Bu yaklaşım, teknolojiyi soğuk bir duvar olmaktan çıkarıp, insan uzmanlığına giden yolda yardımcı bir aracıya dönüştürüyor.
          </p>

          {/* Section 3 */}
          <h2 className="text-[17px] sm:text-[19px] font-semibold mt-10">
            Generative UI: Gözü Yormayan, Sakin Bir Arayüz
          </h2>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Bireysel yatırım ciddi bir iştir ve kullanıcı arayüzü de bu ciddiyeti "elit" bir sakinlikle yansıtmalı. Burada "Generative UI" dediğimiz kavramı, sırf havalı olsun diye değil, kullanıcıyı rahat hissettirmek için kullandık.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Metinlerin ekrana bir anda "küt" diye düşmesi yerine, daha doğal bir akış kurguladık:
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            <strong className="text-white/90">Akışkanlık:</strong> Mesajlar ve kartlar, ekrana yumuşak geçişlerle (fade-in) geliyor.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            <strong className="text-white/90">Yazı Ritmi:</strong> Cevaplar anında belirmiyor; sanki o an sizin için düşünülüp yazılıyormuş gibi hafif bir daktilo efekti ve bulanıklık (blur) ile netleşiyor.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Bu detaylar, kullanıcının aceleye getirilmiş bir form doldurduğu hissini değil; kendisine özel, özenilmiş bir hizmet aldığı hissini destekliyor.
          </p>

          <video
            src="/form-fill.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-screen relative left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 sm:w-full rounded-none sm:rounded-lg"
          />

          {/* Section 4 */}
          <h2 className="text-[17px] sm:text-[19px] font-semibold mt-10">
            Günün Sonunda Ne İşe Yarıyor?
          </h2>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Peki, bu kadar tasarım eforu bir finans kuruluşu için ne anlama geliyor? Cevap aslında basit: Müşteriyi kapıda kaybetmemek.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Mevcut senaryolarda potansiyel müşteri, ruhsuz bir form doldurur ve karşılığında kuru bir "Teşekkürler, sizi arayacağız" mesajı alır. Çoğu müşteri adayı bu noktada soğur ve kopar.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Bizim kurguladığımız bu deneyimde ise kullanıcı, sorulara cevap verdikçe karşılığını anında alıyor. Kendi risk profilini görüyor, ona uygun ürünleri yapay zeka ile birlikte keşfediyor. Yani müşteri temsilcisi daha telefonu açmadan, kullanıcı zaten ürünle tanışmış ve ısınmış oluyor. Bu da sadece "form doldurtmak" değil, müşteriyi gerçekten kazanmak (acquisition) anlamına geliyor.
          </p>

          <video
            src="/fund-selection.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-screen relative left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 sm:w-full rounded-none sm:rounded-lg"
          />

          {/* CTA Button */}
          <div className="flex justify-center !mt-[40px]">
            <Link href="/chat">
              <Button variant="secondary" size="lg" className="text-base">
                Demoyu Dene
              </Button>
            </Link>
          </div>

          {/* Beta Space Studio Section */}
          <section className="!mt-[120px] -mx-6 sm:-mx-0 px-6 py-16 bg-gradient-to-b from-white/5 to-transparent rounded-none sm:rounded-2xl">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              {/* Headline */}
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Beta Space Studio ile yapay zeka deneyimini bir üst seviyeye çıkarın
              </h2>

              {/* Tagline */}
              <p className="text-white/60">
                İnsan odaklı yapay zeka deneyimlerini tasarlıyor ve inşa ediyoruz.
              </p>

              {/* Value Propositions */}
              <div className="space-y-4 text-white/80">
                <p>Yapay zeka deneyiminde <span className="underline underline-offset-4">kullanıcı memnuniyetini 10x</span> arttırın</p>
                <p><span className="underline underline-offset-4">Marka deneyiminizi ve kalitenizi</span> yapay zeka deneyimine yansıtın</p>
                <p>Müşteri kazanım oranlarınızı <span className="underline underline-offset-4">kolayca</span> arttırın</p>
              </div>

              {/* Email Contact */}
              <a
                href="mailto:info@betaspacestudio.com"
                className="inline-block text-white/90 hover:text-white underline underline-offset-4 transition-colors"
              >
                info@betaspacestudio.com
              </a>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
