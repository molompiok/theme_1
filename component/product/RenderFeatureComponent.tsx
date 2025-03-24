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
  console.log("🚀 ~ feature:", feature)
  const componentProps = {
    values: feature.values,
    feature_name: feature.name,
    feature_required: feature.required,
    product_id,
  };

  switch (feature.type) {
    case "color":
      return (
        <>
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
            {feature.name}
            {feature.required && <span className="text-red-500">*</span>}
          </h3>
          <ColorComponent {...componentProps} />
        </>
      );
    case "text":
      return (
        <>
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
            {feature.name}
            {feature.required && <span className="text-red-500">*</span>}
          </h3>
          <TextComponent {...componentProps} />
        </>
      );
    default: null
  }
};
