'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function About() {
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <article className="space-y-8">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Geleneksel Form Yapılarını 'Chat-Native' Tasarımla Yeniden Kurgulayarak Kesintisiz Bir Akışı Nasıl Sağlarız?
          </h1>

          {/* Introduction */}
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
            Finansal hizmetlerde kullanıcı deneyimini dijitalleştirirken karşılaşılan en belirgin adımlardan biri, yasal zorunluluk gereği toplanması gereken verilerdir. Beta Space Studio olarak bu demoda, SPK (Sermaye Piyasası Kurulu) tarafından zorunlu tutulan uygunluk testi sürecini, geleneksel form yapısından çıkarıp, bütünleşik bir yapay zeka sohbet deneyimine nasıl dönüştürdüğümüzü ele alıyoruz.
          </p>

          <p className="text-lg text-white/70 leading-relaxed">
            Geleneksel yatırımcı onboarding süreçlerinde, kullanıcılar genellikle bir noktada sohbet akışından veya ana sayfadan koparılarak statik form sayfalarına yönlendirilir. Bu durum, özellikle mobil deneyimde akışın kesintiye uğramasına neden olabilir. Bu projede temel amacımız; SPK risk profili testini ve veri toplama sürecini, kullanıcıyı başka bir sayfaya yönlendirmeden (No Redirect), doğrudan sohbet arayüzü içerisine (Inline) entegre etmekti.
          </p>

          <p className="text-lg text-white/70 leading-relaxed">
            Bu konsept çalışması, yapay zekanın sadece metin üretmekle kalmayıp, aynı zamanda dinamik arayüz bileşenleri (UI Components) sunarak süreçleri nasıl yönetebileceğine odaklanıyor.
          </p>

          {/* Section: Deneyim Kurgusu */}
          <h2 className="text-3xl sm:text-4xl font-bold mt-12">
            Deneyim Kurgusu: Sohbetin İçinde Çözüm Üretmek
          </h2>

          <p className="text-lg text-white/70 leading-relaxed">
            Bu demoda kurguladığımız akış, kullanıcının bir AI asistan ile tanışmasıyla başlıyor ve yatırım tavsiyesi niteliği taşımayan, tamamen kullanıcının risk profiline uygun seçeneklerin sunulmasıyla sonlanıyor.
          </p>

          <p className="text-lg text-white/70 leading-relaxed">
            Sürecin teknik ve tasarımsal olarak ayrıştığı noktalar şunlardır:
          </p>

          {/* Subsection 1 */}
          <h3 className="text-2xl sm:text-3xl font-semibold mt-8">
            1. Akışkan Veri Toplama (Inline Form Generation)
          </h3>

          <p className="text-lg text-white/70 leading-relaxed">
            Kullanıcıdan bilgi talep ederken onu harici bir "form sayfasına" göndermek yerine, yapay zeka sohbet balonunun hemen altında interaktif bir alan oluşturuyor.
          </p>

          <p className="text-base text-white/60 leading-relaxed ml-6">
            <strong className="text-white/80">Bütünleşik Yapı:</strong> SPK'nın zorunlu kıldığı vade, ürün tercihi ve risk algısı gibi sorular, sohbet penceresi içerisinde çalışan bir kart yapısında sunuluyor.
          </p>

          <p className="text-base text-white/60 leading-relaxed ml-6">
            <strong className="text-white/80">Bağlamsal Rehberlik:</strong> Kullanıcı, form içerisindeki terimler hakkında bilgiye ihtiyaç duyduğunda, yine aynı arayüz üzerinden bağlamsal ipuçlarına (tooltips) ulaşabiliyor.
          </p>

          {/* Subsection 2 */}
          <h3 className="text-2xl sm:text-3xl font-semibold mt-8">
            2. Beklenti Yönetimi ve Şeffaflık
          </h3>

          <p className="text-lg text-white/70 leading-relaxed">
            Form tamamlandığında, arka planda işleyen algoritmanın süreci kullanıcıya şeffaf bir şekilde aktarılıyor. "Risk profiliniz analiz ediliyor" veya "Uygun fonlar taranıyor" gibi bildirimler, kullanıcının sistemin o an ne yaptığını anlamasını sağlıyor. Bu adım, dijital deneyimde oluşan bekleme sürelerini anlamsız boşluklar olmaktan çıkarıp, sürecin bir parçası haline getiriyor.
          </p>

          {/* Subsection 3 */}
          <h3 className="text-2xl sm:text-3xl font-semibold mt-8">
            3. Sonuçların Görselleştirilmesi (Structured Output)
          </h3>

          <p className="text-lg text-white/70 leading-relaxed">
            Analiz tamamlandığında, yapay zeka sonucu düz bir metin bloğu olarak vermek yerine, okunması kolay ve karşılaştırılabilir kartlar halinde sunuyor.
          </p>

          <p className="text-lg text-white/70 leading-relaxed">
            Bu aşamada kullanıcı:
          </p>

          <ul className="list-disc ml-8 text-base text-white/60 leading-relaxed space-y-1">
            <li>Kendi risk profil grubunu (Örn: Dengeli/Atak),</li>
            <li>Profiline uygun eşleşen fonları,</li>
            <li>Fonların temel performans göstergelerini,</li>
          </ul>

          <p className="text-lg text-white/70 leading-relaxed">
            tek bir bakışta görebileceği yapılandırılmış bir formatta görüntülüyor.
          </p>

          {/* Subsection 4 */}
          <h3 className="text-2xl sm:text-3xl font-semibold mt-8">
            4. İnsan Dokunuşu ile Final (Hand-off)
          </h3>

          <p className="text-lg text-white/70 leading-relaxed">
            Yapay zeka, veri toplama ve ön eleme süreçlerini başarıyla tamamladıktan sonra, kullanıcıyı daha derinlemesine bilgi alabilmesi için gerçek bir portföy yöneticisine yönlendiriyor. "Detaylar" butonu ile tetiklenen bu süreç, dijital asistanın görevini tamamlayıp, iletişimi insan uzmanlığına devrettiği noktayı temsil ediyor.
          </p>

          {/* Conclusion */}
          <h2 className="text-3xl sm:text-4xl font-bold mt-12">
            Sonuç: Beta Space Studio Yaklaşımı
          </h2>

          <p className="text-lg text-white/70 leading-relaxed">
            Bu proje, karmaşık finansal regülasyonların kullanıcı dostu arayüzlerle nasıl sunulabileceğine dair bir yetenek gösterimidir (Capability Showreel).
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mt-12">
            <Link href="/chat">
              <Button variant="secondary" size="lg" className="text-base">
                Demoyu Deneyin
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
