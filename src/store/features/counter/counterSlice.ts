'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../index';

interface SearchInputState {
    value: string;
}

const initialState: SearchInputState = {
    value: "",
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        addInputSearch: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
        clearInputSearch: (state) => {
            state.value = "";
        }
    },
});

export const { addInputSearch, clearInputSearch } = counterSlice.actions;

// Selector to access the state
export const selectInputSearch = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
