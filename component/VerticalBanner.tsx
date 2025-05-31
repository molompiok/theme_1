import { useEffect, useState } from "react";
import { useThemeSettingsStore } from "../store/themeSettingsStore";
interface BannerMessage {
  id: number;
  text: string;
  icon: string;
}

// const messages: BannerMessage[] = [
//   { id: 1, text: "Livraison gratuite en Côte d'Ivoire", icon: "🚚" },
//   { id: 2, text: "Nouvelle collection disponible - 20% de réduction", icon: "✨" },
//   { id: 3, text: "Service client 24h/7j - Appelez maintenant", icon: "📞" },
//   { id: 4, text: "Commande avant 15h = Livraison le jour même", icon: "🎁" },
//   { id: 5, text: "Paiement sécurisé - Mobile Money accepté", icon: "💳" },
//   { id: 6, text: "Offres limitées - Profitez-en maintenant", icon: "🔥" },
//   { id: 7, text: "Retour gratuit sous 30 jours", icon: "📦" },
//   { id: 8, text: "Plus de 10,000 clients satisfaits", icon: "⭐" }
// ];

const VerticalBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setSettings, resetSettings, ...settings } = useThemeSettingsStore();
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + 1) % (settings?.announcementMessages?.length || 0)
      );

      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // const handleMouseEnter = () => setIsAnimating(false);
  // const handleMouseLeave = () => setIsAnimating(true);

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };

  return (
    <div
      className={`w-full`}
      style={{
        display: settings?.showAnnouncementBar ? "block" : "none",
      }}
    >
      <div
        className={`relative w-full h-10 overflow-hidden cursor-pointer`}
        style={{
          backgroundColor: settings?.announcementBackgroundColor,
        }}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full h-full">
          {settings?.announcementMessages?.map((message, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center px-4 font-semibold text-sm md:text-base transition-all duration-700 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 transform translate-y-0"
                  : index < currentIndex
                  ? "opacity-0 transform -translate-y-full"
                  : "opacity-0 transform translate-y-full"
              }`}
              style={{
                color: settings?.announcementTextColor,
              }}
            >
              <span className="font-primary text-center truncate">
                {message}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {settings?.announcementMessages?.map((_, index) => (
            <button
              key={index}
              className={`rounded-md transition-all duration-300 focus:outline-none ${
                index === currentIndex
                  ? "scale-x-125 h-1 w-2.5"
                  : "h-1 w-2"
              }`}
              style={{
                backgroundColor: settings?.announcementTextColor +  (index === currentIndex ? "" : "50"),
                opacity: index === currentIndex ? 1 : 0.5,
              }}
              onClick={() => handleDotClick(index)}
              aria-label={`Aller au message ${index + 1}`}
            />
          ))}
        </div>
{/* 
        <div className="absolute top-0 left-0 h-0.5 bg-white/30 w-full">
          <div
            className={`h-full bg-white transition-all duration-75 ease-linear ${
              isAnimating ? "animate-pulse" : ""
            }`}
            style={{
              width: isAnimating ? "100%" : "0%",
              animation: isAnimating ? "progress 3s linear infinite" : "none",
            }}
          />
        </div> */}
      </div>
    </div>
  );
};

export default VerticalBanner;
