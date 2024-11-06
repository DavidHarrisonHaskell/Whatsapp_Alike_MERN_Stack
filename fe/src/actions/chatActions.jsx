export const setSocketConnection = (isConnected) => ({
    type: 'SET_SOCKET_CONNECTION',
    payload: isConnected
})

export const addMessage = (message) => ({
    type: 'ADD_MESSAGE',
    payload: message
})

export const joinRoomSuccess = (room, userId) => ({
    type: 'JOIN_ROOM_SUCCESS',
    payload: { room, userId }
})

export const sendMessage = (text,room,userId) => ({
    type: 'SEND_MESSAGE',
    payload: {text, room, userId  }
})

export const CLEAR_STATE = 'CLEAR_STATE';
export const LOGOUT = 'LOGOUT';

