import { Camera } from 'lucide-react'
import React, { useState } from 'react'
import { usePostStore } from '../store/usePostStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AddPost = () => {
    const { createPost } = usePostStore()
    const navigate = useNavigate()
    const [selectedImg, setSelectedImg] = useState(null)
    const [title, setTitle] = useState('')
    const [isUploading, setIsUploading] = useState(false)

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setSelectedImg(file)
    }

    const handleSubmit = async () => {
        if (!title || !selectedImg) {
            return toast.error('Please add a title and image')
        }

        setIsUploading(true)

        // Create a FormData object to send the file and the title
        const formData = new FormData()
        formData.append('title', title)
        formData.append('image', selectedImg)

        // Send the formData to the backend (update createPost if necessary)
        await createPost(formData)

        setIsUploading(false)
        setTitle('')
        setSelectedImg(null)
        navigate('/')
    }

    return (
        <div className='h-screen bg-base-200'>
            <div className='flex flex-center justify-center pt-20 px-4'>
                <div className='bg-base-200 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
                    <div className='flex h-full rounded-lg overflow-hidden'>
                        <div className='flex flex-col items-center gap-4 p-4 w-full'>
                            <input
                                type='text'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder='Enter post title'
                                className='input input-bordered w-full max-w-md'
                            />
                            <div className='relative'>
                                {selectedImg && (
                                    <img
                                        src={URL.createObjectURL(selectedImg)}
                                        alt='Preview'
                                        className='max-h-80 max-w-md object-contain rounded-lg border'
                                    />
                                )}
                                <label
                                    htmlFor='image-upload'
                                    className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUploading ? 'animate-pulse pointer-events-none' : ''
                                        }`}
                                >
                                    <Camera className='size-5 text-base-200' />
                                    <input
                                        type='file'
                                        id='image-upload'
                                        className='hidden'
                                        accept='image/*'
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>

                            <p className='text-sm text-zinc-400'>
                                {isUploading ? 'Uploading post...' : 'Click the camera icon to upload an image'}
                            </p>
                            <button
                                className='btn btn-primary mt-2'
                                onClick={handleSubmit}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPost
