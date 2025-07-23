export default build => ({
    searchByEmail:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auth/fetch_user_by_email'
        })
    }),
    profileInsert:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auth/user_profile_insert'
        })
    }),
     usersRetrieval:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auth/get_user_profile'
        })
    }),
     profileEdit:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auth/user_profile_Update'
        })
    }),

     profileDelete:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auth/user_profile_delete'
        })
    }),

    divisionCreate:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auths/division_preference'
        })
    }),
     divisionEdit:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auths/division_preference_update'
        })
    }),
    divisionRetrieval:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auths/get_division_preference'
        })
    }),
    divisionDelete:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auths/division_preference_delete'
        })
    }),

    getSharedUsersForDivision:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auth/User_Data'
        })
    }),
     searchUsers:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'user_auth/User_Data_Lookup'
        })
    }),
        })
        