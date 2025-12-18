import { Stack } from "@mui/material";
import { Box, Spinner, Text } from "@nimbus-ds/components";
import { useCallback, useEffect, useRef, useState } from "react";


interface IInfiniteScroll {
  children: React.ReactNode;
  handlePaginationChange: () => void;
  hasMore: boolean;
  fetchingMoreItems: boolean; 
  containerHeight: string;
  loadingText?: string;
}
const InfiniteScroll: React.FC<IInfiniteScroll> = ({
  children,
  handlePaginationChange,
  hasMore,
  fetchingMoreItems,
  containerHeight,
  loadingText
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [distanceBottom, setDistanceBottom] = useState(0);


  const scrollListener = useCallback(() => {
    const bottom = containerRef.current && containerRef.current.scrollHeight - containerRef.current.clientHeight;
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom && bottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2));
    }
    if (containerRef.current && bottom && containerRef.current.scrollTop > bottom - distanceBottom && hasMore && !fetchingMoreItems) {
      handlePaginationChange();
    }
  }, [hasMore, fetchingMoreItems, distanceBottom, handlePaginationChange]);

  useEffect(() => {
    const tableRef: any = containerRef.current;
    if (tableRef) {
      tableRef.addEventListener('scroll', scrollListener);
    }
    return () => {
      if (tableRef) {
        tableRef.removeEventListener('scroll', scrollListener);
      }
    };
  }, [scrollListener]);


    return <Box ref={containerRef} padding='none' overflowY='auto' height={containerHeight}>
      {children}
     {fetchingMoreItems && (
            <>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                sx={{ pr: 5, pl: 2.5 }}
              >
                <Spinner />
                {loadingText && <Text>{loadingText}</Text>}
              </Stack>
            </>
          )}
    </Box>;
  }


export default InfiniteScroll;
