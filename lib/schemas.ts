import { z } from 'zod';

export const conversationSchema = z.object({
  step: z.number().min(0).max(4), // Changed from max(9) to max(4) for new 5-step flow
  showForm: z.boolean().default(false), // NEW: Triggers static form rendering
  text: z.string(),
  buttons: z.array(z.string()).optional(),
  previousAnswers: z.object({
    isim: z.string().optional(),
    vade: z.string().optional(),
    urun: z.string().optional(),
    nitelikli: z.boolean().optional(),
    nakit: z.string().optional(),
    karakter: z.string().optional(),
    ilgiAlanlari: z.array(z.string()).optional(),
  }).optional(),
  isComplete: z.boolean().default(false),
  summary: z.object({
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
      enUygun: z.boolean().optional(),
      nedenUygun: z.string().optional(),
    })),
  }).optional(),
});

export type ConversationObject = z.infer<typeof conversationSchema>;
