import { useEffect, useState } from "react";
import { useChatStore } from "./store/useChatStore";
import { useAuthStore } from "./store/useAuthStore";
import UserCard from "./UserCard";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger, // Import SidebarTrigger from shadcn
} from "@/components/ui/sidebar";
import { FaImage, FaSignOutAlt, FaUser, FaUsers } from "react-icons/fa";
import { SkeletonDemo } from "./ui/userskeleton";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import DropDown from "./DropDown";
import { formatMessageTime } from "@/lib/formatTime";
import Dropdown from "./DropDown";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
    const { getUsers, users, selectedUser, isUsersLoading, setSelectedUser, newMessageForSideBar, unsubscribeFromNewMessageForSideBar } = useChatStore();
    const { onlineUsers, logout } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState("");
    const { authUser } = useAuthStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // 1024px is the lg breakpoint in Tailwind

    useEffect(() => {
        if (!authUser) return;
        const fetchData = async () => {
            try {
                await getUsers();
                newMessageForSideBar();
            } catch (error) {
                console.error("Error fetching users or setting up message listener:", error);
            }
        };

        fetchData();
        return () => unsubscribeFromNewMessageForSideBar();
    }, [getUsers, newMessageForSideBar, unsubscribeFromNewMessageForSideBar]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSidebarClick = (currSelectedUser) => {
        setSelectedUser(currSelectedUser);
        if (isMobile) {
            const sidebarTrigger = document.querySelector('[data-sidebar="trigger"]');
            if (sidebarTrigger) {
                sidebarTrigger.click();
            }
        }
    };

    const navigate = useNavigate();

    const filteredUsers = users.filter(user =>
        user.friendDetails.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const accountOptions = [
        { label: "Profile", icon: <FaUser />, onClick: () => navigate('/profile') },
        { label: "Friend Requests", icon: <FaUsers />, onClick: () => navigate('/friendrequest') },
        { label: "Logout", icon: <FaSignOutAlt />, onClick: logout },
    ];

    return (
        <Sidebar>
            <SidebarContent className="scrollbar-hide py-3">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <div className="px-2">
                                <div className="flex lg:hidden w-full flex items-end mb-5">
                                    <SidebarTrigger data-sidebar="trigger" /> {/* Add data-sidebar attribute for targeting */}
                                </div>
                                <div className="flex justify-between">
                                    <h2 className="text-3xl font-bolder">Messages</h2>
                                    <Dropdown options={accountOptions} />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="my-10 rounded-lg w-full p-3 h-[40px] text-base text-black border border-1 border-slate-400 outline-none"
                                    placeholder="Search users..."
                                />
                            </div>
                        </SidebarMenu>
                        <SidebarMenu>
                            {isUsersLoading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <div className="" key={i}>
                                        <SkeletonDemo />
                                    </div>
                                ))
                            ) : (
                                <>
                                    {filteredUsers.map((user) => {
                                        const currSelectedUser = user.friendDetails;
                                        const isImageMessage = user.lastMessage?.image && !user.lastMessage.text;
                                        const messageContent = isImageMessage ? (
                                            <div className="flex items-center gap-2">
                                                <FaImage className="text-gray-400 text-opacity-75" />
                                                <span className="text-gray-500" style={{ color: 'rgba(200,200,200,0.75)' }}>Image</span>
                                            </div>
                                        ) : (
                                            user.lastMessage?.text.slice(0, 10) + (user.lastMessage.length > 10 ? '...' : '')
                                        );
                                        const time = user.lastMessage?.createdAt ? formatMessageTime(user.lastMessage.createdAt) : '';

                                        // console.log('lastmessage', user.lastMessage);


                                        return (
                                            <SidebarMenuItem key={currSelectedUser._id} className="group">
                                                <SidebarMenuButton asChild>
                                                    <UserCard
                                                        image={currSelectedUser.profilePic}
                                                        isOnline={onlineUsers.includes(currSelectedUser._id)}
                                                        name={currSelectedUser.fullname}
                                                        lastMessage={messageContent}
                                                        lastMessageTime={time}
                                                        styling={`cursor-pointer min-h-[70px] w-full rounded-lg ${selectedUser?._id === currSelectedUser._id ? 'app-selected-background' : ""
                                                            } app-hover-background`}
                                                        onClick={() => handleSidebarClick(currSelectedUser)}
                                                    />
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}