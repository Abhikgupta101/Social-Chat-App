import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from '../Firebase';
import { showUsers } from '../store/responsiveSlce';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';


const Navbar = ({ userData }) => {
    // const userUid = useSelector(selectUid);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userid = useSelector(state => state.user.userUid)
    const userMenu = useSelector(state => state.responsive)

    const updatechat = (id) => {
        navigate(`/chat/${id}`, { replace: true });
    }

    const usersMenu = () => {
        dispatch(showUsers(userMenu))
    }

    const logout = async () => {
        await updateDoc(doc(db, "users", userid), {
            isOnline: false,
        });
        await signOut(auth);
        navigate('/register', { replace: true });
    }
    return (
        <div className='nav_container'>
            <div className='nav_menu'>
                <MenuIcon onClick={usersMenu} />
            </div>
            {
                userData.length == 1 ?
                    <div className='nav_logo'>
                        <img style={{ width: '50px', height: '50px', borderRadius: '100px' }} src={userData[0].photoURL} />
                        <div>{userData[0].name}</div>
                    </div> : null
            }

            <div className='nav_links'>
                <div onClick={() => updatechat('all')} className='links'>
                    <div className='links_icons'>
                        <ChatIcon />
                        <div>All Chats</div>
                    </div>
                </div>
                <div onClick={() => updatechat('private')} className='links'>
                    <div className='links_icons'>
                        <GroupIcon />
                        <div>Private</div>
                    </div>
                </div>
                <div onClick={() => updatechat('group')} className='links'>
                    <div className='links_icons'>
                        <GroupsIcon />
                        <div>Groups</div>
                    </div>
                </div>
                <div onClick={logout} className='links_icons'>
                    <LogoutIcon />
                    <div>Logout</div>
                </div>
            </div>
        </div >
    )
}

export default Navbar