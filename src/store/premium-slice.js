import { createSlice } from "@reduxjs/toolkit";


const initialPremiumState={theme:'light'};

const premiumSlice=createSlice({
    name:'premium',
    initialState:initialPremiumState,
    reducers:{
       setTheme(state,action){
        state.theme=action.payload
       },
    }
});

export const premiumActions=premiumSlice.actions;
export default premiumSlice.reducer;