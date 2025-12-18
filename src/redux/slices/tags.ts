import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TagsState {
  [tagName: string]: boolean;
}

const initialState: TagsState = {};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTag: (state, action: PayloadAction<{ tagName: string; hasTag: boolean }>) => {
      state[action.payload.tagName] = action.payload.hasTag;
    },
    clearTags: () => initialState,
  },
});

export const { setTag, clearTags } = tagsSlice.actions;
export default tagsSlice.reducer;

