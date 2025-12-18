import { Page } from '@nimbus-ds/patterns';
import { navigateHeaderRemove } from '@tiendanube/nexo';
import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { nexo } from '@/app';
import KnowledgeLibrary from './components/KnowledgeLibrary/KnowledgeLibrary';
import ResponseCustomization from './components/ResponseCustomization/ResponseCustomization';
import Playground from './components/Playground/Playground';
import Channels from './components/Channels/Channels';
import { trackingStepOnboarding } from '@/tracking';
import Pricing from './components/Pricing/Pricing';
const OnboardingStepper: React.FC = () => {
  const navigate = useNavigate();
  //  const { t } = useTranslation('translations');
  const { step } = useParams();  
  const stepNumber = step ? parseInt(step, 10) : 0;

  useEffect(() => {
    navigateHeaderRemove(nexo);
    setCurrentStep(stepNumber);
  }, [stepNumber]);

  const [currentStep, setCurrentStep] = useState(stepNumber);
  const prevStep = (componentName: 'Playground' | 'Channels' | 'KnowledgeLibrary' | 'ResponseCustomization' | 'Pricing') => {
    trackingStepOnboarding(componentName, 'Previous');  
    setCurrentStep((prev: number) => prev - 1);
  };
  const nextStep = (componentName: 'Playground' | 'Channels' | 'KnowledgeLibrary' | 'ResponseCustomization' | 'Pricing') => {    
    trackingStepOnboarding(componentName, 'Next');
    setCurrentStep((prev: number) => prev + 1);
  };
  const cancelOnboarding = (componentName: 'ResponseCustomization' | 'Playground' | 'Channels' | 'KnowledgeLibrary') => {
    trackingStepOnboarding(componentName, 'Cancel');
    navigate('/settings');
  };
  const steps = [
    <ResponseCustomization prevStep={() => prevStep('ResponseCustomization')} cancelOnboarding={() => cancelOnboarding('ResponseCustomization')} nextStep={() => nextStep('ResponseCustomization')} />,
    <KnowledgeLibrary cancelOnboarding={() => cancelOnboarding('KnowledgeLibrary')} prevStep={() => prevStep('KnowledgeLibrary')} nextStep={() => nextStep('KnowledgeLibrary')} />,
    <Playground prevStep={() => prevStep('Playground')} nextStep={() => nextStep('Playground')} />,
    <Channels  prevStep={() => prevStep('Channels')} />
  ];
  return <Page maxWidth="800px">{steps[currentStep]}</Page>;
};
export default OnboardingStepper;
