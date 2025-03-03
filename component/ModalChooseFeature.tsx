import React from 'react'
import { ButtonValidCart } from './Button';
import TextComponent from './FeatureDetailProduct/TextComponent';
import ColorComponent from './FeatureDetailProduct/ColorComponent';
import { DisplayPriceDetail } from './DisplayPrice';
import Modal from './Modal';
import { BsX } from 'react-icons/bs';
import { useProductSelectFeature } from '../store/features';
import { usePanier } from '../store/cart';
import { useQuery } from '@tanstack/react-query';
import { get_features_with_values, get_group_features } from '../api/products.api';

export default function ModalChooseFeature() {
    const toggleCart = usePanier((state) => state.toggleCart);
    const addItems = usePanier((state) => state.add);

    const handleModalcartOpen = () => {
        toggleCart(true);
        document.body.style.overflow = "hidden";
    };

    /****************** */
    const product = useProductSelectFeature((state) => state.productSelected);
    const isVisibleFeatureModal = useProductSelectFeature(
        (state) => state.isVisible
    );
    const showModalFeature = useProductSelectFeature(
        (state) => state.setFeatureModal
    );

    const handleModalFeature = () => {
        showModalFeature(false);
        document.body.style.overflow = "auto";
    };

    const { data: features, status: status_features } = useQuery({
        queryKey: ['get_features_with_values', product?.default_feature_id],
        queryFn: () => get_features_with_values({ feature_id: product?.default_feature_id }),
        enabled: !!product?.default_feature_id
    });

    const { data: group_features, status: status_group_feature } = useQuery({
        queryKey: ['get_group_features', product?.id],
        queryFn: () => get_group_features({ product_id: product?.id }),
        enabled: !!product?.id
    });
    return (
        <Modal
            styleContainer="flex items-center select-none size-full justify-center"
            position="start"
            zIndex={100}
            setHide={handleModalFeature}
            isOpen={isVisibleFeatureModal}
            animationName="zoom"
        >
            <div className="font-primary relative bg-white rounded-3xl max-h-[60dvh] md:w-[550px] overflow-auto w-full px-2 py-10">
                <div className="absolute top-8 right-8">
                    <BsX
                        size={50}
                        className="cursor-pointer text-black"
                        onClick={handleModalFeature}
                    />
                </div>
                {product?.id ? (
                    <div className="flex size-full flex-col justify-between items-start img-pdetail-breakpoint-2:pr-0 px-5">
                        <div className="img-pdetail-breakpoint-2:block hidden">
                            <h1 className="text-clamp-md pt-4 font-bold">
                                {product.name}
                            </h1>
                            <h1 className="text-clamp-xs mb-2">
                                {product.description}
                            </h1>
                            <DisplayPriceDetail product={product} />
                        </div>
                        <div className="mt-6 flex flex-col gap-2 img-pdetail-breakpoint-2:p-0 pl-9 max-h-[60dvh] overflow-auto">
                            {features?.map((feature, index) => {
                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-start overflow-x-auto gap-1 scrollbar-thin my-0">
                                            {feature.feature_type === "color" && (
                                                <ColorComponent
                                                    features={features}
                                                    feature_name={feature.feature_name}
                                                    feature_required={feature.feature_required}
                                                    productId={product.id}
                                                    stock={group_features?.[0].stock ?? 0}
                                                />
                                            )}
                                            {feature.feature_type === "text" && (
                                                <TextComponent
                                                features={features}
                                                feature_name={feature.feature_name}
                                                feature_required={feature.feature_required}
                                                productId={product.id}
                                                stock={group_features?.[0].stock ?? 0}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <ButtonValidCart
                            features={features ?? []}
                            product={product}
                            onClick={() => {
                                handleModalFeature();
                                handleModalcartOpen();
                                addItems(product,group_features?.[0].stock ?? 0);
                            }}
                        />
                        <button
                            onClick={handleModalFeature}
                            className="text-clamp-base cursor-pointer font-light self-center text-center my-2 underline underline-offset-2"
                        >
                            Continuer vos achats
                        </button>
                    </div>
                ) : (
                    <h1 className="size-full flex justify-center items-center text-clamp-md">
                        Produit non disponible
                    </h1>
                )}
            </div>
        </Modal>
    )
}
