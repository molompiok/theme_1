//  type ProductType = {
//   id: string;
//   store_id: string;
//   category_id: string;
//   name: string;
//   description: string;
//   default_feature_id: string;
//   price: number;
//   barred_price: number;
//   currency: string;
//   createdAt: Date;
//   updatedAt: Date;
// };
// function generateRandomId(): string {
//   return Math.random().toString(36).substring(2, 15);
// }
// const images = [
//   "/img/ImgP1.jpg",
//   "/img/ImgP2.png",
//   "/img/ImgP3.png",
//   "/img/ImgP4.png",
//   "/img/ImgP5.png",
//   "/img/ImgP6.png",
//   "/img/ImgP7.png",
//   "/img/ImgP8.jpg",
//   "/img/ImgP9.jpg",
// ];

// function getRandomNumber(min: number, max: number): number {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function getRandomDate(): Date {
//   const now = new Date();
//   const pastDate = new Date(now);
//   pastDate.setDate(now.getDate() - 30); // Il y a 30 jours
//   const randomDays = getRandomNumber(0, 30);
//   const randomDate = new Date(pastDate);
//   randomDate.setDate(pastDate.getDate() + randomDays);
//   return randomDate;
// }
// function generateRandomProduct(): ProductType {
//   return {
//     id: generateRandomId(),
//     store_id: generateRandomId(),
//     category_id: generateRandomId(),
//     name: `Souris logitech pro super`,

//     description: `This is a sample product description for product ${getRandomNumber(
//       1,
//       100
//     )}.`,
//     price: getRandomNumber(1500, 25500),
//     barred_price: getRandomNumber(26000, 419000),
//     default_feature_id: "id_5",
//     currency: "CFA",
//     createdAt: getRandomDate(),
//     updatedAt: getRandomDate(),
//   };
// }

//  function generateRandomProducts(count: number): ProductType[] {
//   const products: ProductType[] = [];
//   for (let i = 0; i < count; i++) {
//     products.push(generateRandomProduct());
//   }
//   return products;
// }

// /******************Details produit***************************** */

// const Product: ProductType = {
//   id: "id_1",
//   store_id: generateRandomId(),
//   category_id: generateRandomId(),
//   name: `Men's tree runner go`,
//   description: `This is a sample product description for product ${generateRandomId()}.`,
//   price: getRandomNumber(1500, 25500),
//   barred_price: getRandomNumber(26000, 419000),
//   default_feature_id: "id_5",
//   currency: "CFA",
//   createdAt: getRandomDate(),
//   updatedAt: getRandomDate(),
// };

//  type ValuesType = {
//   id: string;
//   feature_id: string;
//   product_id: string;
//   icon?: string;
//   currency: string;
//   views: string[];
//   additional_price: number;
//   text: string;
// };

//  type FeaturesType = {
//   id: string;
//   product_id: string;
//   name: string;
//   icon: string[];
//   type:
//     | "Text"
//     | "Icon"
//     | "Color"
//     | "component"
//     | "Date"
//     | "Files"
//     | "Input"
//     | "Interval";
//   required: boolean;
//   values: ValuesType[];
// };

//  const groupFeatures: {
//   id: string;
//   product_id: string;
//   stock: number;
// } = {
//   id: "id_sdfsf",
//   product_id: "id_5",
//   stock: 3,
// };

//  const productCommands: {
//   id: string;
//   name: string;
//   description: string;
//   price_unit: number;
//   quantity: number;
//   currency: "CFA";
//   status : 'RETURN' | '';
//   views : Array<string>
//   features: Record<string, string>;

// }[] = [
//   {
//     id: "id_5656464",
//     name: "Souris logitech pro super",
//     description:
//       "Souris logitech pro super Souris logitech pro super  Souris logitech pro super",
//     price_unit: 56454,
//     quantity: 85,
//     currency: "CFA",
//     views : [images[1]],
//     features: { "color": "blue", "taille": "moyen" },
//     status: 'RETURN'
//   },
//   {
//     id: "id_5656464",
//     name: "Souris logitech pro super",
//     description:
//       "Souris logitech pro super Souris logitech pro super  Souris logitech pro super",
//     price_unit: 56454,
//     quantity: 85,
//     currency: "CFA",
//     views : [images[1]],
//     features: { color: "blue", taille: "moyen" },
//     status: ''
//   },
// ];
// const features: FeaturesType[] = [
//   {
//     id: "id_5",
//     product_id: "id_1",
//     name: "Couleur",
//     type: "Color",
//     icon: [""],
//     required: false,
//     values: [
//       {
//         id: "id_8741",
//         feature_id: "id_5",
//         product_id: "id_1",
//         currency: "CFA",
//         views: [images[1], images[2], images[4], images[6]],
//         additional_price: 650,
//         text: "blue",
//       },
//       {
//         id: "id_848",
//         feature_id: "id_5",
//         product_id: "id_1",
//         currency: "CFA",
//         views: [
//           images[8],
//           images[2],
//           images[5],
//           images[1],
//           images[5],
//           images[6],
//           images[7],
//         ],
//         additional_price: 580,
//         text: "red",
//       },
//       {
//         id: "id_871",
//         feature_id: "id_5",
//         product_id: "id_1",
//         currency: "CFA",
//         views: [images[0], images[1], images[2], images[5]],
//         additional_price: 650,
//         text: "green",
//       },
//       {
//         id: "id_872",
//         feature_id: "id_5",
//         product_id: "id_1",
//         currency: "CFA",
//         views: [images[1], images[4], images[5], images[2]],
//         additional_price: 650,
//         text: "yellow",
//       },
//     ],
//   },
//   {
//     id: "id_4",
//     product_id: "id_1",
//     name: "Taille",
//     icon: [""],
//     type: "Text",
//     required: true,
//     values: [
//       {
//         id: "id_48",
//         feature_id: "id_4",
//         product_id: "id_1",
//         currency: "CFA",
//         views: [],
//         additional_price: 690,
//         text: "XL",
//       },
//       {
//         id: "id_58",
//         feature_id: "id_4",
//         product_id: "id_1",
//         currency: "CFA",
//         views: [],
//         additional_price: 540,
//         text: "XXL",
//       },
//       {
//         id: "id_81",
//         feature_id: "id_4",
//         product_id: "id_1",
//         currency: "CFA",
//         views: [],
//         additional_price: 610,
//         text: "L",
//       },
//       {
//         id: "id_8144",
//         feature_id: "id_4",
//         product_id: "id_1",
//         currency: "CFA",
//         views: [],
//         additional_price: 610,
//         text: "M",
//       },
//     ],
//   },
//   // {
//   //   id: "id_4",
//   //   product_id: "id_1",
//   //   name: "Taille",
//   //   icon: [""],
//   //   type: "Text",
//   //   required: true,
//   //   values: [
//   //     {
//   //       id: "id_748",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 690,
//   //       text: "XL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_58",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 540,
//   //       text: "XXL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_81",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "L",
//   //       stock: 0,
//   //     },
//   //     {
//   //       id: "id_8144",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "M",
//   //       stock: 5,
//   //     },
//   //   ],
//   // },
//   // {
//   //   id: "id_4",
//   //   product_id: "id_1",
//   //   name: "Taille",
//   //   icon: [""],
//   //   type: "Text",
//   //   required: true,
//   //   values: [
//   //     {
//   //       id: "id_748",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 690,
//   //       text: "XL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_58",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 540,
//   //       text: "XXL",
//   //       stock: 0,
//   //     },
//   //     {
//   //       id: "id_81",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "L",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_8144",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "M",
//   //       stock: 5,
//   //     },
//   //   ],
//   // },
//   // {
//   //   id: "id_4",
//   //   product_id: "id_1",
//   //   name: "Taille",
//   //   icon: [""],
//   //   type: "Text",
//   //   required: true,
//   //   values: [
//   //     {
//   //       id: "id_748",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 690,
//   //       text: "XL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_58",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 540,
//   //       text: "XXL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_81",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "L",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_8144",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "M",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_58",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 540,
//   //       text: "XXL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_81",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "L",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_8144",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "M",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_58",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 540,
//   //       text: "XXL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_81",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "L",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_8144",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "M",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_58",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 540,
//   //       text: "XXL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_81",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "L",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_8144",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "M",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_58",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 540,
//   //       text: "XXL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_81",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "L",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_8144",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "M",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_58",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 540,
//   //       stock: 5,
//   //       text: "XXL",
//   //     },
//   //     {
//   //       id: "id_81",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "L",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_8144",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "M",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_58",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 540,
//   //       text: "XXL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_81",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "L",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_8144",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "M",

//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_58",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 540,
//   //       text: "XXL",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_81",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "L",
//   //       stock: 5,
//   //     },
//   //     {
//   //       id: "id_8144",
//   //       feature_id: "id_4",
//   //       product_id: "id_1",
//   //       currency: "CFA",
//   //       views: [],
//   //       additional_price: 610,
//   //       text: "M",
//   //       stock: 5,
//   //     },
//   //   ],
//   // },
// ];
interface CategoryType {
  id: string;
  store_id: string;
  parent_category_id: string | null;
  name: string;
  description: string | null;
  view: any[];
  icon: any[];
}
const categoriesData: CategoryType[] = [
  // Électronique
  {
    id: "1",
    store_id: "store-1",
    parent_category_id: null,
    name: "Électronique",
    description: "Appareils électroniques et accessoires",
    view: [],
    icon: ["📱", "💻", "🎧"],
  },
  {
    id: "2",
    store_id: "store-1",
    parent_category_id: "1",
    name: "Smartphones",
    description: "Téléphones intelligents de toutes marques",
    view: [],
    icon: ["📱"],
  },
  {
    id: "3",
    store_id: "store-1",
    parent_category_id: "1",
    name: "Ordinateurs & Accessoires",
    description: "PC portables, de bureau et accessoires informatiques",
    view: [],
    icon: ["💻"],
  },
  {
    id: "4",
    store_id: "store-1",
    parent_category_id: "1",
    name: "Audio & Casques",
    description: "Casques, écouteurs et enceintes Bluetooth",
    view: [],
    icon: ["🎧"],
  },

  // Mode & Vêtements
  {
    id: "5",
    store_id: "store-1",
    parent_category_id: null,
    name: "Mode",
    description: "Vêtements, chaussures et accessoires",
    view: [],
    icon: ["👗", "👞"],
  },
  {
    id: "85",
    store_id: "store-1",
    parent_category_id: "6",
    name: "Modine",
    description: "Vêtements, chaussures et accessoires",
    view: [],
    icon: ["👗", "👞"],
  },
  {
    id: "6",
    store_id: "store-1",
    parent_category_id: "5",
    name: "Vêtements Homme",
    description: "T-shirts, pantalons, vestes et plus",
    view: [],
    icon: ["👕"],
  },
  {
    id: "7",
    store_id: "store-1",
    parent_category_id: "5",
    name: "Vêtements Femme",
    description: "Robes, tops, pantalons et accessoires",
    view: [],
    icon: ["👗"],
  },
  {
    id: "8",
    store_id: "store-1",
    parent_category_id: "5",
    name: "Chaussures",
    description: "Baskets, sandales, bottes pour toutes occasions",
    view: [],
    icon: ["👞", "👠"],
  },

  // Maison & Cuisine
  {
    id: "9",
    store_id: "store-1",
    parent_category_id: null,
    name: "Maison & Cuisine",
    description: "Équipements pour la maison, cuisine et décoration",
    view: [],
    icon: ["🏡", "🍽️"],
  },
  {
    id: "10",
    store_id: "store-1",
    parent_category_id: "9",
    name: "Électroménager",
    description: "Réfrigérateurs, machines à laver, micro-ondes et plus",
    view: [],
    icon: ["⚡", "🍳"],
  },
  {
    id: "11",
    store_id: "store-1",
    parent_category_id: "9",
    name: "Meubles",
    description: "Canapés, tables, chaises et rangements",
    view: [],
    icon: ["🛋️"],
  },

  // Sport & Loisirs
  {
    id: "12",
    store_id: "store-1",
    parent_category_id: null,
    name: "Sport & Loisirs",
    description: "Équipements de sport, jeux et loisirs extérieurs",
    view: [],
    icon: ["⚽", "🏋️"],
  },
  {
    id: "13",
    store_id: "store-1",
    parent_category_id: "12",
    name: "Fitness & Musculation",
    description: "Tapis de yoga, haltères, équipements de gym",
    view: [],
    icon: ["🏋️"],
  },
  {
    id: "14",
    store_id: "store-1",
    parent_category_id: "12",
    name: "Camping & Randonnée",
    description: "Tentes, sacs de couchage, lampes torches et plus",
    view: [],
    icon: ["🏕️"],
  },

  // Beauté & Santé
  {
    id: "15",
    store_id: "store-1",
    parent_category_id: null,
    name: "Beauté & Santé",
    description: "Produits de soin, cosmétiques et santé",
    view: [],
    icon: ["💄", "🧴"],
  },
  {
    id: "16",
    store_id: "store-1",
    parent_category_id: "15",
    name: "Maquillage",
    description: "Rouges à lèvres, fonds de teint, mascaras et plus",
    view: [],
    icon: ["💄"],
  },
  {
    id: "17",
    store_id: "store-1",
    parent_category_id: "15",
    name: "Soins de la peau",
    description: "Crèmes hydratantes, masques et soins anti-âge",
    view: [],
    icon: ["🧴"],
  },

  // Bébé & Enfants
  {
    id: "18",
    store_id: "store-1",
    parent_category_id: null,
    name: "Bébé & Enfants",
    description: "Jouets, vêtements et accessoires pour bébés et enfants",
    view: [],
    icon: ["🍼", "🧸"],
  },
  {
    id: "19",
    store_id: "store-1",
    parent_category_id: "18",
    name: "Jouets",
    description: "Jeux éducatifs, peluches, LEGO et plus",
    view: [],
    icon: ["🧸"],
  },
  {
    id: "20",
    store_id: "store-1",
    parent_category_id: "18",
    name: "Vêtements pour bébés",
    description: "Pyjamas, ensembles, chaussons et plus",
    view: [],
    icon: ["👶"],
  },
];

 export const CommentsProduct = [
  {
    id: 1,
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
    id: 2,
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
/*********
 * 1- refait le group * 
 * 2- terminer page profile *
 * 3- page paymemt
 * 4-Db for countries
 * 5- filter
 * 6- About
 * 7- parametre
 */
   // adresse - name - numero telephone



  //  import React, {
  //    useEffect,
  //    useState,
  //    useRef,
  //    useMemo,
  //    useCallback,
  //  } from "react";
  //  import clsx from "clsx";
  //  import { Filter, FilterValue, VariantType } from "../../pages/type"; // Make sure these paths are correct
  //  import { ProductMedia } from "../ProductMedia"; // Make sure this path is correct
  //  import {
  //    FiCheck,
  //    FiChevronDown,
  //    FiList,
  //    FiGrid,
  //    FiColumns,
  //    FiPocket,
  //    FiMoreHorizontal,
  //    FiLayout,
  //    FiLayers,
  //    FiX,
  //  } from "react-icons/fi";
  //  import { useQuery } from "@tanstack/react-query";
  //  import { CiSliderHorizontal } from "react-icons/ci";
  //  import { get_filters } from "../../api/products.api";
  //  import { usePageContext } from "../../renderer/usePageContext";
  //  import { useSelectedFiltersStore } from "../../store/filter";
  //  import Modal from "../modal/Modal";
  //  import gsap from "gsap";
  //  import { useFiltersAndUrlSync } from "../../hook/useUrlFilterManager";
  //  import { TbTrashX } from "react-icons/tb";
  //  import { IoClose } from "react-icons/io5";
  //  import { useThemeSettingsStore } from "../../store/themeSettingsStore";
  //  import PriceRangePopover from "../PriceRangeFilter";
  //  import PriceRangeFilter from "../PriceRangeFilter";
   
  //  type LayoutMode =
  //    | "row"
  //    | "grid"
  //    | "bento"
  //    | "compact"
  //    | "horizontal-scroll"
  //    | "card"
  //    | "stacked-list"
  //    | "all";
   
  //  interface FilterOptionProps {
  //    filterId: string;
  //    value: FilterValue;
  //    isSelected: boolean;
  //    onToggle: (filterId: string, value: FilterValue) => void;
  //    setRef: (el: HTMLButtonElement | null) => void;
  //    layout?: LayoutMode;
  //  }
   
  //  const getBaseButtonClasses = (layout: LayoutMode = "row") => {
  //    const base =
  //      "group transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1";
  //    switch (layout) {
  //      case "grid":
  //        return `${base} p-2.5 rounded-lg flex flex-col items-center justify-center text-center gap-2`; // Content centered, more padding
  //      case "bento":
  //        return `${base} px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 border`; // Pill shape, border managed by selection classes
  //      case "compact":
  //        return `${base} w-full px-2 py-1 rounded-md flex items-center text-left gap-1.5`; // Denser row, less padding/gap
  //      case "horizontal-scroll":
  //        return `${base} px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 whitespace-nowrap border`; // Pill shape for scroll
  //      case "card":
  //        return `${base} p-3 rounded-xl flex flex-col items-start justify-start text-center gap-2 border bg-white shadow-sm hover:shadow-md focus-visible:ring-slate-500 w-full`; // Card specific, items-start for content
  //      case "stacked-list":
  //        return `${base} w-full px-4 py-3 rounded-lg flex items-center text-left gap-3 hover:bg-gray-50/70`; // Richer row, more padding
  //      case "row":
  //      default:
  //        return `${base} w-full px-3 py-2 rounded-lg flex items-center text-left gap-2.5`; // Standard row
  //    }
  //  };
   
  //  // Adjusted selection classes for clarity and distinction
  //  const selectedClasses =
  //    "bg-slate-100 text-slate-800 font-semibold ring-1 ring-inset ring-slate-300"; // For row, compact, stacked-list
  //  const unselectedClasses = "text-gray-700 hover:bg-gray-50 hover:text-gray-800";
   
  //  const bentoSelectedClasses =
  //    "border-slate-500 bg-slate-100 text-slate-800 font-semibold";
  //  const bentoUnselectedClasses =
  //    "border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900";
   
  //  const cardSelectedClasses = "ring-2 ring-slate-500 border-slate-400 shadow-md"; // Keep distinct card selection
  //  const cardUnselectedClasses = "border-gray-200 hover:border-gray-300"; // Default card border
   
  //  // Specific selected/unselected for grid items that don't use the main 'selectedClasses' logic directly
  //  const gridItemSelectedClasses =
  //    "bg-slate-50 border-slate-300 ring-1 ring-slate-300 shadow-sm";
  //  const gridItemUnselectedClasses =
  //    "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm";
   
  //  const CheckboxIndicator: React.FC<{
  //    isSelected: boolean;
  //    layout?: LayoutMode;
  //  }> = ({ isSelected, layout = "row" }) => {
  //    if (
  //      layout === "bento" ||
  //      layout === "horizontal-scroll" ||
  //      layout === "card"
  //    ) {
  //      return null; // No checkbox for these layouts
  //    }
   
  //    return (
  //      <div
  //        className={clsx(
  //          "flex-shrink-0 flex items-center justify-center rounded border-2 transition-all duration-200",
  //          isSelected
  //            ? "bg-slate-600 border-slate-600"
  //            : "border-gray-300 group-hover:border-gray-400",
  //          layout === "grid" || layout === "compact" ? "size-3.5" : "size-4" // Adjusted sizes
  //        )}
  //      >
  //        {isSelected && (
  //          <FiCheck
  //            className={clsx(
  //              "text-white",
  //              layout === "grid" || layout === "compact" ? "size-2.5" : "size-3"
  //            )}
  //            strokeWidth={3}
  //          />
  //        )}
  //      </div>
  //    );
  //  };
   
  //  export const TextFilterOption: React.FC<FilterOptionProps> = ({
  //    filterId,
  //    value,
  //    isSelected,
  //    onToggle,
  //    setRef,
  //    layout = "row",
  //  }) => (
  //    <button
  //      ref={setRef}
  //      type="button"
  //      role="checkbox"
  //      aria-checked={isSelected}
  //      className={clsx(
  //        getBaseButtonClasses(layout),
  //        isSelected
  //          ? layout === "bento" || layout === "horizontal-scroll"
  //            ? bentoSelectedClasses
  //            : layout === "card"
  //            ? cardSelectedClasses
  //            : selectedClasses
  //          : layout === "bento" || layout === "horizontal-scroll"
  //          ? bentoUnselectedClasses
  //          : layout === "card"
  //          ? cardUnselectedClasses
  //          : unselectedClasses
  //      )}
  //      onClick={(e) => {
  //        e.stopPropagation();
  //        onToggle(filterId, value);
  //      }}
  //    >
  //      <CheckboxIndicator isSelected={isSelected} layout={layout} />
  //      <span
  //        className={clsx(
  //          "capitalize",
  //          layout === "grid"
  //            ? "text-xs"
  //            : layout === "bento" || layout === "horizontal-scroll"
  //            ? "text-xs font-medium"
  //            : layout === "compact"
  //            ? "text-xs"
  //            : layout === "card"
  //            ? "text-sm mt-0.5 font-medium self-center" // Text centered in card
  //            : "text-sm", // row, stacked-list
  //          (layout === "row" ||
  //            layout === "compact" ||
  //            layout === "stacked-list") &&
  //            "flex-grow"
  //        )}
  //      >
  //        {value.text}
  //      </span>
  //    </button>
  //  );
   
  //  export const ColorFilterOption: React.FC<FilterOptionProps> = ({
  //    filterId,
  //    value,
  //    isSelected,
  //    onToggle,
  //    setRef,
  //    layout = "row",
  //  }) => {
  //    const getColorSwatchSize = () => {
  //      switch (layout) {
  //        case "grid":
  //          return "size-8"; // Larger for grid items
  //        case "bento":
  //          return "size-4";
  //        case "compact":
  //          return "size-3.5";
  //        case "horizontal-scroll":
  //          return "size-4";
  //        case "card":
  //          return "size-12 self-center"; // Large, centered swatch for card
  //        case "stacked-list":
  //          return "size-5";
  //        case "row":
  //        default:
  //          return "size-5";
  //      }
  //    };
   
  //    return (
  //      <button
  //        ref={setRef}
  //        type="button"
  //        role="checkbox"
  //        aria-checked={isSelected}
  //        className={clsx(
  //          getBaseButtonClasses(layout),
  //          isSelected
  //            ? layout === "bento" || layout === "horizontal-scroll"
  //              ? bentoSelectedClasses
  //              : layout === "card"
  //              ? cardSelectedClasses
  //              : selectedClasses
  //            : layout === "bento" || layout === "horizontal-scroll"
  //            ? bentoUnselectedClasses
  //            : layout === "card"
  //            ? cardUnselectedClasses
  //            : unselectedClasses
  //        )}
  //        onClick={(e) => {
  //          e.stopPropagation();
  //          onToggle(filterId, value);
  //        }}
  //      >
  //        <div
  //          className={clsx(
  //            "rounded-full border border-gray-300 group-hover:border-gray-400 transition-all duration-200 flex items-center justify-center",
  //            getColorSwatchSize(),
  //            isSelected &&
  //              layout !== "card" &&
  //              "ring-2 ring-offset-1 ring-slate-500"
  //          )}
  //          style={{ backgroundColor: value.key || "transparent" }}
  //        >
  //          {isSelected && value.key?.toLowerCase() === "#ffffff" && (
  //            <FiCheck className="size-3 text-gray-700" strokeWidth={3} />
  //          )}
  //          {isSelected &&
  //            value.key?.toLowerCase() !== "#ffffff" &&
  //            !value.key?.toLowerCase().includes("rgba(255,255,255") && (
  //              <FiCheck
  //                className="size-3 text-white mix-blend-difference"
  //                strokeWidth={3}
  //              />
  //            )}
  //        </div>
  //        {layout === "grid" || layout === "card" ? (
  //          <span
  //            className={clsx(
  //              "capitalize text-center",
  //              layout === "grid" ? "text-xs mt-1" : "text-sm mt-1.5 font-medium" // card text
  //            )}
  //          >
  //            {value.text}
  //          </span>
  //        ) : (
  //          <span
  //            className={clsx(
  //              "capitalize",
  //              layout === "bento" || layout === "horizontal-scroll"
  //                ? "text-xs font-medium"
  //                : layout === "compact"
  //                ? "text-xs"
  //                : "text-sm", // row, stacked-list
  //              (layout === "row" ||
  //                layout === "compact" ||
  //                layout === "stacked-list") &&
  //                "flex-grow"
  //            )}
  //          >
  //            {value.text}
  //          </span>
  //        )}
  //      </button>
  //    );
  //  };
   
  //  export const IconFilterOption: React.FC<FilterOptionProps> = ({
  //    filterId,
  //    value,
  //    isSelected,
  //    onToggle,
  //    setRef,
  //    layout = "row",
  //  }) => {
  //    const getIconContainerSize = () => {
  //      switch (layout) {
  //        case "grid":
  //          return "size-12 sm:size-14"; // Larger for grid
  //        case "bento":
  //          return "size-6";
  //        case "compact":
  //          return "size-5";
  //        case "horizontal-scroll":
  //          return "size-6";
  //        case "card":
  //          return "size-16 sm:size-20 self-center"; // Large, centered icon for card
  //        case "stacked-list":
  //          return "size-9";
  //        case "row":
  //        default:
  //          return "size-9";
  //      }
  //    };
   
  //    const iconButtonClasses = () => {
  //      if (layout === "grid") {
  //        return clsx(
  //          getBaseButtonClasses(layout),
  //          "w-full aspect-[4/3] p-1.5 sm:p-2", // Rectangular aspect ratio for grid items
  //          isSelected ? gridItemSelectedClasses : gridItemUnselectedClasses
  //        );
  //      }
  //      if (layout === "card") {
  //        return clsx(
  //          getBaseButtonClasses(layout), // Already has border and shadow logic for card
  //          isSelected ? cardSelectedClasses : cardUnselectedClasses
  //        );
  //      }
  //      return clsx(
  //        getBaseButtonClasses(layout),
  //        isSelected
  //          ? layout === "bento" || layout === "horizontal-scroll"
  //            ? bentoSelectedClasses
  //            : selectedClasses
  //          : layout === "bento" || layout === "horizontal-scroll"
  //          ? bentoUnselectedClasses
  //          : unselectedClasses
  //      );
  //    };
   
  //    return (
  //      <button
  //        ref={setRef}
  //        type="button"
  //        role="checkbox"
  //        aria-checked={isSelected}
  //        className={iconButtonClasses()}
  //        onClick={(e) => {
  //          e.stopPropagation();
  //          onToggle(filterId, value);
  //        }}
  //      >
  //        <div
  //          className={clsx(
  //            "flex items-center justify-center rounded-md overflow-hidden transition-all duration-200",
  //            getIconContainerSize(),
  //            // Ring for non-grid/card selected items, as grid/card selection is handled by button classes
  //            isSelected && layout !== "grid" && layout !== "card"
  //              ? "ring-1 ring-offset-1 ring-slate-400"
  //              : "",
  //            !isSelected && layout !== "grid" && layout !== "card"
  //              ? "group-hover:scale-105"
  //              : ""
  //          )}
  //        >
  //          {Array.isArray(value.icon) && value.icon.length > 0 ? (
  //            <ProductMedia
  //              mediaList={value.icon}
  //              productName={value.text}
  //              className="size-full object-cover"
  //            />
  //          ) : (
  //            <svg
  //              className={clsx(
  //                "text-gray-400 group-hover:text-gray-500",
  //                layout === "grid"
  //                  ? "size-7"
  //                  : layout === "bento" || layout === "horizontal-scroll"
  //                  ? "w-3.5 h-3.5" // size-3.5
  //                  : layout === "compact"
  //                  ? "w-3.5 h-3.5" // size-3.5
  //                  : layout === "card"
  //                  ? "size-10"
  //                  : "size-7" // row, stacked-list
  //              )}
  //              fill="none"
  //              stroke="currentColor"
  //              viewBox="0 0 24 24"
  //              xmlns="http://www.w3.org/2000/svg"
  //            >
  //              <path
  //                strokeLinecap="round"
  //                strokeLinejoin="round"
  //                strokeWidth="1.5"
  //                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  //              ></path>
  //            </svg>
  //          )}
  //        </div>
  //        <span
  //          className={clsx(
  //            "capitalize",
  //            layout === "grid" || layout === "card"
  //              ? "text-xs text-center mt-1.5"
  //              : layout === "bento" ||
  //                layout === "horizontal-scroll" ||
  //                layout === "compact"
  //              ? "text-xs font-medium"
  //              : "text-sm", // row, stacked-list
   
  //            isSelected && layout !== "grid" && layout !== "card"
  //              ? "text-slate-700 font-medium"
  //              : layout !== "grid" && layout !== "card"
  //              ? "text-gray-600 group-hover:text-gray-800"
  //              : "",
   
  //            isSelected && (layout === "grid" || layout === "card")
  //              ? "text-slate-700 font-semibold"
  //              : layout === "grid" || layout === "card"
  //              ? "text-gray-600"
  //              : "",
   
  //            (layout === "row" ||
  //              layout === "compact" ||
  //              layout === "stacked-list") &&
  //              "flex-grow"
  //          )}
  //        >
  //          {value.text}
  //        </span>
  //      </button>
  //    );
  //  };
   
  //  export const IconTextFilterOption: React.FC<FilterOptionProps> = ({
  //    filterId,
  //    value,
  //    isSelected,
  //    onToggle,
  //    setRef,
  //    layout = "row",
  //  }) => {
  //    const getIconDisplaySize = () => {
  //      switch (layout) {
  //        case "grid":
  //          return "size-8";
  //        case "bento":
  //          return "w-3.5 h-3.5"; // size-3.5
  //        case "compact":
  //          return "size-4";
  //        case "horizontal-scroll":
  //          return "w-3.5 h-3.5"; // size-3.5
  //        case "card":
  //          return "size-10 self-center mb-1.5"; // Icon centered in card flow
  //        case "stacked-list":
  //          return "size-5";
  //        case "row":
  //        default:
  //          return "size-5";
  //      }
  //    };
   
  //    const placeholderSvgSize = () => {
  //      switch (layout) {
  //        case "grid":
  //          return "size-5";
  //        case "bento":
  //          return "size-2.5"; // w-2.5 h-2.5
  //        case "compact":
  //          return "size-3";
  //        case "horizontal-scroll":
  //          return "size-2.5"; // w-2.5 h-2.5
  //        case "card":
  //          return "size-6";
  //        default:
  //          return "size-3.5"; // row, stacked-list
  //      }
  //    };
   
  //    return (
  //      <button
  //        ref={setRef}
  //        type="button"
  //        role="checkbox"
  //        aria-checked={isSelected}
  //        className={clsx(
  //          getBaseButtonClasses(layout),
  //          isSelected
  //            ? layout === "bento" || layout === "horizontal-scroll"
  //              ? bentoSelectedClasses
  //              : layout === "card"
  //              ? cardSelectedClasses
  //              : selectedClasses
  //            : layout === "bento" || layout === "horizontal-scroll"
  //            ? bentoUnselectedClasses
  //            : layout === "card"
  //            ? cardUnselectedClasses
  //            : unselectedClasses
  //        )}
  //        onClick={(e) => {
  //          e.stopPropagation();
  //          onToggle(filterId, value);
  //        }}
  //      >
  //        <CheckboxIndicator isSelected={isSelected} layout={layout} />
   
  //        {layout === "card" ? ( // Card specific rendering for icon
  //          <>
  //            {Array.isArray(value.icon) && value.icon.length > 0 ? (
  //              <ProductMedia
  //                mediaList={value.icon}
  //                productName={value.text}
  //                className={clsx(
  //                  getIconDisplaySize(),
  //                  "rounded-md object-contain"
  //                )}
  //              />
  //            ) : (
  //              <div
  //                className={clsx(
  //                  getIconDisplaySize(),
  //                  "bg-gray-100 rounded-md flex items-center justify-center"
  //                )}
  //              >
  //                <svg
  //                  className={clsx("text-gray-400", placeholderSvgSize())}
  //                  fill="none"
  //                  stroke="currentColor"
  //                  viewBox="0 0 24 24"
  //                >
  //                  <path
  //                    strokeLinecap="round"
  //                    strokeLinejoin="round"
  //                    strokeWidth="2"
  //                    d="M12 8v8m-4-4h8"
  //                  />
  //                </svg>
  //              </div>
  //            )}
  //          </>
  //        ) : (
  //          // Icon for non-card layouts
  //          <>
  //            {Array.isArray(value.icon) && value.icon.length > 0 ? (
  //              <ProductMedia
  //                mediaList={value.icon}
  //                productName={value.text}
  //                className={clsx(
  //                  getIconDisplaySize(),
  //                  "rounded-sm object-contain"
  //                )}
  //              />
  //            ) : (
  //              <div
  //                className={clsx(
  //                  getIconDisplaySize(),
  //                  "bg-gray-100 rounded-sm flex items-center justify-center"
  //                )}
  //              >
  //                <svg
  //                  className={clsx("text-gray-400", placeholderSvgSize())}
  //                  fill="none"
  //                  stroke="currentColor"
  //                  viewBox="0 0 24 24"
  //                >
  //                  <path
  //                    strokeLinecap="round"
  //                    strokeLinejoin="round"
  //                    strokeWidth="2"
  //                    d="M12 8v8m-4-4h8"
  //                  />
  //                </svg>
  //              </div>
  //            )}
  //          </>
  //        )}
   
  //        <span
  //          className={clsx(
  //            "capitalize",
  //            layout === "grid"
  //              ? "text-xs text-center"
  //              : layout === "bento" || layout === "horizontal-scroll"
  //              ? "text-xs font-medium"
  //              : layout === "compact"
  //              ? "text-xs"
  //              : layout === "card"
  //              ? "text-sm text-center font-medium" // Card text
  //              : "text-sm", // row, stacked-list
  //            (layout === "row" ||
  //              layout === "compact" ||
  //              layout === "stacked-list" ||
  //              layout === "grid") &&
  //              "flex-grow", // grid text also flex-grow for centering
  //            layout === "card" && "self-center w-full" // Ensure text in card takes full width for centering
  //          )}
  //        >
  //          {value.text}
  //        </span>
  //      </button>
  //    );
  //  };
   
  //  export default function FilterPanel() {
  //    const [modalFilter, setModalFilter] = useState(false);
  //    const pageContext = usePageContext();
  //    const categorySlug = pageContext.routeParams?.slug;
  //    const filterPanelRef = useRef<HTMLDivElement>(null);
   
  //    const {
  //      data: filters,
  //      isLoading,
  //      isError,
  //    } = useQuery<Filter[] | undefined>({
  //      queryKey: ["get_filters", { slug: categorySlug }],
  //      queryFn: () => get_filters({ slug: categorySlug }),
  //    });
   
  //    const handleModalClose = () => {
  //      gsap.to(filterPanelRef.current, {
  //        x: "100%",
  //        duration: 0.1,
  //        ease: "power2.in",
  //        onComplete: () => {
  //          setModalFilter(false);
  //          document.body.style.overflow = "auto";
  //        },
  //      });
  //    };
   
  //    const handleModalOpen = () => {
  //      setModalFilter(true);
  //      document.body.style.overflow = "hidden";
  //      gsap.fromTo(
  //        filterPanelRef.current,
  //        { x: "100%" },
  //        { x: 0, duration: 0.1, ease: "power2.out" }
  //      );
  //    };
   
  //    if (isLoading)
  //      return (
  //        <div className="text-gray-500 text-center py-4 h-[70dvh]">
  //          Chargement...
  //        </div>
  //      );
  //    if (!filters || isError || !Array.isArray(filters)) return null;
   
  //    return (
  //      <div className="inline max-h-[70dvh]">
  //        <div className="bg-white w-full ">
  //          <button
  //            className="w-full lg:hidden ml-auto px-3.5 py-2 flex items-center justify-center gap-2 border rounded-lg hover:bg-gray-100/80 hover:shadow-sm text-gray-800 border-gray-300 cursor-pointer transition-all duration-150"
  //            onClick={handleModalOpen}
  //            aria-haspopup="true"
  //            aria-expanded={modalFilter}
  //            aria-controls="filter-modal-content"
  //          >
  //            <CiSliderHorizontal size={22} />
  //            <h2 className="text-sm font-medium">Filtres</h2>
  //          </button>
  //          <div className="hidden lg:block bg-white rounded-xl shadow-sm max-w-xs w-full">
  //            <FilterModal
  //              filters={filters}
  //              onModalClose={handleModalClose}
  //              isMobile={false}
  //            />
  //          </div>
  //        </div>
   
  //        <Modal
  //          styleContainer="flex items-center justify-end size-full"
  //          zIndex={100}
  //          setHide={handleModalClose}
  //          animationName="translateRight"
  //          isOpen={modalFilter}
  //        >
  //          <div
  //            ref={filterPanelRef}
  //            id="filter-modal-content"
  //            className="font-primary bg-white h-dvh w-full max-w-[90vw] sm:max-w-[380px] shadow-2xl flex flex-col"
  //            role="dialog"
  //            aria-modal="true"
  //            aria-labelledby="filter-modal-title"
  //          >
  //            <FilterModal
  //              filters={filters}
  //              onModalClose={handleModalClose}
  //              isMobile={true}
  //            />
  //          </div>
  //        </Modal>
  //      </div>
  //    );
  //  }
   
  //  function LayoutSelector({
  //    currentLayout,
  //    filtideLayout,
  //    onLayoutChange,
  //  }: {
  //    currentLayout: LayoutMode;
  //    filtideLayout: LayoutMode;
  //    onLayoutChange: (layout: LayoutMode) => void;
  //  }) {
  //    const layouts: { key: LayoutMode; icon: React.ElementType; label: string }[] =
  //      [
  //        { key: "row", icon: FiList, label: "Liste" },
  //        { key: "grid", icon: FiGrid, label: "Grille" },
  //        { key: "bento", icon: FiColumns, label: "Pillules" }, // Renamed for clarity
  //        { key: "compact", icon: FiPocket, label: "Compact" },
  //        {
  //          key: "horizontal-scroll",
  //          icon: FiMoreHorizontal,
  //          label: "Défilement Horizontal",
  //        },
  //        { key: "card", icon: FiLayout, label: "Cartes" },
  //        { key: "stacked-list", icon: FiLayers, label: "Liste Détaillée" },
  //      ];
   
  //    return (
  //      <div
  //        className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg"
  //        style={{ display: filtideLayout === "all" ? "flex" : "none" }}
  //      >
  //        {layouts.map(({ key, icon: Icon, label }) => (
  //          <button
  //            key={key}
  //            onClick={() => onLayoutChange(key)}
  //            className={clsx(
  //              "p-1.5 rounded-md transition-all duration-200 hover:bg-white",
  //              currentLayout === key
  //                ? "bg-white shadow-sm text-slate-700"
  //                : "text-gray-500 hover:text-gray-700"
  //            )}
  //            title={label}
  //            aria-label={`Layout ${label}`}
  //          >
  //            <Icon size={16} />
  //          </button>
  //        ))}
  //      </div>
  //    );
  //  }
   
  //  function FilterModal({
  //    filters,
  //    onModalClose,
  //    isMobile,
  //  }: {
  //    filters: Filter[];
  //    onModalClose: () => void;
  //    isMobile: boolean;
  //  }) {
  //    const pageContext = usePageContext();
   
  //    const { urlPathname } = pageContext;
  //    const {
  //      setSelectedFilters,
  //      selectedFilters,
  //      setFilter,
  //      clearFilter,
  //      toggleFilter,
  //    } = useSelectedFiltersStore();
   
  //    const filtideLayout =
  //      useThemeSettingsStore(
  //        (state) => state.filterSideLayout as LayoutMode | undefined
  //      ) ?? "row";
  //    // const setFilterSideLayout = useThemeSettingsStore(state => state.setFilterSideLayout as (layout: LayoutMode) => void);
  //    const filterSideBackgroundColor = useThemeSettingsStore(
  //      (state) => state.filterSideBackgroundColor
  //    );
  //    const filterSideTextColor = useThemeSettingsStore(
  //      (state) => state.filterSideTextColor
  //    );
  //    const [filterSideLayout, setFilterSideLayout] =
  //      useState<LayoutMode>(filtideLayout);
   
  //    useEffect(() => {
  //      setFilterSideLayout(filtideLayout);
  //    }, [filtideLayout]);
   
  //    // filtideLayout
   
  //    useFiltersAndUrlSync(
  //      filters,
  //      urlPathname,
  //      setSelectedFilters,
  //      selectedFilters
  //    );
   
  //    const filterOptionRefs = useRef<Map<string, HTMLElement>>(new Map());
   
  //    const activeFilters = useMemo(
  //      () =>
  //        Object.entries(selectedFilters).flatMap(([filterId, values]) =>
  //          values.map((value) => ({ filterId, value }))
  //        ),
  //      [selectedFilters]
  //    );
   
  //    const setFilterOptionRef = useCallback(
  //      (filterId: string, valueText: string) => (el: HTMLElement | null) => {
  //        const key = `${filterId}-${valueText}`;
  //        if (el) filterOptionRefs.current.set(key, el);
  //        else filterOptionRefs.current.delete(key);
  //      },
  //      []
  //    );
   
  //    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
  //      () => {
  //        const initialState: Record<string, boolean> = {};
  //        filters.forEach((filter) => {
  //          initialState[filter.id] = true;
  //        });
  //        return initialState;
  //      }
  //    );
   
  //    const toggleCategory = (filterId: string) => {
  //      setOpenCategories((prev) => ({ ...prev, [filterId]: !prev[filterId] }));
  //    };
   
  //    const getLayoutClasses = (
  //      filterType: VariantType | undefined,
  //      layout: LayoutMode
  //    ) => {
  //      const baseGap = "gap-1.5"; // Common base gap
   
  //      switch (layout) {
  //        case "grid":
  //          // Grid columns adjust based on filter type for better visual balance
  //          if (filterType === VariantType.COLOR)
  //            return `${baseGap} grid grid-cols-4 sm:grid-cols-5`;
  //          if (filterType === VariantType.ICON)
  //            return `${baseGap} grid grid-cols-2 sm:grid-cols-3`; // Icons take more space
  //          return `${baseGap} grid grid-cols-2 sm:grid-cols-3`; // Text, IconText
  //        case "bento":
  //          return `flex flex-wrap ${baseGap}`; // Pills wrap
  //        case "compact":
  //          return `flex flex-col gap-0.5`; // Very dense list
  //        case "horizontal-scroll":
  //          return `flex overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 whitespace-nowrap ${baseGap} items-stretch`;
  //        case "card":
  //          return `grid grid-cols-2 gap-2.5`; // Cards in 2 columns
  //        case "stacked-list":
  //          return `flex flex-col gap-0.5`; // Items are larger, small gap between
  //        case "row":
  //        default:
  //          return `flex flex-col ${baseGap}`; // Standard list
  //      }
  //    };
   
  //    const RenderFilterOption = ({
  //      filter,
  //      value,
  //    }: {
  //      filter: Filter;
  //      value: FilterValue;
  //    }) => {
  //      const isSelected =
  //        selectedFilters[filter.id]?.some((v) => v.text === value.text) ?? false;
  //      const filterType = filter.type || VariantType.TEXT;
   
  //      const refCallback = setFilterOptionRef(filter.id, value.text) as (
  //        el: HTMLButtonElement | null
  //      ) => void;
   
  //      const optionProps = {
  //        filterId: filter.id,
  //        value,
  //        isSelected,
  //        onToggle: toggleFilter,
  //        setRef: refCallback,
  //        layout: filterSideLayout,
  //      };
   
  //      switch (filterType) {
  //        case VariantType.COLOR:
  //          return <ColorFilterOption {...optionProps} />;
  //        case VariantType.ICON:
  //          return <IconFilterOption {...optionProps} />;
  //        case VariantType.ICON_TEXT:
  //          return <IconTextFilterOption {...optionProps} />;
  //        case VariantType.TEXT:
  //        default:
  //          return <TextFilterOption {...optionProps} />;
  //      }
  //    };
   
  //    const handleClearFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
  //      const activeTags = Array.from(
  //        document.querySelectorAll(".active-filter-tag")
  //      );
  //      gsap.to([e.currentTarget, ...activeTags], {
  //        opacity: 0,
  //        x: -10,
  //        stagger: 0.03,
  //        duration: 0.25,
  //        onComplete: clearFilter,
  //      });
  //    };
   
  //    const handleRemoveActiveFilter = (
  //      e: React.MouseEvent<HTMLButtonElement>,
  //      filterId: string,
  //      value: FilterValue
  //    ) => {
  //      e.stopPropagation();
  //      const element = e.currentTarget.closest(".active-filter-tag");
  //      if (element) {
  //        gsap.to(element, {
  //          opacity: 0,
  //          scale: 0.7,
  //          duration: 0.25,
  //          onComplete: () => toggleFilter(filterId, value),
  //        });
  //      } else {
  //        toggleFilter(filterId, value);
  //      }
  //    };
   
  //    return (
  //      <>
  //        {isMobile && (
  //          <header
  //            className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 z-10"
  //            style={{
  //              backgroundColor: filterSideBackgroundColor,
  //              color: filterSideTextColor,
  //            }}
  //          >
  //            <h2 id="filter-modal-title" className="text-lg font-semibold">
  //              Filtres
  //            </h2>
  //            <div className="flex items-center gap-3">
  //              <LayoutSelector
  //                filtideLayout={filtideLayout}
  //                currentLayout={filterSideLayout}
  //                onLayoutChange={setFilterSideLayout}
  //              />
  //              <button
  //                onClick={onModalClose}
  //                className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100"
  //                aria-label="Fermer le panneau des filtres"
  //              >
  //                <IoClose size={28} />
  //              </button>
  //            </div>
  //          </header>
  //        )}
  //        {!isMobile && (
  //          <div
  //            className="flex items-center justify-between px-5 pt-6 pb-3 border-b border-gray-200"
  //            style={{
  //              backgroundColor: filterSideBackgroundColor,
  //              color: filterSideTextColor,
  //            }}
  //          >
  //            <div className="text-xl font-semibold uppercase">Filtres</div>
  //            <LayoutSelector
  //              filtideLayout={filtideLayout}
  //              currentLayout={filterSideLayout}
  //              onLayoutChange={setFilterSideLayout}
  //            />
  //          </div>
  //        )}
   
  //        <div
  //          className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
  //          style={{
  //            backgroundColor: filterSideBackgroundColor,
  //            color: filterSideTextColor,
  //          }}
  //        >
  //          <div className="p-4 space-y-3">
  //            {" "}
  //            {/* Slightly more space for sections */}
  //            {activeFilters.length > 0 && (
  //              <div className="pb-4 border-b border-gray-200">
  //                <div className="flex justify-between items-center mb-3">
  //                  <h3 className="text-sm font-medium text-gray-500">
  //                    Filtres Actifs
  //                  </h3>
  //                  <button
  //                    onClick={handleClearFilters}
  //                    className="text-sm text-slate-600 hover:text-slate-800 font-medium transition duration-150 ease-in-out flex items-center gap-1 group"
  //                  >
  //                    <TbTrashX
  //                      size={18}
  //                      className="transition-transform group-hover:scale-110"
  //                    />
  //                    Tout effacer
  //                  </button>
  //                </div>
  //                <div className="flex flex-wrap gap-2">
  //                  {activeFilters.map(({ filterId, value }) => (
  //                    <div
  //                      key={`${filterId}-${value.text}`}
  //                      className="active-filter-tag flex items-center gap-1.5 bg-slate-50 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
  //                    >
  //                      <span className="capitalize">{value.text}</span>
  //                      <button
  //                        onClick={(e) =>
  //                          handleRemoveActiveFilter(e, filterId, value)
  //                        }
  //                        className="text-slate-400 hover:text-slate-600 transition-colors group p-0.5 rounded-full hover:bg-slate-100"
  //                        aria-label={`Supprimer le filtre ${value.text}`}
  //                      >
  //                        <FiX size={16} strokeWidth={2.5} />
  //                      </button>
  //                    </div>
  //                  ))}
  //                </div>
  //              </div>
  //            )}
  //            <div className="space-y-1">
  //              {filters
  //                .filter((filter) => filter.values && filter.values.length > 0)
  //                .map((filter) => (
  //                  <div
  //                    key={filter.id}
  //                    className="border-b border-gray-100 last:border-b-0"
  //                  >
  //                    <button
  //                      onClick={() => toggleCategory(filter.id)}
  //                      className="w-full flex justify-between items-center py-3 px-1 text-left hover:bg-gray-50/80 rounded-md transition-colors duration-150"
  //                      aria-expanded={openCategories[filter.id] ?? true}
  //                      aria-controls={`filter-options-${filter.id}`}
  //                    >
  //                      <h3
  //                        className="font-semibold uppercase tracking-wide text-sm"
  //                        style={{ color: filterSideTextColor }}
  //                      >
  //                        {filter.name}
  //                        <span
  //                          className="text-xs font-normal ml-1.5"
  //                          style={{ color: filterSideTextColor }}
  //                        >
  //                          ({filter.values.length})
  //                        </span>
  //                      </h3>
  //                      <FiChevronDown
  //                        className={clsx(
  //                          "transform transition-transform duration-300 ease-in-out text-gray-500",
  //                          openCategories[filter.id] ?? true
  //                            ? "rotate-180"
  //                            : "rotate-0"
  //                        )}
  //                        size={20}
  //                      />
  //                    </button>
  //                    <div
  //                      id={`filter-options-${filter.id}`}
  //                      className={clsx(
  //                        "transition-all duration-300 ease-in-out overflow-hidden",
  //                        openCategories[filter.id] ?? true
  //                          ? "max-h-[1500px] opacity-100 pb-3 pt-1"
  //                          : "max-h-0 opacity-0"
  //                      )}
  //                      style={{ backgroundColor: filterSideBackgroundColor }}
  //                    >
  //                      <div
  //                        className={getLayoutClasses(
  //                          filter.type,
  //                          filterSideLayout
  //                        )}
  //                        style={{
  //                          backgroundColor: filterSideBackgroundColor,
  //                          color: filterSideTextColor,
  //                        }}
  //                      >
  //                        {filter.values.map((value, i) => (
  //                          <RenderFilterOption
  //                            key={`${filter.id}-${value.text}-${i}`}
  //                            filter={filter}
  //                            value={value}
  //                          />
  //                        ))}
  //                      </div>
  //                    </div>
  //                  </div>
  //                ))}
  //            </div>
  //          </div>
  //        </div>
  //      </>
  //    );
  //  }
    // if (!product || !seoData) {
    //   return (
    //     <div className="text-center py-20">
    //       <Helmet>
    //         <title>Produit non trouvé | {META_SITE_NAME}</title>
    //         <meta name="robots" content="noindex" /> {/* Good for non-existent products */}
    //       </Helmet>
    //       Aucun produit trouvé.
    //     </div>
    //   );
    // }
    //  const seoData = useMemo(() => {
    //    if (!product) return null;
   
    //    const canonicalUrl = `${BASE_URL}/${slug}`;
    //    const firstFeatureWithValue = getFirstFeatureWithView(features || []);
    //    const mainImage = firstFeatureWithValue?.values[0]?.views[0];
    //    const imageUrl = mainImage ? `${BASE_URL}${mainImage}` : "";
   
    //    const metaDescription =
    //      product.description?.substring(0, 160) || // Truncate for meta description length
    //      `Découvrez ${product.name} - ${
    //        product.barred_price ? `Ancien prix ${product.barred_price}, ` : ""
    //      }Maintenant à ${product.price}`;
   
    //    const discountPercentage =
    //      product.barred_price && product.price
    //        ? Math.round(
    //            ((product.barred_price - product.price) / product.barred_price) *
    //              100
    //          )
    //        : null;
   
    //    // Ensure currency and price are numbers for schema
    //    const productPrice = Number(product.price);
    //    const productBarredPrice = product.barred_price ? Number(product.barred_price) : undefined;
   
   
    //    return {
    //      canonicalUrl,
    //      imageUrl,
    //      metaDescription,
    //      discountPercentage,
    //      productPrice,
    //      productBarredPrice,
    //      currency: product.currency || "EUR", // Default currency if not provided
    //      productName: product.name,
    //      productDescription: product.description,
    //      productId: product.id,
    //      rating: product.rating ?? 4.5, // Default rating
    //      commentCount: product.comment_count ?? 10, // Default review count
    //    };
    //  }, [product, features, slug]);


        // <Helmet>
        //     <title>{`${seoData.productName} | Acheter en ligne | ${META_SITE_NAME}`}</title>
        //     <meta name="description" content={seoData.metaDescription} />
        //     <link rel="canonical" href={seoData.canonicalUrl} />
        //     <meta name="robots" content="index, follow" />
    
        //     {/* Open Graph Data */}
        //     <meta property="og:type" content="product" />
        //     <meta property="og:url" content={seoData.canonicalUrl} />
        //     <meta property="og:title" content={`${seoData.productName} | Acheter en ligne`} />
        //     <meta property="og:description" content={seoData.metaDescription} />
        //     <meta property="og:site_name" content={META_SITE_NAME} />
        //     {seoData.imageUrl && 
        //       <meta property="og:image" content={seoData.imageUrl} />
        //     }
        //     {seoData.imageUrl && 
        //       <meta property="og:image:secure_url" content={seoData.imageUrl} />
        //     }
        //     {seoData.imageUrl && 
        //       <meta property="og:image:alt" content={`Image de ${seoData.productName}`} />
        //     }
        //     {seoData.imageUrl && 
        //       <meta property="og:image:width" content="1200" />
        //     }
        //     {seoData.imageUrl && 
        //       <meta property="og:image:height" content="630" />
        //     }
    
        //     {/* Twitter Card Data */}
        //     <meta name="twitter:card" content="summary_large_image" />
        //     <meta name="twitter:url" content={seoData.canonicalUrl} />
        //     <meta name="twitter:title" content={`${seoData.productName} | Acheter en ligne`} />
        //     <meta name="twitter:description" content={seoData.metaDescription} />
        //     {seoData.imageUrl && <meta name="twitter:image" content={seoData.imageUrl} />}
        //     {/* <meta name="twitter:site" content="@VotreTwitterHandle" /> Optional */}
        //     {/* <meta name="twitter:creator" content="@VotreTwitterHandle" /> Optional */}
    
        //     {/* Open Graph Product Specific */}
        //     <meta property="product:brand" content={seoData.productName || META_SITE_NAME} />
        //     <meta property="product:availability" content="in stock" /> {/* Or "out of stock", "preorder" */}
        //     <meta property="product:condition" content="new" />
        //     <meta property="product:price:amount" content={String(seoData.productPrice)} />
        //     <meta property="product:price:currency" content={seoData.currency} />
        //     {seoData.productBarredPrice && (
        //       <meta
        //         property="product:original_price:amount"
        //         content={String(seoData.productBarredPrice)}
        //       />
        //     )}
        //   </Helmet>
    
        //   <script type="application/ld+json">
        //     {JSON.stringify({
        //       "@context": "https://schema.org",
        //       "@type": "Product",
        //       name: seoData.productName,
        //       image: seoData.imageUrl || undefined, // Omit if no image
        //       description: seoData.productDescription,
        //       brand: {
        //         "@type": "Brand",
        //         name: seoData.productName || META_SITE_NAME, // Or a specific brand name if available
        //       },
        //       offers: {
        //         "@type": "Offer",
        //         url: seoData.canonicalUrl,
        //         priceCurrency: seoData.currency,
        //         price: seoData.productPrice,
        //         priceValidUntil: priceValidUntil, // Use a real date if available
        //         itemCondition: "https://schema.org/NewCondition",
        //         availability: "https://schema.org/InStock", // Match product:availability
        //         ...(seoData.productBarredPrice && { // Add discount info only if applicable
        //           priceSpecification: {
        //             "@type": "PriceSpecification",
        //             price: seoData.productBarredPrice,
        //             priceCurrency: seoData.currency,
        //             valueAddedTaxIncluded: true, // Assuming VAT is included
        //           },
        //           // Consider adding discount information if significant
        //           // "hasMerchantReturnPolicy": { ... } // If you have a clear return policy
        //         }),
        //       },
        //       sku: seoData.productId || undefined, // Stock Keeping Unit
        //       // mpn: seoData.productId, // Manufacturer Part Number (if applicable)
        //       aggregateRating: {
        //         "@type": "AggregateRating",
        //         ratingValue: seoData.rating,
        //         reviewCount: seoData.commentCount,
        //       },
        //       // "review": [ { "@type": "Review", "author": "...", "reviewBody": "..." } ] // Could add a few top reviews
        //     })}
        //   </script>