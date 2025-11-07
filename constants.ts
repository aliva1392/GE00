export type PrintQuality = 'bw' | 'color-b' | 'color-c';
export type PaperSize = 'A5' | 'A4' | 'A3';
export type SidedType = 'single' | 'double';
export type BindingType = 'none' | 'spiral' | 'perfect' | 'staple';
export type CoverType = 'none' | 'clear' | 'matte';
export type SpiralColor = 'black' | 'white' | 'silver';


interface Option<T> {
  value: T;
  label: string;
}

export const PRINT_OPTIONS: {
  printQuality: Option<PrintQuality>[];
  paperSize: Option<PaperSize>[];
  sided: Option<SidedType>[];
} = {
  printQuality: [
    { value: 'bw', label: 'سیاه سفید' },
    { value: 'color-b', label: 'رنگی کلاس B (متن و عکس، بکگراند سفید)' },
    { value: 'color-c', label: 'رنگی کلاس C (فول رنگ)' },
  ],
  paperSize: [
    { value: 'A3', label: 'A3' },
    { value: 'A4', label: 'A4' },
    { value: 'A5', label: 'A5' },
  ],
  sided: [
    { value: 'single', label: 'یک رو' },
    { value: 'double', label: 'دو رو' },
  ],
};

export const BINDING_OPTIONS: {
  binding: Option<BindingType>[];
  cover: Option<CoverType>[];
  spiralColor: Option<SpiralColor>[];
} = {
  binding: [
    { value: 'none', label: 'بدون صحافی' },
    { value: 'spiral', label: 'سیمی فنری' },
    { value: 'perfect', label: 'چسب گرم' },
    { value: 'staple', label: 'منگنه' },
  ],
  cover: [
    { value: 'none', label: 'بدون طلق' },
    { value: 'clear', label: 'طلق شفاف' },
    { value: 'matte', label: 'طلق مات' },
  ],
  spiralColor: [
    { value: 'black', label: 'مشکی' },
    { value: 'white', label: 'سفید' },
    { value: 'silver', label: 'نقره‌ای' },
  ],
};

// Pricing in Toman
export const PRICING = {
  print: {
    A5: { bw: 500, 'color-b': 1500, 'color-c': 2250 },
    A4: { bw: 1000, 'color-b': 3000, 'color-c': 4500 },
    A3: { bw: 2000, 'color-b': 6000, 'color-c': 9000 },
  },
  binding: {
    none: { base: 0, perPage: 0 },
    spiral: { base: 15000, perPage: 100 },
    perfect: { base: 25000, perPage: 150 },
    staple: { base: 5000, perPage: 0 },
  },
};