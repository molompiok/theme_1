import React, {
  useState,
  useEffect,
  FormEvent,
  JSX,
  Suspense,
  useRef,
} from "react";
import { BsSearch, BsGeoAlt, BsTrash } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi"; // Simplifié les icônes
import { CiDeliveryTruck } from "react-icons/ci";
import { FaMapMarkerAlt } from "react-icons/fa"; // Icône pour suggestions
import axios from "axios";
import Loading from "../Loading";
import { useGeolocationWithIP } from "../../hook/useGeolocationWithIP";
import { useAuthStore } from "../../store/user";
import {
  create_user_address,
  delete_user_address,
  update_user_address,
} from "../../api/user.api";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "../../utils";

interface Address {
  id?: string;
  text: string;
  subtitle: string;
  lat: number | null;
  lng: number | null;
}

interface SuggestionItem {
  display_name: string;
  lat: string;
  lon: string;
}

// Géocodage avec Nominatim (inchangé)
const getCoordinates = async (
  address: string,
  fallbackText?: string
): Promise<Address | null> => {
  const addressToGeocode = address.toLowerCase().includes("côte d'ivoire")
    ? address
    : `${address}, Côte d'Ivoire`;
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        addressToGeocode
      )}&format=json&addressdetails=1&limit=1&countrycodes=ci`
    );
    const result = response.data[0];
    if (result) {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      const text = result.display_name || fallbackText || address;
      const subtitle = result.address?.city || result.address?.suburb || "";
      return { text, subtitle, lat, lng };
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      console.error("Trop de requêtes à Nominatim. Veuillez réessayer plus tard.");
      return null;
    }
    console.error("Erreur de géocodage :", error);
    return null;
  }
};

// Géocodage inverse avec Nominatim (inchangé)
const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<Address | null> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
    );
    const result = response.data;
    if (result) {
      const text = result.display_name;
      const subtitle = result.address?.city || result.address?.suburb || "";
      return { text, subtitle, lat, lng };
    }
    return null;
  } catch (error) {
    console.error("Erreur de géocodage inverse :", error);
    return null;
  }
};

// Suggestions avec Nominatim (inchangé)
const getSuggestions = async (query: string): Promise<SuggestionItem[]> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=15&countrycodes=ci`
    );
    return response.data.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des suggestions :", error);
    return [];
  }
};

const highlightText = (text: string): JSX.Element => {
  return <span className="truncate">{text}</span>; // Troncature pour longues suggestions
};

// Composant Map avec améliorations UX
const MapComponent = React.lazy(async () => {
  if (typeof window === "undefined") {
    return { default: () => <div>Chargement de la carte...</div> };
  }
  const L = await import("leaflet");
  await import("leaflet/dist/leaflet.css");
  return {
    default: ({ mapHeight, address, userPosition, onAddressChange }: any) => {
      const mapRef = useRef<any>(null);
      const markerRef = useRef<any>(null);
      const mapContainerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current).setView(
          address.lat && address.lng
            ? [address.lat, address.lng]
            : userPosition
              ? [userPosition.lat, userPosition.lng]
              : [5.3167, -4.0305],
          17
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        const marker = L.marker(
          address.lat && address.lng
            ? [address.lat, address.lng]
            : userPosition
              ? [userPosition.lat, userPosition.lng]
              : [5.3167, -4.0305],
          { draggable: true, title: "Déplacez-moi pour ajuster" }
        ).addTo(map);

        // Popup dynamique
        marker.bindPopup(
          address.text
            ? `LIVRAISON ICI : ${address.text}`
            : "C'est ici qu'on vous livrera"
        ).openPopup();

        marker.on("dragend", async (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          const newAddress = await reverseGeocode(lat, lng);
          if (newAddress) onAddressChange(newAddress);
        });

        mapRef.current = map;
        markerRef.current = marker;

        if (address.lat && address.lng) {
          map.setView([address.lat, address.lng], 17, {
            animate: true,
            duration: 1,
          });
        }

        return () => {
          if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
          }
        };
      }, [address, userPosition]);

      return <div ref={mapContainerRef} style={{ height: mapHeight, width: "100%", zIndex: 1 }} />;
    },
  };
});

export const AddressSelector: React.FC<{ mapHeight: string }> = ({
  mapHeight = "300px",
}) => {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [address, setAddress] = useState<Address>(() => {
    const userAddress = user?.addresses?.[0];
    return {
      id: userAddress?.id,
      text: userAddress?.name?.split("/")[0] ?? userAddress?.name ?? "",
      subtitle: userAddress?.name?.split("/")[1] ?? "",
      lat: userAddress?.latitude ? parseFloat(userAddress.latitude) : null,
      lng: userAddress?.longitude ? parseFloat(userAddress.longitude) : null,
    };
  });
  const [searchInput, setSearchInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState<boolean>(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const { userPosition, setMapCenter } = useGeolocationWithIP();

  const createUserAddressMutation = useMutation({
    mutationFn: create_user_address,
    onSuccess: (newAddress) => {
      fetchUser();
      setAddress({ ...address, id: newAddress?.id });
      setMessage({ type: "success", text: "Adresse créée avec succès !" });
      setTimeout(() => setMessage(null), 7000);
    },
    onError: () => {
      setMessage({ type: "error", text: "Erreur lors de la création." });
      setTimeout(() => setMessage(null), 7000);
    },
  });

  const updateUserAddressMutation = useMutation({
    mutationFn: update_user_address,
    onSuccess: () => {
      fetchUser();
      setMessage({ type: "success", text: "Adresse mise à jour !" });
      setTimeout(() => setMessage(null), 7000);
    },
    onError: () => {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour." });
      setTimeout(() => setMessage(null), 7000);
    },
  });

  const deleteUserAddressMutation = useMutation({
    mutationFn: delete_user_address,
    onSuccess: () => {
      fetchUser();
      setAddress({ text: "", subtitle: "", lat: null, lng: null });
      setMessage({ type: "success", text: "Adresse supprimée !" });
      setTimeout(() => setMessage(null), 7000);
    },
    onError: () => {
      setMessage({ type: "error", text: "Erreur lors de la suppression." });
      setTimeout(() => setMessage(null), 7000);
    },
  });

  const fetchSuggestions = debounce(async () => {
    if (searchInput.trim().length > 2) {
      setIsLoading(true);
      const results = await getSuggestions(searchInput);
      setSuggestions(results);
      setIsSuggestionOpen(true);
      setIsLoading(false);
    } else {
      setSuggestions([]);
      setIsSuggestionOpen(false);
    }
  }, 1090);

  useEffect(() => {
    fetchSuggestions();
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveAddress = async (newAddress: Address | null) => {
    if (!newAddress) {
      if (address?.id) deleteUserAddressMutation.mutate({ id: address.id });
      return;
    }
    const addressData = {
      name: `${newAddress.text}/${newAddress.subtitle}`,
      longitude: newAddress.lng?.toString() || "",
      latitude: newAddress.lat?.toString() || "",
      ...(address?.id && { id: address.id }),
    };
    if (address?.id) {
      // @ts-ignore
      updateUserAddressMutation.mutate(addressData);
    } else {
      const { id, ...createAddressData } = addressData;
      createUserAddressMutation.mutate(createAddressData);
    }
    setAddress({ ...newAddress, id: address?.id || newAddress?.id });
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setMessage({ type: "error", text: "Entrez une adresse valide." });
      setTimeout(() => setMessage(null), 7000);
      return;
    }
    setIsGeocoding(true);
    const coords = await getCoordinates(searchInput);
    if (coords) {
      setAddress(coords);
      saveAddress(coords);
      setSearchInput("");
      setSuggestions([]);
      setIsSuggestionOpen(false);
    } else {
      setMessage({ type: "error", text: "Adresse introuvable ou indisponible." });
      setTimeout(() => setMessage(null), 7000);
    }
    setIsGeocoding(false);
  };

  const handleSuggestionClick = async (suggestion: SuggestionItem) => {
    setIsGeocoding(true);
    const coords = {
      text: suggestion.display_name,
      subtitle: "",
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    };
    setAddress(coords);
    saveAddress(coords);
    setSearchInput("");
    setSuggestions([]);
    setIsSuggestionOpen(false);
    setIsGeocoding(false);
  };

  const handleAddressChange = (newAddress: Address) => {
    setAddress(newAddress);
    saveAddress(newAddress);
  };

  const handleDelete = () => {
    if (address?.id) deleteUserAddressMutation.mutate({ id: address.id });
  };

  const handleReturnToUserPosition = async () => {
    if (userPosition) {
      setIsGeocoding(true);
      const newAddress = await reverseGeocode(userPosition.lat, userPosition.lng);
      if (newAddress) {
        setAddress(newAddress);
        setMapCenter([userPosition.lat, userPosition.lng]);
        saveAddress(newAddress);
      } else {
        setMessage({ type: "error", text: "Position introuvable." });
        setTimeout(() => setMessage(null), 7000);
      }
      setIsGeocoding(false);
    }
  };

  return (
    <section className="w-full p-4 bg-gray-50 rounded-lg shadow-sm relative">
      <div className="mb-4 flex items-center gap-2">
        <CiDeliveryTruck className="text-2xl text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Adresse de livraison</h2>

      </div>
        <span className="text-sm text-gray-600 italic">Vous pouvez deplacer le marqueur pour changer l'adresse de livraison</span>

      <form onSubmit={handleSearch} className="relative mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1 relative">
            <label htmlFor="address-search" className="sr-only">
              Rechercher une adresse
            </label>
            <input
              id="address-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={address?.text ? "Modifier l'adresse de livraison" : "Rechercher une adresse de livraison"}
              className={`w-full p-3 text-sm border rounded-md focus:ring-2 focus:outline-none transition-all duration-200 ${isGeocoding
                  ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                  : "border-gray-300 focus:ring-gray-500"
                }`}
              disabled={isGeocoding}
              aria-disabled={isGeocoding}
            />

          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || isGeocoding}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              aria-label={address?.text ? "Modifier l'adresse" : "Ajouter une adresse"}
            >
              {isLoading ? (
                <Loading size="small" />
              ) : (
                <>
                  <BsSearch size={16} />
                  {address?.text ? "Modifier" : "Ajouter"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReturnToUserPosition}
              disabled={isGeocoding || !userPosition}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              aria-label="Utiliser ma position actuelle"
            >
              <BsGeoAlt size={16} />
              <span className="hidden md:inline">Ma position</span>
            </button>
          </div>
        </div>
        {isSuggestionOpen && suggestions.length > 0 && (
          <div
            ref={suggestionRef}
            className="absolute z-50 w-full bg-white border border-gray-200 rounded-md mt-2 shadow-lg max-h-60 overflow-y-auto animate-fade-in"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2"
              >
                <FaMapMarkerAlt className="text-gray-500" size={14} />
                <div className="font-medium truncate">{highlightText(suggestion.display_name)}</div>
              </div>
            ))}
          </div>
        )}
      </form>
      {address?.text ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className=" font-bold text-gray-900 break-words">{address.text}</p>
              {address.subtitle && (
                <p className=" text-gray-600 font-semibold break-words">{address.subtitle}</p>
              )}
              <p className="text-xs text-gray-500">
                Lat: {address.lat?.toFixed(6) || "N/A"}, Lng: {address.lng?.toFixed(6) || "N/A"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSearchInput(address.text)}
                className="p-2 text-gray-600 hover:text-gray-600 transition-colors"
                aria-label="Modifier l'adresse"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                aria-label="Supprimer l'adresse"
              >
                <BsTrash size={18} />
              </button>
            </div>
          </div>
          <Suspense fallback={<Loading size="medium" />}>
            <MapComponent
              mapHeight={mapHeight}
              address={address}
              userPosition={userPosition}
              onAddressChange={handleAddressChange}
            />
          </Suspense>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p className="text-sm mb-4">Définissez une adresse de livraison.</p>
          <Suspense fallback={<Loading size="medium" />}>
            <MapComponent
              mapHeight={mapHeight}
              address={address}
              userPosition={userPosition}
              onAddressChange={handleAddressChange}
            />
          </Suspense>
        </div>
      )}

      {message && (
        <div
          className={`mt-4 p-3 text-sm text-center rounded-md animate-fade-in ${message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {message.text}
        </div>
      )}

      {(isGeocoding ||
        createUserAddressMutation.isPending ||
        updateUserAddressMutation.isPending ||
        deleteUserAddressMutation.isPending) && (
          <div className="absolute top-[40%] inset-x-0 bg-transparent bg-opacity-50 flex items-center justify-center z-20">
            <Loading size="large" />
          </div>
        )}
    </section>
  );
};

export default AddressSelector;