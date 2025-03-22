import { Feature } from "../../pages/type";
import { ColorComponent } from "../FeatureDetailProduct/ColorComponent";
import { TextComponent } from "../FeatureDetailProduct/TextComponent";

export const RenderFeatureComponent = ({
  feature,
  product_id,
}: {
  feature: Feature;
  product_id: string;
}) => {
  const componentProps = {
    values: feature.values,
    feature_name: feature.name,
    feature_required: feature.required,
    product_id,
  };

  switch (feature.type) {
    case "color":
      return <ColorComponent {...componentProps} />;
    case "text":
      return <TextComponent {...componentProps} />;
    default:
      return (
        <p className="text-gray-500 text-sm italic">
          Type de caractéristique non pris en charge
        </p>
      );
  }
};
