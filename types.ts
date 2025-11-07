import { PaperSize, SidedType, BindingType, CoverType, SpiralColor } from './constants';

export interface UploadedFile {
  id: string;
  name: string;
  pages: number;
}

export type PrintQuality = 'bw' | 'color-b' | 'color-c';

export interface OrderConfig {
  files: UploadedFile[];
  printQuality: PrintQuality | '';
  paperSize: PaperSize | '';
  sided: SidedType | '';
  copies: number;
  manualPageCount: number;
  binding: BindingType;
  cover: CoverType;
  spiralColor: SpiralColor;
  description: string;
}

export interface OrderCosts {
  printCost: number;
  bindingCost: number;
  totalCost: number;
}