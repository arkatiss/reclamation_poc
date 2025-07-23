import { configPromise } from '../config';
const config = await configPromise;
const appUrl= process.env.NODE_ENV === 'development' ? process.env.REACT_APP_IS_URL : config.IS_URL;
const backEndUrl= process.env.NODE_ENV === 'development' ? process.env.REACT_APP_IS_URL : config.IS_URL
export default build => ({
    getLogin:build.mutation  ({
        // invalidatesTags: ['Game'],
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://devcsids.cswg.com/rcm/rest/Reclamation/login'
        }),
    }),
    getUserDivisions:build.mutation  ({
        // invalidatesTags: ['Game'],
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'user_auth/user_div_login'
        }),
    }),
    checkLogin:build.mutation  ({
        // invalidatesTags: ['Game'],
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: backEndUrl + '/api/identity/auth/v1.1/authenticate'
        }),
    }),
    getAuthorizedLogin:build.mutation  ({
        // invalidatesTags: ['Game'],
        query: (payload) => ({
            body: payload.toString(),
            method: 'POST',
            url: appUrl + '/oauth2/token'
        }),
    }),
    
})   