import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({
    name: 'division',
    initialState: {},
    reducers: {
      changeDivision: (state, { payload }) => {
        
        ({ DIVISION: state.DIVISION, id: state.id,SCREENDATA:state.SCREENDATA } = payload);
      },
      // setDefaultDivision: (state, { payload }) => {
      //  // let payload= {DIVISION: 'C&S', id: 1}
      //   ({ DIVISION: state.DIVISION, id: state.id,SCREENDATA:state.SCREENDATA } = payload);
      // },
    },
  })
  
  export const { changeDivision } = slice.actions
  
  export default slice.reducer