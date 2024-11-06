import { io } from 'socket.io-client';
import { addMessage, setSocketConnection, joinRoomSuccess, sendMessage } from '../actions/chatActions';

const socketMiddleware = (store) => {
    let socket;
    return (next) => (action) => {
        switch (action.type) {
            case 'SET_SOCKET_CONNECTION':
                if (!socket) {
                    // Connect to the socket server
                    socket = io('http://localhost:5000', { transports: ['websocket'], });

                    // When the socket connection is established,
                    // set the socket connection in the store
                    socket.on('connect', () => {
                        store.dispatch(setSocketConnection(true));
                    });

                    // When a new message is received from the server,
                    // add it to the chat messages in the store
                    socket.on('message', (message) => {
                        console.log('Received message:', `${message.userId} has joined the room`);
                        if (message.text !== (`${message.userId} has joined the room`) || `${undefined} has joined the room` ) {
                            store.dispatch(addMessage(message));
                        }
                    });

                }
                break;

            case 'JOIN_ROOM_SUCCESS':
                // When the user joins a room,
                // join the room on the socket server
                const { room, userId } = action.payload;
                socket.emit('joinRoom', { room, userId });
                break;

            case 'SEND_MESSAGE':
                // When the user sends a message,
                // send the message to the server
                // text is the message text
                // room is the room the message is sent to
                // userId is the user sending the message
                const { text, room: messageRoom, userId: userIdRoom } = action.payload;
                socket.emit('sendMessage', { room: messageRoom, text: text, userId: userIdRoom });
                break;

            default:
                break;
        }
        return next(action);
    }
}

export default socketMiddleware;

