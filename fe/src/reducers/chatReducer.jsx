
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    items: [],
    status: "idle",
    error: null
}



export const fetchChats = ({ id }) => async dispatch => {
    dispatch(fetchChatsStart());
    console.log('fetchChatsStart')
    try {
        const token = sessionStorage.getItem("token");
        console.log("token", token);
        const response = await axios.get(`http://127.0.0.1:5000/chats/${id}`, {
            headers: {
                token: token,
            },
        });
        console.log("chatReducer:", `http://127.0.0.1:5000/chats/${id}`)
        dispatch(fetchChatsSuccess(response.data));
    }
    catch (error) {
        dispatch(fetchChatsFailure(error.message));
    }
}
const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        fetchChatsStart: (state) => {
            state.status = "loading";
        },
        fetchChatsSuccess: (state, action) => {
            console.log("state before fetchChatsStart", state.items)

            state.status = "succeeded";
            state.items = action.payload.chats;
            console.log("state after fetchChatsSuccess", state.items)
        },
        fetchChatsFailure: (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        }
        // possible to add more reducers for other actions like adding, updating, deleting users
    }
});


export const {
    fetchChatsStart,
    fetchChatsSuccess,
    fetchChatsFailure
} = chatsSlice.actions;

export default chatsSlice.reducer;
