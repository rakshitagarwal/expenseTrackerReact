import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import expenseReducer from './expense-slice'
import premiumReducer from './premium-slice'
const store=configureStore({
    reducer:{auth:authReducer,expense:expenseReducer,premium:premiumReducer}
});

export default store;