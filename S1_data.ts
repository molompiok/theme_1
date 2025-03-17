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
 * 2- terminer page profile
 * 3- page paymemt
 * 4-Db for countries
 * 5- filter
 * 6- About
 * 7- parametre
 * 
 */


   



  // const renderSection = (
  //   title: string,
  //   data: string[],
  //   type: "number"
  // ): JSX.Element => {
  //   const inputRef = numberInputRef;
  //   const setter = setNumbers;
  //   const currentItems = numbers;
  //   return (
  //     <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mt-6 w-full">
  //       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
  //         <h2 className="text-xl sm:text-2xl font-semibold text-black">
  //           {title} ({data.length}/2)
  //         </h2>
  //         <form
  //           onSubmit={(e) => handleAddItem(e, inputRef, setter, currentItems)}
  //           className="flex w-full sm:w-auto gap-2"
  //         >
  //           <select
  //             value={selectedCountry.code}
  //             onChange={(e) =>
  //               setSelectedCountry(
  //                 countries.find((c) => c.code === e.target.value)!
  //               )
  //             }
  //             className="px-2 py-2 border border-black rounded-lg"
  //           >
  //             {countries.map((country) => (
  //               <option key={country.code} value={country.code}>
  //                 {country.name} ({country.code})
  //               </option>
  //             ))}
  //           </select>
  //           <IMaskInput
  //             mask={selectedCountry.mask}
  //             inputRef={numberInputRef as React.RefObject<HTMLInputElement>}
  //             disabled={data.length >= 2}
  //             placeholder={selectedCountry.mask.replace(/0/g, "X")}
  //             className="flex-1 sm:flex-none w-full sm:w-64 px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
  //           />
  //           <button
  //             type="submit"
  //             className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
  //             disabled={data.length >= 2}
  //           >
  //             Ajouter
  //           </button>
  //         </form>
  //       </div>
  //       {phoneError && <p className="text-red-500 mb-4">{phoneError}</p>}
  //       <div className="space-y-4">
  //         {data.map((item, i) => (
  //           <div
  //             key={i}
  //             className="border-b border-gray-200 pb-4 last:border-b-0"
  //           >
  //             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
  //               <div className="flex-1">
  //                 <h3 className="text-black text-sm font-medium">
  //                   {title} {i + 1}
  //                 </h3>
  //                 {editState.type === type && editState.index === i ? (
  //                   <form
  //                     onSubmit={handleEditSubmit}
  //                     className="flex flex-col sm:flex-row gap-2 mt-2"
  //                   >
  //                     <IMaskInput
  //                       mask={selectedCountry.mask}
  //                       value={editState.value}
  //                       onChange={handleEditChange}
  //                       autoFocus
  //                       className="flex-1 px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
  //                     />
  //                     <div className="flex gap-2">
  //                       <button
  //                         type="submit"
  //                         className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
  //                       >
  //                         Sauvegarder
  //                       </button>
  //                       <button
  //                         type="button"
  //                         className="bg-white hover:bg-gray-100 text-black border border-black px-4 py-2 rounded-lg transition-colors"
  //                         onClick={handleEditCancel}
  //                       >
  //                         Annuler
  //                       </button>
  //                     </div>
  //                   </form>
  //                 ) : (
  //                   <p className="text-black mt-1 break-words">{item}</p>
  //                 )}
  //               </div>
  //               <div className="flex gap-3">
  //                 <button
  //                   onClick={() => handleEditStart(type, i, item)}
  //                   className="text-black hover:text-gray-600 p-1"
  //                   aria-label="Edit"
  //                 >
  //                   <FiEdit2 size={18} />
  //                 </button>
  //                 <button
  //                   onClick={() => handleDeleteItem(i, setter)}
  //                   className="text-black hover:text-gray-600 p-1"
  //                   aria-label="Delete"
  //                 >
  //                   <BsTrash size={20} />
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </section>
  //   );
  // };

  // const renderPersonalInfo = (): JSX.Element => {
  //   return (
  //     <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
  //       <div className="space-y-4">
  //         <div>
  //           <div className="flex justify-between items-center mb-2">
  //             <label className="text-black text-sm font-medium">
  //               Nom complet
  //             </label>
  //             {editState.type !== "fullName" && (
  //               <button
  //                 onClick={() => handleEditStart("fullName", null, fullName)}
  //                 className="text-black hover:text-gray-600 p-1"
  //                 aria-label="Edit"
  //               >
  //                 <FiEdit2 size={18} />
  //               </button>
  //             )}
  //           </div>
  //           {editState.type === "fullName" ? (
  //             <form
  //               onSubmit={handleEditSubmit}
  //               className="flex flex-col sm:flex-row gap-2"
  //             >
  //               <input
  //                 type="text"
  //                 value={editState.value}
  //                 onChange={handleEditChange}
  //                 autoFocus
  //                 className="flex-1 px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
  //               />
  //               <div className="flex gap-2">
  //                 <button
  //                   type="submit"
  //                   className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
  //                 >
  //                   Sauvegarder
  //                 </button>
  //                 <button
  //                   type="button"
  //                   className="bg-white hover:bg-gray-100 text-black border border-black px-4 py-2 rounded-lg transition-colors"
  //                   onClick={handleEditCancel}
  //                 >
  //                   Annuler
  //                 </button>
  //               </div>
  //             </form>
  //           ) : (
  //             <p className="text-black">{fullName}</p>
  //           )}
  //         </div>
  //         <div>
  //           <label className="text-black text-sm font-medium block mb-1">
  //             Email
  //           </label>
  //           <p className="text-black">{email}</p>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // };