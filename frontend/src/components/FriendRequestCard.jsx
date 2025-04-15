import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Importing the tick and cross icons

const FriendRequestCard = ({ profileImage, profileName, email, handleAccept, handleDelete }) => {

    return (
        <div className="flex items-center justify-between p-4 border border-slate-500 rounded-lg shadow-md min-w-[625px]  mb-4">
            <div className="flex gap-5">
                <img src={profileImage} className='rounded-full w-24 h-24 object-cover' />
                <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-semibold">{profileName}</h3>
                    <p className="text-sm text-gray-500">{email}</p>
                </div>
            </div>
            <div className="flex space-x-4">
                <button
                    onClick={handleAccept}
                    className="p-2 rounded-full border border-green-600 hover:bg-green-300 transition-colors duration-200 ease-in-out"
                >
                    <FaCheck size={20} fill="green" />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-2 rounded-full border border-red-600 hover:bg-red-300 transition-colors duration-200 ease-in-out"
                >
                    <FaTimes size={20} fill="red" />
                </button>
            </div>
        </div>
    );
};

export default FriendRequestCard;
