import { collection, deleteDoc, doc, onSnapshot, query, setDoc, Timestamp, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../Firebase'
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from "react-redux";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import ScrollableFeed from 'react-scrollable-feed'
import Users from './Users';


const MessagesForm = ({ msgs, user2, mid, user2Data }) => {

    const user1 = useSelector(state => state.user.userUid)

    const [userData, setUserData] = useState([])

    const [curmsg, setCurmsg] = useState('')

    const sendMsg = async () => {
        let uniqueId = uuidv4();
        const t = Timestamp.fromDate(new Date());
        // const d = t.toDate();

        await setDoc(doc(db, `messages/${mid}/chat`, uniqueId), {
            message: curmsg,
            messageId: uniqueId,
            createdAt: t,
            name: userData[0].name,
            from: user1,
            to: user2
        });
    }
    const deleteMsg = async (id) => {
        await deleteDoc(doc(db, `messages/${mid}/chat`, id))
    }

    useEffect(() => {
        const usersRef = collection(db, "users");
        const unsub = onSnapshot(query(usersRef, where("uid", "==", user1)), (querySnapshot) => {
            let tempArray = [];
            querySnapshot.forEach((doc) => {
                tempArray.push({ ...doc.data() });
            });
            setUserData([...tempArray]);
        });
        return () => unsub();
    }, [user1]);

    useEffect(() => {
        window.scrollTo(100, 100);
    }, []);

    return (
        <div className='messageform'>
            {
                user2Data.map((user) => (
                    <Users key={user.uid} user={user} value='false' />))
            }
            <ScrollableFeed className='messages_box' forceScroll='true'>
                {
                    msgs.map((msginfo) => (
                        <div key={uuidv4()}>
                            <div style={{ display: 'flex', marginTop: '10px', color: 'white', fontSize: '10px', }}>
                                <div style={{ marginLeft: '5px' }}>{msginfo.name}</div>
                                <div style={{ marginLeft: '5px' }}>{msginfo.createdAt.toDate().toDateString()}</div>
                                <div style={{ marginLeft: '5px' }}>{msginfo.createdAt.toDate().toTimeString().split(" ")[0]}</div>
                            </div>
                            {
                                msginfo.from == user1 ?
                                    <div style={{ display: "flex", height: '5vh', marginTop: '10px', marginBottom: '10px', color: 'white', borderColor: '2px solid blue', backgroundColor: 'rgb(0,163,136)', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ marginLeft: '5px' }}>{msginfo.message}</div>
                                        <div style={{ marginRight: '5px' }} onClick={() => deleteMsg(msginfo.messageId)}><DeleteIcon /></div>
                                    </div> :
                                    <div style={{ display: "flex", height: '5vh', width: '100%', marginTop: '10px', marginBottom: '10px', backgroundColor: 'green', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ marginLeft: '5px' }}>{msginfo.message}</div>
                                    </div>
                            }
                        </div>
                    ))
                }
            </ScrollableFeed>
            <div className='messageform_cont'>
                <input style={{ height: "2vh", flex: "1", padding: "11px", border: "none", outline: "none" }} type="text" placeholder="Your Message" value={curmsg} onChange={(e) => setCurmsg(e.target.value)}></input>
                <button style={{
                    height: "5vh", flex: "0.1"
                }} onClick={sendMsg}><SendIcon />
                </button>
            </div>
        </div >
    )
}

export default MessagesForm