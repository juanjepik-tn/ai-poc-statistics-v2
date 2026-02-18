import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICustomTag } from '@/types/conversation';

interface TagsState {
  systemTags: { [tagName: string]: boolean };
  customTags: ICustomTag[];
}

const initialState: TagsState = {
  systemTags: {},
  customTags: [],
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTag: (state, action: PayloadAction<{ tagName: string; hasTag: boolean }>) => {
      state.systemTags[action.payload.tagName] = action.payload.hasTag;
    },
    clearTags: (state) => {
      state.systemTags = {};
    },
    setCustomTags: (state, action: PayloadAction<ICustomTag[]>) => {
      state.customTags = action.payload;
    },
    addCustomTag: (state, action: PayloadAction<ICustomTag>) => {
      state.customTags.push(action.payload);
    },
    updateCustomTag: (state, action: PayloadAction<ICustomTag>) => {
      const index = state.customTags.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.customTags[index] = action.payload;
      }
    },
    removeCustomTag: (state, action: PayloadAction<number>) => {
      state.customTags = state.customTags.filter(t => t.id !== action.payload);
    },
  },
});

export const { setTag, clearTags, setCustomTags, addCustomTag, updateCustomTag, removeCustomTag } = tagsSlice.actions;
export const selectCustomTags = (state: any) => state.tags?.customTags || [];
export default tagsSlice.reducer;
