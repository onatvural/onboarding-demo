# Stream Object Mimari Dokümantasyonu

**Proje:** Demo-YKP - Yapı Kredi Portföy AI Asistan
**Tarih:** Ocak 2025
**Stack:** Next.js 15, AI SDK v5.0.59, Zod, Edge Runtime

---

## BÖLÜM 1: Mevcut Mimari Analizi

### 1.1 Stream Object Nedir ve Neden Kullandık

**Stream Object,** Vercel AI SDK'nın yapılandırılmış veri (structured data) streaming özelliğidir. Geleneksel `streamText`'in aksine, sadece düz metin değil, **JSON objeleri** stream eder.

**Neden gerekli?**

1. **Yapılandırılmış Veri İhtiyacı:** 8 aşamalı form akışımızda her adımda:
   - Text mesajı
   - Butonlar (array)
   - previousAnswers (nested object)
   - Step numarası
   - isComplete durumu
   - Summary (fon önerileri ile birlikte)

   Düz metin ile bu yapıyı yönetmek imkansız.

2. **Type Safety:** Zod schema ile TypeScript type inference, compile-time validation.

3. **Progressive Rendering:** Obje kısmi gelirken UI güncellenebilir (örn: buttons henüz gelmeden text render edilebilir).

4. **Validation:** AI çıktısı schema'ya uymuyorsa hata verir, güvenlik ve tutarlılık sağlar.

**Alternatifler ve Neden Seçmedik:**

| Yöntem | Avantajları | Dezavantajları | Neden Kullanmadık |
|--------|------------|----------------|-------------------|
| `streamText` | Basit, hızlı | Sadece text, yapılandırılmamış | Form data stream edilemez |
| `generateObject` | Tek seferde tüm obje | Streaming yok, bekleme süresi uzun | UX kötü, 30sn+ bekletir |
| JSON in Text | Basit implementation | Manuel parsing, type safety yok, AI halüsinasyon riski | Güvensiz, karmaşık |
| SSE Events | Browser native | Server tarafında fazla kod, chunk management zor | NDJSON daha basit |

**NDJSON vs SSE:**
- **NDJSON:** Her satır bir JSON → daha az overhead, AI SDK native support
- **SSE:** `data: {...}` format → daha verbose, ekstra parsing

Seçimimiz: **`streamObject` + NDJSON**

---

### 1.2 Mimari Genel Bakış

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Component (chat.tsx)                              │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ User Input → handleStreamingRequest()              │ │  │
│  │  │  • Fetch POST /api/chat                            │ │  │
│  │  │  • AbortController for cancellation                │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ NDJSON Stream Parser                               │ │  │
│  │  │  • ReadableStream.getReader()                      │ │  │
│  │  │  • TextDecoder (UTF-8)                             │ │  │
│  │  │  • Line-by-line JSON.parse()                       │ │  │
│  │  │  • Buffer management for incomplete lines          │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ State Update (setMessages)                         │ │  │
│  │  │  • Partial<ConversationObject>                     │ │  │
│  │  │  • Progressive UI update                           │ │  │
│  │  │  • Defensive rendering (optional chaining)         │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ UI Rendering                                       │ │  │
│  │  │  • Text message (markdown)                         │ │  │
│  │  │  • Buttons (motion animated)                       │ │  │
│  │  │  • Fund cards (if summary exists)                  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                ↕ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER (Edge Runtime)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Route: /app/api/chat/route.ts                      │  │
│  │                                                           │  │
│  │  POST /api/chat                                          │  │
│  │    ↓                                                      │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ Request Processing                                 │ │  │
│  │  │  • Parse messages from req.json()                  │ │  │
│  │  │  • Context management: .slice(-10)                 │ │  │
│  │  │  • Dynamic prompt: inject fund DB if step 7-8     │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │    ↓                                                      │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ streamObject() - AI SDK                            │ │  │
│  │  │  • model: 'openai/gpt-4.1-mini' (via AI Gateway)  │ │  │
│  │  │  • schema: conversationSchema (Zod)               │ │  │
│  │  │  • messages: recentMessages                        │ │  │
│  │  │  • system: dynamic prompt string                   │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │    ↓                                                      │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ partialObjectStream                                │ │  │
│  │  │  • Async iterator over partial objects             │ │  │
│  │  │  • Each iteration = more complete object           │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │    ↓                                                      │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ NDJSON Stream Builder                              │ │  │
│  │  │  • ReadableStream                                  │ │  │
│  │  │  • for await (partialObject)                       │ │  │
│  │  │  • JSON.stringify + '\n'                           │ │  │
│  │  │  • TextEncoder.encode()                            │ │  │
│  │  │  • controller.enqueue()                            │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │    ↓                                                      │  │
│  │  Response (Content-Type: application/x-ndjson)          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                ↕ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      AI GATEWAY / OPENAI API                    │
├─────────────────────────────────────────────────────────────────┤
│  • GPT-4.1 Mini Model                                           │
│  • Structured Output with JSON Schema                           │
│  • Streaming Response (Server-Sent Events internally)           │
└─────────────────────────────────────────────────────────────────┘
```

**Veri Akışı Özeti:**
1. User input → React component
2. Fetch POST → `/api/chat` with message history
3. Server: Context management, dynamic prompt injection
4. AI SDK `streamObject` → calls OpenAI API
5. AI generates structured JSON progressively
6. `partialObjectStream` async iterator → partial objects
7. Server wraps in NDJSON format
8. Client parses line-by-line
9. State updates trigger React re-renders
10. UI shows progressive updates (text → buttons → cards)

---

### 1.3 Teknoloji Stack'i

| Teknoloji | Versiyon | Kullanım Amacı | Kritik Özellikler |
|-----------|----------|----------------|-------------------|
| **Next.js** | 15.0.0 | Full-stack framework | App Router, Edge Runtime, Streaming |
| **AI SDK** | 5.0.59 | AI integration | `streamObject`, `partialObjectStream` |
| **Zod** | 4.1.11 | Schema validation | Type inference, runtime validation |
| **React** | 19.0.0 | UI library | Streaming support, Suspense |
| **TypeScript** | 5.x | Type safety | Zod type inference |
| **Motion/React** | 12.23.22 | Animations | Button fade-in effects |
| **TailwindCSS** | 3.4.1 | Styling | Utility-first CSS |

**AI SDK v5.0.59 Özellikleri:**
- ✅ `streamObject` ile structured output
- ✅ `partialObjectStream` async iterator
- ❌ `useObject` React hook (bu versiyonda yok!)
- ✅ Edge Runtime uyumlu
- ✅ Multiple providers (OpenAI, Anthropic, Google, xAI)

**Neden Edge Runtime?**
1. **Düşük Latency:** Kullanıcıya en yakın edge node'dan yanıt
2. **Streaming Optimized:** Native ReadableStream support
3. **Soğuk başlangıç yok:** Her zaman hazır
4. **Cost Efficient:** Kullanım bazlı ücretlendirme

**Trade-offs:**
- ⚠️ Node.js API'leri kullanılamaz (fs, path, etc.)
- ⚠️ Maksimum execution time: 25 saniye (Vercel Hobby)
- ✅ Bizim use case için yeterli (AI yanıt 5-10sn)

---

### 1.4 Kritik Bileşenler Detayı

#### **A. Backend: streamObject Implementation**

**Dosya:** `app/api/chat/route.ts`

**Kod Anatomisi:**

```typescript
import { streamObject } from 'ai';
import { conversationSchema } from '@/lib/schemas';

export const runtime = 'edge'; // Edge Runtime aktif

export async function POST(req: Request) {
  const { messages } = await req.json();

  // CRITICAL: Context window management
  const recentMessages = messages.slice(-10); // Son 10 mesaj

  // OPTIMIZATION: Dynamic prompt injection
  const conversationLength = messages.length;
  const isNearFinalStep = conversationLength >= 14;

  const result = streamObject({
    model: 'openai/gpt-4.1-mini',     // AI Gateway format
    schema: conversationSchema,        // Zod schema
    messages: recentMessages,          // Chat history
    system: `...${isNearFinalStep ? mockFunds : ''}...`, // Dynamic
  });

  // NDJSON Stream Builder
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
```

**Kritik Noktalar:**

1. **`messages.slice(-10)`** → Token tasarrufu
   - GPT-4.1 Mini context limit: ~16K tokens
   - System prompt: ~700 token
   - 10 mesaj: ~2000 token
   - Toplam: ~2700 token (güvenli alan)

2. **`isNearFinalStep`** → Dynamic prompt
   - Step 1-6: Fon DB yok → ~400 token
   - Step 7-8: Fon DB eklenir → ~1500 token
   - Akıllı token yönetimi

3. **`for await of partialObjectStream`** → Progressive streaming
   - Her iteration: Daha eksiksiz obje
   - Örnek akış:
     ```
     Iteration 1: { step: 1, text: "Merha..." }
     Iteration 2: { step: 1, text: "Merhaba! Ben..." }
     Iteration 3: { step: 1, text: "Merhaba! Ben Yapı...", buttons: [] }
     Iteration 4: { step: 1, text: "...", buttons: ["Evet", "..."] }
     ```

4. **NDJSON Format:**
   ```
   {"step":1,"text":"Merhaba"}\n
   {"step":1,"text":"Merhaba! Ben"}\n
   {"step":1,"text":"Merhaba! Ben Yapı Kredi..."}\n
   ```
   - Her satır valid JSON
   - `\n` delimiter
   - Incomplete line buffer'da bekletilir

#### **B. Frontend: NDJSON Parser**

**Dosya:** `components/chat.tsx`

**Kod Anatomisi:**

```typescript
const handleStreamingRequest = async (userMessage: string) => {
  const controller = new AbortController(); // Cancellation support

  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: [...] }),
    signal: controller.signal, // AbortController signal
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder(); // UTF-8 decoder
  let buffer = ''; // Incomplete line buffer

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');

    // CRITICAL: Keep last incomplete line
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        try {
          const partialObject = JSON.parse(line);

          // Update last assistant message
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
};
```

**Kritik Noktalar:**

1. **Buffer Management:**
   ```
   Received: {"step":1,"tex
   Buffer: {"step":1,"tex

   Received: t":"Hello"}
   Buffer: {"step":1,"text":"Hello"}
   Parse: ✓
   ```

2. **`decoder.decode(value, { stream: true })`:**
   - Multi-byte UTF-8 karakterler için gerekli
   - Türkçe karakterler: ç, ğ, ı, ö, ş, ü
   - `stream: true` → Incomplete bytes buffer'da bekletilir

3. **State Update Pattern:**
   ```typescript
   setMessages((prev) => {
     const newMessages = [...prev]; // IMMUTABLE
     const lastMessage = newMessages[newMessages.length - 1];
     lastMessage.object = partialObject; // MUTATE copy
     return newMessages;
   });
   ```

4. **AbortController:**
   ```typescript
   const stopGeneration = () => {
     if (abortControllerRef.current) {
       abortControllerRef.current.abort();
       setIsLoading(false);
     }
   };
   ```
   - User "Stop" butonuna basınca stream kesilir
   - `AbortError` catch edilir, UI güncellenir

#### **C. Schema: Zod Validation**

**Dosya:** `lib/schemas.ts`

```typescript
import { z } from 'zod';

export const conversationSchema = z.object({
  step: z.number().min(1).max(8),              // Step validation
  text: z.string(),                            // AI message
  buttons: z.array(z.string()).optional(),     // Button options
  previousAnswers: z.object({                  // User answers
    vade: z.string().optional(),
    urun: z.string().optional(),
    nitelikli: z.boolean().optional(),
    nakit: z.string().optional(),
    karakter: z.string().optional(),
    ilgiAlanlari: z.array(z.string()).optional(),
  }).optional(),
  isComplete: z.boolean().default(false),      // Flow completion
  summary: z.object({                          // Final recommendations
    riskProfili: z.string(),
    onerilecekFonlar: z.array(z.object({
      id: z.string(),
      ad: z.string(),
      risk: z.string(),
      getiri: z.number(),
      minimumTutar: z.number(),
      kategori: z.string(),
      aciklama: z.string(),
      detayUrl: z.string(),
    })),
  }).optional(),
});

export type ConversationObject = z.infer<typeof conversationSchema>;
```

**Zod'un Rolü:**

1. **Runtime Validation:**
   - AI çıktısı schema'ya uymazsa hata
   - Örnek: `step: 9` → ❌ Validation error

2. **Type Inference:**
   ```typescript
   type ConversationObject = {
     step: number;
     text: string;
     buttons?: string[];
     // ...
   }
   ```

3. **Optional vs Required:**
   - `text`: Required (her adımda olmalı)
   - `buttons`: Optional (step 8'de yok)
   - `summary`: Optional (sadece step 8'de)

4. **Nested Objects:**
   - `previousAnswers` → State management
   - `onerilecekFonlar` → Complex array of objects

---

### 1.5 Optimizasyon Stratejileri

#### **1.5.1 Context Window Management**

**Sorun:** Her request'te tüm conversation history gönderilirse token limit aşılır.

**Çözüm:**
```typescript
const recentMessages = messages.slice(-10);
```

**Analiz:**
- 8 step × 2 mesaj (user + AI) = 16 mesaj
- Son 10 mesaj = ~5 exchange
- Step 3'ten itibaren eski mesajlar kesilir
- Trade-off: AI eski detayları "unutur" ama critical info `previousAnswers`'da

**Alternatif Yaklaşımlar:**
| Yöntem | Avantaj | Dezavantaj |
|--------|---------|------------|
| Son N mesaj | Basit, sabit token | Context loss |
| Token counting | Dinamik, optimal | Karmaşık, tokenizer gerekli |
| Summarization | Tam context | Ekstra AI call, latency |
| Embedding search | Semantic context | Karmaşık, DB gerekli |

**Seçimimiz:** Son 10 mesaj (basit + yeterli)

#### **1.5.2 Dynamic Prompt Injection**

**Sorun:** Fon veritabanı (11 fon × ~100 token = 1100 token) her request'te gereksiz.

**Çözüm:**
```typescript
const isNearFinalStep = conversationLength >= 14;

system: `
...
${isNearFinalStep ? `
## FON VERİTABANI
${JSON.stringify(mockFunds, null, 2)}
` : ''}
`
```

**Token Tasarrufu:**
- Step 1-6: ~400 token
- Step 7-8: ~1500 token
- Ortalama 6 step × 400 + 2 step × 1500 = 5400 token
- Static: 8 step × 1500 = 12000 token
- **Tasarruf: %55** 🎉

#### **1.5.3 System Prompt Minimizasyonu**

**Öncesi:** ~2500 token (verbose YAML, examples, repetitive)

**Sonrası:** ~400-700 token

**Optimizasyon Teknikleri:**
1. **Kısa cümleler:** "Her aşamada kullanıcıya soru sor..." → "Her step'te soru sor"
2. **Listeler:** Detaylı açıklamalar → Bullet points
3. **Örnekleri kaldırma:** AI zaten anlıyor
4. **Tekrar eden yapıları silme:** `previousAnswers: "[önceki]"` her step'te → 1 kez açıkla

**Sonuç:** Token %75 azalma, AI performansı aynı

#### **1.5.4 Defensive Rendering**

**Sorun:** Partial object'te field'lar henüz gelmemiş olabilir.

**Çözüm: Optional Chaining**

```typescript
// ❌ BAD: Runtime error if buttons undefined
{message.object.buttons.map((btn) => <Button>{btn}</Button>)}

// ✅ GOOD: Safe rendering
{message.object?.buttons && message.object.buttons.length > 0 && (
  <div>
    {message.object.buttons.map((btn) => <Button>{btn}</Button>)}
  </div>
)}
```

**Partial Object Progression:**
```typescript
// Iteration 1
{ step: 1, text: "Merh" }
// message.object?.buttons → undefined (safe)

// Iteration 2
{ step: 1, text: "Merhaba!", buttons: [] }
// message.object?.buttons → [] (empty, don't render)

// Iteration 3
{ step: 1, text: "Merhaba!", buttons: ["Evet", "Hayır"] }
// message.object?.buttons → ["Evet", "Hayır"] (render!)
```

**Pattern:**
```typescript
{fon.ad && <CardTitle>{fon.ad}</CardTitle>}
{fon.getiri && <span>%{fon.getiri}</span>}
{fon.minimumTutar && <span>{fon.minimumTutar.toLocaleString('tr-TR')}</span>}
```

---

### 1.6 Karşılaşılan Sorunlar ve Çözümler

#### **Sorun 1: AI SDK v5.0.59'da `useObject` Hook Yok**

**Hata:**
```
Module not found: Can't resolve 'ai/react'
```

**Neden:**
- AI SDK v3-v4'te `useObject` hook vardı
- v5.0.59'da kaldırıldı, sadece `streamObject` var
- Docs'ta hala eski örnekler var

**Çözüm:**
Manuel NDJSON parser implementasyonu:
```typescript
const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { value, done } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    const partialObject = JSON.parse(line);
    setMessages(/* update */);
  }
}
```

**Lesson Learned:** AI SDK versiyonlarında breaking changes olabiliyor, docs güncel olmayabiliyor.

#### **Sorun 2: Grok Context Overflow (3. Sorudan Sonra Duruyor)**

**Hata:**
- Grok model 3. sorudan sonra yanıt vermeyi kesiyor
- Error yok, sadece duruyor

**Neden:**
1. System prompt çok uzun: ~2500 token
2. Fon veritabanı her request'te: +1100 token
3. Conversation history: +1500 token (6 mesaj)
4. **Toplam: ~5100 token**
5. Grok-4-fast context limit: ~4000 token (tahmini)

**Çözüm:**
```typescript
// 1. System prompt minimize: 2500 → 400 token
// 2. Dynamic injection: Fon DB sadece step 7-8
// 3. Context management: Son 10 mesaj

const recentMessages = messages.slice(-10);
const isNearFinalStep = conversationLength >= 14;
```

**Sonuç:** 8 sorunun tamamı çalışıyor

#### **Sorun 3: TypeScript RefObject Type Error**

**Hata:**
```typescript
const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
// Error: Type 'RefObject<HTMLCanvasElement | null>' is not assignable to type 'RefObject<HTMLCanvasElement>'
```

**Neden:**
- `useRef<HTMLCanvasElement>(null)` → `RefObject<HTMLCanvasElement | null>`
- Explicit type annotation conflicts

**Çözüm:**
```typescript
// ❌ BAD
const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);

// ✅ GOOD: Let TypeScript infer
const canvasRef = useRef<HTMLCanvasElement>(null);
```

**Lesson Learned:** TypeScript inference > explicit typing

#### **Sorun 4: Gradient Text `background` vs `backgroundClip` Conflict**

**Hata:**
```
Updating a style property during rerender (background) when a conflicting property is set (backgroundClip)
```

**Neden:**
```typescript
style={{
  background: 'linear-gradient(...)', // Shorthand
  backgroundClip: 'text',             // Longhand
}}
```
React shorthand ve longhand karışımını sevmiyor.

**Çözüm:**
```typescript
style={{
  backgroundImage: 'linear-gradient(...)', // Longhand
  backgroundClip: 'text',
}}
```

---

### 1.7 Kullanım Senaryoları

**Stream Object İdeal Kullanım Alanları:**

1. **Multi-Step Forms:**
   - Onboarding flows
   - KYC (Know Your Customer) processes
   - Medical questionnaires
   - Survey applications

2. **AI Agents:**
   - Tool calling with structured output
   - Multi-step reasoning
   - Planning and execution

3. **Structured Content Generation:**
   - Blog post outlines (title, sections, tags)
   - Product descriptions (name, features, price)
   - Email templates (subject, body, CTA)

4. **Data Extraction:**
   - Resume parsing (name, experience, skills)
   - Invoice extraction (items, amounts, total)
   - Document classification

5. **Progressive UI Updates:**
   - Loading states with partial data
   - Skeleton screens → real content
   - Incremental table filling

**Not Uygun Olmayan Senaryolar:**

1. **Basit Chatbots:** Düz metin yeterli → `streamText` kullan
2. **Static JSON:** Streaming gerekmez → `generateObject` kullan
3. **Large Binary Data:** JSON inefficient → custom binary protocol

---

### 1.8 Performans İpuçları

#### **1. Token Optimization**

```typescript
// ❌ BAD: Verbose prompt
system: `
You are a helpful assistant. Your task is to ask the user questions
about their investment preferences. You should be polite and professional.
Always remember to validate the user's input and provide helpful feedback.
...
`

// ✅ GOOD: Concise prompt
system: `Investment profile assistant. Ask 8 questions, validate input, be professional.`
```

**Kural:** Her kelime token = para. Kısa ve net ol.

#### **2. Schema Simplification**

```typescript
// ❌ BAD: Over-engineered
z.object({
  metadata: z.object({
    timestamp: z.string(),
    version: z.string(),
    environment: z.enum(['dev', 'prod']),
  }),
  // ...
})

// ✅ GOOD: Essential fields only
z.object({
  step: z.number(),
  text: z.string(),
  // ...
})
```

**Kural:** Schema càng karmaşık = AI validation zorlaşır = hata riski artar.

#### **3. Streaming Frequency**

```typescript
// Partial object update sıklığı AI kontrolünde
// Çok sık → Network overhead
// Çok seyrek → UX kötü

// Optimal: AI SDK default (~100-200ms aralıklar)
```

#### **4. Message History Trimming**

```typescript
// Context window = para
// Optimize et:

const recentMessages = messages
  .filter(m => m.role === 'user' || m.content) // Empty messages filtrele
  .slice(-10); // Son N mesaj
```

#### **5. Error Handling**

```typescript
try {
  const partialObject = JSON.parse(line);
  setMessages(/* ... */);
} catch (e) {
  console.warn('JSON parse error:', line); // Log but don't crash
  // Partial line, next iteration'da düzelir
}
```

**Kural:** Stream errors geçici olabilir, UI crash ettirme.

---

### 1.9 Metrics ve Monitoring

**Track Edilmesi Gerekenler:**

1. **Token Usage:**
   - Input tokens per request
   - Output tokens per request
   - Cost per conversation

2. **Latency:**
   - Time to first byte (TTFB)
   - Time to first token
   - Total streaming duration

3. **Error Rates:**
   - JSON parse errors
   - Schema validation errors
   - Network timeouts

4. **User Behavior:**
   - Step completion rate
   - Button vs text input ratio
   - Conversation abandonment points

**Örnek Implementation:**

```typescript
// Backend
const startTime = Date.now();

// ... streamObject ...

console.log('Streaming completed:', {
  duration: Date.now() - startTime,
  messageCount: messages.length,
  // Send to analytics
});
```

---

## BÖLÜM 2: Kurulum Reçetesi

Bu bölüm, **başka bir Next.js projesinde** aynı Stream Object mimarisini sıfırdan kurmanız için adım adım talimatlar içerir.

Her phase bağımsızdır ve Claude Code'a copy-paste edilerek çalıştırılabilir.

---

### PHASE 1: Proje Setup ve Dependencies

**Hedef:** Next.js 15 projesi oluştur, gerekli paketleri yükle.

**Claude Code'a Vereceğiniz Prompt:**

```markdown
Yeni bir Next.js 15 projesi oluştur ve Stream Object için gerekli paketleri yükle.

## Gereksinimler:
1. Next.js 15 (App Router)
2. TypeScript
3. TailwindCSS
4. AI SDK (Vercel)
5. Zod

## Komutlar:
```bash
# 1. Next.js projesi oluştur
npx create-next-app@latest my-stream-app --typescript --tailwind --app --no-src-dir

# 2. Proje dizinine gir
cd my-stream-app

# 3. AI SDK ve Zod yükle
npm install ai zod

# 4. OpenAI provider yükle (veya başka provider)
npm install @ai-sdk/openai

# 5. Development server başlat (test için)
npm run dev
```

## Dosya Yapısı:
```
my-stream-app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API endpoint
│   ├── layout.tsx
│   ├── page.tsx                  # Ana sayfa
│   └── globals.css
├── lib/
│   └── schemas.ts                # Zod schemas
├── components/
│   └── chat.tsx                  # Chat component
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Environment Variables:
`.env.local` dosyası oluştur:
```env
# OpenAI API Key (veya AI Gateway URL)
OPENAI_API_KEY=sk-...

# Veya AI Gateway kullanıyorsan:
# AI_GATEWAY_API_KEY=...
```

## Doğrulama:
- `npm run dev` çalışıyor mu?
- http://localhost:3000 açılıyor mu?
- TypeScript hataları yok mu?

Bu adımları tamamla ve "PHASE 1 tamamlandı" de.
```

**Beklenen Çıktı:**
- Çalışan Next.js 15 projesi
- Tüm paketler yüklü
- `.env.local` dosyası oluşturulmuş

---

### PHASE 2: Backend - Schema ve API Route

**Hedef:** Zod schema tanımla, API route oluştur, `streamObject` implementasyonu.

**Claude Code'a Vereceğiniz Prompt:**

```markdown
Stream Object backend'ini kur: Zod schema + API route.

## 1. Zod Schema Oluştur

`lib/schemas.ts` dosyası oluştur:

```typescript
import { z } from 'zod';

// Conversation object schema
export const conversationSchema = z.object({
  step: z.number().min(1).max(5),           // Kaç aşama varsa
  text: z.string(),                         // AI'ın mesajı
  buttons: z.array(z.string()).optional(),  // Button seçenekleri
  isComplete: z.boolean().default(false),   // Akış tamamlandı mı?

  // (Opsiyonel) User cevaplarını saklamak için:
  answers: z.object({
    q1: z.string().optional(),
    q2: z.string().optional(),
    // İhtiyacınıza göre genişletin
  }).optional(),

  // (Opsiyonel) Final summary:
  summary: z.object({
    result: z.string(),
    data: z.array(z.any()),
  }).optional(),
});

// TypeScript type inference
export type ConversationObject = z.infer<typeof conversationSchema>;
```

## 2. API Route Oluştur

`app/api/chat/route.ts` dosyası oluştur:

```typescript
import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai'; // veya başka provider
import { conversationSchema } from '@/lib/schemas';

export const runtime = 'edge'; // Edge Runtime kullan

export async function POST(req: Request) {
  try {
    // 1. Request body'yi parse et
    const { messages } = await req.json();

    // 2. (Opsiyonel) Context management
    const recentMessages = messages.slice(-10);

    // 3. streamObject çağır
    const result = streamObject({
      model: openai('gpt-4-turbo'), // Model seçimi
      schema: conversationSchema,    // Zod schema
      messages: recentMessages,      // Chat history
      system: `
        Sen yardımcı bir asistansın.
        5 aşamalı bir form akışı yönet:
        1. Kullanıcıya hoş geldin mesajı ver
        2. İsim sor
        3. Email sor
        4. Tercih sor
        5. Özet göster ve isComplete: true yap

        Her step'te:
        - text: Kullanıcıya mesajın
        - buttons: (Opsiyonel) Hızlı cevap seçenekleri
        - answers: Önceki cevapları sakla
      `,
    });

    // 4. NDJSON stream oluştur
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
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    // 5. Response döndür
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

## 3. Test Et

Terminal'de test request gönder:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Merhaba"}]}'
```

Beklenen çıktı: NDJSON stream (her satır bir JSON objesi)

```
{"step":1,"text":"Merhaba!","isComplete":false}
{"step":1,"text":"Merhaba! Hoş geldiniz","isComplete":false}
{"step":1,"text":"Merhaba! Hoş geldiniz. İsminiz nedir?","buttons":[],"isComplete":false}
```

"PHASE 2 tamamlandı" de.
```

**Beklenen Çıktı:**
- `lib/schemas.ts` oluşturuldu
- `app/api/chat/route.ts` oluşturuldu
- Curl ile test edildi, NDJSON stream çalışıyor

---

### PHASE 3: Frontend - State Management

**Hedef:** React component'inde message state'i kur, TypeScript tipleri tanımla.

**Claude Code'a Vereceğiniz Prompt:**

```markdown
Frontend için state management ve TypeScript tiplerini kur.

## 1. Message Type Tanımla

`components/chat.tsx` dosyası oluştur:

```typescript
'use client';

import { useState, useRef } from 'react';
import type { ConversationObject } from '@/lib/schemas';

// Message tipi
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;                        // Display text
  object?: Partial<ConversationObject>;   // Partial: Henüz tam gelmemiş olabilir
};

export function Chat() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  // Placeholder functions (Phase 4'te implement edeceğiz)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('TODO: Implement streaming');
  };

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stream Object Chat</h1>

      {/* Messages */}
      <div className="space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 text-right'
                : 'bg-gray-100'
            }`}
          >
            {/* Text */}
            <div>{message.content}</div>

            {/* Buttons (if exists) */}
            {message.object?.buttons && message.object.buttons.length > 0 && (
              <div className="flex gap-2 mt-2">
                {message.object.buttons.map((btn, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
                    onClick={() => {/* TODO: Handle button click */}}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            )}

            {/* Summary (if complete) */}
            {message.object?.isComplete && message.object?.summary && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="font-semibold">Özet:</p>
                <p>{message.object.summary.result}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
          className="flex-1 px-4 py-2 border rounded"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Durdur' : 'Gönder'}
        </button>
      </form>
    </div>
  );
}
```

## 2. Ana Sayfada Kullan

`app/page.tsx` dosyasını güncelle:

```typescript
import { Chat } from '@/components/chat';

export default function Home() {
  return <Chat />;
}
```

## 3. Test Et

- http://localhost:3000 açıldığında Chat component görünüyor mu?
- Input field ve gönder butonu çalışıyor mu?
- Console'da "TODO: Implement streaming" mesajı görünüyor mu?

"PHASE 3 tamamlandı" de.
```

**Beklenen Çıktı:**
- `components/chat.tsx` oluşturuldu
- UI render ediliyor
- State management hazır
- Henüz streaming yok (placeholder)

---

### PHASE 4: Frontend - NDJSON Streaming Parser

**Hedef:** Manuel NDJSON parser implement et, progressive UI update'i aktif et.

**Claude Code'a Vereceğiniz Prompt:**

```markdown
NDJSON streaming parser'ı implement et ve UI'yı progressive update et.

## 1. handleStreamingRequest Function

`components/chat.tsx` içinde `handleSubmit` fonksiyonunu güncelle:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim() || isLoading) return;

  // 1. User mesajını ekle
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: input.trim(),
  };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');

  // 2. Boş assistant mesajı ekle (streaming için)
  const assistantMessage: Message = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: '',
  };
  setMessages((prev) => [...prev, assistantMessage]);

  // 3. Streaming request başlat
  await handleStreamingRequest(input.trim());
};

const handleStreamingRequest = async (userMessage: string) => {
  setIsLoading(true);

  // AbortController oluştur (cancellation için)
  const controller = new AbortController();
  abortControllerRef.current = controller;

  try {
    // 4. API'ye POST request
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    // 5. ReadableStream reader oluştur
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // 6. Stream'i oku
    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      // 7. Decode et ve buffer'a ekle
      buffer += decoder.decode(value, { stream: true });

      // 8. Satırlara böl
      const lines = buffer.split('\n');

      // 9. Son satır incomplete olabilir, buffer'da tut
      buffer = lines.pop() || '';

      // 10. Her satırı parse et
      for (const line of lines) {
        if (line.trim()) {
          try {
            const partialObject = JSON.parse(line) as Partial<ConversationObject>;

            // 11. Son assistant mesajını güncelle
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
            console.warn('JSON parse error:', line, e);
          }
        }
      }
    }

  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('Streaming error:', error);

      // Hata mesajı göster
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage?.role === 'assistant') {
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
```

## 2. Button Click Handler

```typescript
const handleButtonClick = async (buttonText: string) => {
  if (isLoading) return;

  // User mesajı olarak button text'i ekle
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: buttonText,
  };
  setMessages((prev) => [...prev, userMessage]);

  // Boş assistant mesajı
  const assistantMessage: Message = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: '',
  };
  setMessages((prev) => [...prev, assistantMessage]);

  // Streaming başlat
  await handleStreamingRequest(buttonText);
};
```

## 3. Stop Generation

```typescript
const stopGeneration = () => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
    setIsLoading(false);
  }
};
```

## 4. Button onClick Bağla

Render kısmında button'a `onClick` ekle:

```typescript
<button
  key={idx}
  className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
  onClick={() => handleButtonClick(btn)}
>
  {btn}
</button>
```

## 5. Submit Button'u Güncelle

```typescript
<button
  type={isLoading ? 'button' : 'submit'}
  onClick={isLoading ? stopGeneration : undefined}
  disabled={!isLoading && !input.trim()}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
>
  {isLoading ? 'Durdur' : 'Gönder'}
</button>
```

## 6. Test Et

1. Mesaj gönder
2. AI cevabının kelime kelime geldiğini gör (progressive update)
3. Butonlar çıktığında tıkla
4. "Durdur" butonuna basarak streaming'i iptal et

"PHASE 4 tamamlandı, streaming çalışıyor" de.
```

**Beklenen Çıktı:**
- NDJSON parser çalışıyor
- Progressive UI update aktif
- Butonlar tıklanabilir
- Stop generation çalışıyor

---

### PHASE 5: Optimizasyon ve Production Ready

**Hedef:** Context management, error handling, performance optimizations.

**Claude Code'a Vereceğiniz Prompt:**

```markdown
Production-ready optimizasyonları ekle.

## 1. Context Window Management

`app/api/chat/route.ts` içinde:

```typescript
export async function POST(req: Request) {
  const { messages } = await req.json();

  // Son 10 mesajı tut (token tasarrufu)
  const recentMessages = messages.slice(-10);

  const result = streamObject({
    model: openai('gpt-4-turbo'),
    schema: conversationSchema,
    messages: recentMessages, // ← Burada
    system: `...`,
  });

  // ...
}
```

## 2. Dynamic Prompt Injection

Büyük data'yı sadece gerektiğinde ekle:

```typescript
const conversationLength = messages.length;
const isNearEnd = conversationLength >= 8; // Son 2-3 step

const result = streamObject({
  // ...
  system: `
    Sen yardımcı bir asistansın.
    ${isNearEnd ? `
      ## LARGE DATA
      ${JSON.stringify(yourLargeDatabase)}
    ` : ''}
  `,
});
```

## 3. Auto-Scroll

`components/chat.tsx` içinde:

```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);

// Auto scroll to bottom
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

// Render:
<div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto">
  {messages.map((message) => (...))}
  <div ref={messagesEndRef} />
</div>
```

## 4. Loading Indicator

```typescript
{isLoading && messages[messages.length - 1]?.role === 'assistant' && (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
  </div>
)}
```

## 5. Error Boundary (Opsiyonel)

`app/error.tsx` dosyası oluştur:

```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Bir şeyler yanlış gitti!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
```

## 6. Environment Variables Validation

`app/api/chat/route.ts` başında:

```typescript
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}
```

## 7. Rate Limiting (Opsiyonel)

Vercel KV veya Redis ile:

```typescript
import { ratelimit } from '@/lib/redis';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }

  // ...
}
```

## 8. Vercel Analytics

`app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 9. Build Test

```bash
npm run build
npm run start
```

Build hatasız tamamlanmalı.

## 10. Deploy

```bash
# Vercel CLI yükle
npm i -g vercel

# Deploy et
vercel --prod
```

"PHASE 5 tamamlandı, production ready" de.
```

**Beklenen Çıktı:**
- Optimizasyonlar eklendi
- Error handling robust
- Build başarılı
- Production'da çalışıyor

---

### BONUS: Debug ve Troubleshooting

**Sık Karşılaşılan Sorunlar:**

1. **`streamObject` hatası:**
   ```
   Error: Model not found
   ```
   **Çözüm:** `.env.local`'de API key doğru mu?

2. **JSON parse error:**
   ```
   JSON parse error: Unexpected token
   ```
   **Çözüm:** Buffer management doğru mu? `lines.pop()` var mı?

3. **TypeScript hatası:**
   ```
   Property 'object' does not exist on type 'Message'
   ```
   **Çözüm:** `Partial<ConversationObject>` kullanıldı mı?

4. **Stream duruyor:**
   **Çözüm:** Context window aşıldı mı? Token sayısını azalt.

5. **Buttons render olmuyor:**
   **Çözüm:** `message.object?.buttons && message.object.buttons.length > 0` kontrolü var mı?

---

## Sonuç

Bu dokümantasyonla:

1. ✅ Stream Object mimarisini **anladınız**
2. ✅ Mevcut projemizdeki implementasyonu **incediniz**
3. ✅ Sıfırdan **kurulum reçetesi** aldınız
4. ✅ Optimizasyon ve **best practices** öğrendiniz
5. ✅ Troubleshooting **rehberi** edindiniz

**Next Steps:**

- [ ] Kendi use case'iniz için schema tasarlayın
- [ ] System prompt'u özelleştirin
- [ ] UI/UX iyileştirmeleri ekleyin
- [ ] Production'a deploy edin
- [ ] Metrics ve monitoring ekleyin

**Sorular veya ek bilgi için:**
- AI SDK Docs: https://sdk.vercel.ai/docs
- Zod Docs: https://zod.dev
- Next.js Docs: https://nextjs.org/docs

---

**Hazırlayan:** Claude Code
**Tarih:** Ocak 2025
**Lisans:** MIT
