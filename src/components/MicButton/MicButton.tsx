import React from 'react';

const MicIcon: React.FC<{width?: number| string; height?: number| string}> = ({width = 'auto', height = 'auto'}) => {
  return (
    <img src="/imgs/mic-icon.svg" alt="CameraIcon" width={width} height={height} />
  );
};

export default MicIcon;