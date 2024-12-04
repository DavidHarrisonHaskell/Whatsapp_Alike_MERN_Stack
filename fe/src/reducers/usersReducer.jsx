// user service for related API calls

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    items: [],
    status: "idle",
    error: null
}



// fetch users API call

export const fetchUserInformation = () => async dispatch => {
    dispatch(fetchUsersStart());
    // console.log('fetchUsersStart')
    try {
        const token = sessionStorage.getItem("token");
        // console.log("token", token);
        const response = await axios.get(`http://127.0.0.1:5000/users/`, {
            headers: {
                token: token,
            },
        });
        dispatch(fetchUsersSuccess(response.data));
    }
    catch (error) {
        dispatch(fetchUsersFailure(error.message));
    }
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        fetchUsersStart: (state) => {
            state.status = "loading";
        },
        fetchUsersSuccess: (state, action) => {
            // console.log("state before fetchUsersStart", state.items)
            state.status = "succeeded";
            state.items = action.payload.users;
            // console.log("state after fetchUsersStart", state.items)
        },
        fetchUsersFailure: (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        }
        // possible to add more reducers for other actions like adding, updating, deleting users
    }
});

export const {
    fetchUsersStart,
    fetchUsersSuccess,
    fetchUsersFailure
} = userSlice.actions;

export default userSlice.reducer;
