import React from 'react';
import { Box, Text } from '@nimbus-ds/components';
import { ChannelType } from '@/types/conversation';

export interface ChannelIconProps {
  channel: ChannelType;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

// WhatsApp Logo SVG - Figma style: squircle (rounded square) with white border
const WhatsAppLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Squircle background - border-radius ~55% of size like Figma */}
    <rect x="0.75" y="0.75" width="28.5" height="28.5" rx="16" fill="#00D95F" stroke="white" strokeWidth="1.5"/>
    {/* WhatsApp logo - simplified speech bubble with phone */}
    <path d="M15 7C10.58 7 7 10.36 7 14.5c0 1.54.5 2.97 1.36 4.14L7 23l4.59-1.2c1.05.56 2.24.88 3.5.88h.41C19.92 22.68 23 19.32 23 15.18 23 10.86 19.42 7 15 7zm4.95 11.05c-.21.59-1.23 1.13-1.69 1.2-.46.08-.89.36-2.91-.61-2.43-1.17-3.97-3.63-4.09-3.8-.12-.17-.96-1.28-.96-2.44s.61-1.73.83-1.97c.22-.24.48-.3.64-.3h.46c.15 0 .35-.06.54.41.21.51.71 1.75.77 1.87.06.13.1.27.02.44-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.24-.1.48.14.23.61 1.01 1.31 1.64.9.8 1.65 1.05 1.89 1.17.24.12.38.1.52-.06.14-.16.59-.69.75-.93.16-.24.32-.2.54-.12.22.08 1.38.65 1.62.77.24.12.4.18.46.28.06.1.06.56-.15 1.15z" fill="white"/>
  </svg>
);

// Instagram Logo SVG - Figma style: squircle with gradient + white border + official logo path
const InstagramLogo: React.FC<{ size: number }> = ({ size }) => {
  const gradientId = `instagramGradient-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gradient at -45deg matching Figma exactly */}
        <linearGradient id={gradientId} x1="30" y1="0" x2="0" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0.0096" stopColor="#FBE18A"/>
          <stop offset="0.2196" stopColor="#FCBB45"/>
          <stop offset="0.3896" stopColor="#F75274"/>
          <stop offset="0.5296" stopColor="#D53692"/>
          <stop offset="0.7496" stopColor="#8F39CE"/>
          <stop offset="1" stopColor="#5B4FE9"/>
        </linearGradient>
      </defs>
      {/* Squircle background - rx ~55% like Figma */}
      <rect x="0.75" y="0.75" width="28.5" height="28.5" rx="16" fill={`url(#${gradientId})`} stroke="white" strokeWidth="1.5"/>
      {/* Instagram logo - exact path from Figma, scaled and centered */}
      <g transform="translate(7.5, 7.5) scale(2.5)">
        <path d="M2.00024 3.00099C2.00024 2.44854 2.44783 2.00058 3.00012 2.00058C3.55241 2.00058 4.00024 2.44854 4.00024 3.00099C4.00024 3.55343 3.55241 4.0014 3.00012 4.0014C2.44783 4.0014 2.00024 3.55343 2.00024 3.00099ZM1.45959 3.00099C1.45959 3.85207 2.14929 4.54196 3.00012 4.54196C3.85095 4.54196 4.54065 3.85207 4.54065 3.00099C4.54065 2.14991 3.85095 1.46002 3.00012 1.46002C2.14929 1.46002 1.45959 2.14991 1.45959 3.00099ZM4.24162 1.39892C4.24159 1.47014 4.26268 1.53977 4.30221 1.59901C4.34175 1.65825 4.39795 1.70443 4.46373 1.73171C4.5295 1.75899 4.60188 1.76615 4.67173 1.75229C4.74157 1.73842 4.80573 1.70415 4.8561 1.6538C4.90647 1.60346 4.94078 1.53931 4.9547 1.46946C4.96862 1.39961 4.96152 1.3272 4.9343 1.26138C4.90707 1.19557 4.86095 1.13931 4.80177 1.09971C4.74258 1.06012 4.67298 1.03897 4.60178 1.03894H4.60163C4.50619 1.03899 4.41467 1.07692 4.34716 1.14442C4.27966 1.21191 4.2417 1.30345 4.24162 1.39892V1.39892ZM1.78807 5.44372C1.49557 5.43039 1.33659 5.38166 1.23094 5.34048C1.09087 5.28594 0.990928 5.22097 0.885851 5.11601C0.780775 5.01105 0.715733 4.91117 0.661442 4.77106C0.620257 4.66543 0.571535 4.50635 0.558238 4.21377C0.543694 3.89744 0.54079 3.80242 0.54079 3.00101C0.54079 2.1996 0.543934 2.10484 0.558238 1.78825C0.571559 1.49567 0.620641 1.3369 0.661442 1.23096C0.715973 1.09085 0.780919 0.990878 0.885851 0.885771C0.990784 0.780665 1.09063 0.715603 1.23094 0.661297C1.33654 0.6201 1.49557 0.571364 1.78807 0.558063C2.10431 0.543515 2.1993 0.54061 3.00012 0.54061C3.80094 0.54061 3.89603 0.543755 4.21253 0.558063C4.50503 0.571388 4.66375 0.620484 4.76966 0.661297C4.90973 0.715603 5.00967 0.780809 5.11475 0.885771C5.21983 0.990734 5.28463 1.09085 5.33916 1.23096C5.38034 1.33659 5.42907 1.49567 5.44236 1.78825C5.45691 2.10484 5.45981 2.1996 5.45981 3.00101C5.45981 3.80242 5.45691 3.89718 5.44236 4.21377C5.42904 4.50635 5.38008 4.66538 5.33916 4.77106C5.28463 4.91117 5.21968 5.01114 5.11475 5.11601C5.00982 5.22088 4.90973 5.28594 4.76966 5.34048C4.66406 5.38168 4.50503 5.43042 4.21253 5.44372C3.89629 5.45827 3.8013 5.46117 3.00012 5.46117C2.19894 5.46117 2.10421 5.45827 1.78807 5.44372V5.44372ZM1.76323 0.018174C1.44385 0.0327228 1.22561 0.0833794 1.03502 0.157564C0.837633 0.234173 0.670539 0.336951 0.503564 0.50371C0.336589 0.670468 0.234105 0.837875 0.157518 1.03532C0.0833553 1.22608 0.0327133 1.44427 0.0181687 1.76374C0.00338414 2.08372 0 2.18601 0 3.00099C0 3.81596 0.00338414 3.91826 0.0181687 4.23823C0.0327133 4.55773 0.0833553 4.77589 0.157518 4.96666C0.234105 5.16398 0.336613 5.33158 0.503564 5.49826C0.670515 5.66495 0.837633 5.76758 1.03502 5.84441C1.22597 5.91859 1.44385 5.96925 1.76323 5.9838C2.08328 5.99835 2.18538 6.00197 3.00012 6.00197C3.81486 6.00197 3.91712 5.99859 4.23701 5.9838C4.55641 5.96925 4.77451 5.91859 4.96522 5.84441C5.16249 5.76758 5.3297 5.66502 5.49668 5.49826C5.66365 5.3315 5.76592 5.16398 5.84272 4.96666C5.91689 4.77589 5.96777 4.55771 5.98207 4.23823C5.99662 3.91802 6 3.81596 6 3.00099C6 2.18601 5.99662 2.08372 5.98207 1.76374C5.96753 1.44424 5.91689 1.22596 5.84272 1.03532C5.76592 0.837995 5.66339 0.670732 5.49668 0.50371C5.32997 0.336687 5.16249 0.234173 4.96546 0.157564C4.77451 0.0833794 4.55639 0.0324827 4.23725 0.018174C3.91736 0.00362519 3.8151 0 3.00036 0C2.18562 0 2.08328 0.00338511 1.76323 0.018174Z" fill="white"/>
      </g>
    </svg>
  );
};

// Messenger Logo SVG - Figma style: blue circle with white border
const MessengerLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="8" fill="#007AFF" stroke="white" strokeWidth="1.5"/>
    <path d="M9 4.5C6.1 4.5 4 6.8 4 9.3c0 1.4.7 2.6 1.8 3.4v1.6l1.5-.8c.4.1.8.2 1.2.2h.5c2.9 0 5-2.3 5-4.8 0-2.5-2.1-4.4-5-4.4zm.5 5.9l-1.3-1.4-2.5 1.4 2.7-2.9 1.3 1.4 2.5-1.4-2.7 2.9z" fill="white"/>
  </svg>
);

const CHANNEL_CONFIG = {
  whatsapp: {
    label: 'WhatsApp',
    LogoComponent: WhatsAppLogo,
  },
  instagram: {
    label: 'Instagram',
    LogoComponent: InstagramLogo,
  },
  facebook: {
    label: 'Facebook Messenger',
    LogoComponent: MessengerLogo,
  },
};

const SIZE_MAP = {
  small: 18,
  medium: 24,
  large: 32,
};

export const ChannelIcon: React.FC<ChannelIconProps> = ({
  channel,
  size = 'medium',
  showLabel = false,
  className,
}) => {
  const config = CHANNEL_CONFIG[channel];

  if (!config) {
    return null;
  }

  const LogoComponent = config.LogoComponent;

  return (
    <Box display="flex" alignItems="center" gap="1" className={className}>
      <LogoComponent size={SIZE_MAP[size]} />
      {showLabel && (
        <Text fontSize="caption" color="neutral-textHigh">
          {config.label}
        </Text>
      )}
    </Box>
  );
};

export default ChannelIcon;


