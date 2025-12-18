// useFacebookLogin.ts
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/Axios/Axios';
import { useFetch, useRegisterLog } from '@/hooks';
import { trackingWhatsappBusinessConnect, trackingWhatsappBusinessConnectSuccess, trackingWhatsappBusinessSignupAbandoned, trackingWhatsappBusinessSignupErrorReported} from '@/tracking';
import { getStoreInfo } from '@tiendanube/nexo';
import { nexo } from '@/app';

const useFacebookLogin = (onGetInstances: () => void, signupEndpoint?: string) => {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [signUpData, setSignUpData] = useState<any | null>(null);
  const { request } = useFetch();
  const registerLog = useRegisterLog();

  useEffect(() => {
    if (authCode && signUpData) {
      signUp();
    }
  }, [authCode, signUpData]);

  const signUp = async () => {
    try {
      const content = await request<any[]>({
        url: signupEndpoint || API_ENDPOINTS.whatsappBusiness.signUp,
        method: 'POST',
        data: {
          code: authCode,
          ...(signUpData || {})
        }
      });
      if (content.statusCode === 200) {
        onGetInstances();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getErrorData = (err: unknown, event: any): Record<string, unknown> => {
    if (err instanceof Error) {
      return {
        name: err.name,
        message: err.message,
        stack: err.stack,
        event: event.toString(),
        eventData: event.data ? event.data.toString() : 'No event data',
      };
    } else {
      return { value: String(err) };
    }
  }
  

  useEffect(() => {
    const loadFacebookScript = async () => {
      const { language, country } = await getStoreInfo(nexo);
      const languageWithCountry = language === 'es' ? 'es_LA' : language === 'pt' ? 'pt_BR' : `${language}_${country}`;
      const script = document.createElement('script');
      script.src = `https://connect.facebook.net/${languageWithCountry}/sdk.js`;
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
  
      script.onload = () => {
        // @ts-ignore 
        window.fbAsyncInit = function () {
          // @ts-ignore
          window.FB.init({
            appId: import.meta.env.VITE_FACEBOOK_APP_ID, 
            autoLogAppEvents: true,
            xfbml: true,
            version: import.meta.env.VITE_FACEBOOK_APP_VERSION
          });
        };
  
        window.addEventListener('message', (event) => {         
          if (!event.origin.endsWith('facebook.com')) return;
          
          try {
            const data = JSON.parse(event.data);
            registerLog({
              data: data,
              message: 'WHATSAPP_BUSINESS_APP_ONBOARDING',
              level: 'info'
            });
            if (data.type === 'WA_EMBEDDED_SIGNUP') {
              switch (data.event) {
                case 'CANCEL':
                  if (data.data?.current_step) {
                    trackingWhatsappBusinessSignupAbandoned(data.data.current_step);
                  }
                  break;
                case 'ERROR':
                  if (data.data?.error_code && data.data?.error_message) {
                    trackingWhatsappBusinessSignupErrorReported(data.data.error_code, data.data.error_message);
                  }
                  break;
                case 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING':
                case 'FINISH':
                case 'FINISH_ONLY_WABA':
                  trackingWhatsappBusinessConnectSuccess(data.event);              
                  setSignUpData(data);
                  break;
                default:
                  registerLog({
                    data: data,
                    message: 'WHATSAPP_BUSINESS_APP_ONBOARDING_UNKNOWN_EVENT',
                    level: 'error'
                  });
                  break;
              }
            }
          } catch (err) {
              const data = getErrorData(err, event);
          
              registerLog({
                data: data,
                message: "WHATSAPP_BUSINESS_APP_ONBOARDING",
                level: "error",
              });
          }
        });
      };
  
      return () => {
        window.removeEventListener('message', () => {});
      };
    }
    loadFacebookScript();
    
  }, []);

const launchWhatsAppSignup = () => {
  const skipHttpsCheck = import.meta.env.VITE_FACEBOOK_SKIP_HTTPS_CHECK === 'true';
  if (!skipHttpsCheck && window.location.protocol !== 'https:') {
    console.error('FB.login can only be called from HTTPS pages.');
    return;
  }
  trackingWhatsappBusinessConnect();
  registerLog({
    data: {},
    message: "WHATSAPP_BUSINESS_APP_ONBOARDING_START",
    level: "info",
  });
  // @ts-ignore
  window.FB.login(
    (response: any) => {
      if (response.authResponse) {
        const code = response.authResponse.code;
        setAuthCode(code);
      } else {
        console.log('response: ', response); 
      }
    },
    {
      config_id: import.meta.env.VITE_FACEBOOK_CONFIG_ID,
      response_type: 'code',
      override_default_response_type: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },      
      display: "popup",
      scope: "business_management,whatsapp_business_management,whatsapp_business_messaging,pages_show_list,pages_read_engagement",
      extras: {
        setup: {
          mode: 'connect',
          onboarding_type: 'EMBEDDED'
        },
        featureType: 'whatsapp_business_app_onboarding',
        sessionInfoVersion: '3'
      }
    }
  );
};

  return { launchWhatsAppSignup };
};

export default useFacebookLogin;