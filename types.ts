export type PaperSize = 'A3' | 'A4' | 'A5' | '';
export type PrintQuality = 'bw' | 'color-b' | 'color-c' | '';
export type Sided = 'single' | 'double' | '';
export type Service = 'none' | 'simple' | 'spring';
export type UploadMethod = 'upload' | 'whatsapp' | 'telegram' | 'link' | 'email' | 'other' | '';
export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';
export type DeliveryMethod = 'pickup' | 'courier' | 'post';

export interface UploadedFile {
    file: File;
    actualPageCount: number;
    pageCount: number; // Adjusted for double-sided
    previewUrl?: string;
}

export interface OrderConfig {
    paperSize: PaperSize;
    printQuality: PrintQuality;
    sided: Sided;
    manualPageCount: number;
    seriesCount: number;
    service: Service;
    talcType: string;
    springColor: string;
    description: string;
    uploadMethod: UploadMethod;
    uploadDetails: string;
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

export interface Address {
    id: string;
    title: string;
    fullAddress: string;
}

export interface User {
    phoneNumber: string;
    fullName: string;
    role: 'customer' | 'admin';
    addresses: Address[];
}

export interface DeliveryInfo {
    method: DeliveryMethod;
    address?: Address;
}

export interface Order {
    id: string;
    customer: {
        phoneNumber: string;
        fullName: string;
    };
    date: string;
    totalAmount: number;
    status: OrderStatus;
    items: CartItem[];
    delivery?: DeliveryInfo;
}
