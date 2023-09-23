import { createSlice } from "@reduxjs/toolkit";


const token=localStorage.getItem('token')

const initialAuthSate={isLoggedIn:token ? true:false,idToken:token};

const authSlice=createSlice({
    name:'authentication',
    initialState:initialAuthSate,
    reducers:{
        login(state,action){
            state.isLoggedIn=true;
            state.idToken=action.payload
        },
        logout(state){
            state.isLoggedIn=false;
            state.idToken=false;
        }
    }
});

export const authActions=authSlice.actions;
export default authSlice.reducer;