import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInformation } from "../reducers/usersReducer";
import { fetchChats, addChat, sendMessage, clearReadMessages } from "../reducers/chatReducer";
import { useEffect, useState, useRef } from "react";
import { Button } from 'react-bootstrap'
import LayoutHeader from '../components/LayoutHeader';
import "./chatPage.css";
import moment from 'moment';
import { io } from 'socket.io-client'

const chatPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeChatParticipant, setActiveChatParticipant] = useState({}) // user informatio of the active chat
    const [currentChat, setCurrentChat] = useState({});
    const [search, setSearch] = useState('') // for the search bar
    const id = sessionStorage.getItem('id'); // id of the logged in user
    const initialActiveChatSet = useRef(false)
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null)
    const isFirstRender = useRef(true); // Track if it is the first render

    const socket = io('http://localhost:5000')
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to the server')
        })
        // socket.on('disconnect', () => {
        //   console.log('Disconnected from the server')
        // }) 
        // socket.emit('send-message-all-clients', {
        //   text: 'All clients connected Bro'
        // })
        // socket.on('send-message-by-server', data => {
        //   console.log(data)
        // })
        if (id) {
            socket.emit('join-room', id)
        }
        
    }, [id])

    
    //load redux state
    const usersInformation = useSelector((state) => state.users.items);
    const usersInformationStatus = useSelector((state) => state.users.status);
    const usersInformationError = useSelector((state) => state.users.error);

    const chats = useSelector((state) => state.chats.items);
    const chatsStatus = useSelector((state) => state.chats.status);
    const chatsError = useSelector((state) => state.chats.error);

    const testSendMessage = () => {
        
    }
    const loggedInUserInformation = usersInformation.find((user) => user._id === id);
    // users with active chats:
    // find them by filtering all users by those 
    // users who are included in a chat with the 
    // logged in user
    const activeChats = chats.filter((chat) => chat.participants.includes(id))
    const usersWithActiveChats = usersInformation.filter((user) => {
        return activeChats.some((chat) => chat.participants.includes(user._id) && user._id !== id);
        // if they have an active chat, include that user in the filtered users list
    })
    // sort userswithActiveChats based on the chat that has the most recent last message

    // Sort users with active chats based on the last message timestamp
    const getLastMessageTimestamp = (userId) => {
        const chat = chats.find(chat => chat.participants.includes(userId) && chat.participants.includes(id));
        if (chat && chat.messages && chat.messages.length > 0) {
            return new Date(chat.messages[chat.messages.length - 1].createdAt).getTime();
        }
        return 0;
    };

    const sortedUsersWithActiveChats = [...usersWithActiveChats].sort((a, b) => {
        return getLastMessageTimestamp(b._id) - getLastMessageTimestamp(a._id);
    });

    const activeChatUserIds = new Set(activeChats.flatMap(chat => chat.participants));
    const usersWithNonActiveChats = usersInformation.filter((user) => {
        return !activeChatUserIds.has(user._id) && user._id !== id;
    });
    // console.log('users with active chats', usersWithActiveChats)
    // console.log('users with non active chats', usersWithNonActiveChats)

    useEffect(() => {
        if (usersInformationStatus === 'idle') {
            // fetch user information
            dispatch(fetchUserInformation());
        }
        if (chatsStatus === 'idle') {
            // fetch chats
            dispatch(fetchChats({ id }));
        }
    }, [dispatch, usersInformationStatus, chatsStatus]);

    useEffect(() => {
        if (usersWithActiveChats.length > 0 && !initialActiveChatSet.current) {
            // setActiveChatParticipant(usersWithActiveChats[0])
            initialActiveChatSet.current = true;
            // setSelectedUserId(usersWithActiveChats[0]._id)

        }
        // findSelectedChat(activeChatParticipant._id, id)
    }, [usersWithActiveChats, activeChatParticipant]);


    useEffect(() => {
        // Scroll to the bottom of the messages container whenever messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chats, activeChatParticipant]);

    const findSelectedChat = (loggedInUser, selectedUser) => {
        const selectedChat = chats.find(chat => {
            return chat.participants.includes(loggedInUser) && chat.participants.includes(selectedUser) && chat.participants.length == 2
        })
        return selectedChat
    }

    const selectedChat = findSelectedChat(activeChatParticipant?._id, id);
    const messages = selectedChat?.messages;

    useEffect(() => {
        // clear unread messages and set all read fields to true
        // update 03/12/2024: the dispatch function works I just want to integrate it in the 
        // useEffect hook instead of through the onClick event
        if (selectedChat) {
            if (isFirstRender.current) { // first render
                // if the last message is sent by the id of the logged on user then do
                // not dispatch the clearReadMessages
                // console.log("selected Chat: " + JSON.stringify(selectedChat), "working")
                const lastMessage = selectedChat?.messages[selectedChat?.messages?.length - 1]
                // console.log("lastMessageSender: " + JSON.stringify(lastMessage?.sender), "lastMessageSender type", typeof (lastMessage?.sender))
                // console.log("id", id, "id type", typeof (id))
                if (JSON.stringify(lastMessage?.sender) === JSON.stringify(id)) {
                    // console.log("lastMessage.sender: " + lastMessage.sender, "id", id)
                    return;
                }
                // console.log("DISPATCH 1")
                dispatch(clearReadMessages({ selectedChatId: selectedChat._id }))
                isFirstRender.current = false
            }
            
        }
        socket.on('receive-message', (data) => {
            console.log("message received from the server: ", data)
            // TODO: continue working on this function. Only update the redux state but not the datbase.
            // Why? Since if a message is received from the server then that means that the
            // server has received the message and has added it to the redux state
            // but the client has not yet received it.
            // So, if we want to update the state of the client, we need to dispatch the action
            // to the redux store.
        }) 

    }, [dispatch, selectedChat]); 


    const handleDispatchClearReadMessages = (userId) => {
        // console.log("handleDispatchClearReadMessages")

        if (selectedChat) {
            const lastMessage = selectedChat.messages[selectedChat.messages.length - 1]
            // console.log("lastMessage - handleDispatchClearReadMessages: " + JSON.stringify(lastMessage.sender))
            // console.log("id - handleDispatchClearReadMessages", id,)
            if (JSON.stringify(lastMessage.sender) === JSON.stringify(id)) {
                // console.log("lastMessage.sender - handleDispatchClearReadMessages: " + lastMessage.sender, "id", id)
                return;
            }
            // console.log("DISPATCH 2")
            dispatch(clearReadMessages({ selectedChatId: selectedChat._id }))
        }
    }

    const formatDate = (timestamp) => {
        // format the timestamp to a readable date and time string
        const current = moment()
        const difference = current.diff(moment(timestamp), 'days')
        if (difference === 0) {
            return moment(timestamp).format('hh:mm A')
        }
        if (difference === 1) {
            return `Yesterday ${moment(timestamp).format('hh:mm A')}`
        }
        return moment(timestamp).format('MMM D, hh:mm A')
    }


    const findMessageSender = (senderId) => {
        const sender = usersInformation.find(user => user._id === senderId)
        return sender ? sender.name : 'Unknown'
    }

    const logout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const activeChatReduxInformation = () => {
        // console.log("chats", chats)
        const information = chats.find(chat => chat._id === activeChatParticipant._id)
        // console.log("information", information);
        // console.log("activeChatParticipant", activeChatParticipant)
        // console.log("selectedChat", selectedChat)
        return information
    }

    const startNewChat = (currentUserId, otherUserId) => {
        //TODO: update the chat messages redux state once first message is sent or received. doesn't work
        // properly when a new chat is started and then after that a message is sent from tht logged in user
        console.log('starting new chat', currentUserId, otherUserId);
        // trim the currentUserId and the otherUserId
        // and create a new chat between them
        const currentUserIdTrimmed = currentUserId.trim();
        const otherUserIdTrimmed = otherUserId.trim();
        if (currentUserIdTrimmed === '' || otherUserIdTrimmed === '') {
            alert('Please select a user to start a new chat.');
            return;
        }
        const participants = [currentUserIdTrimmed, otherUserIdTrimmed]
        dispatch(addChat({ participants: participants }))
        // create a new chat between the current user and the other user
        // and add them to their respective chats
        // dispatch(createNewChat({ userId: currentUserId, otherUserId }));
        // navigate(`/chat/${otherUserId}`);
    }

    const sendNewMessage = () => {
        if (message.trim() === '') {
            alert('Please enter a message to send.');
            return;
        }

        const socketMessageData = {
            "sender": id,
            "chatId": selectedChat._id,
            "content": message,
            "read": false,
            "createdAt": new Date(),
            "members": chats.find(chat => chat._id === selectedChat._id).participants
        }
        // console.log(socketMessageData);

        socket.emit('send-message', socketMessageData)


        dispatch(sendMessage({
            "sender": id,
            "chatId": selectedChat._id,
            "content": message
        }));
        setMessage('');

    }

    const getLastMessage = (userId) => {
        const chat = chats.find(chat => chat.participants.includes(userId) && chat.participants.includes(id) && chat.participants.length === 2);
        if (chat && chat.messages && chat.messages.length > 0) {
            return chat.messages[chat.messages.length - 1];
        }
        return "No messages";
    };

    const getUnreadMessagesCount = (userId) => {
        const chat = chats.find(chat => chat.participants.includes(userId) && chat.participants.includes(id) && chat.participants.length === 2);
        if (chat && chat.messages && chat.messages.length > 0) {
            if (chat.messages[chat.messages.length - 1].sender === id) {
                return 0;
            }
            // console.log("working getUnreadMessagesCount", chat.unreadMessagesCount);
            return chat.unreadMessagesCount
        }
        return 0;
    };

    const filteredUsersWithNonActiveChats = usersWithNonActiveChats.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

    const isActiveChatInActiveUsers = usersWithActiveChats.some(user => user._id === activeChatParticipant?._id);

    const isEmptyObject = (object) => {
        return Object.keys(object).length === 0 && object.constructor === Object;
    }

    return (
        <div className="chatPage">
            <div >
                <LayoutHeader
                    usersInformationStatus={usersInformationStatus}
                    loggedInUserInformation={loggedInUserInformation}
                    logout={logout}
                />
            </div>
            <div className="chattingSection">
                <div className="searchBar">
                    <label><b>Search Users</b></label>
                    <input type="text" id="search" name="search" onChange={(e) => setSearch(e.target.value)} style={{ marginRight: "2%" }} /><br />
                    <u>Users - Active Chats</u>
                    {
                        sortedUsersWithActiveChats.map((user, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setActiveChatParticipant(user)
                                        setSelectedUserId(user._id)
                                        handleDispatchClearReadMessages(user._id)
                                    }}
                                    className={selectedUserId === user._id ? 'greenBackground' : 'regularBackground'}
                                >
                                    <h2>{user.name}</h2>
                                    {getUnreadMessagesCount(user._id) == 1 && <label className="unreadMessagesLabel">{`${getUnreadMessagesCount(user._id)} unread message`}</label>}
                                    {getUnreadMessagesCount(user._id) > 1 && <label className="unreadMessagesLabel">{`${getUnreadMessagesCount(user._id)} unread messages`}</label>}
                                    <label className="wrapMessage">{user.email}</label><br /><br />
                                    <p className="wrapMessage">{getLastMessage(user._id)?.content?.length <= 30 ? `${getLastMessage(user._id)?.content}` : `${getLastMessage(user._id)?.content?.substring(0, 30)}...`}</p>

                                </div>)
                        })
                    }


                    <u>Users - Non-Active Chats</u>
                    {
                        filteredUsersWithNonActiveChats.map((user, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setActiveChatParticipant(user)
                                        setSelectedUserId(user._id)
                                        handleDispatchClearReadMessages()
                                    }}
                                    className={selectedUserId === user._id ? 'greenBackground' : 'regularBackground'}
                                >
                                    <h2>{user.name}</h2>
                                    <label className="wrapMessage">{user.email}</label><br /><br />
                                    <Button onClick={() => startNewChat(id, user._id)}>Start New Chat</Button>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="chatBox">
                    <h3>Chat Box</h3>
                    {activeChatParticipant && !isEmptyObject(activeChatParticipant) ? (
                        <div>
                            {/* {console.log("activeChatParticipant", Object.keys(activeChatParticipant).length)} */}
                            {activeChatParticipant?._id} <br />
                            {activeChatParticipant?.name}
                            <div>
                                <button onClick={activeChatReduxInformation}>Click to test</button>
                            </div>
                            <div className="messages">
                                {messages && messages.length > 0 ? (
                                    messages.map((message, index) => {
                                        return (
                                            <div className="messageContainer" key={index}>
                                                <div className={`message${message.sender === id ? "Sender" : "Receiver"}`}>
                                                    <div className="messageContainerContent">
                                                        <b>{findMessageSender(message.sender)}</b>
                                                        <p>{message.content}</p>
                                                        {message.sender === id && message.read && (
                                                            <span className="check" style={{ color: 'blue' }}>
                                                                &#10004;
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={message.sender === id ? 'goRight' : 'goLeft'}>
                                                    {formatDate(message.createdAt)}
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div>No messages</div>
                                )}
                                <div ref={messagesEndRef} /> {/*Reference to the end of the messages container*/}
                            </div>
                            <div className="inputContainer">
                                {isActiveChatInActiveUsers && (
                                    <>
                                        <input type="text" placeholder="Type a message" value={message} onChange={e => setMessage(e.target.value)} />
                                        <button onClick={sendNewMessage}>Send</button>
                                        <button onClick={testSendMessage}>Test Send Message</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>Select a user to start a chat.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default chatPage;