import { DEFAULT_TIERED_PRICING, DEFAULT_SERVICE_PRICING } from '../constants';
import { PaperSize, PrintQuality, Sided, Service } from '../types';

interface PriceTier {
  min: number;
  max: number;
  prices: {
    // FIX: Excluded empty string from Sided type to match the data structure which only contains 'single' and 'double'.
    [key in Exclude<Sided, ''>]: number;
  };
}

export interface PricingConfig {
    // FIX: Excluded empty strings from PaperSize and PrintQuality to match the stricter type of DEFAULT_TIERED_PRICING.
    tiered: Record<Exclude<PaperSize, ''>, Record<Exclude<PrintQuality, ''>, PriceTier[]>>;
    services: {
        [key in Exclude<Service, 'none'>]: number
    };
}

const PRICING_STORAGE_KEY = 'printShopPricingConfig';

// Function to get pricing configuration from localStorage or use defaults
export const getPricingConfig = (): PricingConfig => {
    try {
        const storedConfig = localStorage.getItem(PRICING_STORAGE_KEY);
        if (storedConfig) {
            return JSON.parse(storedConfig);
        }
    } catch (error) {
        console.error("Failed to parse pricing config from localStorage:", error);
    }
    
    // Return default if nothing is stored or parsing fails
    return {
        tiered: DEFAULT_TIERED_PRICING,
        services: DEFAULT_SERVICE_PRICING,
    };
};

// Function to save pricing configuration to localStorage
export const savePricingConfig = (config: PricingConfig): void => {
    try {
        localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
        console.error("Failed to save pricing config to localStorage:", error);
    }
};