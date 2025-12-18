import React from 'react';
import { Box, Card, Text, Icon, Tooltip } from '@nimbus-ds/components';
import { InfoCircleIcon } from '@nimbus-ds/icons';
import { thousandSeparator } from '@/common/utils/thousandSeparator';

export interface FunnelStep {
  id: string;
  label: string;
  value: number;
  color: string;
  helpText?: string;
}

interface ConversationFunnelProps {
  title: string;
  steps: FunnelStep[];
  currencySymbol?: string;
  showCurrency?: boolean;
  conversionLabel?: string;
  totalConversionLabel?: string;
  totalLossLabel?: string;
}

const ConversationFunnel: React.FC<ConversationFunnelProps> = ({
  title,
  steps,
  currencySymbol = '$',
  showCurrency = false,
  totalConversionLabel = 'Conversión Total',
  totalLossLabel = 'Pérdida en Embudo',
}) => {
  const maxValue = steps.length > 0 ? steps[0].value : 1;

  const getConversionRate = (currentIndex: number): number => {
    if (currentIndex === 0) return 100;
    const previousValue = steps[currentIndex - 1]?.value || 1;
    const currentValue = steps[currentIndex]?.value || 0;
    return (currentValue / previousValue) * 100;
  };

  const formatValue = (value: number): string => {
    return showCurrency ? `${currencySymbol}${thousandSeparator(value)}` : thousandSeparator(value);
  };

  const funnelColors = ['#4483B9', '#5BA4D9', '#47B5A0', '#5BBD72'];

  return (
    <Card>
      <Card.Header title={title} />
      <Card.Body>
        <Box display="flex" flexDirection="column" gap="4">
          {/* Horizontal Funnel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {steps.map((step, index) => {
              const widthPercentage = maxValue > 0 ? Math.max((step.value / maxValue) * 100, 15) : 15;
              const isLast = index === steps.length - 1;
              const conversionRate = getConversionRate(index);
              const overallRate = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
              const color = funnelColors[index % funnelColors.length];

              return (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '8px 0',
                  }}
                >
                  {/* Step label */}
                  <div
                    style={{
                      width: '160px',
                      minWidth: '160px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#333',
                      }}
                    >
                      {step.label}
                    </span>
                    {step.helpText && (
                      <Tooltip content={step.helpText} position="top">
                        <Icon color="neutral-textDisabled" source={<InfoCircleIcon size="small" />} />
                      </Tooltip>
                    )}
                  </div>

                  {/* Progress bar container */}
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    {/* Bar */}
                    <div
                      style={{
                        flex: 1,
                        height: '32px',
                        backgroundColor: '#F4F6F8',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: `${widthPercentage}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '12px',
                          transition: 'width 0.5s ease-out',
                          minWidth: '80px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'white',
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          }}
                        >
                          {formatValue(step.value)}
                        </span>
                      </div>
                    </div>

                    {/* Percentage badge */}
                    <div
                      style={{
                        minWidth: '70px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: color,
                        }}
                      >
                        {overallRate.toFixed(1)}%
                      </span>
                      {index > 0 && (
                        <span
                          style={{
                            fontSize: '11px',
                            color: conversionRate >= 50 ? '#2E7D32' : '#E65100',
                          }}
                        >
                          ↓ {conversionRate.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: '24px',
              paddingTop: '12px',
              borderTop: '1px solid #E4E9F2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#566176' }}>
                {totalConversionLabel}:
              </span>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#2E7D32',
                }}
              >
                {((steps[steps.length - 1]?.value || 0) / maxValue * 100).toFixed(1)}%
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#566176' }}>
                {totalLossLabel}:
              </span>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#C62828',
                }}
              >
                {(100 - (steps[steps.length - 1]?.value || 0) / maxValue * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Box>
      </Card.Body>
    </Card>
  );
};

export default ConversationFunnel;
