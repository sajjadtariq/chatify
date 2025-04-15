import { useChatStore } from './store/useChatStore'
import avatar from '../assets/images/avatar.webp'
import { useAuthStore } from './store/useAuthStore'
import { MdMoreHoriz } from "react-icons/md";
import Dropdown from './DropDown';
import { FaUserTimes } from 'react-icons/fa';
import { useFriendStore } from './store/useFriendStore';

const ChatHeader = () => {
    const { selectedUser } = useChatStore()
    const { onlineUsers } = useAuthStore()
    const { removeFriend } = useFriendStore()

    const removeFriendOptions = [
        { label: "Remove Friend", icon: <FaUserTimes />, onClick: () => removeFriend(selectedUser._id) },
    ];
    return (
        <div className="h-full px-5 py-10" style={{ borderBottom: '1px solid rgba(36,36,36,1)' }}>
            <div className="h-full w-full flex gap-5 items-center justify-between">
                <div className="flex gap-5 items-center">
                    <div className="relative">
                        <img
                            src={selectedUser.profilePic || avatar}
                            className='size-12 rounded-full object-cover'
                        />
                        {/* {onlineUsers.includes(selectedUser._id) && (
                        <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"></span>
                    )} */}
                    </div>
                    <div className="">
                        <h5>{selectedUser.fullname}</h5>
                        <p className="text-xs" style={{ color: 'rgb(187, 187, 187)' }}>
                            {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
                <div className="">
                    <Dropdown options={removeFriendOptions} />
                </div>
            </div>
        </div>
    )
}

export default ChatHeader