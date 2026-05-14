'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { CartProduct, Product, ProductOption, ProductVariant, SelectedOptions } from '@/lib/shopify/types';
import { startTransition, useMemo } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { useParams, useSearchParams } from 'next/navigation';
import { ColorSwatch } from '@/components/ui/color-picker';
import { Button } from '@/components/ui/button';
import { getColorHex } from '@/lib/utils';
import { getShopifyProductId } from '@/lib/shopify/utils';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

const variantOptionSelectorVariants = cva('flex items-start gap-4', {
  variants: {
    variant: {
      card: 'rounded-md bg-popover py-2 px-3 justify-between',
      condensed: 'justify-start',
    },
  },
  defaultVariants: {
    variant: 'card',
  },
});

interface VariantOptionSelectorComponentProps extends VariantProps<typeof variantOptionSelectorVariants> {
  option: ProductOption;
  product: Product;
  selectedValue: string;
  selectedOptions: Record<string, string>;
  isTargetingProduct: boolean;
  onSelect?: (valueName: string) => void;
}

export function VariantOptionSelectorComponent({
  option,
  variant,
  product,
  selectedValue,
  selectedOptions,
  isTargetingProduct,
  onSelect,
}: VariantOptionSelectorComponentProps) {
  const { variants, options } = product;
  const optionNameLowerCase = option.name.toLowerCase();

  const combinations: Combination[] = Array.isArray(variants)
    ? variants.map(variant => ({
        id: variant.id,
        availableForSale: variant.availableForSale,
        ...variant.selectedOptions.reduce(
          (accumulator, option) => ({
            ...accumulator,
            [option.name.toLowerCase()]: option.value,
          }),
          {}
        ),
      }))
    : [];

  const isColorOption = optionNameLowerCase === 'color';

  return (
    <dl className={variantOptionSelectorVariants({ variant })}>
      <dt className="text-base font-semibold leading-8">{option.name}</dt>
      <dd className="flex flex-wrap gap-2">
        {option.values.map(value => {
          const currentState = selectedOptions;
          const optionParams = {
            ...currentState,
            [optionNameLowerCase]: value.id,
          };

          const filtered = Object.entries(optionParams).filter(([key, value]) =>
            options.find(option => option.name.toLowerCase() === key && option.values.some(val => val.name === value))
          );
          const isAvailableForSale = combinations.find(combination =>
            filtered.every(([key, value]) => combination[key] === value && combination.availableForSale)
          );

          const isActive = isTargetingProduct && selectedValue === value.name;

          if (isColorOption) {
            const color = getColorHex(value.name);
            const name = value.name.split('/');

            return (
              <ColorSwatch
                key={value.id}
                color={
                  Array.isArray(color)
                    ? [
                        { name: name[0], value: color[0] },
                        { name: name[1], value: color[1] },
                      ]
                    : { name: name[0], value: color }
                }
                isSelected={isActive}
                onColorChange={() => onSelect?.(value.name)}
                size={variant === 'condensed' ? 'sm' : 'md'}
                atLeastOneColorSelected={!!selectedValue}
              />
            );
          }

          return (
            <Button
              onClick={() => onSelect?.(value.name)}
              key={value.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              disabled={!isAvailableForSale}
              title={`${option.name} ${value.name}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
              className="min-w-[40px]"
            >
              {value.name}
            </Button>
          );
        })}
      </dd>
    </dl>
  );
}

interface VariantOptionSelectorProps extends VariantProps<typeof variantOptionSelectorVariants> {
  option: ProductOption;
  product: Product;
}

export function VariantOptionSelector({ option, variant, product }: VariantOptionSelectorProps) {
  const pathname = useParams<{ handle?: string }>();
  const optionNameLowerCase = option.name.toLowerCase();

  const [selectedValue, setSelectedValue] = useQueryState(optionNameLowerCase, parseAsString.withDefault(''));
  const [activeProductId, setActiveProductId] = useQueryState('pid', parseAsString.withDefault(''));

  const selectedOptions = useSelectedOptions(product);

  const isProductPage = pathname.handle === product.handle;
  const isTargetingProduct = isProductPage || activeProductId === getShopifyProductId(product.id);

  const handleSelect = (valueName: string) => {
    startTransition(() => {
      setSelectedValue(valueName);
      if (!isProductPage) {
        setActiveProductId(getShopifyProductId(product.id));
      }
    });
  };

  return (
    <VariantOptionSelectorComponent
      option={option}
      variant={variant}
      product={product}
      selectedValue={selectedValue}
      selectedOptions={selectedOptions}
      isTargetingProduct={isTargetingProduct}
      onSelect={handleSelect}
    />
  );
}

export const useSelectedOptions = (product: Product): Record<string, string> => {
  const { options } = product;
  const searchParams = useSearchParams();

  const selectedOptions = useMemo(() => {
    const state: Record<string, string> = {};
    options.forEach(option => {
      const key = option.name.toLowerCase();
      const value = searchParams.get(key);
      if (value) state[key] = value;
    });
    return state;
  }, [options, searchParams]);

  return selectedOptions;
};

export const useSelectedVariant = (product: Product) => {
  const selectedOptions = useSelectedOptions(product);

  const selectedVariant = useMemo(() => {
    const { variants } = product;
    return Array.isArray(variants)
      ? variants.find((variant: ProductVariant) =>
          variant.selectedOptions.every(option => option.value === selectedOptions[option.name.toLowerCase()])
        )
      : undefined;
  }, [product, selectedOptions]);

  return selectedVariant;
};

export const useProductImages = (product: Product | CartProduct, selectedOptions?: SelectedOptions) => {
  const images = useMemo(() => {
    return Array.isArray(product.images) ? product.images : [];
  }, [product.images]);

  const optionsObject = useMemo(() => {
    return selectedOptions?.reduce(
      (acc, option) => {
        acc[option.name.toLowerCase()] = option.value.toLowerCase();
        return acc;
      },
      {} as Record<string, string>
    );
  }, [selectedOptions]);

  // Try to match images by alt text with selected variant values
  // This enables Shopify products to show different images when variants are selected
  // by matching the image alt text with variant names (e.g., "Red Shirt" shows when Red is selected)
  const variantImagesByAlt = useMemo(() => {
    if (!optionsObject || Object.keys(optionsObject).length === 0) return [];

    const selectedValues = Object.values(optionsObject);

    return images.filter(image => {
      if (!image.altText) return false;

      const altTextLower = image.altText.toLowerCase();

      // Check if any selected variant value is mentioned in the alt text
      return selectedValues.some(value => altTextLower.includes(value.toLowerCase()));
    });
  }, [optionsObject, images]);

  // Original logic for images with selectedOptions metadata
  const variantImages = useMemo(() => {
    if (!optionsObject) return [];

    return images.filter(image => {
      return Object.entries(optionsObject || {}).every(([key, value]) =>
        image.selectedOptions?.some(option => option.name === key && option.value === value)
      );
    });
  }, [optionsObject, images]);

  const defaultImages = images.filter(image => !image.selectedOptions);
  const featuredImage = product.featuredImage;

  // Prioritize images with selectedOptions metadata first
  if (variantImages.length > 0) {
    return variantImages;
  }

  // Then try images matched by alt text (for Shopify products with 2+ variants)
  if (variantImagesByAlt.length > 0) {
    return variantImagesByAlt;
  }

  // Fall back to default images
  if (defaultImages.length > 0) {
    return defaultImages;
  }

  // Final fallback to featured image
  if (featuredImage) {
    return [featuredImage];
  }

  // Ultimate fallback - return first image or empty array
  return images.length > 0 ? [images[0]] : [];
};
