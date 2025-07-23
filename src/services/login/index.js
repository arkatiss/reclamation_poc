import { api } from '../api';
import login from './login';

export const loginApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLoginData: login(build).getLogin,
    getUserDivisions:login(build).getUserDivisions,
    checkLogin:login(build).checkLogin,
    getAuthorizedLogin:login(build).getAuthorizedLogin,
    
  }),
  overrideExisting: false,
})

export const { useGetLoginDataMutation,useGetUserDivisionsMutation,useCheckLoginMutation,useGetAuthorizedLoginMutation } = loginApi