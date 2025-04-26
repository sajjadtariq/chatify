import React from 'react'
import { useAuthStore } from '../components/store/useAuthStore'
import InputField from '../components/ui/InputField';
import avatar from '../assets/images/avatar.webp'

const ProfilePage = () => {
  const { authUser, updateProfile } = useAuthStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;

      try {
        await updateProfile({ profilePic: base64Image });
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    };
  };


  return (
    <div className=" flex flex-col gap-10 items-center">
      <div className="">
        <h3 className='m-0 text-5xl uppercase'>
          profile information
        </h3>
      </div>
      <div className="relative">
        <img
          src={authUser.profilePic || avatar} alt=""
          className='w-72 h-72 object-cover rounded-full'
        />
        <label htmlFor='upload-avatar' className='cursor-pointer absolute top-5 right-0 px-5 py-2 rounded-lg bg-[rgba(10,10,10,0.75)]'>
          Edit
        </label>
        <input type="file" accept='image/*' onChange={handleImageUpload} id='upload-avatar' className='hidden' />
      </div>
      <div className="min-w-[400px] flex flex-col gap-5">
        <InputField placeholder={authUser.fullname} readonly={true} />
        <InputField placeholder={authUser.email} readonly={true} />
      </div>
    </div>
  )
}

export default ProfilePage