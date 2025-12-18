
// ----------------------------------------------------------------------

import { Box, Skeleton } from "@nimbus-ds/components";
import React from "react";

export const ChatMessageSkeleton = React.memo(() => {  
  const chatMessages = Array.from({ length: 5 }, (_, index) => ({
    id: index,
    width: `${Math.floor(Math.random() * (400 - 100 + 1)) + 100}px`
  }));
  return (
<Box>
  {chatMessages.map((item: any , index) => (
    <Box key={index} mb={ index === chatMessages.length - 1 ? '2' : '4'} p="2" display="flex" justifyContent={index % 2 === 0 ? 'flex-end' : 'flex-start'}>
      <Skeleton width={item.width} height="55px" borderRadius="10px" />
    </Box>
  ))}                
</Box>   
  );
});
