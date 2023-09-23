import { createSlice } from "@reduxjs/toolkit";


const initialExpenseState={expenses:[],totalAmount:0}


const expenseSlice=createSlice({
    name:'expense',
    initialState:initialExpenseState,
    reducers:{
        addExpense(state,action){
            const updatedExpenses=state.expenses.concat(action.payload.expense)
            state.expenses=updatedExpenses
            state.totalAmount=Number(state.totalAmount)+Number(action.payload.amount)
        },
        removeExpense(state,action){
           state.expenses=action.payload.expenses
           state.totalAmount=Number(state.totalAmount)-Number(action.payload.amount)
        },
        editExpense(state,action){
            state.expenses=action.payload.expenses
            state.totalAmount=Number(state.totalAmount)-Number(action.payload.amount)
        },
        replaceExpenses(state,action){
            state.expenses=action.payload.expenses;
            state.totalAmount=action.payload.amount
        }
        
    }
})

export const expenseActions=expenseSlice.actions;

export default expenseSlice.reducer