// store/themeSettingsStore.ts
import { create } from "zustand";
import { combine } from "zustand/middleware";

export interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  bodyFont?: string;
  headingFont?: string;
  layoutType?: "grid" | "list";
  showHeader?: boolean;
  showFooter?: boolean;
  storeNameVisible?: boolean;
  logoUrl?: string[];
  siteBackgroundColor?: string;
  siteTextColor?: string;
  backgroundGradient?: string[];
  showAnnouncementBar?: boolean;
  announcementText?: string;
  announcementMessages?: string[];
  announcementTextColor?: string;
  announcementBackgroundColor?: string;
  announcementBackgroundGradient?: string[];
  headerTextColor?: string;
  headerBackgroundColor?: string;
  footerTextColor?: string;
  footerBackgroundColor?: string;
  footerFont?: string;
  showFilterSide?: boolean;
  filterSideTextColor?: string;
  filterSideBackgroundColor?: string;
  filterSideLayout: "row" | "grid" | "bento" | "compact" | "horizontal-scroll" | "card" | "stacked-list";
  productCardTextColor?: string;
  productCardBackgroundColor?: string;
  productPriceColor?: string;
  priceBeforeName?: boolean;
  showRatingInList?: boolean;
  showRatingInProduct?: boolean;
  reductionDisplay?: "barred-price" | "percent-reduction";
  productListView?: "grid" | "row" | "bento" ;
  baseFontSize?: string;
  productAddToCartBorderColor?: string;
  productAddToCartBackgroundColor?: string;
  productAddToCartTextColor?: string;
  // Ajouter d'autres options ici si besoin
}

const DEFAULT_SETTINGS: ThemeSettings = {
  "primaryColor": "#3B82F6",
  "secondaryColor": "#6B7280",
  "backgroundColor": "#eee",
  "bodyFont": "Inter, sans-serif",
  "headingFont": "Poppins, sans-serif",
  "layoutType": "grid",
  "showHeader": true,
  "showFooter": true,
  "storeNameVisible": true,
  "logoUrl": [],
  "siteBackgroundColor": "#FFFFFF",
  "siteTextColor": "#1F2937",
  "backgroundGradient": [],
  "showAnnouncementBar": true,
  "announcementText": "Livraison gratuite dès 50€ d'achat !",
  "announcementMessages": [
    "Bienvenue !",
    "Promotions en cours..."
  ],
  "announcementTextColor": "#FFFFFF",
  "announcementBackgroundColor": "#2563EB",
  "announcementBackgroundGradient": [],
  "headerTextColor": "#1F2937",
  "headerBackgroundColor": "#FFFFFF",
  "footerTextColor": "#6B7280",
  "footerBackgroundColor": "#1F2937",
  "productAddToCartBorderColor": "#cccccc",
  "productAddToCartBackgroundColor": "#F9FAFB",
  "productAddToCartTextColor": "#1F2937",
  "footerFont": "Inter, sans-serif",
  "showFilterSide": true,
  "filterSideTextColor": "#374151",
  "filterSideBackgroundColor": "#F9FAFB",
  "filterSideLayout": "row",
  "productCardTextColor": "#1F2937",
  "productCardBackgroundColor": "#FFFFFF",
  "productPriceColor": "#2563EB",
  "priceBeforeName": false,
  "showRatingInList": true,
  "showRatingInProduct": true,
  "reductionDisplay": "barred-price",
  "productListView": "grid",
  "baseFontSize": "16px"
};

export const useThemeSettingsStore = create(
  combine(DEFAULT_SETTINGS, (set) => ({
    setSettings: (newSettings: Partial<ThemeSettings>) => {
      console.log(newSettings)
      set((state) => ({
        ...state,
        ...newSettings,
      }))
    },
    setFilterSideLayout: (layout: "row" | "grid" | 'bento' | 'compact' | 'horizontal-scroll' | 'card' | 'stacked-list') => 
      set({ filterSideLayout: layout as "row" | "grid" | 'bento' | 'compact' | 'horizontal-scroll' | 'card' | 'stacked-list' }),
    resetSettings: () => set(DEFAULT_SETTINGS),
  }))
);
