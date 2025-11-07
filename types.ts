// Types for Customer Portal
export type PaperSize = 'A3' | 'A4' | 'A5';
export type PrintQuality = 'bw' | 'color-b' | 'color-c';
export type Sided = 'single' | 'double';
export type Service = 'none' | 'simple' | 'spring';
export type TalcType = 'none' | 'glossy' | 'matte';
export type SpringColor = 'white' | 'black';
export type UploadMethod = 'upload' | 'whatsapp' | 'telegram' | 'link' | 'email' | 'other';


export interface OrderConfig {
  paperSize: PaperSize | '';
  printQuality: PrintQuality | '';
  sided: Sided | '';
  manualPageCount: number;
  seriesCount: number;
  service: Service;
  talcType: TalcType;
  springColor: SpringColor;
  description: string;
  uploadMethod: UploadMethod | '';
  uploadDetails: string;
}

export interface UploadedFile {
  file: File;
  actualPageCount: number;
  pageCount: number;
  previewUrl?: string;
}

export interface CartItem {
  id: string;
  config: OrderConfig;
  files: UploadedFile[];
  totalPages: number;
  numberOfSheets: number;
  costs: {
    printCost: number;
    serviceCost: number;
    totalCost: number;
  };
}


// Types for Admin Portal
export type OrderStatus = 'completed' | 'processing' | 'cancelled' | 'new';

export interface Order {
  id: string;
  customerName: string; 
  date: string;
  totalAmount: number;
  status: OrderStatus;
  items: CartItem[];
}