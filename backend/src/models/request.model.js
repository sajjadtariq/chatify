import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        friendId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isAccepted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema)

export default FriendRequest