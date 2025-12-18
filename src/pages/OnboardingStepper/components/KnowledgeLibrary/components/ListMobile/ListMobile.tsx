import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Card, IconButton, Spinner, Tag, Text } from '@nimbus-ds/components';
import { EditIcon, TiendanubeIcon, TrashIcon } from '@nimbus-ds/icons';

import { DataList } from '@nimbus-ds/patterns';
import { IContentItem } from '../../step2.types';
import { useTranslation } from 'react-i18next';

const ListMobile: React.FC<{
  contentList: IContentItem[];
  onEditContent: (content: IContentItem) => void;
  onDeleteContent: (content: IContentItem) => void;
  fetchMoreData: () => void;
  totalContent: number;
  fetchingMoreData: boolean;
}> = ({ contentList, onEditContent, onDeleteContent, fetchMoreData, totalContent, fetchingMoreData }) => {

  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [distanceBottom, setDistanceBottom] = useState(0);
  const { t } = useTranslation('translations');
  
  useEffect(() => {
    setHasMore(contentList.length < totalContent);
  }, [contentList, totalContent]);

  const scrollListener = useCallback(() => {
    const bottom = containerRef.current && containerRef.current.scrollHeight - containerRef.current.clientHeight;
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom && bottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2));
    }
    if (containerRef.current && bottom && containerRef.current.scrollTop > bottom - distanceBottom && hasMore && !fetchingMoreData) {      
      fetchMoreData();
    }
  }, [hasMore, distanceBottom, fetchMoreData]);

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

  return (
    <Card>
      <Card.Body>
        <Box ref={containerRef} padding='none' overflow='scroll' height="70vh">
          <DataList>         
            {contentList.map((content) => (
              <DataList.Row key={content.id} flexDirection="row" gap="2" width="100%">
                <Box display="flex" gap="2" flex="1 1 auto">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                  >
                    <Text>{content.title}</Text>
                    {content.iaGenerated && <Tag appearance="primary">
                      <Text color="primary-textLow" fontSize='caption'>{t('settings.step2.iaGenerated')}</Text>
                      <TiendanubeIcon/>
                      <img src="/imgs/ia-icon.svg" alt="WandIcon" />
                    </Tag>}
                  </Box>
                </Box>
                <Box display="flex" gap="2" alignItems="center" justifyContent="center">
                  <IconButton
                    onClick={() => onEditContent(content)}
                    source={<EditIcon />}
                    size="2rem"
                  />
                  <IconButton
                    onClick={() => onDeleteContent(content)}
                    source={<TrashIcon />}
                    size="2rem"
                  />
                </Box>
              </DataList.Row>
            ))}
          </DataList> 
          {fetchingMoreData && (
                <>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="space-between"
                    padding="2"
                  >
                    <Spinner />
                    <Text>{t('common.loading')}</Text>
                  </Box>
                </>
              )}
        </Box>
      </Card.Body>
    </Card>
  );
};

export default ListMobile;
