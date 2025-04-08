import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa";

interface FooterProps {
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">À propos de nous</h3>
          <p className="text-sm text-gray-400">
            Nous sommes une boutique passionnée par la qualité et la satisfaction client. Découvrez nos produits uniques !
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/shop" className="text-gray-400 hover:text-white transition">
                Boutique
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-400 hover:text-white transition">
                À propos
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-400 hover:text-white transition">
                Contact
              </a>
            </li>
            <li>
              <a href="/faq" className="text-gray-400 hover:text-white transition">
                FAQ
              </a>
            </li>
            <li>
              <a href="/returns" className="text-gray-400 hover:text-white transition">
                Retours
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">
            Inscrivez-vous pour recevoir nos offres exclusives !
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Votre email"
              className="p-2 rounded-md bg-amber-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-md transition"
            >
              S'inscrire
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="Facebook"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="Pinterest"
            >
              <FaPinterestP size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Ma Boutique. Tous droits réservés.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/privacy" className="hover:text-white transition">
            Politique de confidentialité
          </a>
          <a href="/terms" className="hover:text-white transition">
            Conditions d'utilisation
          </a>
        </div>
      </div>
    </footer>
  );
};