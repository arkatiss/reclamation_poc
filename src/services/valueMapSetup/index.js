import { api } from '../api';
import valueMapSetup from './valueMapSetup';


export const valueMapApi = api.injectEndpoints({
  endpoints: (build) => ({
    getValueMapCodes: valueMapSetup(build).getValueMapCodes,
    getValueMapDef: valueMapSetup(build).getValueMapDef, 
    saveVmDef: valueMapSetup(build).saveVmDef, 
    getValueMapData: valueMapSetup(build).getValueMapData, 
    saveValueMapData: valueMapSetup(build).saveValueMapData
   
  }),
  overrideExisting: false,
})

export const { useGetValueMapCodesMutation, useGetValueMapDefMutation, useSaveVmDefMutation, useGetValueMapDataMutation, useSaveValueMapDataMutation} = valueMapApi

