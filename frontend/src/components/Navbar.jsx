import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js';
import { Link } from 'react-router-dom';
import { ImageUp, LogOut, MessageSquare, Settings, User } from 'lucide-react';

function Navbar() {
  const { logout, authUser } = useAuthStore();
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blue-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div>
            <Link to={"/"} className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
              <div className="size-9 rounded-lg bg-primary/10 flex intems-center justify-center">
                <MessageSquare className='w-5 h-5 text-primary' />
              </div>
              <h1 className="text-lg font-bold">Tchat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link to={"/setting"} className={`
           btn btn-sm transition-colo hidden lg:flex`}>

              <Settings className='w-4 h-4' />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            {authUser && <>
              <Link to={"/upload"} className={`
           btn btn-sm gap-2`}>

                <ImageUp className='size-5' />
                <span className="hidden sm:inline">Add Post</span>
              </Link>
              <Link to={"/Profile"} className={`
           btn btn-sm gap-2 hidden lg:flex`}>

                <User className='size-5' />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button className="flex gap-2 items-center hidden lg:flex" onClick={logout}>

                <LogOut className='w-4 h-4' />
                <span className="hidden sm:inline">Logout</span>
              </button>

            </>}

            {authUser && <div className="flex gap-2 block sm:hidden">

              <div className="dropdown dropdown-end ">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={authUser.profilePic} />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">

                  <li><Link to={"/Profile"} >

                    <User className='size-5' />
                    <span >Profile</span>
                  </Link></li>
                  <li>
                    <Link to={"/setting"} >

                      <Settings className='w-4 h-4' />
                      <span >Settings</span>
                    </Link>
                  </li>
                  <li><button className="flex gap-2 items-center" onClick={logout}>

                    <LogOut className='w-4 h-4' />
                    <span className="">Logout</span>
                  </button></li>
                </ul>
              </div>

            </div>}
          </div>



        </div>

      </div>
    </header>
  )
}

export default Navbar
