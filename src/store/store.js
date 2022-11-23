import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import user2Reducer from "./user2Slice"
import groupReducer from "./groupSlice"
import responsiveReducer from './responsiveSlce'
import windowReducer from './windowSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        group: groupReducer,
        user2: user2Reducer,
        responsive: responsiveReducer,
        window: windowReducer,
    },
})

export default store;