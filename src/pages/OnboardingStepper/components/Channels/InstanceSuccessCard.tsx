import InstanceCard, { Instance } from '@/pages/Configurations/components/InstanceCard';
import { Box, Card, Title } from '@nimbus-ds/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type InstanceCardProps = {
    instance: Instance | undefined;
    onDelete: (basePath: string, instanceId: string) => void;
};

const InstanceSuccessCard: React.FC<InstanceCardProps> = ({ onDelete, instance }) => {
    const { t } = useTranslation('translations');
    const [currentInstance, setCurrentInstance] = useState<Instance | undefined>(undefined);
    useEffect(() => {
        if (instance) {
            setCurrentInstance(instance);
        }
    }, [instance])
    const generateSteps = (
        <Box color="neutral-textLow" gap="4" marginTop="4" width="100%">
            {currentInstance && (
                <InstanceCard
                    instance={currentInstance}
                    onDelete={() => { onDelete(currentInstance.basePath, currentInstance.id) }}
                />
            )}            
        </Box>
    );
    return (
        <Card>
            <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" gap="2">
                <Title as="h4">{t('instances.instance-success-card.title')}</Title>
                {generateSteps}
            </Box>
        </Card>
        
    );
};
export default InstanceSuccessCard;
