
export type MetaStatusError = {
    code?: number;
    title?: string;
    message?: string;
    details?: string;
    [key: string]: unknown;
};

export type MetaStatusHistoryEntry = {
    status: string;
    timestamp: string;
    error?: MetaStatusError;
    [key: string]: unknown;
};

export type IChannel = {
    id: string;
    channelName: string;
    store: any;
    username: String;
    bot_status: string;
    whatsapp_status: string;
};

export type IConversationMessage = {
    id: number;
    content: string;
    created_at: string;
    saw: boolean;
    mimetype: string | null;
    username: string | null;
    role: string;
    class: string;
    fromApp: boolean;
    hasImage: boolean;
    run_id: string | null;
    response_score: number | null | undefined;
    meta_status_history?: MetaStatusHistoryEntry[];
}



export type IConversation = {
    id: string;
    chat_summary: string;
    conversation_summary: number;
    created_at: Date;
    messages:  IConversationMessage[];
    channel: IChannel;
    name: string;
    username: string;
    chatSummary: string;
    conversationSummary: string;
    unreadMessages: number;
    customer: any;
    unreadMessagesAfterAccepted: number;
    qualification: IConversationQualification;
    avatar: string;
    virtual_assistant_failed: boolean;
    isPaused: boolean;
    messagesPanel: IConversationMessage[];
    lastMessage: IConversationMessage;
};


export type IConversationQualification = {
    id: string;
    class: string;
    created_at: Date;
    name: string;
    description: string;
};