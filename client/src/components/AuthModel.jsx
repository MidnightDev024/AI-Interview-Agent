import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaTimes } from 'react-icons/fa'
import Auth from '../pages/Auth'

function AuthModel({ onClose }) {
    const {userData} = useSelector((state) => state.user)

    useEffect(() => {
        if(userData) {
            onClose();
        }   
    },[userData, onClose])

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

  return (
    <div
        className='fixed inset-0 z-[999] flex items-center justify-center bg-black/10 backdrop-blur-sm px-4 py-6'
        role="dialog"
        aria-modal="true"
    >
        <div className='relative w-full max-w-md'>
            <button 
            onClick={onClose}
            className='absolute top-4 right-4 z-10 rounded-full p-2 text-gray-700 hover:text-black hover:bg-gray-100 transition'
            aria-label="Close sign in modal"
            type="button">
                <FaTimes size={18} />
            </button>
            <Auth isModel={true} />
        </div>
    </div>
  )
}

export default AuthModel
