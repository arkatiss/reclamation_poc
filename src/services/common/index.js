import { api } from "../api";
import common from "./common";
export const commonApi = api.injectEndpoints({
    endpoints: (build) => ({
      gridViewInsert: common(build).gridViewInsert,
      gridViewRetrieve:common(build).gridViewRetrieve,
      gridViewDelete:common(build).gridViewDelete,
      gridViewEdit:common(build).gridViewEdit,
      gridSearchData:common(build).gridSearchData,
      gridViewShare:common(build).gridViewShare,
      lookUpSearch:common(build).lookUpSearch,
      uploadExcelFile:common(build).uploadExcelFile
    }),
    overrideExisting: false,
  })
export const {useGridViewInsertMutation,useGridViewRetrieveMutation,useGridViewEditMutation, useGridViewDeleteMutation,useGridSearchDataMutation,useLookUpSearchMutation,useGridViewShareMutation,useUploadExcelFileMutation} = commonApi;
