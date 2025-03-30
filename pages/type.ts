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
  currency: Currency;
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

export type ProductFeature = {
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
  key?: string | null; 
  stock?:number |null
  additional_price?:number|null
  decreases_stock?:boolean,
  continue_selling?:boolean
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type Feature = {
  id: string;
  product_id: string;
  name: string;
  type: VariantType;
  icon: string[];
  required: boolean;
  default: string | number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  values: ProductFeature[];
};


export type GroupProductType = {
  // id: string;
  product_id: string;
  stock: number | null;
  additional_price: number;
  bind: { [key: string]: string };
  // created_at: string;
  // updated_at: string;
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

export enum VariantType {
  ICON_TEXT = 'icon_text',
  COLOR = 'color',
  TEXT = 'text',
  ICON = 'icon',
  INPUT = 'input',
  DATE = 'date',
  DOUBLE_DATE = 'double_date',
  RANGE = 'range',
  LEVEL = 'level',
  FILE = ' file',
}

export const filterOptions: {
  id: OrderByType;
  name: OptionType;
}[] = [
  { id: "date_desc", name: "plus recent" },
  { id: "date_asc", name: "moins recent" },
  { id: "price_desc", name: "prix eleve" },
  { id: "price_asc", name: "prix bas" },
];

export interface FilterValue {
  text: string;
  icon: string[] | Record<string, never>;
  key: string | null;
}

export interface Filter {
  id: string;
  name: string;
  values: FilterValue[];
  type?: VariantType;
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
// export type GroupProductCart = {
//   id: string;
//   product_id: string;
//   stock: number;
//   currency: string;
//   additional_price: number;
//   bind: Record<string, any>;
//   created_at: string;
//   updated_at: string;
//   product: ProductType;
// };


export type CartItem = {
  id: string;
  cart_id: string;
  bind: string
  realBind: Record<string, any>;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: ProductType;
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

export type CartUpdateResponse = {
  message: string;
  cart: Cart;
  updatedItem: CartItem;
  total: number;
  action: "added" | "removed" | "updated";
};



export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  RETURNED = 'returned',
  DELIVERED = 'delivered',
  PICKED_UP = 'picked_up',
  NOT_DELIVERED = 'not_delivered',
  NOT_PICKED_UP = 'not_picked_up',
  WAITING_FOR_PAYMENT = 'waiting_for_payment',
  WAITING_PICKED_UP = 'waiting_picked_up',
}

export enum Currency {
  FCFA = 'FCFA',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  MOBILE_MONEY = 'mobile_money',
  CASH = 'cash',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}


export interface UserOrderItem {
  id: string;
  store_id: string;
  user_id: string;
  order_id: string;
  status: OrderStatus;
  product_id: string;
  bind_name: Record<string, ProductFeature>; // Parsed JSON from bind_name
  bind: Record<string, string>; // Parsed JSON from bind
  quantity: number;
  price_unit: number;
  currency: Currency;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  product: ProductType;
}


export interface UserOrder {
  id: string;
  store_id: string;
  user_id: string;
  phone_number: string;
  formatted_phone_number: string;
  country_code: string;
  reference: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  currency: Currency;
  total_price: number;
  delivery_price: number;
  return_delivery_price: number;
  with_delivery: boolean;
  delivery_address?: string;
  delivery_address_name?: string;
  delivery_date?: string; // ISO date string
  delivery_latitude?: number;
  delivery_longitude?: number;
  pickup_address?: string;
  pickup_address_name?: string;
  pickup_date?: string; // ISO date string
  pickup_latitude?: number;
  pickup_longitude?: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  items: UserOrderItem[];
}