import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StoreRedirector: React.FC<{ storeDetails: any }> = ( {storeDetails} ) => {
  const navigate = useNavigate();
  const validateRelevantContents = (relevantContents: any) => {
    for (const content of relevantContents) {
      if (content.class === 'relevant_content_mandatory' && (!content.content || content.content == '')) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (storeDetails) {      
      const { ia_response_length = {}, relevantContents = [], ia_personalization = {}, personality_traits = [], onboarding } = storeDetails;
      if (!ia_response_length || (!ia_personalization && personality_traits.length === 0)) {
        navigate('/onboarding/0');
      }
      else {
        if (onboarding){
          if (!validateRelevantContents(relevantContents)) {
            navigate('/onboarding/1');
          } else {
            navigate('/onboarding/3');
          }
        } else {
          navigate('/conversations');
        }
      }
    }
  }, [storeDetails, navigate]);

  return null;
};

export default StoreRedirector;