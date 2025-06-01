import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP, FaEnvelope, FaCheck, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useThemeSettingsStore } from "../store/themeSettingsStore";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const footerBackgroundColor = useThemeSettingsStore(state => state.footerBackgroundColor);
  const footerTextColor = useThemeSettingsStore(state => state.footerTextColor);
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
    <footer className="bg-slate-900 text-white border-t border-slate-700" style={{
      backgroundColor: footerBackgroundColor,
      color: footerTextColor,
    }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Section À propos */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">
                À propos de nous
              </h3>
              <div className="w-12 h-0.5 bg-blue-500 mb-4"></div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Nous sommes une boutique passionnée par la qualité et la satisfaction client. 
              Découvrez nos produits uniques et notre service exceptionnel.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-slate-400">
                <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
                <span>123 Rue Commerce, Paris 75001</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <FaPhone className="text-blue-500 flex-shrink-0" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span>Service client 24/7</span>
              </div>
            </div>
          </div>

          {/* Section Liens utiles */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Liens utiles
              </h3>
              <div className="w-12 h-0.5 bg-emerald-500 mb-4"></div>
            </div>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "Boutique" },
                { href: "/about", label: "À propos" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
                { href: "/returns", label: "Retours & Échanges" },
                { href: "/shipping", label: "Livraison" },
                { href: "/support", label: "Support" }
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Newsletter
              </h3>
              <div className="w-12 h-0.5 bg-purple-500 mb-4"></div>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Inscrivez-vous pour recevoir nos offres exclusives et nos nouveautés en avant-première.
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full p-4 pr-12 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
                <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isSubscribed}
                className={`w-full p-4 rounded-lg font-semibold transition-colors duration-200 ${
                  isSubscribed 
                    ? 'bg-green-600 text-white cursor-default' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSubscribed ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FaCheck />
                    <span>Inscription confirmée !</span>
                  </div>
                ) : (
                  'S\'inscrire à la newsletter'
                )}
              </button>
            </div>
            
            <p className="text-xs text-slate-400">
              Nous respectons votre vie privée. Désabonnement possible à tout moment.
            </p>
          </div>

          {/* Section Réseaux sociaux */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Suivez-nous
              </h3>
              <div className="w-12 h-0.5 bg-pink-500 mb-4"></div>
            </div>
            
            <p className="text-slate-300 mb-6">
              Rejoignez notre communauté et ne manquez aucune actualité !
            </p>
            
            <div className="space-y-4">
              {[
                { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook", desc: "Suivez nos actualités" },
                { icon: FaInstagram, href: "https://instagram.com", label: "Instagram", desc: "Photos et stories" },
                { icon: FaTwitter, href: "https://twitter.com", label: "Twitter", desc: "Actualités en temps réel" },
                { icon: FaPinterestP, href: "https://pinterest.com", label: "Pinterest", desc: "Inspirations et idées" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-colors duration-200 group"
                  aria-label={social.label}
                >
                  <div className="flex-shrink-0">
                    <social.icon className="text-xl text-slate-400 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{social.label}</div>
                    <div className="text-xs text-slate-400">{social.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-slate-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} <span className="font-semibold text-white">Ma Boutique</span>. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <a 
                href="/privacy" 
                className="text-slate-400 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-colors duration-200"
              >
                Politique de confidentialité
              </a>
              <a 
                href="/terms" 
                className="text-slate-400 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-colors duration-200"
              >
                Conditions d'utilisation
              </a>
              <a 
                href="/cookies" 
                className="text-slate-400 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-colors duration-200"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>

        {/* Badge de confiance */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Paiement sécurisé SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Livraison rapide</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Satisfaction garantie</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};