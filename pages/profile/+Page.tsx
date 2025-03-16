import React, {
  useState,
  useRef,
  FormEvent,
  ChangeEvent,
  JSX,
  Suspense,
  useEffect,
} from "react";
import { IMaskInput } from "react-imask";
import {
  BsPerson,
  BsTrash,
  BsSearch,
  BsPencil,
  BsGeoAlt,
} from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import { useAuthRedirect } from "../../hook/authRedirect";
import axios from "axios";
import { useGeolocationWithIP } from "../../hook/useGeolocationWithIP";

const YMaps = React.lazy(() =>
  import("@pbe/react-yandex-maps").then((mod) => ({ default: mod.YMaps }))
);
const Map = React.lazy(() =>
  import("@pbe/react-yandex-maps").then((mod) => ({ default: mod.Map }))
);
const Placemark = React.lazy(() =>
  import("@pbe/react-yandex-maps").then((mod) => ({ default: mod.Placemark }))
);

type EditStateType = {
  type: "address" | "number" | "fullName" | null;
  index: number | null;
  value: string;
};

const countries = [
  {
    name: "Côte d'Ivoire",
    code: "+225",
    length: 10,
    mask: "+225 00 00 000 000",
  },
  { name: "France", code: "+33", length: 9, mask: "+33 0 00 00 00 00" },
  { name: "États-Unis", code: "+1", length: 10, mask: "+1 000 000 0000" },
];

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

interface SuggestionItem {
  title: { text: string; hl?: { begin: number; end: number }[] };
  subtitle?: { text: string; hl?: { begin: number; end: number }[] };
  tags?: string[];
  distance?: { text: string; value: number };
  address?: {
    formatted_address: string;
    component?: { name: string; kind: string }[];
  };
}

const YANDEX_API_KEY = "67b74e18-a7a6-40d9-82ae-fb7460a81010";
const YANDEX_API_GEOCODER = "21e88d05-cb30-4849-8e1c-dee1bb671c75";
const COTE_DIVOIRE_BBOX = "4.19,-8.6~10.74,-2.49";

const getCoordinates = async (
  address: string
): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await axios.get(
      `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_API_GEOCODER}&geocode=${encodeURIComponent(
        address
      )}&bbox=${COTE_DIVOIRE_BBOX}&lang=en_US&format=json`
    );
    const pos =
      response.data.response.GeoObjectCollection.featureMember[0]?.GeoObject
        .Point.pos;
    if (pos) {
      const [lng, lat] = pos.split(" ").map(Number);
      return { lat, lng };
    }
    console.warn(`Aucune coordonnée trouvée pour "${address}"`);
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération des coordonnées:", error);
    return null;
  }
};

const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  try {
    const response = await axios.get(
      `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_API_GEOCODER}&geocode=${lng},${lat}&bbox=${COTE_DIVOIRE_BBOX}&lang=en_US&format=json`
    );
    return (
      response.data.response.GeoObjectCollection.featureMember[0]?.GeoObject
        .metaDataProperty.GeocoderMetaData.text || null
    );
  } catch (error) {
    console.error("Erreur lors de la récupération de l'adresse:", error);
    return null;
  }
};

const getSuggestions = async (query: string): Promise<SuggestionItem[]> => {
  try {
    const response = await axios.get(
      `https://suggest-maps.yandex.ru/v1/suggest?apikey=${YANDEX_API_KEY}&text=${encodeURIComponent(
        query
      )}&bbox=${COTE_DIVOIRE_BBOX}&results=5&lang=en_US&highlight=1`
    );
    return response.data?.results?.map((item: any) => ({
      title: { text: item.title.text, hl: item.title.hl || [] },
      subtitle: item.subtitle
        ? { text: item.subtitle.text, hl: item.subtitle.hl || [] }
        : undefined,
      tags: item.tags || [],
      distance: item.distance
        ? { text: item.distance.text, value: item.distance.value }
        : undefined,
      address: item.address
        ? {
            formatted_address: item.address.formatted_address,
            component: item.address.component || [],
          }
        : undefined,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des suggestions:", error);
    return [];
  }
};

const highlightText = (
  text: string,
  hl?: { begin: number; end: number }[]
): JSX.Element => {
  if (!hl || hl.length === 0) return <span>{text}</span>;
  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  hl.forEach(({ begin, end }, index) => {
    if (lastIndex < begin)
      parts.push(
        <span key={`plain-${index}`}>{text.slice(lastIndex, begin)}</span>
      );
    parts.push(
      <span key={`hl-${index}`} className="font-semibold text-gray-900">
        {text.slice(begin, end)}
      </span>
    );
    lastIndex = end;
  });
  if (lastIndex < text.length)
    parts.push(<span key="plain-end">{text.slice(lastIndex)}</span>);
  return <>{parts}</>;
};

const MapComponent: React.FC<{
  addresses: { text: string; lat: number; lng: number }[];
  onPositionChange: (
    index: number | null,
    lat: number,
    lng: number,
    text: string
  ) => void;
}> = ({ addresses, onPositionChange }) => {

  // const [userPosition, setUserPosition] = useState<{
  //   lat: number;
  //   lng: number;
  // } | null>(null);
  // const [mapCenter, setMapCenter] = useState<[number, number]>(
  //   addresses.length > 0
  //     ? [addresses[0].lat, addresses[0].lng]
  //     : [5.3599517, -4.0082563]
  // );
  const { mapCenter, userPosition, geoError, setMapCenter } =
    useGeolocationWithIP();
  // const [geoError, setGeoError] = useState<string | null>(null);
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude: lat, longitude: lng } = position.coords;
  //         setUserPosition({ lat, lng });
  //         setMapCenter([lat, lng]); // Mettre à jour le centre de la carte
  //       },
  //       (error) => {
  //         setGeoError(
  //           "Impossible d'obtenir votre position. Veuillez activer la géolocalisation."
  //         );
  //         console.error("Erreur de géolocalisation:", error);
  //       }
  //     );
  //   } else {
  //     setGeoError(
  //       "La géolocalisation n'est pas supportée par votre navigateur."
  //     );
  //   }
  // }, []);

  const handleDragEnd = async (index: number | null, e: any) => {
    const coords = e.get("target").geometry.getCoordinates();
    const newLat = coords[0];
    const newLng = coords[1];
    const newAddress = await reverseGeocode(newLat, newLng);
    if (newAddress) {
      setMapCenter([newLat, newLng]);
      onPositionChange(index, newLat, newLng, newAddress);
    }
  };

  return (
    <Suspense fallback={<div className="text-gray-500 text-sm">Chargement de la carte...</div>}>
      <YMaps query={{ apikey: YANDEX_API_KEY, lang: "en_US" }}>
        <Map
          state={{
            center: mapCenter!,
            zoom: 13,
          }}
          width="100%"
          height="300px"
        >
      {/* Afficher les marqueurs pour les adresses */}
          {addresses.map((addr, index) => (
            <Placemark
              key={index}
              geometry={[addr.lat, addr.lng]}
              properties={{
                hintContent: `Adresse ${index + 1}: ${addr.text}`,
                balloonContent: `
                  <div>
                    <strong>Adresse ${index + 1}</strong>
                    <p>${addr.text}</p>
                    <p>Latitude: ${addr.lat.toFixed(6)}</p>
                    <p>Longitude: ${addr.lng.toFixed(6)}</p>
                  </div>
                `,
              }}
              options={{
                preset: "islands#blueIcon",
                draggable: true,
                balloonCloseButton: true,
              }}
              onDragEnd={(e: any) => handleDragEnd(index, e)}
            />
          ))}

          {/* Afficher un marqueur pour la position de l'utilisateur */}
          {userPosition && (
            <Placemark
             onDragEnd={(e: any) => handleDragEnd(null, e)}
              geometry={[userPosition.lat, userPosition.lng]}
              // properties={{
              //   hintContent: "Votre position", // Infobulle au survol
              //   balloonContent: `
              //     <div>
              //       <strong>Votre position</strong>
              //       <p>Latitude: ${userPosition.lat.toFixed(6)}</p>
              //       <p>Longitude: ${userPosition.lng.toFixed(6)}</p>
              //     </div>
              //   `, // Infobulle au clic
              // }}
              // options={{
              //   iconLayout: "default#image", // Utiliser une image personnalisée
              //   iconImageHref: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // URL de l'icône de test
              //   iconImageSize: [40, 40], // Taille de l'icône
              //   iconImageOffset: [-20, -40], // Ajuster la position de l'icône
              //   balloonCloseButton: true, // Ajouter un bouton pour fermer l'infobulle
              // }}
            />
          )}
        </Map>
      </YMaps>
    </Suspense>
  );
};

export default function Page(): JSX.Element {
  useAuthRedirect();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("Messah Simeon");
  const [email] = useState<string>("sijean619@gmail.com");
  const [addresses, setAddresses] = useState<
    { text: string; lat: number; lng: number }[]
  >([]);
  const [numbers, setNumbers] = useState<string[]>(["+2250759091098"]);
  const [editState, setEditState] = useState<EditStateType>({
    type: null,
    index: null,
    value: "",
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState<{
    type: "add" | "edit" | "delete" | null;
    index: number | null;
  }>({ type: null, index: null });

  const numberInputRef = useRef<HTMLInputElement>(null);

  const saveToBackend = async () => {
    try {
      const data = {
        fullName,
        email,
        addresses: addresses.map((addr) => addr.text),
        phoneNumbers: numbers,
      };
      const response = await axios.post(
        "http://votre-api-adonisjs/api/user/profile",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Données sauvegardées:", response.data);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\s/g, "");
    const country = countries.find((c) => cleaned.startsWith(c.code));
    if (!country) return false;
    const numberPart = cleaned.slice(country.code.length);
    return numberPart.length === country.length && /^\d+$/.test(numberPart);
  };

  const normalizePhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\s/g, "");
    const country = countries.find(
      (c) => cleaned.startsWith(c.code) || cleaned.startsWith("0")
    );
    if (!country) return cleaned;
    return cleaned.startsWith("0") ? country.code + cleaned.slice(1) : cleaned;
  };

  const handleAddItem = (
    e: FormEvent<HTMLFormElement>,
    ref: React.RefObject<HTMLInputElement | null>,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentItems: string[],
    maxItems: number = 2
  ): void => {
    e.preventDefault();
    const input = ref.current;
    if (!input || !input.value.trim()) return;
    const newValue = input.value.trim();
    if (ref === numberInputRef) {
      if (!isValidPhone(newValue)) {
        setPhoneError(
          `Numéro invalide. Format attendu: ${selectedCountry.mask}`
        );
        return;
      }
      const normalizedNumber = normalizePhoneNumber(newValue);
      if (currentItems.length < maxItems) {
        setter((prev) => [...prev, normalizedNumber]);
        input.value = "";
        setPhoneError(null);
        saveToBackend();
      } else {
        alert(`Vous ne pouvez pas ajouter plus de ${maxItems} numéros`);
      }
    }
  };

  const handleDeleteItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ): void => {
    setter((prev) => prev.filter((_, i) => i !== index));
    setTimeout(saveToBackend, 0);
  };

  const handleEditStart = (
    type: "address" | "number" | "fullName",
    index: number | null = null,
    value: string
  ): void => {
    setEditState({ type, index, value });
    setPhoneError(null);
  };

  const handleEditCancel = (): void => {
    setEditState({ type: null, index: null, value: "" });
    setPhoneError(null);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setEditState((prev) => ({ ...prev, value: newValue }));
    if (editState.type === "number" && newValue.trim()) {
      setPhoneError(
        isValidPhone(newValue)
          ? null
          : `Numéro invalide. Format attendu: ${selectedCountry.mask}`
      );
    }
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { type, index, value } = editState;
    if (!value.trim()) {
      handleEditCancel();
      return;
    }
    if (type === "number") {
      if (!isValidPhone(value)) {
        setPhoneError(
          `Numéro invalide. Format attendu: ${selectedCountry.mask}`
        );
        return;
      }
      const normalizedNumber = normalizePhoneNumber(value);
      if (index !== null)
        setNumbers((prev) =>
          prev.map((item, i) => (i === index ? normalizedNumber : item))
        );
    } else if (type === "fullName") {
      setFullName(value);
    }
    handleEditCancel();
    setTimeout(saveToBackend, 0);
  };

  const renderSection = (
    title: string,
    data: string[],
    type: "number"
  ): JSX.Element => {
    const inputRef = numberInputRef;
    const setter = setNumbers;
    const currentItems = numbers;
    return (
      <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mt-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            {title} ({data.length}/2)
          </h2>
          <form
            onSubmit={(e) => handleAddItem(e, inputRef, setter, currentItems)}
            className="flex w-full sm:w-auto gap-2"
          >
            <select
              value={selectedCountry.code}
              onChange={(e) =>
                setSelectedCountry(
                  countries.find((c) => c.code === e.target.value)!
                )
              }
              className="px-2 py-2 border border-black rounded-lg"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
            <IMaskInput
              mask={selectedCountry.mask}
              inputRef={numberInputRef as React.RefObject<HTMLInputElement>}
              disabled={data.length >= 2}
              placeholder={selectedCountry.mask.replace(/0/g, "X")}
              className="flex-1 sm:flex-none w-full sm:w-64 px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
              disabled={data.length >= 2}
            >
              Ajouter
            </button>
          </form>
        </div>
        {phoneError && <p className="text-red-500 mb-4">{phoneError}</p>}
        <div className="space-y-4">
          {data.map((item, i) => (
            <div
              key={i}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-black text-sm font-medium">
                    {title} {i + 1}
                  </h3>
                  {editState.type === type && editState.index === i ? (
                    <form
                      onSubmit={handleEditSubmit}
                      className="flex flex-col sm:flex-row gap-2 mt-2"
                    >
                      <IMaskInput
                        mask={selectedCountry.mask}
                        value={editState.value}
                        onChange={handleEditChange}
                        autoFocus
                        className="flex-1 px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Sauvegarder
                        </button>
                        <button
                          type="button"
                          className="bg-white hover:bg-gray-100 text-black border border-black px-4 py-2 rounded-lg transition-colors"
                          onClick={handleEditCancel}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-black mt-1 break-words">{item}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditStart(type, i, item)}
                    className="text-black hover:text-gray-600 p-1"
                    aria-label="Edit"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(i, setter)}
                    className="text-black hover:text-gray-600 p-1"
                    aria-label="Delete"
                  >
                    <BsTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderPersonalInfo = (): JSX.Element => {
    return (
      <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-black text-sm font-medium">
                Nom complet
              </label>
              {editState.type !== "fullName" && (
                <button
                  onClick={() => handleEditStart("fullName", null, fullName)}
                  className="text-black hover:text-gray-600 p-1"
                  aria-label="Edit"
                >
                  <FiEdit2 size={18} />
                </button>
              )}
            </div>
            {editState.type === "fullName" ? (
              <form
                onSubmit={handleEditSubmit}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={editState.value}
                  onChange={handleEditChange}
                  autoFocus
                  className="flex-1 px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sauvegarder
                  </button>
                  <button
                    type="button"
                    className="bg-white hover:bg-gray-100 text-black border border-black px-4 py-2 rounded-lg transition-colors"
                    onClick={handleEditCancel}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-black">{fullName}</p>
            )}
          </div>
          <div>
            <label className="text-black text-sm font-medium block mb-1">
              Email
            </label>
            <p className="text-black">{email}</p>
          </div>
        </div>
      </section>
    );
  };

  const renderAddressSection = (): JSX.Element => {
    const fetchSuggestions = async () => {
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
    };

    const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

    useEffect(() => {
      debouncedFetchSuggestions();
      return () => clearTimeout(debouncedFetchSuggestions as any);
    }, [searchInput]);

    const handlePositionChange = async (
      index: number | null,
      newLat: number,
      newLng: number,
      newText: string
    ) => {
      setLoadingAction({ type: "edit", index });
      if (index === null && addresses.length < 2) {
        setAddresses((prev) => [
          ...prev,
          { text: newText, lat: newLat, lng: newLng },
        ]);
      } else if (index !== null) {
        setAddresses((prev) =>
          prev.map((addr, i) =>
            i === index ? { text: newText, lat: newLat, lng: newLng } : addr
          )
        );
      }
      setSearchInput(newText);
      await saveToBackend();
      setLoadingAction({ type: null, index: null });
    };

    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchInput.trim()) return;

      setLoadingAction({ type: "add", index: null });
      const coords = await getCoordinates(searchInput);
      if (coords) {
        if (editingIndex !== null) {
          setAddresses((prev) =>
            prev.map((addr, i) =>
              i === editingIndex
                ? { text: searchInput, lat: coords.lat, lng: coords.lng }
                : addr
            )
          );
          setEditingIndex(null);
        } else if (addresses.length < 2) {
          setAddresses((prev) => [
            ...prev,
            { text: searchInput, lat: coords.lat, lng: coords.lng },
          ]);
        } else {
          alert("Vous ne pouvez pas ajouter plus de 2 adresses.");
        }
        setSearchInput("");
        setSuggestions([]);
        setIsSuggestionOpen(false);
        await saveToBackend();
      } else {
        alert("Impossible de trouver cette adresse.");
      }
      setLoadingAction({ type: null, index: null });
    };

    const handleSuggestionClick = async (suggestion: SuggestionItem) => {
      setLoadingAction({ type: "add", index: null });
      const coords = await getCoordinates(suggestion.title.text);
      if (coords) {
        if (editingIndex !== null) {
          setAddresses((prev) =>
            prev.map((addr, i) =>
              i === editingIndex
                ? {
                    text: suggestion.title.text,
                    lat: coords.lat,
                    lng: coords.lng,
                  }
                : addr
            )
          );
          setEditingIndex(null);
        } else if (addresses.length < 2) {
          setAddresses((prev) => [
            ...prev,
            { text: suggestion.title.text, lat: coords.lat, lng: coords.lng },
          ]);
        } else {
          alert("Vous ne pouvez pas ajouter plus de 2 adresses.");
          return;
        }
        setSearchInput("");
        setSuggestions([]);
        setIsSuggestionOpen(false);
        await saveToBackend();
      } else {
        alert("Impossible de géocoder cette suggestion.");
      }
      setLoadingAction({ type: null, index: null });
    };

    const handleEditAddress = (index: number) => {
      setEditingIndex(index);
      setSearchInput(addresses[index].text);
    };

    return (
      <section className="bg-white rounded-xl shadow-md p-6 mt-8 w-full transition-all duration-300">
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Adresses ({addresses.length}/2)
          </h2>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 relative"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                editingIndex !== null
                  ? "Modifier l'adresse"
                  : "Ajouter une nouvelle adresse"
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onFocus={() =>
                suggestions.length > 0 && setIsSuggestionOpen(true)
              }
              onBlur={() => setTimeout(() => setIsSuggestionOpen(false), 200)}
            />
            <button
              type="submit"
              className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
              disabled={
                (addresses.length >= 2 && editingIndex === null) ||
                loadingAction.type !== null
              }
            >
              {loadingAction.type === "add" && loadingAction.index === null ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      fill="none"
                      className="opacity-25"
                    />
                    <path
                      fill="white"
                      d="M4 12a8 8 0 018-8v8H4z"
                      className="opacity-75"
                    />
                  </svg>
                  Chargement...
                </span>
              ) : (
                <>
                  <span>
                    {editingIndex !== null ? "Mettre à jour" : "Ajouter"}
                  </span>
                  <BsSearch className="size-4" />
                </>
              )}
            </button>
            {isSuggestionOpen && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-12 shadow-lg max-h-60 overflow-y-auto transition-all duration-200">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                  >
                    <div>
                      {highlightText(
                        suggestion.title.text,
                        suggestion.title.hl
                      )}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-xs text-gray-500">
                        {highlightText(
                          suggestion.subtitle.text,
                          suggestion.subtitle.hl
                        )}
                      </div>
                    )}
                    {suggestion.distance && (
                      <div className="text-xs text-gray-400">
                        {suggestion.distance.text}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>
        <div className="space-y-6 transition-all duration-300 ease-in-out">
          {addresses.length === 0 ? (
            <div className="text-center text-gray-600 py-6 animate-fade-in">
              <p>
                Aucune adresse enregistrée. Déplacez le marqueur ci-dessous ou
                utilisez la recherche pour en ajouter une.
              </p>
              <MapComponent
                addresses={[]}
                onPositionChange={(index, lat, lng, text) =>
                  handlePositionChange(null, lat, lng, text)
                }
              />
            </div>
          ) : (
            <>
              {addresses.map((addr, i) => (
                <div
                  key={i}
                  className={`border-b border-gray-200 pb-6 last:border-b-0 transition-opacity duration-300 ${
                    loadingAction.type === "delete" && loadingAction.index === i
                      ? "opacity-50"
                      : "opacity-100"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-gray-800 text-base font-medium">
                        Adresse {i + 1}
                      </h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditAddress(i)}
                          className="text-gray-600 hover:text-blue-600 p-1 transition-colors duration-150"
                          aria-label="Edit"
                        >
                          <BsPencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setLoadingAction({ type: "delete", index: i });
                            setAddresses((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            );
                            setEditingIndex(null);
                            saveToBackend().then(() =>
                              setLoadingAction({ type: null, index: null })
                            );
                          }}
                          className="text-gray-600 hover:text-red-600 p-1 transition-colors duration-150"
                          aria-label="Delete"
                        >
                          {loadingAction.type === "delete" &&
                          loadingAction.index === i ? (
                            <svg
                              className="animate-spin h-5 w-5"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                className="opacity-25"
                              />
                              <path
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                                className="opacity-75"
                              />
                            </svg>
                          ) : (
                            <BsTrash size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 mt-1 break-words">
                      {addr.text}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Lat: {addr.lat.toFixed(6)} ; Long: {addr.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              ))}
              <MapComponent
                addresses={addresses}
                onPositionChange={(index, lat, lng, text) =>
                  handlePositionChange(index, lat, lng, text)
                }
              />
            </>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <BsPerson className="text-2xl sm:text-4xl text-gray-800" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Informations de livraison
          </h1>
        </div>
        {renderPersonalInfo()}
        {renderAddressSection()}
        {renderSection("Numéros", numbers, "number")}
      </div>
    </div>
  );
}
