import { VariantOptionSelector, VariantOptionSelectorComponent } from '@/components/products/variant-selector';
import { Product } from '@/lib/shopify/types';

export function VariantSelectorSlots({ product, fallback = false }: { product: Product; fallback?: boolean }) {
  const { options } = product;

  const hasNoOptionsOrJustOneOption = !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  if (fallback) {
    return options.map(option => (
      <VariantOptionSelectorComponent
        key={option.id}
        option={option}
        product={product}
        variant="card"
        selectedValue=""
        isTargetingProduct
        selectedOptions={{}}
      />
    ));
  }

  return options.map(option => (
    <VariantOptionSelector key={option.id} option={option} product={product} variant="card" />
  ));
}
