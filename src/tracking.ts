import { logEvent } from "./common/utils/tracking";
import { CONTENT_ADDITIONAL_INFORMATION_CLOSE, CONTENT_ADDITIONAL_INFORMATION_OPEN, CONTENT_ADDITIONAL_INFORMATION_SELECT, COPILOT_REQUEST, COPILOT_USE, CTH_ENABLED, DELETE_LIBRARY_CONTENT, ENABLE_EMOJIS, LIBRARY_CONTENT_CONTENT_UPDATE, LIBRARY_CONTENT_CTH_UPDATE, LIBRARY_CONTENT_FORM_CLOSE, LIBRARY_CONTENT_OPTIONS_MENU_OPEN, LIBRARY_CONTENT_OPTIONS_MENU_SELECT, LIBRARY_CONTENT_TITLE_UPDATE, MESSAGE_SEND, MODIFY_LIBRARY_CONTENT, NEW_LIBRARY_CONTENT, OPTIONAL_LIBRARY_CONTENT_ADD, PERSONALITY_TRAITS, PERSONALITY_UPDATE, PLAYGROUND_AUDIO_SEND, PLAYGROUND_AUDIO_START_RECORDING, PLAYGROUND_AUDIO_STOP_RECORDING, PLAYGROUND_MESSAGE_SENT, PLAYGROUND_MESSAGE_UPDATE, PLAYGROUND_QUESTION_USED, PLAYGROUND_RESET, PLAYGROUND_RESPONSE_FEEDBACK, QR_GENERATION, RESPONSE_LENGTH, SHOW_LIBRARY_CONTENT, START_TRIAL, STEP_ONBOARDING, WHATSAPP_BAILEYS_CONNECT, WHATSAPP_CONNECT_SUCCESS, WHATSAPP_BUSINESS_CONNECT, WHATSAPP_BUSINESS_CONNECT_SUCCESS, WHATSAPP_BUSINESS_SIGNUP_ABANDONED, HELP_LINK, BUSINESS_VERIFICATION_CLICK, WHATSAPP_BUSINESS_SIGNUP_ERROR_REPORTED } from "./config/trackingEvents";
import { OnboardingStep } from "./constants/helpLinkConfig";

export const trackingCopilotUsed = (
    conversation_id: string,
) => {
    logEvent(COPILOT_USE, {
        conversation_id: conversation_id,
    });
};
export const trackingCopilotRequested = (
    conversation_id: string,
) => {
    logEvent(COPILOT_REQUEST, {
        conversation_id: conversation_id,
    });
};
export const trackingMessageSent = (
    conversation_id: string,
) => {
    logEvent(MESSAGE_SEND, {
        conversation_id: conversation_id,
    });
};

export const trackingStepOnboarding = (
    stepName: 'ResponseCustomization' | 'Playground' | 'Channels' | 'KnowledgeLibrary' | 'Pricing',
    action: 'Cancel' | 'Previous' | 'Next',
) => {
    logEvent(STEP_ONBOARDING, {
        stepName: stepName,
        action: action,
    });
};

export const trackingResponseLength = (
    params: {
        responseLength: 'Short' | 'Medium' | 'Long',
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(RESPONSE_LENGTH, {
        responseLength: params.responseLength,
        source: params.source,
    });
};

export const trackingCTHEnabled = (
    cthEnabled: 'Enabled' | 'Disabled',
    content_title: string,
    source: 'onboarding' | 'settings',
) => {
    logEvent(CTH_ENABLED, {
        cthEnabled: cthEnabled,
        content_title: content_title,
        source: source,
    });
};

export const trackingQuestionUsed = (
    params: {
        question: string,
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(PLAYGROUND_QUESTION_USED, {
        question: params.question,
        source: params.source,
    });
};

export const trackingPlaygroundResponseFeedback = (
    params: {
        feedback: 'Positive' | 'Negative',
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(PLAYGROUND_RESPONSE_FEEDBACK, {
        feedback: params.feedback,
        source: params.source,
    });
};

export const trackingEnableEmojis = (
    params: {
        checked: string,
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(ENABLE_EMOJIS, {
        checked: params.checked,
        source: params.source,
    });
};
export const trackingNewLibraryContent = (
    params: {
        content_title: string,
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(NEW_LIBRARY_CONTENT, {
        content_title: params.content_title,
        source: params.source,
    });
};

export const trackingModifyLibraryContent = (
    params: {
        content_id: string,
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(MODIFY_LIBRARY_CONTENT, {
        content_id: params.content_id,
        source: params.source,
    });
};

export const trackingQRGeneration = () => {
    logEvent(QR_GENERATION, {});
};

export const trackingPlaygroundMessageSent = (
    params: {
        source: 'onboarding' | 'settings',
        message: string,
    }
) => {
    logEvent(PLAYGROUND_MESSAGE_SENT, {
        source: params.source,
        message: params.message,
    });
};

export const trackingPersonalityTraits = (
    params: {
        traits: string[],
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(PERSONALITY_TRAITS, {
        traits: params.traits.join(', '),
        source: params.source,
    });
};

export const trackingPersonalityChange = (
    params: {
        isEmpty: boolean,
        hasChanged: boolean,
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(PERSONALITY_UPDATE, {
        is_empty: params.isEmpty.toString(),
        has_changed: params.hasChanged.toString(),
        source: params.source,
    });
};

export const trackingContentAdditionalInformation = (
    params: {
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(CONTENT_ADDITIONAL_INFORMATION_SELECT, {
        source: params.source,
    });
};

export const trackingDeleteLibraryContent = (
    params: {
        content_title: string,
        content_id: string,
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(DELETE_LIBRARY_CONTENT, {
        content_title: params.content_title,
        content_id: params.content_id,
        source: params.source,
    });
};

export const trackingShowLibraryContent = (
    params: {
        content_title: string,
        content_id: string,
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(SHOW_LIBRARY_CONTENT, {
        content_title: params.content_title,
        content_id: params.content_id,
        source: params.source,
    });
};

export const trackingLibraryContentOptionsMenu = (
    params: {
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(LIBRARY_CONTENT_OPTIONS_MENU_OPEN, {
        source: params.source,
    });
};

export const trackingLibraryContentOptionsMenuSelect = (
    params: {
        source: 'onboarding' | 'settings',
        selected_option: 'edit' | 'delete',
    }
) => {
    logEvent(LIBRARY_CONTENT_OPTIONS_MENU_SELECT, {
        source: params.source,
        selected_option: params.selected_option,
    });
};

export const trackingOptionalLibraryContentAdd = (
    params: {
        source: 'onboarding' | 'settings',
        content_title: string,
    }
) => {
    logEvent(OPTIONAL_LIBRARY_CONTENT_ADD, {
        source: params.source,
        content_title: params.content_title,
    });
};

export const trackingContentAdditionalInformationOpen = (
    params: {
        source: 'onboarding' | 'settings',
        open: boolean,
    }
) => {
    const event = params.open ? CONTENT_ADDITIONAL_INFORMATION_OPEN : CONTENT_ADDITIONAL_INFORMATION_CLOSE;
    logEvent(event, {
        source: params.source,
    });
};

export const trackingLibraryContentTitleUpdate = (
    params: {
        source: 'onboarding' | 'settings',
        content_title: string,
    }
) => {
    logEvent(LIBRARY_CONTENT_TITLE_UPDATE, {
        source: params.source,
        content_title: params.content_title,
    });
};

export const trackingLibraryContentContentUpdate = (
    params: {
        source: 'onboarding' | 'settings',
        content_content: string,
    }
) => {
    logEvent(LIBRARY_CONTENT_CONTENT_UPDATE, {
        source: params.source,
        content_content: params.content_content,
    });
};

export const trackingLibraryContentToolUpdate = (
    params: {
        source: 'onboarding' | 'settings',
        content_tool: string,
    }
) => {
    logEvent(LIBRARY_CONTENT_CTH_UPDATE, {
        source: params.source,
        content_tool: params.content_tool,
    });
};

export const trackingLibraryContentFormClose = (
    params: {
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(LIBRARY_CONTENT_FORM_CLOSE, {
        source: params.source,
    });
};

export const trackingPlaygroundReset = (
    params: {
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(PLAYGROUND_RESET, {
        source: params.source,
    });
};

export const trackingPlaygroundMessageUpdate = (
    params: {
        source: 'onboarding' | 'settings',
        message: string,
    }
) => {
    logEvent(PLAYGROUND_MESSAGE_UPDATE, {
        source: params.source,
        message: params.message,
    });
};

export const trackingPlaygroundAudioStartRecording = (
    params: {
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(PLAYGROUND_AUDIO_START_RECORDING, {
        source: params.source,
    });
};
export const trackingPlaygroundAudioStopRecording = (
    params: {
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(PLAYGROUND_AUDIO_STOP_RECORDING, {
        source: params.source,
    });
};

export const trackingPlaygroundAudioSend = (
    params: {
        source: 'onboarding' | 'settings',
    }
) => {
    logEvent(PLAYGROUND_AUDIO_SEND, {
        source: params.source,
    });
};
export const trackingStartTrial = () => {
    logEvent(START_TRIAL, {});
};
export const trackingWhatsappBusinessConnect = () => {
    logEvent(WHATSAPP_BUSINESS_CONNECT, {});
};
export const trackingWhatsappBusinessConnectSuccess = (finishType: string) => {
    logEvent(WHATSAPP_BUSINESS_CONNECT_SUCCESS, {
        finish_type: finishType,
    });
};
export const trackingWhatsappBusinessSignupAbandoned = (currentStep: string) => {
    logEvent(WHATSAPP_BUSINESS_SIGNUP_ABANDONED, {
        current_step: currentStep,
    });
};
export const trackingWhatsappBusinessSignupErrorReported = (error_code: string, error_message: string) => {
    logEvent(WHATSAPP_BUSINESS_SIGNUP_ERROR_REPORTED, {
        error_code: error_code,
        error_message: error_message,
    });
};
export const trackingBusinessVerificationClick = (businessId: string | null, wabaId: string | null) => {
    logEvent(BUSINESS_VERIFICATION_CLICK, {
        business_id: businessId || 'unknown',
        waba_id: wabaId || 'unknown',
    });
};
export const trackingWhatsappBaileysConnect = () => {
    logEvent(WHATSAPP_BAILEYS_CONNECT, {});
};
export const trackingWhatsappConnectSuccess = () => {
    logEvent(WHATSAPP_CONNECT_SUCCESS, {});
};
export const trackingHelpLink = (
    params: {
        source: OnboardingStep,        
    }
) => {
    logEvent(HELP_LINK, {
        source: params.source,
    });
};