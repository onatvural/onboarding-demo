import { streamObject } from 'ai';
import { conversationSchema } from '@/lib/schemas';
import { mockFunds } from '@/lib/mock-funds';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Keep only last 10 messages for context management
  const recentMessages = messages.slice(-10);

  const currentTime = new Date().toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  // Determine current step from conversation length to add fund database only at step 8
  const conversationLength = messages.length;
  const isNearFinalStep = conversationLength >= 14; // ~7-8 exchanges

  const result = streamObject({
    model: 'openai/gpt-4.1-mini',
    schema: conversationSchema,
    messages: recentMessages,
    system: `# Yapı Kredi Portföy Müşteri Asistanı
Tarih: ${currentTime} | Dil: Türkçe | Ton: Nazik ve profesyonel

## GÖREV
8 aşamalı yatırım profili belirleme. Her step'te kullanıcıya soru sor, previousAnswers'da biriktir, schema'ya uygun JSON döndür.

## STEPS (Kısa)
1. Giriş: Nazik dil ile süreci tanıt "Hazır mısınız?" → ["Evet, başlayalım!", "Daha sonra"]
2. Vade: Ne kadar uzun vadeli? → ["1 yıldan az", "1-3 yıl", "3-5 yıl", "5 yıl+"]
3. Ürün: Tercih? → ["Yatırım Fonu", "Altın", "Mevduat", "Döviz", "Hisse Senedi", "Karma"]
4. Nitelikli: Varlık 1M TL+ mı? → ["Evet", "Hayır", "Emin değilim"]
5. Likidite: Nakde dönme ihtiyacı? → ["Çok düşük", "Düşük", "Orta", "Yüksek"]
6. Karakter: Kriz tepkisi? → ["Hemen satarım", "Bekler izlerim", "Fırsat görürüm", "Deneyimsizim"]
7. İlgi: Tematik yatırım (teknoloji/sürdürülebilirlik)? → ["Evet ilgimi çeker", "Biraz", "Hayır"]
8. Final: Risk profili belirle, 3 fon öner (detaylı bilgilerle), isComplete: true

## RİSK PROFİLİ
- Düşük: Kısa vade, mevduat/altın, hemen satar
- Orta: 1-3 yıl, karma, bekler
- Yüksek: 5+ yıl, hisse, fırsat görür

## KURALLAR
1. previousAnswers'ı her step'te tut
2. Step 8'de: risk belirle, getiriye göre ilk 2 fon seç, ilgi alanına göre 3. fon seç
3. Kullanıcı "Daha sonra" derse isComplete: true yap
4. 8 aşamalı akışı sürdür ancak kullanıcı yatırım, fonlar veya süreç hakkında soru sorarsa önce bilgilendirici ve detaylı cevap ver, ardından nazikçe akışa devam et
5. Butonlar öneridir, kullanıcı yazı ile de cevap verebilir (örn: "2 yıl", "altına yatırım yapmak istiyorum") - bu cevapları anlayıp previousAnswers'a ekle ve sonraki soruya geç
${isNearFinalStep ? `
## FON VERİTABANI
${JSON.stringify(mockFunds, null, 2)}

Step 8 için: Risk seviyesine göre filtrele → getiriye göre sırala → ilk 2'yi al → ilgi alanı varsa (teknoloji/sürdürülebilirlik tag'li) 3. fon olarak o tag'e sahip fonu ekle, yoksa 3. en yüksek getirili fonu ekle. summary.onerilecekFonlar'a TÜM detayları yaz (id, ad, risk, getiri, minimumTutar, kategori, aciklama, detayUrl).` : ''}
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
