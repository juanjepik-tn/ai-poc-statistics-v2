import i18n from 'i18next';

export function thousandSeparator(
  value: number,
  withoutDecimal = true,
): string {
  const noDecimals = value % 1 === 0;

  const numberFormatter = Intl.NumberFormat(i18n.language, {
    minimumFractionDigits: withoutDecimal && noDecimals ? 0 : 2, // If it has decimals, we add two
    maximumFractionDigits: 2,
  });
  return numberFormatter.format(value);
} 