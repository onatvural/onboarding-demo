export interface FundDetail {
  id: string;
  ad: string;
  risk: 'Düşük Risk' | 'Orta Risk' | 'Yüksek Risk';
  getiri: number; // Yıllık getiri oranı (%)
  minimumTutar: number; // TL
  kategori: string;
  aciklama: string;
  detayUrl: string;
  tags?: string[]; // Filtreleme için (sürdürülebilirlik, teknoloji, vb.)
}

export const mockFunds: FundDetail[] = [
  // Düşük Risk Fonları
  {
    id: 'bsf-kisa-vadeli-tahvil',
    ad: 'BSF Kısa Vadeli Tahvil Fonu',
    risk: 'Düşük Risk',
    getiri: 8.5,
    minimumTutar: 1000,
    kategori: 'Tahvil',
    aciklama: 'Kısa vadeli devlet tahvillerine yatırım yaparak istikrarlı getiri hedefler. Düşük riskli yatırımcılar için idealdir.',
    detayUrl: '/fonlar/kisa-vadeli-tahvil',
    tags: ['güvenli', 'kısa-vade'],
  },
  {
    id: 'bsf-likit-fon',
    ad: 'BSF Likit Fon',
    risk: 'Düşük Risk',
    getiri: 7.2,
    minimumTutar: 500,
    kategori: 'Likit',
    aciklama: 'Yüksek likidite sağlayan, günlük erişim imkanı sunan para piyasası fonu. Acil nakit ihtiyaçları için uygundur.',
    detayUrl: '/fonlar/likit-fon',
    tags: ['likit', 'güvenli'],
  },
  {
    id: 'bsf-altin-fon',
    ad: 'BSF Altın Fonu',
    risk: 'Düşük Risk',
    getiri: 9.8,
    minimumTutar: 2000,
    kategori: 'Kıymetli Maden',
    aciklama: 'Altın ve değerli madenlere yatırım yaparak enflasyona karşı koruma sağlar. Uzun vadeli değer koruma aracıdır.',
    detayUrl: '/fonlar/altin-fon',
    tags: ['altın', 'enflasyon-koruması'],
  },

  // Orta Risk Fonları
  {
    id: 'bsf-dengeli-karma',
    ad: 'BSF Dengeli Karma Fon',
    risk: 'Orta Risk',
    getiri: 12.5,
    minimumTutar: 1500,
    kategori: 'Karma',
    aciklama: 'Hem hisse senedi hem tahvil içeren dengeli portföy. Orta düzey risk ve getiri dengesi sunar.',
    detayUrl: '/fonlar/dengeli-karma',
    tags: ['dengeli', 'çeşitlendirilmiş'],
  },
  {
    id: 'bsf-degisken-fon',
    ad: 'BSF Değişken Fon',
    risk: 'Orta Risk',
    getiri: 14.3,
    minimumTutar: 2500,
    kategori: 'Değişken',
    aciklama: 'Piyasa koşullarına göre varlık dağılımını değiştiren esnek yapılı fon. Aktif yönetim stratejisi uygular.',
    detayUrl: '/fonlar/degisken-fon',
    tags: ['esnek', 'aktif-yönetim'],
  },
  {
    id: 'bsf-baslangic-fon-sepeti',
    ad: 'BSF Başlangıç Fon Sepeti',
    risk: 'Orta Risk',
    getiri: 11.8,
    minimumTutar: 1000,
    kategori: 'Fon Sepeti',
    aciklama: 'Yeni başlayanlar için özel olarak hazırlanmış çeşitlendirilmiş fon sepeti. Kolay yatırım deneyimi sunar.',
    detayUrl: '/fonlar/baslangic-fon-sepeti',
    tags: ['başlangıç', 'çeşitlendirilmiş'],
  },

  // Yüksek Risk Fonları
  {
    id: 'bsf-hisse-senedi-fon',
    ad: 'BSF Hisse Senedi Fonu',
    risk: 'Yüksek Risk',
    getiri: 18.7,
    minimumTutar: 3000,
    kategori: 'Hisse Senedi',
    aciklama: 'Borsa İstanbul\'da işlem gören seçkin hisse senetlerine yatırım yapar. Yüksek getiri potansiyeli sunar.',
    detayUrl: '/fonlar/hisse-senedi-fon',
    tags: ['hisse', 'yüksek-getiri'],
  },
  {
    id: 'bsf-teknoloji-yogun',
    ad: 'BSF Teknoloji Yoğun Fon',
    risk: 'Yüksek Risk',
    getiri: 22.4,
    minimumTutar: 5000,
    kategori: 'Sektörel',
    aciklama: 'Teknoloji şirketlerine odaklanan tematik fon. Gelecek teknolojilerine yatırım fırsatı sağlar.',
    detayUrl: '/fonlar/teknoloji-yogun',
    tags: ['teknoloji', 'inovasyon', 'tematik'],
  },
  {
    id: 'bsf-gelisen-piyasalar',
    ad: 'BSF Gelişen Piyasalar Fonu',
    risk: 'Yüksek Risk',
    getiri: 20.1,
    minimumTutar: 4000,
    kategori: 'Uluslararası',
    aciklama: 'Gelişmekte olan ülke piyasalarına yatırım yapar. Küresel çeşitlendirme ve yüksek büyüme potansiyeli sunar.',
    detayUrl: '/fonlar/gelisen-piyasalar',
    tags: ['uluslararası', 'büyüme'],
  },

  // Tematik Fonlar
  {
    id: 'bsf-surdurulebilirlik-temali',
    ad: 'BSF Sürdürülebilirlik Temalı Fon',
    risk: 'Orta Risk',
    getiri: 13.9,
    minimumTutar: 2500,
    kategori: 'Tematik',
    aciklama: 'Çevre dostu ve sosyal sorumluluk sahibi şirketlere yatırım yapar. ESG kriterlerine uygun portföy yönetimi.',
    detayUrl: '/fonlar/surdurulebilirlik-temali',
    tags: ['sürdürülebilirlik', 'ESG', 'çevre', 'tematik'],
  },
  {
    id: 'bsf-teknoloji-inovasyon',
    ad: 'BSF Teknoloji ve İnovasyon Fonu',
    risk: 'Yüksek Risk',
    getiri: 24.2,
    minimumTutar: 5000,
    kategori: 'Tematik',
    aciklama: 'Yapay zeka, elektrikli araçlar, yenilenebilir enerji gibi geleceğin teknolojilerine odaklanan fon.',
    detayUrl: '/fonlar/teknoloji-inovasyon',
    tags: ['teknoloji', 'inovasyon', 'yapay-zeka', 'elektrikli-araç', 'tematik'],
  },
];

/**
 * Risk seviyesine göre fonları filtreler
 */
export function getFundsByRisk(risk: 'Düşük Risk' | 'Orta Risk' | 'Yüksek Risk'): FundDetail[] {
  return mockFunds.filter(fund => fund.risk === risk);
}

/**
 * Tag'lere göre fonları filtreler
 */
export function getFundsByTags(tags: string[]): FundDetail[] {
  return mockFunds.filter(fund =>
    fund.tags?.some(tag => tags.includes(tag))
  );
}

/**
 * Getiriye göre fonları sıralar (azalan)
 */
export function sortByReturn(funds: FundDetail[]): FundDetail[] {
  return [...funds].sort((a, b) => b.getiri - a.getiri);
}
