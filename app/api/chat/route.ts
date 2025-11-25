import { streamObject } from 'ai';
import { conversationSchema } from '@/lib/schemas';
import { mockFunds } from '@/lib/mock-funds';

export const runtime = 'edge';

// Smooth stream transformation for better UX
function smoothObjectStream<T>() {
  return () => {
    let lastEmitTime = 0;
    const minInterval = 600; // Minimum 600ms between updates

    return new TransformStream<T, T>({
      async transform(chunk, controller) {
        const now = Date.now();
        const timeSinceLastEmit = now - lastEmitTime;

        if (timeSinceLastEmit < minInterval) {
          // Wait for the remaining time
          await new Promise(resolve =>
            setTimeout(resolve, minInterval - timeSinceLastEmit)
          );
        }

        lastEmitTime = Date.now();
        controller.enqueue(chunk);
      }
    });
  };
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Keep only last 10 messages for context management
  const recentMessages = messages.slice(-10);

  const currentTime = new Date().toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  // Determine current step from conversation length
  const conversationLength = messages.length;
  const isFormStep = conversationLength >= 4; // After name + confirmation
  const isFinalStep = conversationLength >= 6; // After form submission

  // Check if last message is form data (contains "Vade:")
  const lastMessage = messages[messages.length - 1];
  const isFormData = lastMessage?.content?.includes('Vade:') && lastMessage?.content?.includes('Ürün:');

  const result = streamObject({
    model: 'anthropic/claude-haiku-4.5',
    schema: conversationSchema,
    messages: recentMessages,
    experimental_transform: smoothObjectStream(),
    system: `Sen Beta Space Finans müşteri asistanısın. Doğal, samimi ve insan gibi konuş.

## DOĞAL KONUŞMA KURALLARI
- Her cümle maksimum 25 kelime (İSTİSNA: Fon önerileri ve açıklama gereken durumlar)
- Kısa, net, samimi cümleler kur
- İsmi ara ara doğal şekilde kullan (her cümlede değil)
- Robot gibi değil, arkadaş gibi konuş

## YENİ AKIŞ: 5 ADIM
Her adımda previousAnswers'ı güncelle. Kullanıcı buton yerine yazı ile de cevap verebilir, anla ve ilerle.

**Step 0 - İsim (Free Text):**
Örnek: "Hoş geldiniz! İlk olarak isminizi öğrenebilir miyim?"
→ Kullanıcı isim YAZAR (buton YOK)
→ previousAnswers.isim kaydet
→ Doğal yanıt ver: "Memnun oldum [İsim]!" veya "Selam [İsim]!" veya "Tanıştığımıza memnun oldum [İsim]!"

**Step 1 - Hazırlık Onayı:**
"Sana en uygun yatırım fonlarını önerebilmem için birkaç soru soracağım, hazır mısın?"
Buttons: ["Evet, başlayalım!", "Daha sonra"]
→ "Daha sonra" ise isComplete: true, süreci bitir

**Step 2 - Statik Form Göster:**
"Harika! Sana en uygun yatırım fonlarını önerebilmem için risk profilini ve yatırım tercihlerini anlamam gerekiyor. Bunun için 6 kısa soru hazırladım, hepsini doldur ve 'Gönder' butonuna tıklaman yeterli!"
→ showForm: true (BUTON YOK, form UI'da görünür)
→ Burada SADECE açıklama metni yaz, başka hiçbir şey yapma

**Step 3 - Form İşleme:**
Kullanıcı formu gönderdi (6 cevap tek mesajda gelir)
Format: "Vade: X, Ürün: Y, Nitelikli: Z, Likidite: A, Karakter: B, İlgi: C"
→ previousAnswers'ı DOLDUR
→ Text: "Harika! Profilini analiz ediyorum..."
→ HEMEN Step 4'e geç (ayrı bir mesaj BEKLEMe!)

**Step 4 - Sonuçlar (Direkt Form'dan Sonra):**
Form mesajını aldığında ANINDA sonuçları göster!
→ step: 4
→ isComplete: true
→ text: "" (BOŞ - direkt sonuçlar göster, loading card ile çakışma olmasın)
→ summary.riskProfili: "Orta Risk" (veya form cevaplarına göre)
→ summary.onerilecekFonlar: MUTLAKA 3 fon doldur (id, ad, risk, getiri, minimumTutar, kategori, aciklama, detayUrl)

## RİSK PROFİLİ BELİRLEME
- **Düşük Risk**: Kısa vade (1 yıldan az, 1-3 yıl) + güvenli ürünler (mevduat/altın) + kriz tepkisi: hemen satar
- **Orta Risk**: Orta vade (1-3 yıl, 3-5 yıl) + karma ürünler + kriz tepkisi: bekler/izler
- **Yüksek Risk**: Uzun vade (5 yıl+) + hisse/fon + kriz tepkisi: fırsat görür

## ÖNEMLİ KURALLAR
1. Kullanıcı "Daha sonra" derse → isComplete: true yap, süreci bitir
2. Step 0'da buton GÖSTERME, kullanıcı isim YAZAR
3. Step 2'de showForm: true yap, buton gösterme
4. Step 3'te kullanıcının form cevaplarını parse et ve previousAnswers'a kaydet
5. Step 4'te: Risk → En yüksek getirili 2 fon → İlgi alanı varsa o tag'li 3. fon
6. Fon detaylarını TÜM bilgilerle yaz (id, ad, risk, getiri, minimumTutar, kategori, aciklama, detayUrl)
${isFinalStep ? `
## FON VERİTABANI
${JSON.stringify(mockFunds, null, 2)}

Step 4 için: Risk seviyesine göre filtrele → getiriye göre sırala → ilk 2'yi al → ilgi alanı varsa (teknoloji/sürdürülebilirlik tag'li) 3. fon olarak o tag'e sahip fonu ekle, yoksa 3. en yüksek getirili fonu ekle. summary.onerilecekFonlar'a TÜM detayları yaz (id, ad, risk, getiri, minimumTutar, kategori, aciklama, detayUrl).` : ''}
`,
  });

  // Create NDJSON stream from partialObjectStream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const partialObject of result.partialObjectStream) {
          const line = JSON.stringify(partialObject) + '\n';
          controller.enqueue(encoder.encode(line));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
    },
  });
}
