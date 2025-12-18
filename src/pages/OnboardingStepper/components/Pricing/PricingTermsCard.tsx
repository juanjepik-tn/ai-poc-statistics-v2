import nexo from '@/app/NexoClient';
import { Box, List, Text } from '@nimbus-ds/components';
import { getStoreInfo } from '@tiendanube/nexo';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const linksCountryTerms = {
    AR: 'https://www.tiendanube.com/terminos-de-uso',
    BR: 'https://www.nuvemshop.com.br/termos-de-uso',
    CO: 'https://www.tiendanube.com/co/terminos-de-uso',
    CL: 'https://www.tiendanube.com/cl/terminos-de-uso',
    MX: 'https://www.tiendanube.com/mx/terminos-de-uso',
} as const;

const linksCountryPrivacy = {
    AR: 'https://www.tiendanube.com/politicas-de-privacidad',
    BR: 'https://www.nuvemshop.com.br/politica-de-privacidade',
    CO: 'https://www.tiendanube.com/co/politicas-de-privacidad',
    CL: 'https://www.tiendanube.com/cl/politicas-de-privacidad',
    MX: 'https://www.tiendanube.com/mx/politicas-de-privacidad',
} as const;

export const PricingTermsCard: React.FC = () => {
    const { t } = useTranslation('translations');
    const [termsLink, setTermsLink] = useState('');
    const [privacyLink, setPrivacyLink] = useState('');

    useEffect(() => {
        const fetchStoreInfo = async () => {
            const { country } = await getStoreInfo(nexo);            
            if (country in linksCountryTerms) {
                setTermsLink(linksCountryTerms[country as keyof typeof linksCountryTerms]);
            }
            if (country in linksCountryPrivacy) {
                setPrivacyLink(linksCountryPrivacy[country as keyof typeof linksCountryPrivacy]);
            }
        };
        fetchStoreInfo();
    }, []);

    return (
        <>
        <Box display="flex" flexDirection="column" gap="2" padding="2">            
            <Text color="neutral-textLow" fontSize="base" fontWeight="bold">{t('pricing.terms.title')}</Text>
            <List as="ul">
                        <List.Item>
                            <Text color="neutral-textLow" fontSize="caption">
                                <Trans
                                    i18nKey="pricing.terms.description"
                                    components={{
                                        terms: (
                                            <a
                                                href={termsLink}
                                                target="_blank"
                                                style={{ textDecoration: 'underline', fontWeight: 'normal' }}
                                            />
                                        ),
                                        privacy: (
                                            <a
                                                href={privacyLink}
                                                target="_blank"
                                                style={{ textDecoration: 'underline', fontWeight: 'normal' }}
                                            />
                                        ),
                                    }}
                                />
                            </Text>
                        </List.Item>
                        <List.Item><Text color="neutral-textLow"  fontSize="caption">{t('pricing.terms.after-accept')}</Text></List.Item>
                        <List.Item><Text color="neutral-textLow"  fontSize="caption">{t('pricing.terms.suggestion')}</Text></List.Item>
                    </List>
        </Box> 
        </>
    );
}; 