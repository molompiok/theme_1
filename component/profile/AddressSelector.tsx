import React, {
  useState,
  useEffect,
  FormEvent,
  JSX,
  Suspense,
  useRef,
} from "react";
import { BsSearch, BsGeoAlt, BsTrash } from "react-icons/bs";
import { FiEdit2, FiMapPin } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import axios, { AxiosInstance } from "axios";
import { useGeolocationWithIP } from "../../hook/useGeolocationWithIP";
import { useAuthStore } from "../../store/user";
import {
  create_user_address,
  delete_user_address,
  update_user_address,
} from "../../api/user.api";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "../../utils";
import { usePageContext } from "vike-react/usePageContext";

export const nominatim_url = import.meta.env.VITE_NOMINATIM_URL;

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

// Fonctions de géocodage inchangées
const getCoordinates = async (
  address: string,
  fallbackText?: string
): Promise<Address | null> => {
  try {
    const response = await axios.get(
      `${nominatim_url}/search?q=${encodeURIComponent(
        address
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
      console.error(
        "Trop de requêtes à Nominatim. Veuillez réessayer plus tard."
      );
      return null;
    }
    console.error("Erreur de géocodage :", error);
    return null;
  }
};

export const reverseGeocode = async (
  lat: number,
  lng: number,
  api: AxiosInstance
): Promise<Address | null> => {
  try {
    const response = await api.get("/api/reverse", {
      params: {
        lat,
        lon: lng, // attention à bien envoyer `lon` et non `lng`
      },
    });

    const result = response?.data;

    if (result && result.display_name) {
      const text = result.display_name;
      const subtitle = result.address?.city || result.address?.suburb || "";
      return { text, subtitle, lat, lng };
    }

    return null;
  } catch (error) {
    console.error("Erreur reverseGeocode côté client :", error);
    return null;
  }
};

const getSuggestions = async (query: string): Promise<SuggestionItem[]> => {
  try {
    const response = await axios.get(
      `${nominatim_url}/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=10&countrycodes=ci`
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

const highlightText = (text: string, query: string): JSX.Element => {
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span className="truncate">
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <strong
            key={i}
            className="font-semibold text-blue-400 underline bg-blue-50 px-1 rounded"
          >
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </span>
  );
};

// Composant Map modernisé avec icône améliorée
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
      const { api } = usePageContext();
      const mapContainerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
          zoomControl: true,
          scrollWheelZoom: false,
        }).setView(
          address.lat && address.lng
            ? [address.lat, address.lng]
            : userPosition
              ? [userPosition.lat, userPosition.lng]
              : [5.3167, -4.0305],
          17
        );

        const customIcon = L.divIcon({
          html: `
            <div class="relative flex items-center justify-center animate-bounce">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="absolute -bottom-1 w-6 h-2 bg-blue-900 opacity-20 rounded-full blur-sm"></div>
            </div>
          `,
          className: "",
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40],
        });

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {}
        ).addTo(map);

        const marker = L.marker(
          address.lat && address.lng
            ? [address.lat, address.lng]
            : userPosition
              ? [userPosition.lat, userPosition.lng]
              : [5.3167, -4.0305],
          {
            draggable: true,
            icon: customIcon,
            title: "Déplacez-moi pour ajuster l'adresse",
          }
        ).addTo(map);

        marker
          .bindPopup(
            `<div class="p-2 text-center">
              <div class="flex items-center justify-center gap-2 mb-1">
                <svg class="size-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                <span class="font-semibold text-gray-900">Lieu de livraison</span>
              </div>
              <p class="text-sm text-gray-600">Déplacez le marqueur pour ajuster</p>
            </div>`
          )
          .openPopup();

        marker.on("dragend", async (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          const newAddress = await reverseGeocode(lat, lng, api);
          if (newAddress) onAddressChange(newAddress);
        });

        mapRef.current = map;
        markerRef.current = marker;

        if (address.lat && address.lng) {
          map.setView([address.lat, address.lng], 17, {
            animate: true,
            duration: 0.5,
          });
        }

        return () => {
          if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
          }
        };
      }, [address, userPosition]);

      return (
        <div
          ref={mapContainerRef}
          style={{ height: mapHeight, width: "100%" }}
          className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 z-10"
          role="region"
          aria-label="Carte interactive pour sélectionner l'adresse de livraison"
        />
      );
    },
  };
});

export const AddressSelector: React.FC<{ mapHeight: string }> = ({
  mapHeight = "350px",
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
  const [searchInput, setSearchInput] = useState<string>(address?.text || "");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState<boolean>(false);
  const { api } = usePageContext();
  const suggestionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { userPosition, setMapCenter } = useGeolocationWithIP();

  const createUserAddressMutation = useMutation({
    mutationFn: (params: { name: string; longitude: string; latitude: string; }) => create_user_address(params, api),
    onSuccess: (newAddress) => {
      fetchUser(api, { token: useAuthStore.getState().token || undefined });
      setAddress({ ...address, id: newAddress?.id });
      setMessage({
        type: "success",
        text: "Adresse enregistrée avec succès !",
      });
      setTimeout(() => setMessage(null), 5000);
    },
    onError: () => {
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement." });
      setTimeout(() => setMessage(null), 5000);
    },
  });

  const updateUserAddressMutation = useMutation({
    mutationFn: (params: { name: string; longitude: string; latitude: string; id: string; }) => update_user_address(params, api),
    onSuccess: () => {
      fetchUser(api, { token: useAuthStore.getState().token || undefined });
      setMessage({
        type: "success",
        text: "Adresse mise à jour avec succès !",
      });
      setTimeout(() => setMessage(null), 5000);
    },
    onError: () => {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour." });
      setTimeout(() => setMessage(null), 5000);
    },
  });

  const deleteUserAddressMutation = useMutation({
    mutationFn: (params: { id: string; }) => delete_user_address(params, api),
    onSuccess: () => {
      fetchUser(api, { token: useAuthStore.getState().token || undefined });
      setAddress({ text: "", subtitle: "", lat: null, lng: null });
      setSearchInput("");
      setMessage({ type: "success", text: "Adresse supprimée avec succès !" });
      setTimeout(() => setMessage(null), 5000);
    },
    onError: () => {
      setMessage({ type: "error", text: "Erreur lors de la suppression." });
      setTimeout(() => setMessage(null), 5000);
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
  }, 400);

  useEffect(() => {
    fetchSuggestions();
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
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
      id: address?.id || "",
      name: `${newAddress.text}/${newAddress.subtitle}`,
      longitude: newAddress.lng?.toString() || "",
      latitude: newAddress.lat?.toString() || "",
      ...(address?.id && { id: address.id }),
    };
    if (address?.id) {
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
      setMessage({
        type: "error",
        text: "Veuillez entrer une adresse valide.",
      });
      setTimeout(() => setMessage(null), 5000);
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
      setMessage({
        type: "error",
        text: "Adresse introuvable. Essayez une autre adresse.",
      });
      setTimeout(() => setMessage(null), 5000);
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
      const newAddress = await reverseGeocode(
        userPosition.lat,
        userPosition.lng,
        api
      );
      console.log("🚀 ~ handleReturnToUserPosition ~ newAddress:", newAddress);
      if (newAddress) {
        setAddress(newAddress);
        setMapCenter([userPosition.lat, userPosition.lng]);
        saveAddress(newAddress);
      } else {
        setMessage({
          type: "error",
          text: "Impossible de récupérer votre position.",
        });
        setTimeout(() => setMessage(null), 5000);
      }
      setIsGeocoding(false);
    }
  };

  return (
    <div className="w-full bg-transparent overflow-hidden">
      <div className="bg-gradient-to-r from-slate-600 to-gray-600 sm:p-6 p-4 rounded-2xl text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <HiOutlineLocationMarker className="sm:text-2xl text-lg" />
          </div>
          <div>
            <h2 className="sm:text-xl text-base font-bold">
              Adresse de livraison
            </h2>
            <p className="text-blue-100 text-sm">
              Où souhaitez-vous être livré ?
            </p>
          </div>
        </div>
      </div>

      <div className="py-6 space-y-6">
        {/* Formulaire de recherche moderne */}
        <form onSubmit={handleSearch} className="relative">
          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="address-search"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Rechercher une adresse
              </label>
              <div className="relative group">
                <input
                  id="address-search"
                  type="text"
                  ref={searchInputRef}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={
                    address?.text
                      ? "Modifier l'adresse de livraison"
                      : "Tapez votre adresse..."
                  }
                  className={`w-full text-sm sm:text-base px-4 py-3 sm:py-4 pl-12 text-gray-900 placeholder-gray-500 bg-white border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 ${isGeocoding
                    ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                    : "border-gray-200 hover:border-gray-300 group-hover:shadow-md"
                    }`}
                  disabled={isGeocoding}
                />
                <BsSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                {isLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading || isGeocoding}
                className="flex-1 px-6 py-3 bg-gradient-to-r sm:text-base text-sm from-slate-600 to-slate-600 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-slate-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <BsSearch size={18} />
                    {address?.text ? "Modifier" : "Ajouter"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReturnToUserPosition}
                disabled={isGeocoding || !userPosition}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] flex items-center gap-2"
              >
                <BsGeoAlt size={18} />
                <span className="hidden sm:inline">Ma position</span>
              </button>
            </div>
          </div>

          {isSuggestionOpen && suggestions.length > 0 && (
            <div
              ref={suggestionRef}
              className="absolute z-50 w-full bg-white border border-gray-200 rounded-2xl mt-2 shadow-2xl max-h-64 overflow-y-auto animate-fadeIn"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <FiMapPin className="text-blue-600" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {highlightText(suggestion.display_name, searchInput)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {address?.text ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-1 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl flex-shrink-0">
                    <FaCheckCircle className="text-green-600" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                      Adresse confirmée
                    </h3>
                    <p className="text-sm sm:text-base text-gray-800 font-medium break-words leading-relaxed">
                      {address.text}
                    </p>
                    {address.subtitle && (
                      <p className="text-sm text-gray-600 font-medium mt-1">
                        {address.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 font-mono break-all">
                      📍 {address.lat?.toFixed(6) || "N/A"},{" "}
                      {address.lng?.toFixed(6) || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end sm:justify-start flex-shrink-0">
                  <button
                    onClick={() => setSearchInput(address.text)}
                    className="p-2 sm:p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-110"
                    title="Modifier l'adresse"
                  >
                    <FiEdit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 sm:p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-110"
                    title="Supprimer l'adresse"
                  >
                    <BsTrash size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <Suspense
                fallback={
                  <div className="h-64 sm:h-80 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm sm:text-base text-gray-600">
                        Chargement de la carte...
                      </p>
                    </div>
                  </div>
                }
              >
                <MapComponent
                  mapHeight={mapHeight}
                  address={address}
                  userPosition={userPosition}
                  onAddressChange={handleAddressChange}
                />
              </Suspense>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HiOutlineLocationMarker className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Définissez votre adresse
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Recherchez une adresse ou déplacez le marqueur sur la carte pour
                définir votre lieu de livraison.
              </p>
            </div>

            <div className="relative">
              <Suspense
                fallback={
                  <div className="h-80 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-600">Chargement de la carte...</p>
                    </div>
                  </div>
                }
              >
                <MapComponent
                  mapHeight={mapHeight}
                  address={address}
                  userPosition={userPosition}
                  onAddressChange={handleAddressChange}
                />
              </Suspense>
            </div>
          </div>
        )}
      </div>
      {message && (
        <div
          className={`fixed top-20 right-6 p-4 rounded-2xl shadow-2xl transition-all duration-500 transform z-50 max-w-sm ${message.type === "success"
            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
            } animate-slideIn`}
        >
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white/20 rounded-full">
              {message.type === "success" ? (
                <FaCheckCircle size={16} />
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <p className="font-medium">{message.text}</p>
          </div>
        </div>
      )}

      {(isGeocoding ||
        createUserAddressMutation.isPending ||
        updateUserAddressMutation.isPending ||
        deleteUserAddressMutation.isPending) && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Traitement en cours...</p>
            </div>
          </div>
        )}
    </div>
  );
};
