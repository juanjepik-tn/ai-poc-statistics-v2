import { Box } from '@nimbus-ds/components';

export const WhatsappIllustration = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      maxWidth="280px"
    >
      <img
        src="/imgs/heroWhatsapp.svg"
        alt="WhatsApp Integration"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Box>
  );
};

