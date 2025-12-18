  export type InstancesChannel = "WhatsappBusiness" | "WhatsappBaileys";
  export type InstancesStatus = "Connected" | "Disconnected" | "Pending" | "Error";
  export type InstancesChannelDTO = {
    id: number;
    name: InstancesChannel;
  }
  
  export type HealthStatusResponse = {
    health_status: {
      health_status: {
        can_send_message: string;
        entities: Array<{
          entity_type: string;
          id: string;
          can_send_message: string;
          additional_info?: string[];
          errors?: Array<{
            error_code: number;
            error_description: string;
            possible_solution: string;
          }>;
        }>;
      };
      id: string;
    };
    subscriptions: {
      data: Array<{
        whatsapp_business_api_data: {
          link: string;
          name: string;
          id: string;
        };
      }>;
    };
    failure_rate: {
      last_7_days: {
        total_bot_messages: number;
        failed_bot_messages: number;
        failure_rate: number;
      };
      last_10_messages: {
        total_bot_messages: number;
        failed_bot_messages: number;
        failure_rate: number;
      };
    };
    business_verification?: {
      business_verification_status: string;
      business_id: string | null; //TODO: make it required after api update
      waba_id: string | null; //TODO: make it required after api update
    };
  }