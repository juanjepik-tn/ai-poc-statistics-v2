import {
  Box,
  Button,
  Pagination,
  Popover,
  Table,
  Tag,
  Text,
} from '@nimbus-ds/components';
import { EditIcon, EllipsisIcon, TiendanubeIcon, TrashIcon } from '@nimbus-ds/icons';
import { Layout } from '@nimbus-ds/patterns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IContentItem } from '../../step2.types';
import ContentForm from '../../ContentForm';

const pageSize = 10;

interface Props {
  contentList: IContentItem[];
  onEditContent: (content: IContentItem) => void;
  onDeleteContent: (content: IContentItem) => void;
  totalContent: number;
  fetchMoreData: () => void;
}

const ListDesktop: React.FC<Props> = ({
  contentList,
  onEditContent,
  onDeleteContent,
  totalContent,
  fetchMoreData,
}) => {
  useEffect(() => {
    setRows(contentList);
  }, [contentList]);
  const { t } = useTranslation('translations');

  const [rows, setRows] = useState<IContentItem[]>(contentList);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortDirection] = useState<'ascending' | 'descending'>('descending');
  const [sortColumn] = useState<'id' | 'clientName'>('id');

  const handlePageChange = (page: number): void => {    
    setCurrentPage(page);
  };
  useEffect(() => {
    if (rows.length > 0) { 
      const displeyedRows = getDisplayedRows();      
      if (displeyedRows.length === 0) {
        fetchMoreData();
      }
    }
  }, [currentPage, totalContent, rows]);
  const sortCompareFunction = (rowA: IContentItem, rowB: IContentItem) => {
    if (sortColumn === 'id') {
      return sortDirection === 'ascending'
        ? rowA.id - rowB.id
        : rowB.id - rowA.id;
    }
    return 0;
  };

  const getDisplayedRows = (): IContentItem[] => {
    const sortedRows = rows?.slice().sort(sortCompareFunction);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedRows.slice(startIndex, endIndex);
  };

  const displayedRows = getDisplayedRows();
  const totalRows = totalContent;
  const firstRow = (currentPage - 1) * pageSize + 1;
  const lastRow = Math.min(currentPage * pageSize, totalRows);
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prevState) => !prevState);
  // @ts-ignore
  const [popoverOpen, setPopoverOpen] = useState<number | null>(null);
  const [currentEntity] = useState<IContentItem | null>(null);
  const headers = [
    t('settings.step2.title-input'),
    t('settings.step2.content'),
    t('settings.actions'),
  ];

  return (
    <>
      <Box>
        <Table>
          <Table.Head>
            <Table.Cell
              key="header-1"
              backgroundColor="neutral-surface"
              width="50%"
              as="th"
              padding="base"
            >
              {headers[0]}
            </Table.Cell>
            <Table.Cell
              key="header-2"
              backgroundColor="neutral-surface"
              width="40%"
              as="th"
              padding="base"
            >
              {headers[1]}
            </Table.Cell>
            <Table.Cell
              key="header-3"
              backgroundColor="neutral-surface"
             width="10%"
              as="th"
              padding="base"
            >
              {headers[2]}
            </Table.Cell>
          </Table.Head>
          <Table.Body>
            {displayedRows.map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell width="50%">
                  <Box alignItems="flex-start" display="flex" pl="1" gap="2">
                    <Text>{row.title}</Text>
                    {row.tool && <Tag appearance="primary">
                      <Text color="primary-textLow" fontSize='caption'>{t('settings.step2.iaGenerated')}</Text>
                      <TiendanubeIcon/>
                      <img src="/imgs/ia-icon.svg" alt="WandIcon" />
                    </Tag>}
                  </Box>
                </Table.Cell>
                <Table.Cell width="40%">
                <Text color="primary-textLow" fontSize='caption' lineClamp={1}>{row.content}</Text>
                </Table.Cell>
                <Table.Cell width="10%">
                  <Popover
                    visible={popoverOpen === row.id}
                    onVisibility={(visible) =>
                      setPopoverOpen(visible ? row.id : null)
                    }
                    content={
                      <>
                        <Layout columns="1">
                          <Layout.Section>
                            <Box display="flex" flexDirection="column">
                              <Button
                                appearance="transparent"
                                onClick={() => {
                                  setPopoverOpen(null);
                                  onEditContent(row);
                                }}
                              >
                                <Text>
                                  <EditIcon style={{ cursor: 'pointer' }} />
                                </Text>
                                <Text>{t('settings.edit')}</Text>
                              </Button>
                              <Button
                                appearance="transparent"
                                onClick={() => {
                                  setPopoverOpen(null);
                                  onDeleteContent(row);
                                }}
                              >
                                <Text>
                                  <TrashIcon style={{ cursor: 'pointer' }} />
                                </Text>
                                <Text>{t('settings.delete')}</Text>
                              </Button>
                            </Box>
                          </Layout.Section>
                        </Layout>
                      </>
                    }
                    position="bottom-start"
                  >
                    <EllipsisIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        setPopoverOpen(popoverOpen === row.id ? null : row.id)
                      }
                    />
                  </Popover>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {totalContent > 10 && (
          <Box display="flex" justifyContent="space-between" p="2">
            <Text>
              {`${t('settings.step2.showing')} ${firstRow}-${lastRow} ${t(
                'settings.step2.content',
              ).toLowerCase()} de ${totalRows}`}
            </Text>
            <Pagination
              activePage={currentPage}
              onPageChange={handlePageChange}
              pageCount={Math.ceil(totalRows / pageSize)}
            />
          </Box>
        )}
      </Box>

      {/* @ts-ignore */}
      <ContentForm
        source='onboarding'
        content={currentEntity || undefined}
        open={open}
        toggleOpen={toggleOpen}
      />
    </>
  );
};

export default ListDesktop;
