import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Message from "../models/message.modal.js";
import mongoose from "mongoose";

export const getFriend = async (req, res) => {
    try {
        const loggedInUserId = req.user?._id;

        if (!loggedInUserId) return res.status(400).json({ message: "Invalid user" });

        const friends = await Friend.find({
            $or: [{ userId: loggedInUserId }, { friendId: loggedInUserId }]
        }).lean();

        if (!friends.length) return res.status(200).json([]);

        const friendIds = friends.map(friend =>
            friend.userId.toString() === loggedInUserId.toString() ? friend.friendId : friend.userId
        );

        const friendDetailsMap = new Map();
        const users = await User.find({ _id: { $in: friendIds } }).select('-password').lean();
        users.forEach(user => friendDetailsMap.set(user._id.toString(), user));

        const messages = await Message.aggregate([
            {
                $match: {
                    $or: friendIds.map(friendId => ({
                        senderId: loggedInUserId,
                        receiverId: friendId
                    })).concat(friendIds.map(friendId => ({
                        senderId: friendId,
                        receiverId: loggedInUserId
                    })))
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $gt: ["$senderId", "$receiverId"] },
                            then: { senderId: "$receiverId", receiverId: "$senderId" },
                            else: { senderId: "$senderId", receiverId: "$receiverId" }
                        }
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        const lastMessageMap = new Map();
        messages.forEach(msg => {
            const key = `${msg._id.senderId}_${msg._id.receiverId}`;
            lastMessageMap.set(key, msg.lastMessage);
        });

        const friendsWithDetails = friends.map(friend => {
            const isSender = friend.userId.toString() === loggedInUserId.toString();
            const friendId = isSender ? friend.friendId.toString() : friend.userId.toString();

            return {
                ...friend,
                friendDetails: friendDetailsMap.get(friendId) || null,
                lastMessage: lastMessageMap.get(`${loggedInUserId}_${friendId}`) || lastMessageMap.get(`${friendId}_${loggedInUserId}`) || { text: '', createdAt: '' }
            };
        });

        console.log(friendsWithDetails);

        const sortedUsers = [...friendsWithDetails].sort((a, b) => {

            const timestampA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const timestampB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;

            console.log("Timestamp A:", timestampA, "Timestamp B:", timestampB);

            return timestampB - timestampA;
        });
        // const sortedUsers = Array.from(friendsWithDetails).sort((a, b) => {
        //     const timestampA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
        //     const timestampB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
        //     return timestampB - timestampA;
        // });
        console.log('sorted users', sortedUsers);


        return res.status(200).json(sortedUsers);
    } catch (err) {
        console.error('Error in getFriend Controller:', err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const removeFriend = async (req, res) => {

    console.log('Removing friend from backend');

    try {
        const loggedInUserId = req.user?._id;
        if (!loggedInUserId) return res.status(400).json({ message: "Invalid user" });

        const { id: requestId } = req.params;
        if (!requestId) return res.status(400).json({ message: "Invalid request ID" });

        console.log('LoggedInUserId:', loggedInUserId);
        console.log('FriendId:', requestId);

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: "Invalid request ID" });
        }

        const response = await Friend.findOneAndDelete({
            $or: [{ userId: loggedInUserId, friendId: requestId }, { userId: requestId, friendId: loggedInUserId }]
        })

        if (!response) return res.status(404).json({ message: "Friend not found" });
        return res.status(200).json({ message: "Friend removed" });

    } catch (error) {
        console.error('Error in removeFriend Controller:', error.message);
        res.status(500).json({ message: "Internal server error" });

    }
}