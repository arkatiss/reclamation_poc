import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({
    name: 'navigation',
    initialState: { },
    reducers: {
      changeNavigation: (state, { payload }) => {
        
        state.PARENT_MODULE = payload.navigation?.split('/')[1];
      },
      changeSubModule:(state, { payload }) => {
        state.CHILD_MODULE = payload.subModule;
      },
      resetSubModule:(state)=>{
        state.CHILD_MODULE = ''; 
      },
      resetNavigation: (state) => {
        state.PARENT_MODULE = '';
        state.CHILD_MODULE = ''; 
      },
    },
  })
  
  export const { changeNavigation,changeSubModule,resetNavigation,resetSubModule } = slice.actions
  
  export default slice.reducer