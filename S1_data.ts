import img from "./public/assets/img/ImgP1.jpg";
import img2 from "./public/assets/img/imgP2.png";
export type ProductType = {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  description: string;
  views: string[];
  price: number;
  barred_price: number;
  currency: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};
function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(): Date {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - 30); // Il y a 30 jours
  const randomDays = getRandomNumber(0, 30);
  const randomDate = new Date(pastDate);
  randomDate.setDate(pastDate.getDate() + randomDays);
  return randomDate;
}
function generateRandomProduct(): ProductType {
  return {
    id: generateRandomId(),
    store_id: generateRandomId(),
    category_id: generateRandomId(),
    name: `Product ${getRandomNumber(1, 100)}`,
    description: `This is a sample product description for product ${getRandomNumber(
      1,
      100
    )}.`,
    views: [img, img2],
    price: getRandomNumber(1500, 25500),
    barred_price: getRandomNumber(26000, 419000),
    currency: "CFA",
    stock: getRandomNumber(0, 4),
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  };
}

export function generateRandomProducts(count: number): ProductType[] {
  const products: ProductType[] = [];
  for (let i = 0; i < count; i++) {
    products.push(generateRandomProduct());
  }
  return products;
}

/******************Details produit***************************** */

const Product: ProductType = {
  id: "id_1",
  store_id: generateRandomId(),
  category_id: generateRandomId(),
  name: `Men's tree runner go`,
  description: `This is a sample product description for product ${generateRandomId()}.`,
  views: [],
  price: getRandomNumber(1500, 25500),
  barred_price: getRandomNumber(26000, 419000),
  currency: "CFA",
  stock: getRandomNumber(0, 4),
  createdAt: getRandomDate(),
  updatedAt: getRandomDate(),
};

export type ValuesType = {
  id: string;
  feature_id: string;
  product_id: string;
  currency: string;
  views: string[];
  additional_price: number;
  text: string;
};

export type FeaturesType = {
  id: string;
  product_id: string;
  name: string;
  icon: string[];
  type:
    | "Text"
    | "Icon"
    | "Color"
    | "component"
    | "Date"
    | "Files"
    | "Input"
    | "Interval";
  required: boolean;
  values: ValuesType[];
};

const features: FeaturesType[] = [
  {
    id: "id_5",
    product_id: "id_1",
    name: "Couleur",
    type: "Color",
    icon: [""],
    required: false,
    values: [
      {
        id: "id_8741",
        feature_id: "id_5",
        product_id: "id_1",
        currency: "CFA",
        views: [img2, img2, img, img],
        additional_price: 650,
        text: "blue",
      },
      {
        id: "id_848",
        feature_id: "id_5",
        product_id: "id_1",
        currency: "CFA",
        views: [img2, img2, img2, img, img2, img, img],
        additional_price: 580,
        text: "red",
      },
      {
        id: "id_871",
        feature_id: "id_5",
        product_id: "id_1",
        currency: "CFA",
        views: [img, img2, img, img2],
        additional_price: 650,
        text: "green",
      },
      {
        id: "id_872",
        feature_id: "id_5",
        product_id: "id_1",
        currency: "CFA",
        views: [img, img, img, img2],
        additional_price: 650,
        text: "yellow",
      },
    ],
  },

  {
    id: "id_7854",
    product_id: "id_1",
    name: "Stockage",
    icon: [""],
    type: "Text",
    required: true,
    values: [
      {
        id: "id_748",
        feature_id: "id_4",
        product_id: "id_1",
        currency: "CFA",
        views: [],
        additional_price: 690,
        text: "128",
      },
      {
        id: "id_748",
        feature_id: "id_4",
        product_id: "id_1",
        currency: "CFA",
        views: [],
        additional_price: 690,
        text: "32",
      },
    ],
  },
  {
    id: "id_4",
    product_id: "id_1",
    name: "Taille",
    icon: [""],
    type: "Text",
    required: true,
    values: [
      {
        id: "id_748",
        feature_id: "id_4",
        product_id: "id_1",
        currency: "CFA",
        views: [],
        additional_price: 690,
        text: "XL",
      },
      {
        id: "id_58",
        feature_id: "id_4",
        product_id: "id_1",
        currency: "CFA",
        views: [],
        additional_price: 540,
        text: "XXL",
      },
      {
        id: "id_81",
        feature_id: "id_4",
        product_id: "id_1",
        currency: "CFA",
        views: [],
        additional_price: 610,
        text: "L",
      },
      {
        id: "id_8144",
        feature_id: "id_4",
        product_id: "id_1",
        currency: "CFA",
        views: [],
        additional_price: 610,
        text: "M",
      },
    ],
  },
];

// const [indexFeature, setIndexFeature] = useState(0);
// const [indexValue, setIndexValue] = useState(0);
// const pfeature = useproductFeatures((state) => state.productFeatures);
// const indexValueViews = useMemo(() => {
//   let obj;
//   pfeature.get(Product.id)?.forEach((v, key) => {
//     obj = { key, v };
//   });
//   return obj;
// }, [pfeature]);

// const indexes = useMemo(() => {
//   let indexFeature = 0;
//   let indexValue = 0;
//   indexFeature = features.findIndex(
//     (feature) => feature.name == indexValueViews?.["key"]
//   );

//   indexValue = features[indexFeature ?? 0]?.values?.findIndex(
//     (value) => value.text == indexValueViews?.["v"]
//   );
//   if (
//     features[indexFeature && indexFeature <= 0 ? 0 : indexFeature]?.values?.[
//       !indexValue && indexValue <= 0 ? 0 : indexValue
//     ]?.views?.length === 0
//   ) {
//     return { key: 0, value: 0 };
//   }

//   return { key: indexFeature, value: indexValue };
// }, [indexValueViews]);

export { Product, features };
