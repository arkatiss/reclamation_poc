import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'columnSelection',
  initialState: {
    editGridView: {},
    isFilter: { filterState: null, filterString: null, jsonData: null,draggedCols:null },
    bulkRecord: [],
    bulkEdit: [],
    bulkDeleteRecords: [],
    bulkCreateResponse: null,
    bulkEditResponse: null,
    sharedUserProfiles:[],
    recordsMsg: null
  },
  reducers: {
    getEditGridView: (state, { payload }) => {
      state.editGridView = payload;
    },
    clearGridView: (state) => {
      state.editGridView = {}; 
    },
    changeIsFilter: (state, { payload }) => {    
      if (payload?.filterState !== undefined) {
        state.isFilter = {
          ...state.isFilter,
          filterState: payload.filterState,
          filterString: payload.queryString,
          jsonData: payload?.jsonData,
          draggedCols:payload?.draggedCols
        };
      }
    },
    resetIsFilter: (state) => {
      state.isFilter = {
        filterState: null,
        filterString: '',
        jsonData: null,
      };
    },
    bulkCreate: (state, { payload }) => {
      state.bulkRecord = payload;
    },

    bulkDelete: (state, { payload }) => {
      state.bulkDeleteRecords = Array.isArray(payload)
        ? [...state.bulkDeleteRecords, ...payload]
        : [...state.bulkDeleteRecords, payload];
    },
    setDefaultUpload: (state) => {
      state.editGridView = {};
    },
    clearDeleteRecordsData: (state) => {
      state.bulkDeleteRecords = [];
    },
    bulkEdit: (state, { payload }) => {
      state.bulkEdit = Array.isArray(payload)
        ? [...state.bulkEdit, ...payload]
        : [...state.bulkEdit, payload];
    },
    clearBulkEditRecords: (state, { payload }) => {
      state.bulkEdit = []
    },
    clearBulkCreateRecords: (state, { payload }) => {
      state.bulkRecord = []
    },
    bulkCreateResponse: (state, { payload }) => {
      state.bulkCreateResponse = payload
    },
    bulkEditResponse: (state, { payload }) => {
      state.bulkEditResponse = payload
    },
     sharedUserEmails: (state, { payload }) => {
      state.sharedUserProfiles = payload
    },
    recordsMsgs: (state, { payload }) => {
      state.recordsMsg = payload
    }
  },

});



export const { getEditGridView, changeIsFilter, bulkCreate, bulkEdit, setDefaultUpload, bulkDelete, clearDeleteRecordsData, clearBulkEditRecords, clearBulkCreateRecords, bulkCreateResponse, bulkEditResponse,clearGridView,resetIsFilter,sharedUserEmails, recordsMsgs } = slice.actions;

export default slice.reducer;

