import { api } from '../api';
import scanSetup from './scanSetup';

export const scanApi = api.injectEndpoints({
  endpoints: (build) => ({
    getScanProcessList: scanSetup(build).getScanProcessList,
    getScanErrorProcessList: scanSetup(build).getScanErrorProcessList,
    saveScanErrorProcess: scanSetup(build).saveScanErrorProcess,
    getScanAudit: scanSetup(build).getScanAudit,
    getScanErrorAudit: scanSetup(build).getScanErrorAudit
   
  }),
  overrideExisting: false,
})

export const { useGetScanProcessListMutation , useGetScanErrorProcessListMutation, useSaveScanErrorProcessMutation, useGetScanAuditMutation, useGetScanErrorAuditMutation} = scanApi

