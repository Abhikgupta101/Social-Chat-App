import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userUid: null,
}

const user2Slice = createSlice({
    name: "user2",
    initialState,
    reducers: {
        setUser2: (state, action) => {
            state.userUid = action.payload;
        },
    }
})

export const { setUser2 } = user2Slice.actions;

export default user2Slice.reducer;