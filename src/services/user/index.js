import { api } from '../api';
import user from './user'

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    searchByEmail: user(build).searchByEmail,
   profileInsert: user(build).profileInsert,
   usersRetrieval: user(build).usersRetrieval,
   profileEdit: user(build).profileEdit,
   profileDelete: user(build).profileDelete,
   divisionCreate:user(build).divisionCreate,
   divisionEdit:user(build).divisionEdit,
   divisionRetrieval: user(build).divisionRetrieval,
   divisionDelete:user(build).divisionDelete,
   getSharedUsersForDivision:user(build).getSharedUsersForDivision,
   searchUsers:user(build).searchUsers
   
  }),
  overrideExisting: false,
})

export const {useSearchByEmailMutation,useProfileInsertMutation,useUsersRetrievalMutation,useProfileEditMutation,
  useProfileDeleteMutation,useDivisionCreateMutation,useDivisionEditMutation,useDivisionRetrievalMutation,
  useDivisionDeleteMutation,useGetSharedUsersForDivisionMutation,useSearchUsersMutation
} = userApi
