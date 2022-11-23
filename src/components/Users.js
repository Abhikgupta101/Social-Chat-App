import { useDispatch, useSelector } from "react-redux";
import { setGroup } from "../store/groupSlice";
import { setUser2 } from "../store/user2Slice";
const Users = ({ user, value }) => {
    const dispatch = useDispatch();

    const updateChatId = () => {

        if (user.chatType == 'group') {
            dispatch(setGroup(user.uid))
            dispatch(setUser2(null))
        }
        else {
            dispatch(setGroup(null))
            dispatch(setUser2(user.uid))
        }
    }

    return (

        <div className="single_user" onClick={updateChatId} >
            <div style={{ display: 'flex', height: '100%', flex: '1', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: '1' }}>
                    <img style={{ width: '35px', height: '35px', borderRadius: '100px', marginLeft: '5%' }} src={user.photoURL} />
                </div>
                <div style={{ flex: '1' }}>{user.name}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: "100%", flexBasis: "20%" }}>
                {
                    user.chatType == 'private' && value == 'true' ?
                        <div>
                            {
                                user.isOnline ?
                                    <div style={{ width: "10px", height: "10px", backgroundColor: "green" }}></div> :
                                    <div style={{ width: "10px", height: "10px", backgroundColor: "red" }}></div>
                            }
                        </div> : null
                }
            </div>
        </div >
    )
}

export default Users