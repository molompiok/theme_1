export type ProductType = {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  description: string;
  default_feature_id: string;
  price: number;
  barred_price: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
};

type ProductPick = 'barred_price' | 'description' | 'name' | 'id' | 'price' | 'currency' | 'default_feature_id';


export type FeatureType = {
  "id": string,
  "feature_id": string,
  feature_name: string,
  feature_type: string,
  feature_icon: string,
  feature_required: boolean,
  "currency": string,
  "views": Array<string>,
  "icon": Array<string>,
  "text": string,
  "additional_price": number,
  "min": number,
  "max": number,
  "min_size": number,
  "max_size": number,
  "is_double": boolean,
  "multiple": number,
  "created_at": string,
  "updated_at": string
}

export type GroupFeatureType = {
  id: string,
  product_id: string,
  stock: number,
  bind: object,
  created_at: string,
  updated_at: string
}


export type MetaPagination = {
  "total": number,
  "perPage": number,
  "currentPage": number,
  "lastPage": number,
  "firstPage": number,
  "firstPageUrl": string,
  "lastPageUrl": string,
  "nextPageUrl": null,
  "previousPageUrl": null
}
export type ProductClient = Pick<ProductType, ProductPick> 