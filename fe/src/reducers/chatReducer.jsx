
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    items: [],
    status: "idle",
    error: null
}



export const fetchChats = ({ id }) => async dispatch => {
    dispatch(fetchChatsStart());
    // console.log('fetchChatsStart')
    try {
        const token = sessionStorage.getItem("token");
        // console.log("token", token);
        const response = await axios.get(`http://127.0.0.1:5000/chats/${id}`, {
            headers: {
                token: token,
            },
        });
        // console.log("chatReducer:", `http://127.0.0.1:5000/chats/${id}`)
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
        // console.log("all is good...")
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

export const sendMessage = ({ sender, chatId, content }) => async dispatch => {
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

export const clearReadMessages = ({ selectedChatId }) => async dispatch => {
    //TODO: finish up this function
    console.log("working so far before clearing read messages")

    dispatch(clearReadMessagesStart())
    console.log("working so far after clearing read messages")
    try {
        const token = sessionStorage.getItem("token");
        console.log("token", token);
        const response = await axios.post(`http://127.0.0.1:5000/chats/clear-unread-messages/${selectedChatId}`,{}, { 
            headers: {
                token: token 
            }
        });
        console.log("response.data line 82", response.data)
        dispatch(clearReadMessagesSuccess(response.data));
    } catch (e) {
        dispatch(clearReadMessagesFailure(e.response));
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
            state.items = state.items.map(item => {
                const chat = item._id === action.payload.message.chatId;
                console.log("item", item, "chat", chat)
                console.log("item._id", item._id, "action.payload.message.chatId", action.payload.message.chatId)
                if (chat) {
                    item.messages.push(action.payload.message);
                    item = {
                        ...item,
                        unreadMessagesCount: item.unreadMessagesCount + 1
                    }
                }
                return item;
            })
            // state.items.push(action.payload.message);
        },
        sendMessageFailure: (state, action) => {
            state.status = "failed";
            console.log("sendMessageFailure", action.payload?.message)
            state.error = action.payload;
        },
        clearReadMessagesStart: (state) => {
            state.status = "loading";
        },
        clearReadMessagesSuccess: (state, action) => {
            state.status = "succeeded";
            console.log("action.payload for clearReadMessagesSuccess", action.payload)
            console.log("state.items before change", state.items)
            state.items = state.items.map(item => {
                if (item._id === action.payload.updatedChat._id && item.messages) {
                    return {
                        ...item,
                        messages: item.messages.map(message => ({
                            ...message,
                            read: true
                        })),
                        unreadMessagesCount: 0
                    }
                }
                return item
            })
            console.log("state.items after change", state.items)
        },
        clearReadMessagesFailure: (state, action) => {
            state.status = "failed";
            console.log("clearReadMessagesFailure", action.payload?.message)
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
    sendMessageFailure,
    clearReadMessagesStart,
    clearReadMessagesSuccess,
    clearReadMessagesFailure
} = chatsSlice.actions;

export default chatsSlice.reducer;
