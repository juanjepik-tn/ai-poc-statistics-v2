import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notification: '',
    instanceState: '',
    conversationUpdate: '',
    newOrder: '',
    operationMode: '',
    newTag: '',
    reloadConversation: false
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotificationQR: (state, action) => {
            state.notification = action.payload
        },
        setNotificationInstanceUpdate: (state, action) => {
            state.instanceState = action.payload
        },
        setNotificationConversationUpdate: (state, action) => {
            state.conversationUpdate = action.payload
        },
        setNotificationNewOrder: (state, action) => {
            state.newOrder = action.payload
        },
        resetNewOrder: (state) => {
            state.newOrder = initialState.newOrder;
        },
        setNotificationOperationMode: (state, action) => {
            state.operationMode = action.payload;
        },
        setNotificationNewTag: (state, action) => {
            state.newTag = action.payload;
        },
        reloadConversation: (state) => {
            state.reloadConversation = true;
        },
        resetReloadConversation: (state) => {
            state.reloadConversation = false;
        },
        reset: () => initialState,

    }
});

export const {setNotificationQR, setNotificationInstanceUpdate, setNotificationConversationUpdate, setNotificationNewOrder, resetNewOrder, reset, setNotificationOperationMode, setNotificationNewTag, reloadConversation, resetReloadConversation} = notificationSlice.actions;
export default notificationSlice.reducer;