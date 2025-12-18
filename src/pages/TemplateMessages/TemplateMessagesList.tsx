import { AppShell, DataList, Layout, Page } from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { nexo } from '@/app';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { Box, Icon, Button, Tag, Text } from '@nimbus-ds/components';

import InfiniteScroll from '@/components/InfiniteScroll';
import { ChevronLeftIcon } from '@nimbus-ds/icons';
import { useFetch } from '@/hooks';
import TemplateMessagesForm from './TemplateMessagesForm';


const TemplateMessagesList: React.FC = () => {
  useEffect(() => {
    navigateHeaderRemove(nexo);
  }, []);
interface TemplateMessage {
  name: string;
  body: string;
  category: string;
  components: any[];
}
  const [templateMessages, setTemplateMessages] = useState<TemplateMessage[]>([]);
  const navigate = useNavigate();
  const { request } = useFetch();
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prevState) => !prevState);

  const backButton = (
    <Button appearance="transparent" onClick={() => navigate('/configurations/3')}>
      <Icon source={<ChevronLeftIcon />} />
      <Text>
        Volver
      </Text>
    </Button>
  );

  const onGetTemplateMessages = () => {
    request<any[]>({
      url: API_ENDPOINTS.whatsappBusiness.templates('117'),
      method: 'GET',
    })
      .then((content: any) => {       
        console.log(content);       
       setTemplateMessages(content?.content?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
    useEffect(() => {
        onGetTemplateMessages();
    }, []);



  return (
    <>
    <AppShell>
    <AppShell.Header leftSlot={backButton} />
    <Page maxWidth="800px">
      <Page.Header title="Plantillas de mensajes" buttonStack={<Button onClick={toggleOpen} appearance="primary">Agregar</Button>} />
      <Page.Body>
        <Layout columns="1">
          <Layout.Section>
          <DataList>
                <InfiniteScroll
                    handlePaginationChange={() => {}}
                    hasMore={false}
                    fetchingMoreItems={false}
                    containerHeight='450px'
                    loadingText='Cargando...'
                >
                    {templateMessages?.map((message, index) => (
                    <DataList.Row key={index}>
                        <Box display="flex" flexDirection="column" gap="2" p="2" borderColor="neutral-interactive">
                        <Text fontWeight="bold">{message.name}</Text>
                        <Tag appearance={message.category === 'MARKETING' ? 'success' : message.category === 'UTILITY' ? 'warning' : 'danger'}>
                          {message.category}
                        </Tag>
                        {message.components.map((component, idx) => (
                          <Box key={idx} display="flex" flexDirection="column" gap="1">
                            <Text>Tipo: {component.type}</Text>
                            {component.type === 'BODY' && <Text>Contenido: {component.text}</Text>}
                            {component.type === 'HEADER' && <Text>Encabezado: {component.text}</Text>}
                            {component.type === 'FOOTER' && <Text>Pie de página: {component.text}</Text>}
                            
                          </Box>
                        ))}
             
                        </Box>
                    </DataList.Row>
                    ))}
                </InfiniteScroll>
            </DataList>
            <TemplateMessagesForm open={open} toggleOpen={toggleOpen} onGetTemplateMessages={onGetTemplateMessages} />
          </Layout.Section>
        </Layout>
      </Page.Body>
    </Page>
    </AppShell>
    </>
    
  );
};
export default TemplateMessagesList;
