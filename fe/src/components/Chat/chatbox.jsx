// the chatbox layout where conversations happen
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSocketConnection, joinRoomSuccess, sendMessage } from '../../actions/chatActions'

const chatbox = () => {
    const dispatch = useDispatch()
    const messages = useSelector((state) => state.chat.messages) || []
    const [input, setInput] = useState('')
    const [room, setRoom] = useState('')
    const [userId, setUserId] = useState('')
    useEffect(() => {
        // establish socket connection
        dispatch(setSocketConnection(true))
    }, [dispatch])

    //handle joining room
    const handleJoinRoom = () => {
        if (room && userId) {
            // join the room
            dispatch(joinRoomSuccess(room, userId))
        } else {
            // handle error
            alert('Please enter a valid room and userId')
        }
    }

    // handle sending message
    const handleSendMessage = () => {
        if (input.trim() && room && userId) {
            // send the message
            dispatch(sendMessage(room, userId, input))
            setInput('')
        } else {
            // handle error
            alert('Please enter a valid message')
        }
    }

    return (
        <div>
            {/*input fields for room and userId */}
            <input
                type="text"
                placeholder="Enter room id"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
            /><br />
            <input
                type="text"
                placeholder="Enter user id"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            /><br />
            {/* button to join room */}
            <button onClick={handleJoinRoom}>Join Room</button>
            {/* Chat messages display */}
            <div>
                {messages.map((message, index) => (
                    <p key={index}>
                        <b>{message.userId}</b>: {message.text}
                    </p>
                ))}
            </div>
            {/* input field for message */}
            <input
                type="text"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage()
                    }
                }}
            />
            {/* button to send message */}
            <button onClick={handleSendMessage}>Send</button>
        </div>
    )
}

export default chatbox