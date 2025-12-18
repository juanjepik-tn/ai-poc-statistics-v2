import React, { useState } from 'react';
import { Alert, Link, Text } from '@nimbus-ds/components';
import { Trans, useTranslation } from 'react-i18next';
import { goTo } from '@tiendanube/nexo';
import { nexo } from '@/app';
import { BillingStatus } from '@/types/billingDTO';


interface AlertComponentProps {
  type: BillingStatus;
  daysLeft?: number;
  isCostumerInvoice?: boolean;
}

const PricingAlertStatus: React.FC<AlertComponentProps> = ({ type, daysLeft, isCostumerInvoice }) => {
  const { t } = useTranslation('translations');
  const [showAlert, setShowAlert] = useState(() => {
    const savedState = localStorage.getItem(`alert-${type}`);    
    return (savedState !== null ? JSON.parse(savedState) : true) && !(type === 'active' && isCostumerInvoice);
  });
  const handleRemoveAlert = () => {
    setShowAlert(false);
    localStorage.setItem(`alert-${type}`, JSON.stringify(false));
  };
  const getAlertAppearance = () => {
    switch (type) {
      case 'freetrial':
      case 'active':
        return 'primary';
      case 'non_payment':
        return 'warning';
      case 'inactive':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const renderAlertContent = () => {
    switch (type) {
      case 'freetrial':
        return <Text fontWeight="bold" color="primary-textLow">{t('pricing.alert.trial', { daysLeft })}</Text>;
      case 'active':
        return <Text fontWeight="bold" color="primary-textLow">{t('pricing.alert.trialEnded')}</Text>;
      case 'non_payment':
        return (
          <Text fontWeight="bold" color="warning-textLow">
            <Trans
              i18nKey="pricing.alert.paymentDue"
              components={{
                a: <a onClick={() => goTo(nexo, '/account/checkout/charges/')} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'primary' }} />
              }}
            />
            <Link appearance="primary" onClick={() => goTo(nexo, '/account/checkout/charges/')}>{t('pricing.paymentRequired.cta')}</Link>
          </Text>
        );
      case 'inactive':
        return <Text fontWeight="bold" color="danger-textLow">
          {t('pricing.alert.paymentError')}
          <Link appearance="primary" onClick={() => goTo(nexo, '/account/checkout/charges/')}>{t('pricing.paymentRequired.cta')}</Link>
        </Text>;
      default:
        return null;
    }
  };

  return (

      <Alert
        appearance={getAlertAppearance()}
        show={showAlert}
        {...(type === 'freetrial' || type === 'active' ? { onRemove: handleRemoveAlert } : {})}
      >
        {renderAlertContent()}
      </Alert>
  );
};

export default PricingAlertStatus;