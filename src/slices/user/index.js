import { createSlice } from '@reduxjs/toolkit';
const userObj = sessionStorage.getItem('userData');
const defaultUserData = [
    {
        appName: "",
        userName: "",
        message: "",
        roleList: [],
        email: "",
        status: "",
        divisionData:[]
    }
]
const slice = createSlice({
    name: 'userData',
    initialState: {
        userData: userObj ? JSON.parse(userObj) : defaultUserData,
    },
    reducers: {
        setUserData: (state, action) => {
            
            state.userData = action.payload; 
          },
          clearUserData: (state) => {
            state.userData = null; 
          },
    },
  })
  
  export const { setUserData, clearUserData } = slice.actions
  
  export default slice.reducer