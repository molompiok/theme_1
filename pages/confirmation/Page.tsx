import React, { useState } from 'react';

interface DétailsCommande {
  adresse_livraison: string;
  nom_adresse_livraison: string;
  adresse_retrait: string;
  nom_adresse_retrait: string;
  prix_total: number;
  prix_livraison: number;
  avec_livraison: boolean;
  méthode_paiement: 'carte_crédit' | 'paypal' | 'mobile_money' | 'espèces';
  numéro_téléphone: string;
  articles: ArticlePanier[];
}

interface ArticlePanier {
  id: string;
  quantité: number;
  groupe_produit: {
    id: string;
    nom: string;
    prix: number;
  };
}

export default function PagePaiement() {
  const [commande, setCommande] = useState<DétailsCommande>({
    adresse_livraison: '',
    nom_adresse_livraison: '',
    adresse_retrait: '',
    nom_adresse_retrait: '',
    prix_total: 0,
    prix_livraison: 5.99,
    avec_livraison: true,
    méthode_paiement: 'carte_crédit',
    numéro_téléphone: '',
    articles: [
      {
        id: '1',
        quantité: 2,
        groupe_produit: { id: 'gp1', nom: 'Produit Exemple', prix: 29.99 }
      }
    ]
  });

  const [étape, setÉtape] = useState<'info' | 'livraison' | 'paiement'>('info');

  const calculerSousTotal = () => {
    return commande.articles.reduce((somme, article) =>
      somme + article.quantité * article.groupe_produit.prix, 0);
  };

  const gérerSoumission = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Commande soumise :', commande);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      <div className="w-full lg:w-2/3 p-4 sm:p-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-light mb-8 text-black border-b border-gray-200 pb-4">
            Paiement
          </h1>
          <div className="flex flex-col sm:flex-row justify-between mb-10 gap-4">
            <ÉlémentÉtape
              titre="Information"
              active={étape === 'info'}
              complétée={étape !== 'info'}
            />
            <ÉlémentÉtape
              titre="Livraison"
              active={étape === 'livraison'}
              complétée={étape === 'paiement'}
            />
            <ÉlémentÉtape
              titre="Paiement"
              active={étape === 'paiement'}
            />
          </div>

          <form onSubmit={gérerSoumission} className="space-y-8">
            {étape === 'info' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="Entrez votre numéro de téléphone"
                    value={commande.numéro_téléphone}
                    onChange={(e) => setCommande({ ...commande, numéro_téléphone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setÉtape('livraison')}
                  className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition-colors"
                >
                  Continuer vers la Livraison
                </button>
              </div>
            )}

            {étape === 'livraison' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Méthode de Livraison</h2>
                  <div className="space-y-4">
                    <label className="flex items-start p-4 border border-gray-300 rounded cursor-pointer hover:border-black">
                      <input
                        type="radio"
                        checked={commande.avec_livraison}
                        onChange={() => setCommande({ ...commande, avec_livraison: true })}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium">Livraison (${commande.prix_livraison})</p>
                        <input
                          type="text"
                          placeholder="Entrez l'adresse de livraison"
                          value={commande.adresse_livraison}
                          onChange={(e) => setCommande({ ...commande, adresse_livraison: e.target.value })}
                          className="w-full p-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                        />
                      </div>
                    </label>

                    <label className="flex items-start p-4 border border-gray-300 rounded cursor-pointer hover:border-black">
                      <input
                        type="radio"
                        checked={!commande.avec_livraison}
                        onChange={() => setCommande({ ...commande, avec_livraison: false })}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium">Retrait (Gratuit)</p>
                        <input
                          type="text"
                          placeholder="Entrez l'adresse de retrait"
                          value={commande.adresse_retrait}
                          onChange={(e) => setCommande({ ...commande, adresse_retrait: e.target.value })}
                          className="w-full p-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                        />
                      </div>
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setÉtape('paiement')}
                  className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition-colors"
                >
                  Continuer vers le Paiement
                </button>
                <button
                  type="button"
                  onClick={() => setÉtape('info')}
                  className="w-full text-gray-600 hover:underline"
                >
                  Retour aux Informations
                </button>
              </div>
            )}

            {étape === 'paiement' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Méthode de Paiement
                  </label>
                  <select
                    value={commande.méthode_paiement}
                    onChange={(e) => setCommande({ ...commande, méthode_paiement: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  >
                    <option value="carte_crédit">Carte de Crédit</option>
                    <option value="paypal">Paypal</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="espèces">Paiement à la Livraison</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition-colors"
                >
                  Compléter la Commande
                </button>
                <button
                  type="button"
                  onClick={() => setÉtape('livraison')}
                  className="w-full text-gray-600 hover:underline"
                >
                  Retour à la Livraison
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="w-full lg:w-1/3 bg-gray-50 p-4 sm:p-8 border-l border-gray-200">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Résumé de la Commande</h2>

          {commande.articles.map((article) => (
            <div key={article.id} className="flex justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-gray-800">{article.groupe_produit.nom}</p>
                <p className="text-sm text-gray-500">Qté: {article.quantité}</p>
              </div>
              <p className="text-gray-800">${(article.groupe_produit.prix * article.quantité).toFixed(2)}</p>
            </div>
          ))}

          <div className="pt-4 mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <p>Sous-total</p>
              <p>${calculerSousTotal().toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <p>Livraison</p>
              <p>${commande.avec_livraison ? commande.prix_livraison.toFixed(2) : '0.00'}</p>
            </div>
            <div className="flex justify-between text-lg font-medium text-gray-900 mt-4 pt-4 border-t border-gray-200">
              <p>Total</p>
              <p>${(calculerSousTotal() + (commande.avec_livraison ? commande.prix_livraison : 0)).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ÉlémentÉtapeProps {
  titre: string;
  active: boolean;
  complétée?: boolean;
}

const ÉlémentÉtape: React.FC<ÉlémentÉtapeProps> = ({ titre, active, complétée }) => (
  <div className="flex-1">
    <div className="flex items-center">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
        active ? 'border-black bg-black text-white' :
        complétée ? 'border-black bg-white text-black' :
        'border-gray-300 bg-white'
      }`}>
        {complétée ? '✓' : active ? '●' : '○'}
      </div>
      <p className={`ml-2 text-sm ${active ? 'font-medium text-black' : 'text-gray-500'}`}>
        {titre}
      </p>
    </div>
    <div className="h-1 bg-gray-200 mt-2 sm:hidden">
      <div className={`h-full ${active || complétée ? 'bg-black' : 'bg-gray-200'}`} />
    </div>
  </div>
);
