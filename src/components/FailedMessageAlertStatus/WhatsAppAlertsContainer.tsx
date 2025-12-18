import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@nimbus-ds/components';
import axios, { API_ENDPOINTS } from '@/app/Axios/Axios';
import { HealthStatusResponse } from '@/types/instancesDTO';
import { useStoreDetails, useStoreTag } from '@/hooks';
import HealthStatusAlert from './HealthStatusAlert';
import BusinessVerificationAlert from './BusinessVerificationAlert';

interface WhatsAppChannel {
  id: number;
  name: string;
  whatsapp_status: string;
}

const BV_ALERT_TAG = 'nuvem-chat-show-bv-alert';

const WhatsAppAlertsContainer: React.FC = () => {
  const [healthStatusResults, setHealthStatusResults] = useState<Array<HealthStatusResponse | null>>([]);
  const [whatsappBusinessChannels, setWhatsappBusinessChannels] = useState<WhatsAppChannel[]>([]);
  const { storeDetails } = useStoreDetails();
  const showBusinessVerificationAlert = useStoreTag(BV_ALERT_TAG);
  
  const channels = useMemo(
    () => storeDetails?.channelsList || [],
    [storeDetails?.channelsList]
  );

  useEffect(() => {
    const fetchHealthStatus = async () => {
      if (!channels || channels.length === 0) return;

      try {
        const filteredChannels: WhatsAppChannel[] = channels.filter(
          (channel: any) =>
            channel.name === 'WhatsAppBusiness' &&
            channel.whatsapp_status === 'Connected'
        ).map((channel: any) => ({
          id: channel.id,
          name: channel.name,
          whatsapp_status: channel.whatsapp_status
        }));

        if (filteredChannels.length === 0) {
          setHealthStatusResults([]);
          setWhatsappBusinessChannels([]);
          return;
        }

        const healthStatusPromises = filteredChannels.map((channel) =>
          axios
            .get<HealthStatusResponse>(
              API_ENDPOINTS.whatsappBusiness.healthStatus(channel.id.toString())
            )
            .then(response => response.data)
            .catch(() => null)
        );

        const results = await Promise.all(healthStatusPromises);
        setHealthStatusResults(results);
        setWhatsappBusinessChannels(filteredChannels);
      } catch (error) {
        setHealthStatusResults([]);
        setWhatsappBusinessChannels([]);
      }
    };

    fetchHealthStatus();
  }, [channels]);

  if (healthStatusResults.length === 0 || whatsappBusinessChannels.length === 0) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" gap="2">
      <HealthStatusAlert 
        healthStatusResults={healthStatusResults}
        whatsappBusinessChannels={whatsappBusinessChannels}
      />
      {showBusinessVerificationAlert && (
        <BusinessVerificationAlert 
          healthStatusResults={healthStatusResults}
        />
      )}
    </Box>
  );
};

export default WhatsAppAlertsContainer;

