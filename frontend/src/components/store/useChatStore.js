import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosapiinstance } from "../../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosapiinstance.get('/friends/get')
            set({ users: res.data })

        }
        catch (err) {
            return
        }
        finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosapiinstance.get(`/messages/${userId}`)
            set({ messages: res.data })
        }
        catch (err) {
            toast.error("Error in fetching messages")
            console.log(err);
        }
        finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (message) => {
        const { selectedUser, messages, users, sortedUsers } = get();

        if (!selectedUser || !selectedUser._id) {
            toast.error("No selected user or invalid user ID");
            return;
        }

        try {
            const res = await axiosapiinstance.post(`/messages/send/${selectedUser._id}`, message);

            set({ messages: [...messages, res.data] });

            const updatedUsers = users.map((user) => {
                if (user.friendId.toString() === selectedUser._id.toString() || user.userId.toString() === selectedUser._id.toString()) {
                    return {
                        ...user,
                        lastMessage: {
                            ...user.lastMessage,
                            text: res.data.text,
                            createdAt: res.data.createdAt,
                        },
                    };
                }
                return user;
            });

            // console.log(updatedUsers);


            // const sortedUsers = updatedUsers.sort((a, b) => {
            //     const timestampA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
            //     const timestampB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
            //     return timestampB - timestampA;
            // });
            const sorted = sortedUsers(updatedUsers)

            set({ users: sorted });

        } catch (err) {
            console.error(err);
            toast.error("Error in sending message");
        }
    },
    subscribeToMessages: () => {
        const { selectedUser, users, sortedUsers } = get()
        const socket = useAuthStore.getState().socket

        socket.on('newMessage', async (mess) => {
            console.log('new message', mess);

            const updatedUsers = users.map((user) => {
                if (user.userId.toString() === mess.senderId.toString() || user.friendId.toString() === mess.senderId.toString()) {
                    return {
                        ...user,
                        lastMessage: {
                            ...user.lastMessage,
                            text: mess.text,
                            createdAt: mess.createdAt,
                        },
                    };
                }
                return user;
            });

            const sorted = sortedUsers(updatedUsers)

            set({ users: sorted });
        });


        if (!selectedUser) return


        socket.on('newMessage', async (mess) => {
            const messageSentFromSelectedUser = mess.senderId === selectedUser._id
            if (!messageSentFromSelectedUser) return
            set({
                messages: [...get().messages, mess]
            })
        })
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off('newMessage')
    },
    newMessageForSideBar: () => {
        const { users, sortedUsers } = get();
        const socket = useAuthStore.getState().socket;

        socket.on('newMessage', async (mess) => {
            console.log('new message', mess);

            const updatedUsers = users.map((user) => {
                if (user.userId.toString() === mess.senderId.toString() || user.friendId.toString() === mess.senderId.toString()) {
                    return {
                        ...user,
                        lastMessage: {
                            ...user.lastMessage,
                            text: mess.text,
                            createdAt: mess.createdAt,
                        },
                    };
                }
                return user;
            });

            const sorted = sortedUsers(updatedUsers)

            set({ users: sorted });
        });
    },
    unsubscribeFromNewMessageForSideBar: () => {
        const socket = useAuthStore.getState().socket
        socket.off('newMessage')
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),
    sortedUsers: (users) => {
        const sortedUsers = [...users].sort((a, b) => {

            const timestampA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const timestampB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;

            // console.log("Timestamp A:", timestampA, "Timestamp B:", timestampB);

            return timestampB - timestampA;
        });
        return sortedUsers;
    }
}))