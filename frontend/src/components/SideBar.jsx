import { useEffect } from "react";
import { useChatStore } from "./store/useChatStore"
import avatar from '../assets/images/avatar.webp'
import { useAuthStore } from "./store/useAuthStore";


const SideBar = () => {
    const { getUsers, users, selectedUser, isUsersLoading, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore()
    useEffect(() => {
        getUsers()
    }, [getUsers])

    if (isUsersLoading) return <p>Loading..</p>

    return (
        <div className="flex flex-col gap-5 px-3">
            <div className="overlow-y-auto w-full py-3 flex flex-col gap-3">
                {users.map((user) => {
                    const currSelectedUser = user.friendDetails
                    return (
                        <button
                            key={currSelectedUser._id}
                            onClick={() => setSelectedUser(currSelectedUser)}
                            className={`cursor-pointer ${selectedUser?._id === currSelectedUser._id ? 'bg-[rgba(36,36,36,1)] rounded-xl' : ""}`}
                        >
                            <div className="flex gap-3 items-center p-2">
                                <div className="relative">
                                    <img
                                        src={currSelectedUser.profilePic || avatar}
                                        alt={currSelectedUser.fullname}
                                        className="size-12 object-cover rounded-full"
                                    />
                                    {onlineUsers.includes(user._id) && (
                                        <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"></span>
                                    )}
                                </div>
                                <div className="hidden lg:block text-left min-w-0">
                                    <h5>{currSelectedUser.fullname}</h5>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default SideBar