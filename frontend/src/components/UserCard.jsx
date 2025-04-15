import avatar from '../assets/images/avatar.webp'

const UserCard = ({ image, isOnline, name, lastMessage, lastMessageTime, onClick, styling }) => {
    return (
        <button className={`flex gap-5 cursor-pointer items-center p-2 ${styling}`} onClick={onClick}>
            <div className="relative">
                <img
                    src={image || avatar}
                    className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"></span>
                )}
            </div>
            <div className="text-left min-w-0 grow-1">
                <h5>{name || ''}</h5>
                <div className="w-full flex justify-between items-center">
                    <h6 className='mt-1 pl-1 text-base' style={{ color: 'rgba(200,200,200,0.75)' }}>
                        {lastMessage ? lastMessage : ''}
                    </h6>
                    <h6 className='mt-1 pl-1 text-sm' style={{ color: 'rgba(200,200,200,0.75)' }}>
                        {lastMessageTime ? lastMessageTime : ''}
                    </h6>
                </div>
            </div>
        </button>
    )
}

export default UserCard