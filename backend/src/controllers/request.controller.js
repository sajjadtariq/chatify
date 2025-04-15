import User from "../models/user.model.js";
import FriendRequest from "../models/request.model.js";
import Friend from "../models/friend.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import mongoose from "mongoose";

export const getReceivedFriendRequest = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const friendRequests = await FriendRequest.find({ friendId: loggedInUserId })
        for (let i = 0; i < friendRequests.length; i++) {
            const { userId } = friendRequests[i]
            const senderDetails = await User.findById(userId).select('-password')
            friendRequests[i] = { ...friendRequests[i]._doc, senderDetails }
        }
        res.status(200).json(friendRequests)
    } catch (err) {
        console.log("Error in getFriendRequest controller", err.message);
        res.status(500).json({ message: "Internal server error" })
    }

}
export const sendFriendRequest = async (req, res) => {
    // console.log('sending friend request');

    try {
        const loggedInUser = req.user
        const { email } = req.body
        const receiver = await User.findOne({ email: email })
        if (!receiver) return res.status(404).json({ message: "User doesn't exist" })
        const { _id: receiverId } = receiver;
        const { _id: senderId } = loggedInUser;
        const alreadyExists = await FriendRequest.findOne({
            $or: [
                { userId: senderId, friendId: receiverId },
                { userId: receiverId, friendId: senderId }
            ]
        });
        const alreadyFriend = await Friend.findOne({
            $or: [
                { userId: senderId, friendId: receiverId },
                { userId: receiverId, friendId: senderId }
            ]
        });
        if (alreadyFriend) return res.status(202).json({ message: "Already Friends" })

        if (alreadyExists) return res.status(201).json({ message: "Friend request already sent" })
        const newFriendRequest = new FriendRequest({ userId: senderId, friendId: receiverId })
        await newFriendRequest.save()

        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newFriendRequest', newFriendRequest)
        }

        res.status(200).json({ message: "Friend request sent" })

    } catch (err) {
        console.log("Error in sendFriendRequest controller", err.message);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const acceptFriendRequest = async (req, res) => {
    // console.log('accepting friend request backend');
    try {
        const loggedInUserId = req.user._id.toString()
        const { id: receiverId } = req.params

        if (!receiverId) return res.status(404).json({ message: "ReceiverId not found" })
        const receiver = await User.findOne({ _id: receiverId })
        if (!receiver) return res.status(404).json({ message: "Receiver not found" })
        const newFriend = new Friend({ userId: loggedInUserId, friendId: receiverId })
        const alreadyFriend = await Friend.findOne({
            $or: [
                { userId: receiverId, friendId: loggedInUserId },
                { userId: loggedInUserId, friendId: receiverId }
            ]
        })
        if (alreadyFriend) return res.status(201).json({ message: "Already friends" })
        const friendRequestStatus = await FriendRequest.findOneAndDelete({
            $or: [
                { userId: receiverId, friendId: loggedInUserId },
                { userId: loggedInUserId, friendId: receiverId }
            ]
        })
        if (!friendRequestStatus) return res.status(404).json({ message: "Friend request not found" })
        await newFriend.save()
        res.status(200).json({ message: "Friend request accepted" })

    } catch (err) {
        console.log("Error in acceptFriendRequest controller", err.message);
        res.status(500).json({ message: "Internal server error" })
    }

}
export const deleteFriendRequest = async (req, res) => {
    console.log('Deleting friend request from backend');

    try {

        const { id: requestId } = req.params;

        if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: "Invalid friend request ID" });
        }

        const objectId = new mongoose.Types.ObjectId(requestId);

        const result = await FriendRequest.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        res.status(200).json({ message: "Friend request deleted" });

    } catch (error) {
        console.error("Error in deleteFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
