import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useToast } from '@nimbus-ds/components';
import { useFetch } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { trackingCTHEnabled } from '@/tracking';
import { MCP_RELEVANT_CONTENT} from '@/constants/mcpRelevantContent';


const TOAST_CONFIG = {
  duration: 4000,
  type: {
    success: 'success' as const,
    danger: 'danger' as const,
  }
} as const;

const Step2DataProvider: React.FC<any> = ({ children }) => {
  const { addToast } = useToast();
  const { request } = useFetch();
  const { t } = useTranslation('translations');

  const [contentList, setContentList] = useState<any[]>([]);
  const [totalContent, setTotalContent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingMoreData, setFetchingMoreData] = useState(false);
  const [optionalsList, setOptionalsList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const pageRef = useRef(page);
  const [searchQuery, setSearchQuery] = useState('');
  const isFirstSearchRef = useRef(true);

  const onSearchContent = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setPage(0);
  };

  const onGetContentList = useCallback(() => {
    setLoading(true);
    const url = searchQuery ? API_ENDPOINTS.relevantContent.list(pageRef.current.toString()) + `&search=${searchQuery}` : API_ENDPOINTS.relevantContent.list(pageRef.current.toString());
    request<any[]>({
      url: url,
      method: 'GET',
    })
      .then(({content}: any) => {                  
          let processedContent = content.rows;
          
          if (!searchQuery) {
            processedContent = [...MCP_RELEVANT_CONTENT, ...processedContent];
          }
          const updateContentList = (newContent: any[]) => {
            if (pageRef.current === 0) {
              return newContent;
            } else {              
              return (prevData: any[]) => [...(prevData ?? []), ...newContent];
            }
          };
          const removeDuplicates = (data: any[]) => {
            const seen = new Set();
            return data.filter(item => {
              if (seen.has(item.id)) return false;
              seen.add(item.id);
              return true;
            });
          };          
          if (searchQuery) {            
            setContentList(updateContentList(processedContent));
          } else {
            setContentList((prevData) => {
              if (pageRef.current === 0) {
                return processedContent; 
              } else {
                const combinedData = [...(prevData ?? []), ...processedContent];
                return removeDuplicates(combinedData); 
              }
            });
          }
          setTotalContent(content.total);
      })
      .catch((error) => {           
        addToast({
          type: TOAST_CONFIG.type.danger,
          text: error.message.description ?? error.message,
          duration: TOAST_CONFIG.duration,
          id: 'error-content',
        });
      })
      .finally(() => {
        setFetchingMoreData(false);
        setLoading(false);
      });
  }, [searchQuery, request, addToast]);

  useEffect(() => {    
    pageRef.current = page;   
    if (page > 0) {      
      onGetContentList();
    }
  }, [page, onGetContentList]);

  useEffect(() => {
    if (isFirstSearchRef.current) {
      isFirstSearchRef.current = false;
      return;
    }
    onGetContentList();
  }, [searchQuery, onGetContentList]);

  const onGetOptionals = () => {
    request<any[]>({
      url: API_ENDPOINTS.relevantContent.optionals,
      method: 'GET',
    })
      .then(({content}: any) => {
        setOptionalsList(content);
      })
      .catch((error) => {
        addToast({
          type: TOAST_CONFIG.type.danger,
          text: error.message.description ?? error.message,
          duration: TOAST_CONFIG.duration,
          id: 'error-optionals',
        });
      });
  };

  useEffect(() => {
    const initializeData = async () => {
      onGetOptionals();
      onGetContentList();
    };
    
    initializeData();
  }, []);

  const onCreateContent = (formData: any, className: string): Promise<boolean> => {    
    const PARAMS = {
      title: formData.title,
      content: formData.content,      
      tool: formData.tool,
    };
    setLoading(true);
    const url = className === 'relevant_content_store' 
      ? API_ENDPOINTS.relevantContent.createStore 
      : className === 'relevant_content_mandatory' 
      ? API_ENDPOINTS.relevantContent.createMandatory 
      : API_ENDPOINTS.relevantContent.createOptionals;
    return request<any>({
       url: url,
       method: 'POST',
       data: PARAMS,
     })
       .then(() => {
         setLoading(false);
         setPage(0);
         addToast({
           type: TOAST_CONFIG.type.success,
           text: t('settings.step2.content-added-successfully'),
           duration: TOAST_CONFIG.duration,
           id: 'create-content',
         });
         onGetContentList();
         onGetOptionals();
         return true;              
       })
       .catch((error) => {    
         setLoading(false);
         addToast({
           type: 'danger',
           text: error.message.description ?? error.message,
           duration: 4000,
           id: 'error-create-content',
          });         
          return false;     
       });
  };
  const onUpdateContent = (contentId: string, formData: any, className: string): Promise<boolean> => {    
    const PARAMS = {
      title: formData.title,
      content: formData.content,     
      tool: formData.tool, 
    };
    setLoading(true);
    const url = className === 'relevant_content_store' 
      ? API_ENDPOINTS.relevantContent.updateStore(contentId) 
      : className === 'relevant_content_mandatory' 
      ? API_ENDPOINTS.relevantContent.updateMandatory(contentId) 
      : API_ENDPOINTS.relevantContent.updateOptionals(contentId);
    return request<any>({
       url: url,
       method: 'PUT',
       data: PARAMS,
     })
       .then(() => {
         setLoading(false);
         const updatedContentList = contentList.map((item) => 
           item.id === parseInt(contentId, 10) ? { ...item, ...formData } : item
         );         
         setContentList(updatedContentList);
         addToast({
           type: TOAST_CONFIG.type.success,
           text: t('settings.step2.content-updated-successfully'),
           duration: TOAST_CONFIG.duration,
           id: 'update-content',
         });
         //if the content has a tool, track the CTH enabled
         if (formData.tool_name) {
          trackingCTHEnabled(
            formData.tool_name && formData.tool ? 'Enabled' : 'Disabled',
            formData.title,
            'onboarding'
          );
         }
         return true;              
       })
       .catch((error) => {    
         setLoading(false);
         addToast({
           type: 'danger',
           text: error.message.description ?? error.message,
           duration: 4000,
           id: 'error-create-content',
          });         
          return false;     
       });
  };

  const onDeleteContent = (contentId: number): Promise<boolean> => {       
    setLoading(true);
    return request<any>({
       url: API_ENDPOINTS.relevantContent.delete(contentId.toString()),
       method: 'DELETE',
     })
       .then(() => {
         setLoading(false);
         const updatedContentList = contentList.filter(item => item.id !== contentId);
         setContentList(updatedContentList);
         onGetOptionals();
         addToast({
           type: TOAST_CONFIG.type.success,
           text: t('settings.step2.content-deleted-successfully'),
           duration: TOAST_CONFIG.duration,
           id: `delete-content-${contentId}`,
         });
         return true;              
       })
       .catch((error) => {    
         setLoading(false);
         addToast({
           type: 'danger',
           text: error.message.description ?? error.message,
           duration: 4000,
           id: 'error-delete-content',
          });         
          return false;     
       });
  };
  const fetchMoreData = () => {
    setPage(prevPage => prevPage + 1);
    setFetchingMoreData(true);
  };
  const contextValue = {
    contentList,    
    onCreateContent,
    onUpdateContent,
    onDeleteContent,
    loading,
    totalContent,
    fetchMoreData,
    fetchingMoreData,
    optionalsList,
    onSearchContent
  };

  return (
    <Step2Context.Provider value={contextValue}>
      {children(contextValue)}
    </Step2Context.Provider>
  );
};

// Crear el contexto para Step2Data
export const Step2Context = createContext<any>(null);

// Hook personalizado para usar el contexto
export const useKnowledgeLibraryData = () => {
  const context = useContext(Step2Context);
  if (!context) {
    throw new Error('useKnowledgeLibraryData has to use inside Step2DataProvider');
  }
  return context;
};

export default Step2DataProvider;
