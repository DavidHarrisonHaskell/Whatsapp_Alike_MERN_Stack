
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

export const addChat = ({ participants }) => async dispatch => {
    dispatch(addChatStart())
    const the_participants = participants
    console.log("participants", participants);
    try {
        console.log("all is good...")
        const token = sessionStorage.getItem('token')
        const response = await axios.post('http://127.0.0.1:5000/chats/new-chat', { "participants": the_participants }, {
            headers: {
                token: token
            }
        });
        console.log("response.data for add chat", response.data)
        dispatch((addChatSuccess(response.data)))
    } catch (e) {
        dispatch(addChatFailure(e.response));
    }
}

// TODO: make a sendMessage function
export const  sendMessage = ({ sender, chatId, content }) => async dispatch => {
    console.log("sender", sender, "chatId", chatId, "content", content);
    dispatch(sendMessageStart());
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`http://127.0.0.1:5000/messages/new-message`, { "sender": sender, "chatId": chatId, "content": content }, {
            headers: {
                token: token,
            },
        });
        console.log("response.data for sendMessage", response.data)
        dispatch(sendMessageSuccess(response.data));
    } catch (e) {
        dispatch(sendMessageFailure(e.response));
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
            state.status = "succeeded";
            state.items = action.payload.chats;
        },
        fetchChatsFailure: (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        },
        addChatStart: (state) => {
            state.status = "loading";
        },
        addChatSuccess: (state, action) => {
            state.status = "succeeded";
            state.items.push(action.payload.chat);
        },
        addChatFailure: (state, action) => {
            state.status = "failed";
            console.log("addChatFailure", action.payload?.message)
            state.error = action.payload;
        },
        sendMessageStart: (state) => {
            state.status = "loading";
        },
        sendMessageSuccess: (state, action) => {
            state.status = "succeeded";
            state.items.find(item => {
                const chat = item._id === action.payload.message.chatId;
                console.log("item", item, "chat", chat)
                console.log("item._id", item._id, "action.payload.message.chatId", action.payload.message.chatId)
                if (chat) {
                    item.messages.push(action.payload.message);
                }
            })            
            // state.items.push(action.payload.message);
        },
        sendMessageFailure: (state, action) => {
            state.status = "failed";
            console.log("sendMessageFailure", action.payload?.message)
            state.error = action.payload;
        }
    }
});


export const {
    fetchChatsStart,
    fetchChatsSuccess,
    fetchChatsFailure,
    addChatStart,
    addChatSuccess,
    addChatFailure,
    sendMessageStart,
    sendMessageSuccess,
    sendMessageFailure
} = chatsSlice.actions;

export default chatsSlice.reducer;
