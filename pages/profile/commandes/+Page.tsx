import { BsCartCheck } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../component/Popover";
import clsx from "clsx";
import { useAuthRedirect } from "../../../hook/authRedirect";

// Define the order type
type Order = {
  views: string[];
  name: string;
  features: { [key: string]: string };
  description: string;
  quantity: number;
  price_unit: number;
  currency: string;
  status: "DELIVERED" | "RETURN";
};

// Generate fake orders
const generateFakeOrders = (): Order[] => {
  const products = [
    {
      name: "T-shirt Classique",
      features: { size: "M", color: "Noir" } as { [key: string]: string },
      description: "T-shirt en coton confortable pour un usage quotidien",
      price: 1999,
    },
    {
      name: "Jean Slim",
      features: { size: "32", color: "Bleu Foncé" } as { [key: string]: string },
      description: "Jean slim ajusté avec couture renforcée",
      price: 49545,
    },
    {
      name: "Chaussures de Sport",
      features: { size: "42", color: "Blanc" } as { [key: string]: string },
      description: "Chaussures légères pour course et fitness",
      price: 7900,
    },
    {
      name: "Sac à Dos",
      features: { capacity: "20L", color: "Gris" } as { [key: string]: string },
      description: "Sac à dos imperméable pour randonnée",
      price: 3999000,
    },
    {
      name: "Montre Analogique",
      features: { material: "Acier", color: "Argent" } as { [key: string]: string },
      description: "Montre élégante avec cadran minimaliste",
      price: 914599,
    },
  ];

  return Array.from({ length: 5 }, (_, index) => {
    const product = products[index % products.length];
    return {
      views: ['/img/imgP1.jpg', '/img/imgP2.png', '/img/imgP3.png'],
      name: `${product.name} #${index + 1}`,
      features: { ...product.features },
      description: product.description,
      quantity: Math.floor(Math.random() * 3) + 1,
      price_unit: product.price,
      currency: "CFA",
      status: Math.random() > 0.3 ? "DELIVERED" : "RETURN",
    };
  });
};

export default function Page() {
  useAuthRedirect();

  const productCommands = generateFakeOrders();
  const sortOptions = [
    "Plus récent",
    "Plus ancien",
    "Mieux noté",
    "Prix élevé",
    "Prix bas",
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <BsCartCheck className="text-4xl sm:text-5xl text-black" />
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Mes commandes
            </h1>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-black rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-black">
                  Filtrer par
                </span>
                <span className="text-sm text-black">Plus récents</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="z-20 w-48 p-0">
              <div className="bg-white border border-black rounded-lg shadow-lg py-2">
                {sortOptions.map((sort, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 capitalize transition-colors"
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-6">
          {productCommands.map((pCommand, index) => (
            <div
              key={index}
              className="bg-white border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={pCommand.views[0]}
                    alt={pCommand.name}
                    className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-black mb-2">
                    {pCommand.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Object.entries(pCommand.features).map(([key, value]) => (
                      <span
                        key={key}
                        className="text-sm text-black bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-black/80 line-clamp-2">
                    {pCommand.description}
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-48">
                  <div className="text-sm text-black">
                    <span>
                      {pCommand.quantity} x {pCommand.price_unit}
                      {pCommand.currency}
                    </span>
                    <span className="font-semibold ml-2">
                      = {(pCommand.quantity * pCommand.price_unit).toFixed(2)}
                      {pCommand.currency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        {
                          "bg-green-500 text-white":
                            pCommand.status === "DELIVERED",
                          "bg-red-500   text-white":
                            pCommand.status === "RETURN",
                        }
                      )}
                    >
                      {pCommand.status === "RETURN"
                        ? "Produit retourné"
                        : "Produit livré"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {productCommands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-black text-lg">
              Aucune commande pour le moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}