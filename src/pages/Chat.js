import { collection, doc, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import MessagesForm from '../components/MessagesForm'
import Users from '../components/Users'
import { db } from '../Firebase';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { showUsers } from '../store/responsiveSlce';
import { setUser2 } from '../store/user2Slice';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CreateGroup from '../components/CreateGroup';

const Chat = () => {
    
    let { id } = useParams();
    const userID = localStorage.getItem('userId')

    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState([])
    const [user2Data, setUser2Data] = useState([])
    const [msgs, setMsgs] = useState([]);
    const [mid, setMid] = useState(null)


    const user1 = useSelector(state => state.user.userUid)
    const user2 = useSelector(state => state.user2.userUid)
    const groupId = useSelector(state => state.group.groupUid)

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const userMenu = useSelector(state => state.responsive)
    const windowValue = useSelector(state => state.window)

    //group and users
    useEffect(() => {

        const usersRef = collection(db, 'users');
        const q = id == 'all' ? query(usersRef) :
            query(usersRef, where("chatType", "==", id))
        const unsub = onSnapshot(q, (querySnapshot) => {
            let tempArray = [];
            querySnapshot.forEach((doc) => {
                tempArray.push({ ...doc.data() });
            });
            setUsers([...tempArray]);
        });
        return () => unsub();
    }, [id]);

    //updating messages related to grooup or private chats
    useEffect(() => {

        const Chatid = groupId ? groupId : (user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`)


        setMid(Chatid)

        const msgsRef = collection(db, "messages", Chatid, "chat");
        const q = query(msgsRef, orderBy("createdAt", "asc"));

        onSnapshot(q, (querySnapshot) => {
            let tempArray = [];
            querySnapshot.forEach((doc) => {
                tempArray.push(doc.data());
            });
            setMsgs([...tempArray]);
        });

        dispatch(showUsers(userMenu))
        // dispatch(setUser2(null))
    }, [groupId ? groupId : user2])


    //updating group or user when other user clicks on any chat
    useEffect(() => {
        const colRef = collection(db, 'users')
        const unsub = onSnapshot(query(colRef, where("uid", "==", groupId ? groupId : user2)), (snapshot) => {
            let tempArray = []
            snapshot.docs.forEach((doc) => {
                tempArray.push({ ...doc.data() })
            })

            setUser2Data([...tempArray])
        })
        return () => {
            unsub();
        }

    }, [groupId ? groupId : user2])

    useEffect(() => {
        const colRef = collection(db, 'users')
        const unsub = onSnapshot(query(colRef, where("uid", "==", userID)), (snapshot) => {
            let tempArray = []
            snapshot.docs.forEach((doc) => {
                tempArray.push({ ...doc.data() })
            })

            setUserData([...tempArray])
        })
        return () => {
            unsub();
        }

    }, [userID])


    return (
        userID ?
            <div>
                <Navbar userData={userData} />
                <div className='home'>
                    <div className='users' style={{ display: windowValue > 600 ? 'flex' : `${userMenu}` }}>
                        {
                            id == 'group' ? <CreateGroup /> : null
                        }
                        {
                            users.map((user) => (
                                <Users key={uuidv4()} user={user} value='true' />))
                        }

                    </div>

                    <MessagesForm msgs={msgs} user2={user2} mid={mid} user2Data={user2Data} />
                </div>
            </div> 
            : <Navigate to="/login" />
    )
}

export default Chat