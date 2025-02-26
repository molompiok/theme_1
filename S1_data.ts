export type ProductType = {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  description: string;
  default_feature_id: string,
  price: number;
  barred_price: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
};
function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}
const images = [
  "img/ImgP1.jpg",
  "img/imgP2.png",
  "img/imgP3.png",
  "img/imgP4.png",
  "img/imgP5.png",
  "img/imgP6.png",
  "img/imgP7.png",
  "img/imgP8.jpg",
];

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
    name: `Samsung galaxy s25`,
    description: `This is a sample product description for product ${getRandomNumber(
      1,
      100
    )}.`,
    price: getRandomNumber(1500, 25500),
    barred_price: getRandomNumber(26000, 419000),
    default_feature_id : 'id_5',
    currency: "CFA",
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
  price: getRandomNumber(1500, 25500),
  barred_price: getRandomNumber(26000, 419000),
  default_feature_id : 'id_5',
  currency: "CFA",
  createdAt: getRandomDate(),
  updatedAt: getRandomDate(),
};

export type ValuesType = {
  id: string;
  feature_id: string;
  product_id: string;
  icon? : string;
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

export const groupFeatures : {
  id : string,
  product_id: string,
  stock : number
} = {
  id: "id_sdfsf",
  product_id: 'id_5',
  stock : 3
}
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
        views: [images[4], images[1], images[4], images[1]],
        additional_price: 650,
        text: "blue",
      },
      {
        id: "id_848",
        feature_id: "id_5",
        product_id: "id_1",
        currency: "CFA",
        views: [
          images[3],
          images[2],
          images[5],
          images[1],
          images[5],
          images[6],
          images[7],
        ],
        additional_price: 580,
        text: "red",
      },
      {
        id: "id_871",
        feature_id: "id_5",
        product_id: "id_1",
        currency: "CFA",
        views: [images[0], images[1], images[2], images[5]],
        additional_price: 650,
        text: "green",
      },
      {
        id: "id_872",
        feature_id: "id_5",
        product_id: "id_1",
        currency: "CFA",
        views: [images[1], images[4], images[5], images[2]],
        additional_price: 650,
        text: "yellow",
      },
    ],
  },
  // {
  //   id: "id_7854",
  //   product_id: "id_1",
  //   name: "Taille",
  //   icon: [""],
  //   type: "Text",
  //   required: true,
  //   values: [
  //     {
  //       id: "id_558",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 690,
  //       text: "XL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_74",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 690,
  //       text: "32",
  //       stock: 1,
  //     },
  //   ],
  // },
  {
    id: "id_4",
    product_id: "id_1",
    name: "Taille",
    icon: [""],
    type: "Text",
    required: true,
    values: [
      {
        id: "id_48",
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
  // {
  //   id: "id_4",
  //   product_id: "id_1",
  //   name: "Taille",
  //   icon: [""],
  //   type: "Text",
  //   required: true,
  //   values: [
  //     {
  //       id: "id_748",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 690,
  //       text: "XL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_58",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 540,
  //       text: "XXL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_81",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "L",
  //       stock: 0,
  //     },
  //     {
  //       id: "id_8144",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "M",
  //       stock: 5,
  //     },
  //   ],
  // },
  // {
  //   id: "id_4",
  //   product_id: "id_1",
  //   name: "Taille",
  //   icon: [""],
  //   type: "Text",
  //   required: true,
  //   values: [
  //     {
  //       id: "id_748",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 690,
  //       text: "XL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_58",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 540,
  //       text: "XXL",
  //       stock: 0,
  //     },
  //     {
  //       id: "id_81",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "L",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_8144",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "M",
  //       stock: 5,
  //     },
  //   ],
  // },
  // {
  //   id: "id_4",
  //   product_id: "id_1",
  //   name: "Taille",
  //   icon: [""],
  //   type: "Text",
  //   required: true,
  //   values: [
  //     {
  //       id: "id_748",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 690,
  //       text: "XL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_58",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 540,
  //       text: "XXL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_81",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "L",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_8144",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "M",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_58",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 540,
  //       text: "XXL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_81",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "L",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_8144",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "M",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_58",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 540,
  //       text: "XXL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_81",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "L",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_8144",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "M",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_58",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 540,
  //       text: "XXL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_81",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "L",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_8144",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "M",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_58",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 540,
  //       text: "XXL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_81",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "L",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_8144",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "M",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_58",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 540,
  //       stock: 5,
  //       text: "XXL",
  //     },
  //     {
  //       id: "id_81",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "L",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_8144",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "M",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_58",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 540,
  //       text: "XXL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_81",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "L",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_8144",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "M",

  //       stock: 5,
  //     },
  //     {
  //       id: "id_58",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 540,
  //       text: "XXL",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_81",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "L",
  //       stock: 5,
  //     },
  //     {
  //       id: "id_8144",
  //       feature_id: "id_4",
  //       product_id: "id_1",
  //       currency: "CFA",
  //       views: [],
  //       additional_price: 610,
  //       text: "M",
  //       stock: 5,
  //     },
  //   ],
  // },
];

export const CommentsProduct = [
  {
    id: generateRandomId(),
    user: {
      name: "albert camason",
      photo: [],
    },
    product: {
      name: "samsumg ia",
      feature: "size : XL; color: red",
    },
    note: 5,
    title: "Great Shoe for Travel",
    description:
      "I needed a new pair of Allbirds for an upcoming trip to Thailand. I wanted something that I could wear with dresses to temples (and slip on/off easily since you have to take your shoes off) or while I was walking from place to place. These are perfect! They are incredibly comfortable, lightweight and look great with either our casual dress or jeans.",
  },
  {
    id: generateRandomId(),
    user: {
      name: "albert camason",
      photo: [],
    },
    product: {
      name: "iphone ia",
      feature: "size : XL; color: red",
    },
    note: 5,
    title: "Comfy, Breathable and made with natural materials 👍",
    description:
      "Lately, I’ve been all about comfort and a healthier lifestyle, and the Tree Gliders have been my go-to sneakers. I got them in my usual size 7. 5, and they fit true to size with a slightly wider toe box than my other sneakers. They’re super lightweight and breathable, keeping my feet cool whether I’m at yoga or out running errands. Plus, they’re made with sustainable materials like recycled polyester laces and a lyocell upper. If you’re looking for comfy, everyday sneakers that are also eco-friendly, these are definitely worth checking out!",
  },
];

export { Product, features };
