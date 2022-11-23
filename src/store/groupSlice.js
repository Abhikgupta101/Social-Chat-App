import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    groupUid: null,
}

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        setGroup: (state, action) => {
            state.groupUid = action.payload;
        },
    }
})

export const { setGroup } = groupSlice.actions;

export default groupSlice.reducer;