import { useRef, useState } from 'react'
import { useChatStore } from './store/useChatStore'
import { FaPlus, FaTimes } from 'react-icons/fa';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import toast from 'react-hot-toast';

const MessageInput = () => {
    const [text, setText] = useState('')
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)
    const { sendMessage } = useChatStore()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file");
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file);
    }
    const removeImage = () => {
        setImagePreview(null)
        if (!fileInputRef.current) fileInputRef.current.value = '';
    }
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!text.trim() && !imagePreview) return

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            })
            // console.log('sent');

        }
        catch (err) {
            console.log("failed to send message", err);
        }
        removeImage();
        setText('')
    }
    return (
        <div className=" w-full relative p-5">
            {imagePreview && (
                <div className="absolute -top-25">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt='Preview'
                            className='w-24 h-24 object-cover rounded-lg'
                        />
                        <button
                            onClick={removeImage}
                            className='cursor-pointer absolute top-0 right-0 bg-[rgba(10,10,10,0.75)] p-2 rounded-full'
                            type='button'
                        >
                            <FaTimes size={12} />
                        </button>
                    </div>
                </div>
            )}

            <div>
                <form onSubmit={handleSendMessage} className="grid grid-cols-[1fr_100px] items-center gap-3 items-center">
                    <div className="">
                        <input
                            type='text'
                            className="rounded-lg w-full p-3 h-[50px] text-lg text-black border border-1 border-slate-500 outline-none"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder='Type a message'
                        />
                    </div>
                    <div className="flex gap-5 items-center justify-end">
                        <div className="">
                            <input
                                type='file'
                                accept='image/*'
                                className='hidden'
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                            <button
                                type='button'
                                className={`border border-1 border-slate-500 p-2 rounded-full sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FaPlus size={20} />
                            </button>
                        </div>
                        <div className="">
                            <button
                                type='submit'
                                className='btn btn-sm btn-circle'
                                disabled={!text?.trim() && !imagePreview}
                            >
                                <HiOutlinePaperAirplane size={35} className="rotate-45" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>


        </div>
    )
}

export default MessageInput