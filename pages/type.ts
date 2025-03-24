export type ProductType = {
  id: string;
  store_id: string;
  categories_id: string[];
  name: string;
  description: string;
  default_feature_id: string;
  price: number;
  barred_price: number;
  slug: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductFavorite = {
  id: string;
  store_id: string;
  categories_id: string[] | null;
  name: string;
  default_feature_id: string;
  description: string;
  barred_price: number | null;
  price: number;
  currency: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  label: string;
  product_id: string;
};

export type FeatureValue = {
  id: string;
  featureId: string;
  currency: string;
  views: string[];
  icon: string | null;
  text: string | null;
  min: number | null;
  max: number | null;
  minSize: number | null;
  maxSize: number | null;
  multiple: boolean;
  isDouble: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type Feature = {
  id: string;
  product_id: string;
  name: string;
  type: string | null;
  icon: string[];
  required: boolean;
  default: string | number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  values: FeatureValue[];
};


export type GroupProductType = {
  id: string;
  product_id: string;
  stock: number;
  additional_price: number;
  bind: { [key: string]: string };
  created_at: string;
  updated_at: string;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_category_id: string;
  store_id: string;
  view: string[];
  icon: string[];
  created_at: string;
  updated_at: string;
}

export type MetaPagination = {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: null;
  previousPageUrl: null;
};
type ProductPick =
  | "barred_price"
  | "description"
  | "name"
  | "id"
  | "price"
  | "currency"
  | "default_feature_id"
  | "slug";

export type ProductClient = Pick<ProductType, ProductPick>;



export const defaultOptions = [
  "plus recent",
  "moins recent",
  "prix eleve",
  "prix bas",
] as const;
export type OrderByType = "date_asc" | "date_desc" | "price_asc" | "price_desc";
export type OptionType = (typeof defaultOptions)[number]


export const filterOptions: {
  id: OrderByType;
  name: OptionType;
}[] = [
  { id: "date_desc", name: "plus recent" },
  { id: "date_asc", name: "moins recent" },
  { id: "price_desc", name: "prix eleve" },
  { id: "price_asc", name: "prix bas" },
];

export enum FeaturType {
  COLOR = "color",
  TEXT = "text",
  ICON = "icon",
  ICON_TEXT = "icon_text",
}

export interface Filter {
  id: string;
  name: string;
  values: string[];
  type?: FeaturType;
}
export interface PhoneNumber {
  id: string;
  phone_number: string;
  format: string;
  country_code: string;
  created_at: string;
  updated_at: string;
}

export interface Adresse {
  id: string;
  name: string;
  longitude: string;
  latitude: string;
  created_at: string;
  updated_at: string;
}

// cart

type GroupProductCart = {
  id: string;
  product_id: string;
  stock: number;
  currency: string;
  additional_price: number;
  bind: Record<string, any>;
  created_at: string;
  updated_at: string;
  product: ProductType;
};


type CartItem = {
  id: string;
  cart_id: string;
  group_product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  group_product: GroupProductCart;
};

type Cart = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  items: CartItem[];
};

export type CartResponse = {
  cart: Cart;
  total: number;
};


type UpdatedItem = {
  id: string;
  cart_id: string;
  group_product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type CartUpdateResponse = {
  message: string;
  cart: Cart;
  updatedItem: UpdatedItem;
  total: number;
  action: "added" | "removed" | "updated";
};