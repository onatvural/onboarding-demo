'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

export default function About() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Star Background - client only */}
      {isMounted && (
        <>
          <StarsBackground className="fixed inset-0" />
          <ShootingStars className="fixed inset-0" />
        </>
      )}

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <Link href="/">
          <Button variant="outline" size="icon" className="h-10 w-10 border-white/20 text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-[1] max-w-4xl mx-auto px-6 py-16 sm:py-24 pt-20 sm:pt-24">
        <article className="space-y-6">

          {/* Main Title */}
          <h1 className="text-[24px] sm:text-[30px] font-bold leading-tight">
            Zorunlu Bir Adımı Değerli Bir Deneyime Çevirmek
          </h1>

          {/* Introduction */}
          <p className="text-[15px] text-white/70 leading-relaxed">
            Teknoloji ne kadar gelişirse gelişsin, insan psikolojisinin temel beklentileri değişmiyor: Anlaşılmak, saygı görmek ve hedefe en az zahmetle ulaşmak. Beta Space Studio olarak yapay zeka (LLM) projelerine yaklaşımımızın merkezinde de bu yatıyor. Bizim için nihai amaç, sadece &quot;yeni bir teknolojiyi entegre etmek&quot; değil; yıllardır kanıksadığımız o sıkıcı, bürokratik ve &quot;mecburen yapılan&quot; süreçleri, kullanıcı ile marka arasında güven inşa eden değerli bir diyaloğa dönüştürmek.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            SPK uyumluluk testleri gibi en çetrefilli süreçleri ele alırken hayal ettiğimiz dünya çok net: Yazılımın kullanıcıya ne yapması gerektiğini dikte eden soğuk bir bürokrat gibi değil; aksine sessiz, yetkin ve kullanıcının önünü açan nazik bir asistan gibi davrandığı bir deneyim.
          </p>

          {/* UX Flow Diagram */}
          <img
            src="/ux-flow.svg"
            alt="Kullanıcı Deneyimi Akış Şeması"
            className="w-screen relative left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 sm:w-full rounded-none sm:rounded-lg my-8"
          />

          {/* Section 1 */}
          <h2 className="text-[17px] sm:text-[19px] font-semibold mt-10">
            Akışta Kalmak
          </h2>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Geleneksel dijital deneyimlerde en sık gördüğümüz hata, kullanıcının bağlamdan koparılmasıdır. Bir sohbetin ortasında veya bir işlemin en kritik anında &quot;Formu doldurmak için tıklayın&quot; diyerek kullanıcıyı bambaşka bir sayfaya yönlendirmek, kullanıcının dikkatini dağıtmak ve yolculukta kaybolmasına ihtimal vermektir.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Bizim tasarım felsefemizde, geçişken şekilde tek bir alanda kullanıcının tüm adımlarını gerçekleştirmesi öncelikli hedeftir. SPK formlarını harici bir sayfa yerine, mesajların arasına, sohbetin doğal bir parçasıymış gibi (Inline) yerleştirmemizin sebebi budur. Kullanıcıyı sayfalar arasında savurmak yerine, her şeyi tek bir ekranda çözmek, zihinsel yükü (bilişsel sürtünmeyi) ortadan kaldırır. Eğer tasarladığımız arayüz, kullanıcının daha az düşünmesini ve hedefine daha zahmetsizce ulaşmasını sağlıyorsa, doğru yoldayız demektir.
          </p>

          <video
            src="/welcome-message.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-screen relative left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 sm:w-full rounded-none sm:rounded-lg"
          />

          {/* Section 2 */}
          <h2 className="text-[17px] sm:text-[19px] font-semibold mt-10">
            Herkes Sohbet İstemez
          </h2>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Ancak burada romantik bir hataya düşmemek ve dürüst olmak gerekir: Her kullanıcı &quot;sohbet etmeye&quot; bayılmaz. Deneyim beklentisi herkes için aynı değildir.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            SPK formları gibi standart prosedürlerde, konuya hakim ve hızlıca işlem yapmak isteyen bir kullanıcı için, yapay zekanın her soruyu tek tek, yavaş yavaş sormasını beklemek bir işkenceye dönüşebilir. 20 kutucuğu hızlıca &quot;tık-tık-tık&quot; diye işaretlemek, bazen en akıllı sohbetten bile 10 kat daha verimlidir.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Bu yüzden biz, Generative UI kavramını &quot;Hibrit&quot; bir yapıda kullanmayı tercih ediyoruz:
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            <strong className="text-white/90">Rehberlik İsteyen Kullanıcı:</strong> Adım adım, sohbet eşliğinde ilerler, neyi neden seçtiğini anlar ve güvende hisseder.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            <strong className="text-white/90">Hız İsteyen Kullanıcı:</strong> Sohbetin içinde beliren akıllı kartlar sayesinde, çoklu seçimleri tek seferde yapar veya &quot;Varsayılanları Seç&quot; gibi kısayollarla süreci hızla tamamlar.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Yani amacımız kullanıcıyı sadece bir sohbet botuna mahkum etmek değil; onun hız tercihine ve o anki ruh haline saygı duyan esnek bir yapı sunmaktır.
          </p>

          <video
            src="/form-fill.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-screen relative left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 sm:w-full rounded-none sm:rounded-lg"
          />

          {/* Section 3 */}
          <h2 className="text-[17px] sm:text-[19px] font-semibold mt-10">
            Güven, Dürüstlükten Gelir
          </h2>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Yazılımın &quot;nazik&quot; olması, insan taklidi yapması demek değildir. Kullanıcı karşısındakinin bir yapay zeka olduğunu bilir. Bu yüzden sahte bir insan profili çizmek yerine, &quot;haddini bilen&quot; ve güven veren bir asistan profili çizmek çok daha değerlidir.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Kurguladığımız yapıda yapay zeka, analizleri sunduktan sonra yatırım tavsiyesi vermeye kalkışmaz. &quot;Benim yetkim buraya kadar, şimdi seni işin gerçek uzmanına bağlıyorum&quot; diyerek insani bir köprü kurar. Bu dürüstlük, teknolojiyi soğuk bir duvar olmaktan çıkarıp, insan uzmanlığına giden yolda güvenilir bir aracıya dönüştürür.
          </p>

          {/* Section 4 */}
          <h2 className="text-[17px] sm:text-[19px] font-semibold mt-10">
            Tasarımın İşletmeye Olan Gerçek Katkısı
          </h2>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Peki, tüm bu &quot;nazik arayüz&quot;, &quot;hibrit yapı&quot; ve &quot;akışkan deneyim&quot; bir finans kuruluşu için günün sonunda ne ifade eder?
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Cevap çok nettir: Müşteri Kazanımı (Acquisition).
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            UX bizim için sadece &quot;güzel ekranlar&quot; tasarlamak değil, iş hedeflerine doğrudan hizmet eden stratejik bir araçtır. Mevcut senaryolarda müşteri adayı ruhsuz bir formu doldurup &quot;Sizi arayacağız&quot; mesajıyla boşluğa düşerken; bizim kurgumuzda kullanıcı, satış ekibi daha telefonu eline almadan kendi risk profilini görmüş, ürünü tanımış ve markaya ısınmış oluyor.
          </p>

          <p className="text-[15px] text-white/70 leading-relaxed">
            Satış ekibi müşteriyi aradığında, sıfırdan ikna etmeye çalışmıyor; zaten ikna olmuş, ne istediğini bilen bir kullanıcıyla tanışıyor. İşte bu, sadece bir form doldurma işini çözmek değil; işletme için ölçülebilir, gerçek bir değer yaratmaktır.
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
          <div className="flex justify-center !mt-[80px]">
            <Link href="/chat">
              <Button size="lg" className="text-base bg-white text-black hover:bg-white/90">
                Demoyu Dene
              </Button>
            </Link>
          </div>

          {/* Beta Space Studio Section */}
          <div className="!mt-[120px]">
            <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm py-8 sm:py-12">
              <CardHeader className="text-center pb-4 px-8 sm:px-12">
                <CardTitle className="text-xl sm:text-2xl text-white">
                  Beta Space Studio ile yapay zeka deneyimini bir üst seviyeye çıkarın
                </CardTitle>
                <CardDescription className="text-white/60 text-[15px] mt-4">
                  İnsan odaklı, kullanıcı hedeflerine saygılı ve sonuç odaklı deneyimler tasarlıyoruz.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pt-6 px-8 sm:px-12">
                <a
                  href="mailto:info@betaspacestudio.com"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                >
                  <Mail className="h-4 w-4 text-white/50 group-hover:text-white/80 transition-colors" />
                  <span className="underline underline-offset-4">info@betaspacestudio.com</span>
                </a>
              </CardContent>
            </Card>
          </div>
        </article>
      </div>
    </div>
  );
}
