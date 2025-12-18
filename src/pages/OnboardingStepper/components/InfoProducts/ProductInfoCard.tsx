import React from 'react';
import { Box, Card, Checkbox, List, Text } from '@nimbus-ds/components';

type ProductInfoCardProps = {
  t: any;
  isChecked: boolean;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ t, isChecked, handleCheckboxChange }) => {
  return (
    <Card>
      <Card.Header title={t('settings.info-products.subtitle')} />
      <Card.Body>
        <Box display="flex" flexDirection="column" gap="4">
          <Checkbox name='ai-authorization' label={t('settings.info-products.checkbox')} onChange={handleCheckboxChange} checked={isChecked} />
          <List as="ul">
            <List.Item>{t('settings.info-products.product-title')}</List.Item>
            <List.Item>{t('settings.info-products.product-description')}</List.Item>
            <List.Item>{t('settings.info-products.product-price')}</List.Item>
            <List.Item>{t('settings.info-products.product-stock')}</List.Item>
            <List.Item>{t('settings.info-products.product-related')}</List.Item>
            <List.Item>{t('settings.info-products.product-variants')}</List.Item>
          </List>
          <Text as="span" color="primary-textLow">
            {t('settings.info-products.footnote')}
          </Text>
        </Box>
      </Card.Body>
    </Card>
  );
};

export default ProductInfoCard; 