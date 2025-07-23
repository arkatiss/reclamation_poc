import { api } from '../api';
import itemSetup from './itemSetup';

export const itemApi = api.injectEndpoints({
  endpoints: (build) => ({
      getItemSummary: itemSetup(build).getItemSummary,
     getItemDetails: itemSetup(build).getItemDetails,
     getHazardousItems: itemSetup(build).getHazardousItems,
     getTobaccoDetails: itemSetup(build).getTobaccoDetails,
     getItemWhDetails: itemSetup(build).getItemWhDetails,
     getItemAuditDetails: itemSetup(build).getItemAuditDetails,
     getItemDeals: itemSetup(build).getItemDeals,
     getModShipp: itemSetup(build).getModShipp,
   
    // getLogin: itemSetup(build).getLogin,
    getWhItemsEdit: itemSetup(build).getWhItemsEdit,
    getCustDetails: itemSetup(build).getCustDetails,
    updateItemDetails: itemSetup(build).updateItemDetails,
    updateCustomerItemDetails: itemSetup(build).updateCustomerItemDetails,
    saveItemDetail: itemSetup(build).saveItemDetail,
    customerItemDetailsCreate: itemSetup(build).customerItemDetailsCreate,
    hazardousDeatilsUpdate: itemSetup(build).hazardousDeatilsUpdate,
    itemsVendorDeduct:itemSetup(build).itemsVendorDeduct,
    masterObjRet:itemSetup(build).masterObjRetrieve,
    masterObjUpd:itemSetup(build).masterObjUpdate
  }),
  overrideExisting: false,
})

export const {useGetItemSummaryMutation,useGetItemDetailsMutation, useGetHazardousItemsMutation , useGetTobaccoDetailsMutation, useGetItemWhDetailsMutation, useGetItemAuditDetailsMutation, useGetItemDealsMutation,  useGetModShippMutation, 
  //useGetLoginQuery,
  useGetWhItemsEditMutation, useGetCustDetailsMutation, useUpdateItemDetailsMutation,useUpdateCustomerItemDetailsMutation, useSaveItemDetailMutation
,useCustomerItemDetailsCreateMutation, useHazardousDeatilsUpdateMutation,useItemsVendorDeductMutation,useMasterObjRetMutation,useMasterObjUpdMutation} = itemApi
