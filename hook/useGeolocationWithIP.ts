import { useEffect, useState } from "react";


interface Position {
    lat: number;
    lng: number;
    source: 'browser' | 'ip' | 'default';
  }
export const useGeolocationWithIP = ({
    highAccuracy = true,
    timeout = 10000,
    defaultPosition = { lat: 48.8566, lng: 2.3522 }
  } = {}) => {
    const [userPosition, setUserPosition] = useState<Position | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>([0,0]);
    const [geoError, setGeoError] = useState<string | null>(null);
  
    useEffect(() => {
      let isMounted = true;
  
      const updatePosition = (lat: number, lng: number, source: Position['source']) => {
        if (!isMounted) return;
        if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
          throw new Error('Coordonnées invalides');
        }
        setUserPosition({ lat, lng, source });
        setMapCenter([lat, lng]);
        setGeoError(null);
      };
  
      const fetchPositionByIP = async () => {
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (!response.ok) throw new Error('Erreur réseau');
          
          const data = await response.json() as { latitude?: number; longitude?: number };
          if (!data.latitude || !data.longitude) {
            throw new Error('Données de position manquantes');
          }
          
          updatePosition(data.latitude, data.longitude, 'ip');
        } catch (error) {
          setGeoError('Erreur lors de la géolocalisation par IP');
          console.error('Erreur IP:', error);
          updatePosition(defaultPosition.lat, defaultPosition.lng, 'default');
        }
      };
  
      // Gestion des erreurs de géolocalisation navigateur
      const handleError = (error: GeolocationPositionError) => {
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission refusée";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position indisponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai dépassé";
            break;
          default:
            errorMessage = "Erreur inconnue";
        }
        setGeoError(errorMessage);
        fetchPositionByIP();
      };
  
      if (navigator.geolocation) {
        const geoOptions: PositionOptions = {
          enableHighAccuracy: highAccuracy,
          timeout,
          maximumAge: 0
        };
  
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            if (!isMounted) return;
            const { latitude: lat, longitude: lng } = position.coords;
            updatePosition(lat, lng, 'browser');
          },
          handleError,
          geoOptions
        );
      } else {
        fetchPositionByIP();
      }
  
      return () => {
        isMounted = false;
      };
    }, [highAccuracy, timeout, defaultPosition.lat, defaultPosition.lng]);
  
    return { userPosition, mapCenter, geoError ,setMapCenter };
  };