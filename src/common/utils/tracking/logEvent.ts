import amplitude from 'amplitude-js';

function logEvent(
  eventName: string,
  eventProperties: Record<string, string>,
  instanceName: string | undefined = undefined,
): void {
  if(import.meta.env.VITE_AMPLITUDE_ENABLE === 'true'){    
    amplitude.getInstance(instanceName).logEvent(eventName, eventProperties);
  }

}

export default logEvent;