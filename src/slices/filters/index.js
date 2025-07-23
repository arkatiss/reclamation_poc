import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    addFilObj: {}
};
const slice = createSlice({
    name: 'additionalFilters',
    initialState,
    reducers: {
        setAddFilObj: (state, action) => {
            
            state.addFilObj = action.payload ;
            
        },
        resetAddFilObj: (state) => {
            state.addFilObj = {};
        }
    }
});

export const { setAddFilObj,resetAddFilObj  } = slice.actions;
export default slice.reducer;