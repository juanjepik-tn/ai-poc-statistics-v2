import { Box, Button, Card, Tag, Text, Title } from '@nimbus-ds/components';
import { FeatureListItem } from './FeatureListItem';

type FeatureItem = {
  text: string;
  enabled: boolean;
};

type WhatsappOptionCardProps = {
  title: string;
  isRecommended?: boolean;
  features: FeatureItem[];
  buttonText: string;
  buttonVariant?: 'primary' | 'neutral';
  onButtonClick: () => void;
};

export const WhatsappOptionCard = ({
  title,
  isRecommended = false,
  features,
  buttonText,
  buttonVariant = 'primary',
  onButtonClick,
}: WhatsappOptionCardProps) => {
  return (
    <Card style={{ height: '100%' }}>
      <Card.Body>
        <Box 
          display="flex" 
          flexDirection="column" 
          gap="4" 
          height="100%"
        >
          <Box minHeight="24px">
            {isRecommended && (
              <Tag appearance="primary">
                <Text color="primary-textLow" fontSize="caption">
                  Recomendado
                </Text>
              </Tag>
            )}
          </Box>

          <Title as="h3">{title}</Title>

          <Box display="flex" flexDirection="column" gap="2" flex="1">
            {features.map((feature, index) => (
              <FeatureListItem
                key={index}
                text={feature.text}
                enabled={feature.enabled}
              />
            ))}
          </Box>

          <Box>
            <Button appearance={buttonVariant} onClick={onButtonClick}>
              {buttonText}
            </Button>
          </Box>
        </Box>
      </Card.Body>
    </Card>
  );
};

