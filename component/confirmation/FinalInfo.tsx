import {
  FaMapMarkerAlt,
  FaPhone,
  FaTruck,
  FaCalendarAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { useOrderInCart } from "../../store/cart";
import { useMutation } from "@tanstack/react-query";
import { create_user_order } from "../../api/cart.api";
import { navigate } from "vike/client/router";
import { useAuthStore } from "../../store/user";
import { InfoOrderOwner } from "../../utils";
import useCart from "../../hook/query/useCart";

type RecapitulatifStepProps = {
  step: "info" | "livraison" | "Finalisation";
  setStep: React.Dispatch<
    React.SetStateAction<"info" | "livraison" | "Finalisation">
  >;
};

const FinalInfo = ({ step, setStep }: RecapitulatifStepProps) => {
  const { with_delivery } = useOrderInCart();
  const { data: cart } = useCart();
  const totalPrice = cart?.total || 0;
const {user} = useAuthStore();
  const { mutate, isError, error, isSuccess , isPending} = useMutation({
    mutationFn: create_user_order,
    onSuccess: (data) => {
      console.log('Commande créée avec succès:', data);
      navigate('/profile/commandes');
    },
    onError: (error: Error) => {
      console.error('Erreur lors de la mutation:', error.message);
    },
  });

  if (with_delivery === null) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Aucune information de commande disponible.</p>
        <button
          onClick={() => setStep("livraison")}
          className="mt-4 flex items-center justify-center w-full py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Retour à la livraison
        </button>
      </div>
    );
  }

  const isDelivery = with_delivery === true;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Récapitulatif de votre commande
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            {isDelivery ? (
              <>
                <FaTruck className="mr-2 text-gray-600" /> Livraison à domicile
              </>
            ) : (
              <>
                <FaMapMarkerAlt className="mr-2 text-gray-600" /> Retrait
              </>
            )}
          </h2>
          <div className="text-sm text-gray-700 space-y-2">
            {isDelivery ? (
              <>
                <p>
                  <span className="font-semibold">Adresse :</span>{" "}
                  {user?.addresses?.[0].name || "Non spécifiée"}
                </p>
                {user?.addresses?.[0].latitude && user?.addresses?.[0].longitude && (
                  <p>
                    <span className="font-semibold">Coordonnées :</span>{" "}
                    {user?.addresses?.[0].latitude}, {user?.addresses?.[0].longitude}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Date estimée :</span>{" "}
                  {"2-3 jours ouvrables"}
                </p>
                <p>
                  <span className="font-semibold">Coût :</span>{" "}
                  {InfoOrderOwner.delivery_price} CFA
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="font-semibold">Lieu :</span>{" "}
                  {InfoOrderOwner.pickup_address || "Non spécifié"}
                </p>
                {InfoOrderOwner.pickup_latitude && InfoOrderOwner.pickup_longitude && (
                  <p>
                    <span className="font-semibold">Coordonnées :</span>{" "}
                    {InfoOrderOwner.pickup_latitude}, {InfoOrderOwner.pickup_longitude}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Date limite :</span>{" "}
                  {InfoOrderOwner.pickup_date || "Non spécifiée"}
                </p>
                <p>
                  <span className="font-semibold">Coût :</span> Gratuit
                </p>
              </>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <FaPhone className="mr-2 text-gray-600" /> Contact
          </h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <span className="font-semibold">Numéro :</span>{" "}
              {InfoOrderOwner.pickup_phone || "Non spécifié"}
            </p>
            {InfoOrderOwner.country_code && (
             <p className="flex items-center">
             <a
               href={InfoOrderOwner.pickup_maps_link}
               target="_blank"
               rel="noopener noreferrer"
               className="text-blue-600 hover:underline flex items-center"
             >
               <FaMapMarkerAlt className="mr-2 text-blue-600" size={16} />
               Voir sur Google Maps
             </a>
           </p>
            )}
          </div>
        </section>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setStep("livraison")}
          className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" /> Retour
        </button>
        <button
          onClick={() => {
            const pickupDeadline = new Date();
            pickupDeadline.setDate(pickupDeadline.getDate() + 3);

            mutate({
              with_delivery: isDelivery,
              total_price: totalPrice + (isDelivery ? InfoOrderOwner.delivery_price : 0),
              delivery_price: isDelivery ? InfoOrderOwner.delivery_price : undefined,
              phone_number: user?.phone_numbers?.[0]?.phone_number || '',
              formatted_phone_number: user?.phone_numbers?.[0]?.format || '',
              country_code: InfoOrderOwner.country_code,
              delivery_address: isDelivery ? (user?.addresses?.[0]?.name || '') : undefined,
              delivery_address_name: isDelivery ? (user?.addresses?.[0]?.name || '') : undefined,
              delivery_date: isDelivery ? pickupDeadline.toISOString() : undefined,
              delivery_latitude: isDelivery ? parseFloat(user?.addresses?.[0]?.latitude || '0') : undefined,
              delivery_longitude: isDelivery ? parseFloat(user?.addresses?.[0]?.longitude || '0') : undefined,
              pickup_address: isDelivery ? undefined : InfoOrderOwner.pickup_address,
              pickup_address_name: isDelivery ? undefined : InfoOrderOwner.pickup_address,
              pickup_date: isDelivery ? undefined : pickupDeadline.toISOString(),
              pickup_latitude: isDelivery ? undefined : InfoOrderOwner.pickup_latitude,
            
              pickup_longitude: isDelivery ? undefined : InfoOrderOwner.pickup_longitude,
            });
          }}
          disabled={isPending}
          className={`flex-1 py-3 px-4 rounded-md text-white transition-colors ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
        >
          {isPending ? "En cours..." : "Confirmer la commande"}
        </button>
      </div>
    </div>
  );
};

export default FinalInfo;