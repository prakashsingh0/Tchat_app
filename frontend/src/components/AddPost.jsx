import { Camera } from 'lucide-react';
import React, { useState } from 'react';
import { usePostStore } from '../store/usePostStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
    const { createPost } = usePostStore();
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Detect file type
    const getFileType = (file) => {
        if (!file) return null;
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        if (file.type.startsWith('audio/')) return 'audio';
        return 'other';
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (!title || !selectedFile) {
            return toast.error('Please add a title and select a file');
        }
        console.log(selectedFile);

        setIsUploading(true);

        // Create a FormData object to send the file and the title
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', selectedFile); // ✅ unified field for backend

        await createPost(formData);

        setIsUploading(false);
        setTitle('');
        setSelectedFile(null);
        navigate('/');
    };

    const fileType = getFileType(selectedFile);

    return (
        <div className="h-screen bg-base-200">
            <div className="flex flex-center justify-center pt-20 px-4">
                <div className="bg-base-200 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <div className="flex flex-col items-center gap-4 p-4 w-full">
                            {/* Title */}
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter post title"
                                className="input input-bordered w-full max-w-md"
                            />

                            {/* Preview */}
                            <div className="relative">
                                {selectedFile && fileType === 'image' && (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Preview"
                                        className="max-h-80 max-w-md object-contain rounded-lg border"
                                    />
                                )}

                                {selectedFile && fileType === 'video' && (
                                    <video
                                        controls
                                        className="max-h-80 max-w-md rounded-lg border"
                                    >
                                        <source src={URL.createObjectURL(selectedFile)} />
                                        Your browser does not support the video tag.
                                    </video>
                                )}

                                {selectedFile && fileType === 'audio' && (
                                    <audio
                                        controls
                                        className="w-full max-w-md mt-2"
                                    >
                                        <source src={URL.createObjectURL(selectedFile)} />
                                        Your browser does not support the audio tag.
                                    </audio>
                                )}

                                {/* File Input */}
                                <label
                                    htmlFor="file-upload"
                                    className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUploading ? 'animate-pulse pointer-events-none' : ''
                                        }`}
                                >
                                    <Camera className="size-5 text-base-200" />
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept="image/*,video/*,audio/*" // ✅ support all
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>

                            {/* Info */}
                            <p className="text-sm text-zinc-400">
                                {isUploading
                                    ? 'Uploading post...'
                                    : 'Click the camera icon to upload image, video, or audio'}
                            </p>

                            {/* Submit Button */}
                            <button
                                className="btn btn-primary mt-2"
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
    );
};

export default AddPost;
