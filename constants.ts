import { PaperSize, PrintQuality, Sided } from "./types";

// FIX: Changed PaperSize to Exclude<PaperSize, ''> to represent only valid, selectable options.
export const PAPER_SIZE_OPTIONS: { value: Exclude<PaperSize, ''>; label: string }[] = [
    { value: 'A3', label: 'A3' },
    { value: 'A4', label: 'A4' },
    { value: 'A5', label: 'A5' },
];

// FIX: Changed PrintQuality to Exclude<PrintQuality, ''> to represent only valid, selectable options.
export const PRINT_QUALITY_OPTIONS: { value: Exclude<PrintQuality, ''>; label: string }[] = [
    { value: 'bw', label: 'سیاه سفید' },
    { value: 'color-b', label: 'رنگی کلاس B (متن و عکس، بکگراند سفید)' },
    { value: 'color-c', label: 'رنگی کلاس C (فول رنگ)' },
];

export const SIDED_OPTIONS: { value: Sided, label: string }[] = [
    { value: 'single', label: 'یک رو' },
    { value: 'double', label: 'پشت و رو' },
];

export const SERVICE_OPTIONS = [
    { value: 'none', label: 'هیچکدام' },
    { value: 'simple', label: 'صحافی ساده' },
    { value: 'spring', label: 'صحافی فنری' },
];

export const TALC_TYPE_OPTIONS = [
    { value: 'none', label: 'هیچکدام' },
    { value: 'glossy', label: 'طلق و شیت گلاسه' },
    { value: 'matte', label: 'طلق و شیت مات' },
];

export const SPRING_COLOR_OPTIONS = [
    { value: 'white', label: 'سفید' },
    { value: 'black', label: 'مشکی' },
];

export const UPLOAD_METHOD_OPTIONS = [
    { value: 'upload', label: 'آپلود فایل' },
    { value: 'whatsapp', label: 'واتساپ' },
    { value: 'telegram', label: 'تلگرام' },
    { value: 'link', label: 'لینک' },
    { value: 'email', label: 'ایمیل' },
    { value: 'other', label: 'سایر' },
];

interface PriceTier {
  min: number;
  max: number;
  prices: {
    single: number;
    double: number;
  };
}

// FIX: Updated the type to exclude empty strings from PaperSize and PrintQuality, resolving the error about the missing '""' property.
export const DEFAULT_TIERED_PRICING: Record<Exclude<PaperSize, ''>, Record<Exclude<PrintQuality, ''>, PriceTier[]>> = {
    A4: {
        'bw': [
            { min: 1, max: 499, prices: { single: 1500, double: 1900 } },
            { min: 500, max: 999, prices: { single: 1100, double: 1500 } },
            { min: 1000, max: Infinity, prices: { single: 890, double: 990 } },
        ],
        'color-b': [
            { min: 1, max: 500, prices: { single: 4500, double: 6500 } },
            { min: 501, max: 1000, prices: { single: 4300, double: 6300 } },
            { min: 1001, max: Infinity, prices: { single: 3900, double: 5900 } },
        ],
        'color-c': [
            { min: 1, max: 500, prices: { single: 4900, double: 6900 } },
            { min: 501, max: 1000, prices: { single: 4700, double: 6700 } },
            { min: 1001, max: Infinity, prices: { single: 4300, double: 6300 } },
        ],
    },
    A3: {
        'bw': [
            { min: 1, max: 499, prices: { single: 2600, double: 2980 } },
            { min: 500, max: 999, prices: { single: 1980, double: 2800 } },
            { min: 1000, max: Infinity, prices: { single: 1800, double: 2500 } },
        ],
        'color-b': [
            { min: 1, max: 500, prices: { single: 8900, double: 11900 } },
            { min: 501, max: 1000, prices: { single: 8600, double: 11400 } },
            { min: 1001, max: Infinity, prices: { single: 7900, double: 10900 } },
        ],
        'color-c': [
            { min: 1, max: 500, prices: { single: 9900, double: 12900 } },
            { min: 501, max: 1000, prices: { single: 9500, double: 12500 } },
            { min: 1001, max: Infinity, prices: { single: 8900, double: 11900 } },
        ],
    },
    A5: {
        'bw': [
            { min: 1, max: 499, prices: { single: 790, double: 890 } },
            { min: 500, max: 1000, prices: { single: 750, double: 850 } },
            { min: 1001, max: Infinity, prices: { single: 690, double: 790 } },
        ],
        'color-b': [
            { min: 1, max: 500, prices: { single: 2000, double: 3000 } },
            { min: 501, max: 1000, prices: { single: 1800, double: 2800 } },
            { min: 1001, max: Infinity, prices: { single: 1500, double: 2500 } },
        ],
        'color-c': [
            { min: 1, max: 500, prices: { single: 2700, double: 3800 } },
            { min: 501, max: 1000, prices: { single: 2500, double: 3600 } },
            { min: 1001, max: Infinity, prices: { single: 2200, double: 3300 } },
        ],
    },
};


export const DEFAULT_SERVICE_PRICING = {
    simple: 5000,
    spring: 10000,
};