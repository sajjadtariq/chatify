import { create } from 'zustand';
import { axiosapiinstance } from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = 'http://localhost:5001'

export const useAuthStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem('authUser')) || null,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosapiinstance.get('/auth/check');
            set({ authUser: res.data });
            localStorage.setItem('authUser', JSON.stringify(res.data));
            get().connectSocket();
        } catch (err) {
            set({ authUser: null });
            localStorage.removeItem('authUser');
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        try {
            const res = await axiosapiinstance.post('/auth/signup', data);

        
            set({ authUser: res.data });
            localStorage.setItem('authUser', JSON.stringify(res.data));
            toast.success("Account created successfully");
            get().connectSocket();

            return true;

        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message || "Something went wrong");
                return false; 
            }
            toast.error("Error in signing up. Try again");
            return false;
        }
    },

    login: async (data) => {
        try {
            const res = await axiosapiinstance.post('/auth/login', data);
            set({ authUser: res.data });
            localStorage.setItem('authUser', JSON.stringify(res.data));
            toast.success("Logged in successfully");
            get().connectSocket();
            return true;
        } catch (err) {
            toast.error('Invalid credentials');
            return false;
        }
    },

    logout: async () => {
        try {
            await axiosapiinstance.post('/auth/logout');
            set({ authUser: null });
            localStorage.removeItem('authUser');
            toast.success('Logged out');
            get().disconnectSocket();
        } catch (err) {
            toast.error('Error logging out');
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await axiosapiinstance.put('/auth/update-profile', data);
            set({ authUser: res.data });
            localStorage.setItem('authUser', JSON.stringify(res.data));
            toast.success("Profile picture updated successfully!");
        } catch (err) {
            console.error('Error in updateProfile:', err);
            toast.error("Error in updating profile picture");
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        })
        socket.connect();
        set({ socket });
        socket.on('getOnlineUsers', (usersId) => {
            set({ onlineUsers: usersId });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    }
}));
