import Chatbox from "../components/Chat/chatbox";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInformation } from "../reducers/usersReducer";
import { fetchChats } from "../reducers/chatReducer";
import { useEffect } from "react";
import "./chatPage.css";
const chatPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const id = sessionStorage.getItem('id');
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
    // const activeChats = chats.filter((chat) => chat.participants.includes(id))
    // const usersWithActiveChats = usersInformation.filter((user) => {
    // return activeChats.some((chat) => chat.participants.includes(user._id) && user._id !== id);
    //     // if they have an active chat, include that user in the filtered users list
    // })
    // console.log('users with active chats', usersWithActiveChats)
    
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

    const logout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <div className="chatPage">
            <div>
                <h1>Chat Page</h1>
                <h2>Hello {sessionStorage.getItem('name')}</h2>
                {/* <Chatbox /> */}
                {usersInformationStatus === 'loading' && <p>Loading...</p>}
                {usersInformationStatus === 'succeeded' && (
                    <div>
                        <p>User Information:</p>
                        <ul>
                            <li>Name: {loggedInUserInformation.name}</li>
                            <li>Email: {loggedInUserInformation.email}</li>
                        </ul>
                        <button onClick={logout}>Logout</button>
                    </div>
                )}
            </div>
            <div className="searchBar">
                <label><b>Search Users</b></label>
                <input type="text" placeholder="Search.." />
            </div>
        </div>
    );
};

export default chatPage;