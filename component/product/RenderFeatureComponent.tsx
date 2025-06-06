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
      <FeatureSelector {...componentProps} />
    </div>
  );
};
