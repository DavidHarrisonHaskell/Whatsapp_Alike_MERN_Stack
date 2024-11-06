const initialState = {
    isConnected: false,
    messages: [],
    room: null
}

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SOCKET_CONNECTION':
            return {
                ...state,
                isConnected: action.payload
            }
            
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
            
        case 'JOIN_ROOM_SUCCESS':
            return {
                ...state,
                room: action.payload
            }
            
        default:
            return state
    }
}

export default chatReducer