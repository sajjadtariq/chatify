import { create } from 'zustand';
import { axiosapiinstance } from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
import { useChatStore } from './useChatStore';

export const useFriendStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem('authUser')) || null,
    friendrequests: [],
    isFriendsLoading: false,

    addFriend: async (receiverId) => {
        try {

            const res = await axiosapiinstance.post('/request/send', receiverId);
            if (res.status === 201) return toast.success(res.data.message);
            if (res.status === 202) return toast.success(res.data.message);
            toast.success(res.data.message);
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message || "Something went wrong");
                return false;
            }
            console.log("Error in addFriend store", err.message);
            toast.error("Error in sending request");
        }
    },

    getFriend: async (userId) => {
        set({ isFriendsLoading: true })
        try {

            const res = await axiosapiinstance.get(`/request/get/${userId}`);
            set({ friendrequests: res.data })
            // console.log(get().friendrequests);

        } catch (err) {
            console.log("Error in getFriend store", err.message);
            toast.error("Error in getting friends");
        }
        finally {
            set({ isFriendsLoading: false })
        }
    },

    acceptFriend: async (receiverId) => {
        console.log('Accepting friend request from frontend');
        // const { friendrequests } = get()
        try {
            const res = await axiosapiinstance.post(`/request/accept/${receiverId}`);

            if (res.status === 404) {
                return toast.error("Receiver not found");
            }
            if (res.status === 201) {
                return toast.success("Already friends");
            }
            if (res.status === 404) {
                return toast.error("Friend request not found");
            }

            // console.log('receiverId', receiverId);

            // console.log(friendrequests);


            set((state) => ({
                friendrequests: state.friendrequests.filter(
                    (req) => req.userId !== receiverId
                )
            }));

            // console.log('accept friends', get().friendrequests);


            toast.success("Friend Request accepted");
        } catch (err) {
            console.log("Error in acceptFriend store", err.message);
            toast.error("Error in accepting friend request");
        }
    },
    deleteFriendRequest: async (requestId) => {
        console.log('Deleting friend from frontend');

        try {
            // console.log(requestId);

            const res = await axiosapiinstance.delete(`/request/delete/${requestId}`);

            if (res.status === 404) {
                return toast.error("Friend request not found");
            }

            set((state) => {

                return {
                    friendrequests: state.friendrequests.filter((req) => req && req._id !== requestId)
                };
            });


            toast.success(res.data.message);


        } catch (err) {
            console.error("Error in deleteFriendRequest store", err.message);
            toast.error("Error in deleting friend request");
        }
    },
    removeFriend: async (requestId) => {
        const { users, sortedUsers } = useChatStore.getState();

        console.log('Removing friend from frontend');

        try {
            const res = await axiosapiinstance.delete(`/friends/remove/${requestId}`);

            const updatedUsers = users.filter((user) => user.friendId !== requestId);
            const sorted = sortedUsers(updatedUsers);

            useChatStore.setState((state) => ({
                users: sorted,
                selectedUser: null
            }));

            toast.success(res.data.message || "Friend removed successfully");
        } catch (err) {
            console.error("Error in removeFriend store", err.message);

            if (err.response?.status === 404) {
                toast.error("Friend not found");
            } else {
                toast.error("Error in removing friend");
            }
        }
    },
    subscribeToFriends: () => {


        const socket = useAuthStore.getState().socket

        socket.on('newFriendRequest', async (req) => {
            const newRequest = await get().getFriend(req)
            set({
                friendrequests: [...get().friendrequests, newRequest]
            })
        })
    },
    unsubscribeFromFriends: () => {
        const socket = useAuthStore.getState().socket
        socket.off('newFriendRequest')
    },
}));