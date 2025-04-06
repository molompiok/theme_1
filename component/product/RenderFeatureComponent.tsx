import { Feature } from "../../pages/type";
import { FeatureSelector } from "../FeatureDetailProduct/FeatureSelector";

export const RenderFeatureComponent = ({
  features,
  feature,
  product_id,
}: {
  features: Feature[];
  feature: Feature;
  product_id: string;
}) => {
  if (feature.values.length === 0) return null;


  const componentProps = {
    features: [feature],
    feature_name: feature.name,
    product_id,
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm uppercase mb-1 font-medium text-gray-700 flex items-center gap-1">
        {feature.name}
        {feature.required && <span className="text-red-500">*</span>}
      </h3>
      <FeatureSelector {...componentProps} />
    </div>
  );
};