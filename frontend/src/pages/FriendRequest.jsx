import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../components/ui/InputField';
import { useFriendStore } from '../components/store/useFriendStore';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../components/store/useAuthStore';
import FriendRequestCard from '@/components/FriendRequestCard';
import avatar from '../assets/images/avatar.webp'

const FriendRequest = () => {

    const { addFriend, getFriend, acceptFriend, deleteFriendRequest, isFriendsLoading, friendrequests, subscribeToFriends, unsubscribeFromFriends } = useFriendStore();
    const { authUser } = useAuthStore()

    useEffect(() => {
        getFriend(authUser._id);
        subscribeToFriends()
        return () => unsubscribeFromFriends()
    }, [getFriend, subscribeToFriends, unsubscribeFromFriends])

    const friendRequestSchema = z
        .object({
            email: z.string().email("Invalid email address"),
        })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(friendRequestSchema),
    })

    const onSubmit = async (data) => {
        await addFriend(data);
        reset();
    }
    return (
        <div className="flex flex-col gap-10 items-center">
            <div className="">
                <h1 className='my-5 text-2xl'>Send a Friend Request</h1>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex gap-5 items-center max-w-fit'>
                    <div className="min-w-[400px]">
                        <InputField
                            label=""
                            type="email"
                            placeholder="Enter your email"
                            register={register}
                            errors={errors}
                            name="email"
                        />
                    </div>
                    <div className="w-full">
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="rounded-lg cursor-pointer border border-slate-400 text-black px-5 py-3 min-w-[200px]"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
            {friendrequests.length > 0 ?
                (
                    <div className="">
                        <h1 className='my-5'>Incoming Friend Request</h1>
                        <div className="">
                            {friendrequests.map((data, index) => {
                                // console.log(data);
                                
                                if (!data || !data.senderDetails) {
                                    return null;
                                }

                                return (
                                    <div className="flex gap-3" key={index}>
                                        <FriendRequestCard
                                            profileImage={data.senderDetails.profilePic || avatar}
                                            email={data.senderDetails.email}
                                            profileName={data.senderDetails.fullname}
                                            handleAccept={() => acceptFriend(data.userId)}
                                            handleDelete={() => deleteFriendRequest(data._id)}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                )
                :
                (
                    ''
                )
            }
        </div>
    )
}

export default FriendRequest