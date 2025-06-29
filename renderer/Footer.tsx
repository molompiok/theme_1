import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPinterestP,
  FaEnvelope,
  FaCheck,
  FaMapMarkerAlt,
  FaPhone,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaHeart,
} from "react-icons/fa";
import { useThemeSettingsStore } from "../store/themeSettingsStore";
import { usePageContext } from "vike-react/usePageContext";

interface FooterProps { }

export const Footer: React.FC<FooterProps> = () => {
  const [email, setEmail] = useState("");
  const { storeInfo: { storeInfoInitial: info } } = usePageContext();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const footerBackgroundColor = useThemeSettingsStore(
    (state) => state.footerBackgroundColor
  );
  const footerTextColor = useThemeSettingsStore(
    (state) => state.footerTextColor
  );

  const handleSubmit = () => {
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 relative overflow-hidden">
      {/* Geometric background patterns */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-0 w-64 h-64 bg-black rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black rounded-full translate-x-48 translate-y-48"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-black transform rotate-45"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">
            Restons connectés
          </h2>
          <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez nos nouveautés, offres exclusives et conseils d'experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Section À propos - Redesigned */}
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-black mb-2">
                À propos de nous
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              Une boutique passionnée par l'excellence, dédiée à vous offrir
              des produits de qualité supérieure et une expérience client
              exceptionnelle.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="flex-shrink-0 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white text-xs" />
                </div>
                <div>
                  <p className="text-black font-medium text-sm">Localisation</p>
                  <p className="text-gray-500 text-xs">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="flex-shrink-0 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <FaPhone className="text-white text-xs" />
                </div>
                <div>
                  <p className="text-black font-medium text-sm">Téléphone</p>
                  <p className="text-gray-500 text-xs">+225 07 59 09 10 98</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700">
                  Service client 24/7
                </span>
              </div>
            </div>
          </div>

          {/* Section Liens utiles - Redesigned */}
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-black mb-2">
                Navigation
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { href: "/", label: "Boutique" },
                { href: "/about", label: "À propos" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
                { href: "/", label: "Retours & Échanges" },
                { href: "/", label: "Livraison" },
                { href: "/contact", label: "Support" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-gray-600 group-hover:text-black text-sm font-medium">
                    {link.label}
                  </span>
                  <FaArrowRight className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-200 text-xs" />
                </a>
              ))}
            </div>
          </div>

          {/* Section Newsletter - Redesigned */}
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-black mb-2">Newsletter</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Recevez nos offres exclusives et découvrez nos nouveautés en
                avant-première.
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full p-4 pr-12 rounded-xl bg-white border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-sm"
                  />
                  <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubscribed}
                  className={`w-full p-4 rounded-xl font-semibold transition-all duration-200 text-sm ${isSubscribed
                    ? "bg-green-500 text-white cursor-default"
                    : "bg-black hover:bg-gray-800 text-white hover:shadow-lg"
                    }`}
                >
                  {isSubscribed ? (
                    <div className="flex items-center justify-center space-x-2">
                      <FaCheck />
                      <span>Inscription confirmée !</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>S'abonner</span>
                      <FaArrowRight className="text-xs" />
                    </div>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Désabonnement possible à tout moment
              </p>
            </div>
          </div>

          {/* Section Réseaux sociaux - Redesigned */}
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-black mb-2">
                Réseaux sociaux
              </h3>
            </div>

            <p className="text-gray-600 mb-6 text-sm">
              Rejoignez notre communauté et suivez nos actualités !
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: FaFacebookF,
                  href: "https://facebook.com",
                  label: "Facebook",
                  color: "hover:bg-blue-50 hover:border-blue-200",
                },
                {
                  icon: FaInstagram,
                  href: "https://instagram.com",
                  label: "Instagram",
                  color: "hover:bg-pink-50 hover:border-pink-200",
                },
                {
                  icon: FaTwitter,
                  href: "https://twitter.com",
                  label: "Twitter",
                  color: "hover:bg-blue-50 hover:border-blue-200",
                },
                {
                  icon: FaPinterestP,
                  href: "https://pinterest.com",
                  label: "Pinterest",
                  color: "hover:bg-red-50 hover:border-red-200",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 transition-all duration-200 group ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="text-xl text-gray-600 group-hover:text-black transition-colors duration-200 mb-2" />
                  <span className="text-xs font-medium text-gray-600 group-hover:text-black">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges Section */}
        <div className="border-t border-gray-100 pt-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 p-6 rounded-2xl border border-gray-100 bg-gray-50">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-green-600 text-lg" />
              </div>
              <div>
                <h4 className="font-semibold text-black text-sm">
                  Paiement sécurisé
                </h4>
                <p className="text-gray-500 text-xs">SSL 256-bit</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 rounded-2xl border border-gray-100 bg-gray-50">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaTruck className="text-blue-600 text-lg" />
              </div>
              <div>
                <h4 className="font-semibold text-black text-sm">
                  Livraison rapide
                </h4>
                <p className="text-gray-500 text-xs">24-48h en Côte d'Ivoire</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 rounded-2xl border border-gray-100 bg-gray-50">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaHeart className="text-purple-600 text-lg" />
              </div>
              <div>
                <h4 className="font-semibold text-black text-sm">
                  Satisfaction garantie
                </h4>
                <p className="text-gray-500 text-xs">30 jours pour changer d'avis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()}{" "}
                <span className="font-bold text-black">{info?.name}</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Tous droits réservés. Fait avec ❤️ en Côte d'Ivoire
              </p>
            </div>
            <div className="flex flex-wrap gap-8 text-sm">
              <a
                href="/contact"
                className="text-gray-600 hover:text-black transition-colors duration-200 relative group"
              >
                Confidentialité
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-black transition-colors duration-200 relative group"
              >
                Conditions
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-black transition-colors duration-200 relative group"
              >
                Cookies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};