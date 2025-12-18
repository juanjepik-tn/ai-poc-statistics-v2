import { thousandSeparator } from "@/common/utils/thousandSeparator";
import { formatPrice } from "@/pages/Costs/utils/formatPrice";
import { Box, Tag, Text } from "@nimbus-ds/components";
import { format, parseISO } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";

interface PaymentItemProps {
  payment: any;
  currentPlan: any;
  storeCountry: string;
}
const PaymentItem: React.FC<PaymentItemProps> = ({ payment, currentPlan, storeCountry }) => {
  const { t } = useTranslation('translations');
  const formatCurrencyValue = (value: number) => {
    return formatPrice(
        storeCountry, 
        currentPlan?.country?.currency ?? '', 
        thousandSeparator(value)
    );
};
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Text fontWeight="medium">
          {payment.description}
        </Text>
        <Text>{formatCurrencyValue(payment.amount)}</Text>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Text>{t('costs.lastPayments.cycle', {
          startCycle: format(parseISO(payment.start_date), "dd/MM/yyyy"),
          endCycle: format(parseISO(payment.end_date), "dd/MM/yyyy"),
          interpolation: { escapeValue: false }
        })}</Text>
      </Box>
      <Box display="flex" flexWrap="wrap" gap="2" pt="2">
        <Tag appearance={payment.status === 'Paid' ? 'success' : 'warning'}>
          {t(`costs.lastPayments.${payment.status}`)}
        </Tag>
      </Box>
    </>
  );
};
export default PaymentItem;