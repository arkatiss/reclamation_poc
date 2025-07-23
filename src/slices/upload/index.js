import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'upload',
  initialState: {
    tableData: [],
    tableCols:[]  
  },
  reducers: {
    getTableData: (state, { payload }) => {
      state.tableData = payload;  
    },
    getTableColumns: (state, { payload }) => {
      state.tableCols = payload;  
    },
    setDefaultUpload: (state) => {
      state.tableCols = []; 
      state.tableData=[]; 
    },
  },
});
export const { getTableData,getTableColumns,setDefaultUpload } = slice.actions;
export default slice.reducer;
