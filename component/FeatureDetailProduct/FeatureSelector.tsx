import ValueComponent from "../product/ValueComponent";
import { useMemo } from "react";
import { useproductFeatures } from "../../store/features";
import { Feature } from "../../pages/type";

interface FeatureSelectorProps {
  features: Feature[];
  product_id: string;
  feature_name: string;
}

export const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  features,
  product_id,
  feature_name,
}) => {
  const { selections } = useproductFeatures();

  const hasValidValues = useMemo(
    () => features.some((f) => f.values.some((v) => !!v.text)),
    [features]
  );

  if (!hasValidValues) {
    return null;
    // <div className="text-gray-500 text-sm p-0.5" role="alert">
    //   Aucune option disponible pour {feature_name}
    // </div>
  }

  return (
    <div
      className="p-0.5 pl-2"
      role="group"
      aria-label={`Options pour ${feature_name}`}
    >
      {features.map((feature) => {
        const validFeatureValues = feature.values.filter((v) => !!v.text);
        if (!validFeatureValues.length) return null;

        return (
          <>
            <h3 className="text-sm uppercase mb-1 font-medium text-gray-700 flex items-center gap-1">
              {feature.name}
              {feature.required && <span className="text-red-500">*</span>}
            </h3>
            <div key={feature.id}>
              <div
                className="flex items-center justify-start flex-wrap gap-2 scrollbar-thin max-w-full"
                role="listbox"
                aria-labelledby={`feature-${feature.id}`}
              >
                {validFeatureValues.map((value) => {
                  const isSelected =
                    selections.get(product_id)?.get(feature.id)
                      ?.valueFeature === value.id;
                  return (
                    <ValueComponent
                      key={value.id}
                      value={value}
                      features={features}
                      product_id={product_id}
                      feature_id={feature.id}
                      feature_name={feature.name}
                      isSelected={isSelected}
                      isColor={feature.type === "color"}
                      isIcon={feature.type === "icon"}
                      isIconText={feature.type === "icon_text"}
                    />
                  );
                })}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};
