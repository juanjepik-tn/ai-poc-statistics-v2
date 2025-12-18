/**
 * POC UI Playground - Back Button
 * Uses react-router-dom instead of Nexo
 */

import { Button, Icon, Text } from '@nimbus-ds/components';
import { ChevronLeftIcon } from '@nimbus-ds/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BackButton: React.FC = () => {
    const { t } = useTranslation('translations');
    const navigate = useNavigate();

    const handleBack = () => {
        // Try to go back in history, or go to home
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <Button appearance="transparent" onClick={handleBack}>
            <Icon source={<ChevronLeftIcon />} />
            <Text>
                {t('base-layout.back')}
            </Text>
        </Button>
    );
}

export default BackButton;
