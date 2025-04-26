import React from 'react'
import { useAuthStore } from './store/useAuthStore'
import { Link } from 'react-router-dom';
import { FaComments, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className="flex justify-between gap-10 items-center h-full" >
      <div className="">
        <div className="">
        </div>
        <Link to={'/'}>
          <button className='cursor-pointer flex flex-row items-center text-base uppercase gap-3'>
            <FaComments size={26} />
            Chatify
          </button>
        </Link>
      </div>
      <div className="flex flex-row gap-10">
        {authUser &&
          (<Link to={'/profile'}>
            <button className='cursor-pointer flex flex-row items-center text-base uppercase gap-3'>
              <FaUser size={26} /> Profile
            </button>
          </Link>)
        }
        {authUser &&
          (<button className='cursor-pointer flex flex-row items-center text-base uppercase gap-3' onClick={logout}>
            <FaSignOutAlt size={26} /> Logout
          </button>)}
      </div>
    </div>
  )
}

export default Navbar