import { thousandSeparator } from "@/common/utils/thousandSeparator";


const BILLION = 1000000000;
const MILLION = 1000000;
const THOUSAND = 1000;

export function abbreviateNumber(num: number): string {
  const decimal = num % 1 !== 0;

  if (num >= BILLION) {
    const shortNumber = num / BILLION;
    return `${decimal ? shortNumber.toFixed(1) : shortNumber}B`;
  }
  if (num >= MILLION) {
    const shortNumber = num / MILLION;
    return `${decimal ? shortNumber.toFixed(1) : shortNumber}M`;
  }
  if (num >= THOUSAND) {
    const shortNumber = num / THOUSAND;
    return `${decimal ? shortNumber.toFixed(1) : shortNumber}K`;
  }

  return decimal ? thousandSeparator(num) : num.toLocaleString();
}
