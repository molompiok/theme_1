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
// interface CategoryType {
//   id: string;
//   store_id: string;
//   parent_category_id: string | null;
//   name: string;
//   description: string | null;
//   view: any[];
//   icon: any[];
// }
// const categoriesData: CategoryType[] = [
//   // Électronique
//   {
//     id: "1",
//     store_id: "store-1",
//     parent_category_id: null,
//     name: "Électronique",
//     description: "Appareils électroniques et accessoires",
//     view: [],
//     icon: ["📱", "💻", "🎧"],
//   },
//   {
//     id: "2",
//     store_id: "store-1",
//     parent_category_id: "1",
//     name: "Smartphones",
//     description: "Téléphones intelligents de toutes marques",
//     view: [],
//     icon: ["📱"],
//   },
//   {
//     id: "3",
//     store_id: "store-1",
//     parent_category_id: "1",
//     name: "Ordinateurs & Accessoires",
//     description: "PC portables, de bureau et accessoires informatiques",
//     view: [],
//     icon: ["💻"],
//   },
//   {
//     id: "4",
//     store_id: "store-1",
//     parent_category_id: "1",
//     name: "Audio & Casques",
//     description: "Casques, écouteurs et enceintes Bluetooth",
//     view: [],
//     icon: ["🎧"],
//   },

//   // Mode & Vêtements
//   {
//     id: "5",
//     store_id: "store-1",
//     parent_category_id: null,
//     name: "Mode",
//     description: "Vêtements, chaussures et accessoires",
//     view: [],
//     icon: ["👗", "👞"],
//   },
//   {
//     id: "85",
//     store_id: "store-1",
//     parent_category_id: "6",
//     name: "Modine",
//     description: "Vêtements, chaussures et accessoires",
//     view: [],
//     icon: ["👗", "👞"],
//   },
//   {
//     id: "6",
//     store_id: "store-1",
//     parent_category_id: "5",
//     name: "Vêtements Homme",
//     description: "T-shirts, pantalons, vestes et plus",
//     view: [],
//     icon: ["👕"],
//   },
//   {
//     id: "7",
//     store_id: "store-1",
//     parent_category_id: "5",
//     name: "Vêtements Femme",
//     description: "Robes, tops, pantalons et accessoires",
//     view: [],
//     icon: ["👗"],
//   },
//   {
//     id: "8",
//     store_id: "store-1",
//     parent_category_id: "5",
//     name: "Chaussures",
//     description: "Baskets, sandales, bottes pour toutes occasions",
//     view: [],
//     icon: ["👞", "👠"],
//   },

//   // Maison & Cuisine
//   {
//     id: "9",
//     store_id: "store-1",
//     parent_category_id: null,
//     name: "Maison & Cuisine",
//     description: "Équipements pour la maison, cuisine et décoration",
//     view: [],
//     icon: ["🏡", "🍽️"],
//   },
//   {
//     id: "10",
//     store_id: "store-1",
//     parent_category_id: "9",
//     name: "Électroménager",
//     description: "Réfrigérateurs, machines à laver, micro-ondes et plus",
//     view: [],
//     icon: ["⚡", "🍳"],
//   },
//   {
//     id: "11",
//     store_id: "store-1",
//     parent_category_id: "9",
//     name: "Meubles",
//     description: "Canapés, tables, chaises et rangements",
//     view: [],
//     icon: ["🛋️"],
//   },

//   // Sport & Loisirs
//   {
//     id: "12",
//     store_id: "store-1",
//     parent_category_id: null,
//     name: "Sport & Loisirs",
//     description: "Équipements de sport, jeux et loisirs extérieurs",
//     view: [],
//     icon: ["⚽", "🏋️"],
//   },
//   {
//     id: "13",
//     store_id: "store-1",
//     parent_category_id: "12",
//     name: "Fitness & Musculation",
//     description: "Tapis de yoga, haltères, équipements de gym",
//     view: [],
//     icon: ["🏋️"],
//   },
//   {
//     id: "14",
//     store_id: "store-1",
//     parent_category_id: "12",
//     name: "Camping & Randonnée",
//     description: "Tentes, sacs de couchage, lampes torches et plus",
//     view: [],
//     icon: ["🏕️"],
//   },

//   // Beauté & Santé
//   {
//     id: "15",
//     store_id: "store-1",
//     parent_category_id: null,
//     name: "Beauté & Santé",
//     description: "Produits de soin, cosmétiques et santé",
//     view: [],
//     icon: ["💄", "🧴"],
//   },
//   {
//     id: "16",
//     store_id: "store-1",
//     parent_category_id: "15",
//     name: "Maquillage",
//     description: "Rouges à lèvres, fonds de teint, mascaras et plus",
//     view: [],
//     icon: ["💄"],
//   },
//   {
//     id: "17",
//     store_id: "store-1",
//     parent_category_id: "15",
//     name: "Soins de la peau",
//     description: "Crèmes hydratantes, masques et soins anti-âge",
//     view: [],
//     icon: ["🧴"],
//   },

//   // Bébé & Enfants
//   {
//     id: "18",
//     store_id: "store-1",
//     parent_category_id: null,
//     name: "Bébé & Enfants",
//     description: "Jouets, vêtements et accessoires pour bébés et enfants",
//     view: [],
//     icon: ["🍼", "🧸"],
//   },
//   {
//     id: "19",
//     store_id: "store-1",
//     parent_category_id: "18",
//     name: "Jouets",
//     description: "Jeux éducatifs, peluches, LEGO et plus",
//     view: [],
//     icon: ["🧸"],
//   },
//   {
//     id: "20",
//     store_id: "store-1",
//     parent_category_id: "18",
//     name: "Vêtements pour bébés",
//     description: "Pyjamas, ensembles, chaussons et plus",
//     view: [],
//     icon: ["👶"],
//   },
// ];

//  export const CommentsProduct = [
//   {
//     id: 1,
//     user: {
//       name: "albert camason",
//       photo: [],
//     },
//     product: {
//       name: "samsumg ia",
//       feature: "size : XL; color: red",
//     },
//     note: 5,
//     title: "Great Shoe for Travel",
//     description:
//       "I needed a new pair of Allbirds for an upcoming trip to Thailand. I wanted something that I could wear with dresses to temples (and slip on/off easily since you have to take your shoes off) or while I was walking from place to place. These are perfect! They are incredibly comfortable, lightweight and look great with either our casual dress or jeans.",
//   },
//   {
//     id: 2,
//     user: {
//       name: "albert camason",
//       photo: [],
//     },
//     product: {
//       name: "iphone ia",
//       feature: "size : XL; color: red",
//     },
//     note: 5,
//     title: "Comfy, Breathable and made with natural materials 👍",
//     description:
//       "Lately, I’ve been all about comfort and a healthier lifestyle, and the Tree Gliders have been my go-to sneakers. I got them in my usual size 7. 5, and they fit true to size with a slightly wider toe box than my other sneakers. They’re super lightweight and breathable, keeping my feet cool whether I’m at yoga or out running errands. Plus, they’re made with sustainable materials like recycled polyester laces and a lyocell upper. If you’re looking for comfy, everyday sneakers that are also eco-friendly, these are definitely worth checking out!",
//   },
// ];
// /*********
//  * 1- refait le group * 
//  * 2- terminer page profile *
//  * 3- page paymemt
//  * 4-Db for countries
//  * 5- filter
//  * 6- About
//  * 7- parametre
//  */
//    // adresse - name - numero telephone



//   import React, { useState } from "react";
//   import Modal from "./Modal";
//   import { useModalAuth } from "../../store/user";
//   // import GoogleAuthButton from "../Auth/GoogleAuthButton";
//   import { twMerge } from "tailwind-merge";
//   import { BsX } from "react-icons/bs";
//   import { navigate } from "vike/client/router";
//   import { BASE_URL } from "../../api";
//   import { FcGoogle } from "react-icons/fc";
//   import { googleLogin } from "../../utils";
  
//   export default function ModalAuth() {
//     const { close, isOpen, message, type } = useModalAuth((state) => state);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
  
//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setError(null);
//       setIsSubmitting(true);
  
//       if (type === "register" && password !== confirmPassword) {
//         setError("Les mots de passe ne correspondent pas.");
//         setIsSubmitting(false);
//         return;
//       }
  
//       try {
//         close();
//       } catch (err) {
//         setError("Une erreur est survenue. Veuillez réessayer.");
//       } finally {
//         setIsSubmitting(false);
//       }
//     };
  
//     const handleModalClose = () => {
//       close();
//       document.body.style.overflow = "auto";
//     };
  
//     return (
//       <Modal
//         styleContainer="flex items-end min-[500px]:items-center justify-center select-none size-full"
//         zIndex={100}
//         setHide={handleModalClose}
//         isOpen={isOpen}
//         animationName="translateBottom"
//       >
//         <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg max-h-[80dvh] md:max-w-[600px] overflow-auto">
//           <button
//             onClick={handleModalClose}
//             className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-800"
//             aria-label="Fermer la fenêtre"
//           >
//             <BsX size={24} />
//           </button>
  
//           <h2 className="text-xl font-semibold text-center mb-2">
//             {type === "login" ? "Connexion" : "Créer un compte"}
//           </h2>
//           <p className="text-sm text-gray-600 text-center mb-5">{message}</p>
//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             <div className="flex flex-col gap-1">
//               <label htmlFor="email" className="text-sm font-medium">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
//                 required
//               />
//             </div>
  
//             <div className="flex flex-col gap-1">
//               <label htmlFor="password" className="text-sm font-medium">
//                 Mot de passe
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="Mot de passe"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
//                 required
//               />
//             </div>
  
//             {type === "register" && (
//               <div className="flex flex-col gap-1">
//                 <label htmlFor="confirm-password" className="text-sm font-medium">
//                   Confirmer le mot de passe
//                 </label>
//                 <input
//                   id="confirm-password"
//                   type="password"
//                   placeholder="Confirmation mot de passe"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
//                   required
//                 />
//               </div>
//             )}
  
//             {error && <p className="text-sm text-red-500 text-center">{error}</p>}
  
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={twMerge(
//                 "w-full py-2.5 bg-black/70 text-white rounded-md transition-colors duration-300",
//                 isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-black"
//               )}
//             >
//               {isSubmitting
//                 ? "Chargement..."
//                 : type === "login"
//                 ? "Se connecter"
//                 : "S'inscrire"}
//             </button>
//           </form>
  
//           {type === "login" && (
//             <p className="text-center mt-3 text-sm">
//               <button className="text-black underline hover:text-gray-700">
//                 Mot de passe oublié ?
//               </button>
//             </p>
//           )}
  
//           <div className="relative flex items-center my-4">
//             <span className="w-full border-t border-gray-300"></span>
//             <span className="px-2 text-sm text-gray-500">OU</span>
//             <span className="w-full border-t border-gray-300"></span>
//           </div>
//           <div className="w-full flex justify-center">
//             <button
//               onClick={googleLogin}
//               className="flex items-center gap-3 px-6 py-2 rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 bg-white hover:bg-gray-50"
//             >
//               <FcGoogle size={20} />
//               <span className="text-sm font-medium text-gray-700">
//                 Continuer avec Google
//               </span>
//             </button>
//           </div>
  
//           <p className="text-center mt-4 text-sm">
//             {type === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
//             <button
//               className="text-black font-medium hover:underline"
//               onClick={() =>
//                 useModalAuth
//                   .getState()
//                   .open(type === "login" ? "register" : "login")
//               }
//             >
//               {type === "login" ? "S'inscrire" : "Se connecter"}
//             </button>
//           </p>
//         </div>
//       </Modal>
//     );
//   }
  