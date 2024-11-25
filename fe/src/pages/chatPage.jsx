import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInformation } from "../reducers/usersReducer";
import { fetchChats, addChat, sendMessage } from "../reducers/chatReducer";
import { useEffect, useState, useRef } from "react";
import { Button } from 'react-bootstrap'
import LayoutHeader from '../components/LayoutHeader';
import "./chatPage.css";
import moment from 'moment';

const chatPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeChat, setActiveChat] = useState({})
    const [currentChat, setCurrentChat] = useState({});
    const [search, setSearch] = useState('')
    const id = sessionStorage.getItem('id');
    const initialActiveChatSet = useRef(false)
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null)

    console.log("id", id);
    console.log("typeof id", typeof (id));
    //load redux state
    const usersInformation = useSelector((state) => state.users.items);
    const usersInformationStatus = useSelector((state) => state.users.status);
    const usersInformationError = useSelector((state) => state.users.error);

    const chats = useSelector((state) => state.chats.items);
    const chatsStatus = useSelector((state) => state.chats.status);
    const chatsError = useSelector((state) => state.chats.error);


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
    const activeChatUserIds = new Set(activeChats.flatMap(chat => chat.participants));
    const usersWithNonActiveChats = usersInformation.filter((user) => {
        return !activeChatUserIds.has(user._id) && user._id !== id;
    });
    console.log('users with active chats', usersWithActiveChats)
    console.log('users with non active chats', usersWithNonActiveChats)

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
            setActiveChat(usersWithActiveChats[0])
            initialActiveChatSet.current = true;
            findSelectedChat(usersWithActiveChats[0]._id, id)
            setSelectedUserId(usersWithActiveChats[0]._id)

        }
    }, [usersWithActiveChats, activeChat]);


    useEffect(() => {
        // Scroll to the bottom of the messages container whenever messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chats, activeChat]);

    const findSelectedChat = (loggedInUser, selectedUser) => {
        const selectedChat = chats.find(chat => {
            return chat.participants.includes(loggedInUser) && chat.participants.includes(selectedUser) && chat.participants.length == 2
        })
        return selectedChat
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

    const selectedChat = findSelectedChat(activeChat?._id, id);
    const messages = selectedChat?.messages;

    const findMessageSender = (senderId) => {
        const sender = usersInformation.find(user => user._id === senderId)
        return sender ? sender.name : 'Unknown'
    }

    const logout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const activeChatReduxInformation = () => {
        console.log("chats", chats)
        const information = chats.find(chat => chat._id === activeChat._id)
        console.log("information", information);
        console.log("activeChat", activeChat)
        console.log("selectedChat", selectedChat)
        return information
    }

    const startNewChat = (currentUserId, otherUserId) => {
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

        dispatch(sendMessage({
            "sender": activeChat._id,
            "chatId": selectedChat._id,
            "content": message
        }));
        setMessage('');

    }

    const getLastMessage = (userId) => {
        const chat = chats.find(chat => chat.participants.includes(userId) && chat.participants.includes(id) && chat.participants.length === 2);
        if (chat && chat.messages && chat.messages.length > 0) {
            return chat.messages[chat.messages.length - 1].content;
        }
        return "No messages";
    };

    const filteredUsersWithNonActiveChats = usersWithNonActiveChats.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

    const isActiveChatInActiveUsers = usersWithActiveChats.some(user => user._id === activeChat?._id);

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
                        usersWithActiveChats.map((user, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setActiveChat(user)
                                        setSelectedUserId(user._id)
                                    }}
                                    className={selectedUserId === user._id ? 'greenBackground' : 'regularBackground'}
                                >
                                    <h2>{user.name}</h2>
                                    <label>{user.email}</label><br /><br />
                                    <p>{`${getLastMessage(user._id).substring(0,30)}...`}</p>
                                    
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
                                        setActiveChat(user)
                                        setSelectedUserId(user._id)
                                    }}
                                    className={selectedUserId === user._id ? 'greenBackground' : 'regularBackground'}
                                >
                                    <h2>{user.name}</h2>
                                    <label>{user.email}</label><br /><br />
                                    <Button onClick={() => startNewChat(id, user._id)}>Start New Chat</Button>
                                </div>)
                        })
                    }
                </div>
                <div className="chatBox">
                    <h3>Chat Box</h3>
                    {activeChat._id} <br />
                    {activeChat.name}
                    <div>
                        <button onClick={activeChatReduxInformation}>Click to test</button>
                    </div>
                    <div className="messages">
                        {messages && messages.length > 0 ? (
                            messages.map((message, index) => (
                                <div className="messageContainer">
                                    <div key={index} className={`message${message.sender === id ? "Sender" : "Receiver"}`}>
                                        <div>
                                            <b>{findMessageSender(message.sender)}</b>
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                    <div className={message.sender === id ? 'goRight' : 'goLeft'}>
                                        {formatDate(message.createdAt)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No messages</div>
                        )}
                        <div ref={messagesEndRef} /> {/*Reference to the end of the messages container*/}
                    </div>
                    <div className="inputContainer">
                        {isActiveChatInActiveUsers && (
                            <>
                                <input type="text" placeholder="Type a message" onChange={e => setMessage(e.target.value)} />
                                <button onClick={sendNewMessage}>Send</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default chatPage;