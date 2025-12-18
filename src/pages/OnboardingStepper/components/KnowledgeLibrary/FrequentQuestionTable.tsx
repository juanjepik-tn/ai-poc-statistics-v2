import {
  Box,
  Button,
  Pagination,
  Popover,
  Sidebar,
  Table,
  Text,
} from '@nimbus-ds/components';
import { EditIcon, EllipsisIcon, TrashIcon } from '@nimbus-ds/icons';
import { Layout } from '@nimbus-ds/patterns';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FrecuentQuestionsForm from './FrecuentQuestionsForm';
import { FrecuentQuestionItem } from './step2.types';

const pageSize = 10;

interface Props {
  frequentQuestionList: FrecuentQuestionItem[];
}

const FrecuentQuestionTable: React.FC<Props> = ({ frequentQuestionList }) => {
  const { t } = useTranslation('translations');
  const [rows] =
    useState<FrecuentQuestionItem[]>(frequentQuestionList);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortDirection] = useState<'ascending' | 'descending'>('descending');
  const [sortColumn] = useState<'id' | 'clientName'>('id');

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const sortCompareFunction = (
    rowA: FrecuentQuestionItem,
    rowB: FrecuentQuestionItem,
  ) => {
    if (sortColumn === 'id') {
      return sortDirection === 'ascending'
        ? rowA.id - rowB.id
        : rowB.id - rowA.id;
    }
    return 0;
  };

  const getDisplayedRows = (): FrecuentQuestionItem[] => {
    const sortedRows = rows?.slice().sort(sortCompareFunction);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedRows.slice(startIndex, endIndex);
  };

  const displayedRows = getDisplayedRows();
  const totalRows = rows?.length;
  const firstRow = (currentPage - 1) * pageSize + 1;
  const lastRow = Math.min(currentPage * pageSize, totalRows);
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prevState) => !prevState);

  const headers = [
    t('settings.step2.question'),
    t('settings.step2.response'),
    t('settings.actions'),
  ];
  const [currentEntity, setCurrentEntity] =
    useState<FrecuentQuestionItem | null>(null);

  const handleEditClick = (row: FrecuentQuestionItem) => {
    setCurrentEntity(row);
    toggleOpen();
    // Lógica para editar
  };

  const handleDeleteClick = (id: number) => {
    console.log(`Delete item with id: ${id}`);
    // Lógica para eliminar
  };

  return (
    <>
      <Box>
        <Table>
          <Table.Head>
            {headers.map((header) => (
              <Table.Cell key={header}>{header}</Table.Cell>
            ))}
          </Table.Head>
          <Table.Body>
            {displayedRows.map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell>
                  <Box alignItems="flex-start" display="flex" pl="2">
                    <Text>{row.question}</Text>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Box alignItems="flex-start" display="flex" pl="2">
                    <Text>{row.answer}</Text>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Popover
                    content={
                      <>
                        <Layout columns="1">
                          <Layout.Section>
                            <Box display="flex" flexDirection="column">
                              <Button
                                appearance="transparent"
                                onClick={() => handleEditClick(row)}
                              >
                                <Text>
                                  <EditIcon style={{ cursor: 'pointer' }} />
                                </Text>
                                <Text>{t('settings.edit')}</Text>
                              </Button>
                              <Button
                                appearance="transparent"
                                onClick={() => handleDeleteClick(row.id)}
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
                    <EllipsisIcon style={{ cursor: 'pointer' }} />
                  </Popover>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {rows.length > 10 && (
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
      <Sidebar padding="base" open={open} onRemove={toggleOpen}>
        {/* @ts-ignore */}
        <FrecuentQuestionsForm
          frequentQuestion={currentEntity}
          onBack={toggleOpen}
        />
        ,
      </Sidebar>
    </>
  );
};

export default FrecuentQuestionTable;
