import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../Firebase';
import AddIcon from '@mui/icons-material/Add';

const CreateGroup = () => {

    const [file, setFile] = useState(null)
    const [groupName, setGroupName] = useState('')

    const createGroup = async () => {
        let uniqueId = uuidv4();
        try {

            const storageRef = ref(storage, `${uniqueId}/groupImage`);

            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    switch (snapshot.state) {
                        case 'paused':
                            break;
                        case 'running':
                            break;
                    }
                },
                (error) => {
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        let obj = {
                            uid: uniqueId,
                            name: groupName,
                            photoURL: downloadURL,
                            isOnline: false,
                            chatType: 'group',
                            createdAt: Timestamp.fromDate(new Date()),
                        }
                        await setDoc(doc(db, "users", uniqueId), obj)
                    });
                }

            );
        } catch (error) {
        }

    }

    return (
        <div style={{
            marginTop: "5px", marginBottom: "5px", display: "flex", width: "100 % ", height: "5vh", backgroundColor: 'white'
        }}>
            <input style={{ height: "2vh", flex: "0.5", padding: "11px", border: "none", outline: "none" }} type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)}></input>
            <input style={{ display: 'none' }} type="file" id="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])}>
            </input>
            <label for="file" className='group_file_lable'>
                Select Image
            </label>
            <button style={{ height: "5vh", flex: "0.2" }} onClick={createGroup}><AddIcon /></button>
        </div>
    )
}

export default CreateGroup