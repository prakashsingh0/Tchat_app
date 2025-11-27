import { CircleX, Heart, MessageCircle, FileText } from 'lucide-react';
import React, { useEffect } from 'react';
import { usePostStore } from '../store/usePostStore';
import PostSkeletons from './skeletons/PostSkeletons';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Post = () => {
    const { authUser, findUserProfile } = useAuthStore();
    const { allPosts, getAllPosts, likeOrDislike, deletePost } = usePostStore();
    const navigate = useNavigate();

    useEffect(() => {
        getAllPosts();
    }, [getAllPosts]);

    const handleLike = (postId) => {
        likeOrDislike(postId);
    };

    const handleDelete = (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost(postId);
        }
    };

    const goToProfile = (id) => {
        findUserProfile(id, navigate);
    };

    const isLoading = !allPosts || allPosts.length === 0;

    return (
        <div className="flex flex-col gap-5 mx-auto overflow-y-auto scrollbar-none">
            {isLoading ? (
                <PostSkeletons />
            ) : (
                allPosts.map((post) => (
                    <div
                        className="flex flex-col m-2 p-2 border rounded-2xl"
                        key={post._id}
                    >
                        {/* User Info */}
                        <div className="flex justify-between items-center">
                            <div
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => goToProfile(post.userId)}
                            >
                                <img
                                    src={post.userPic || '/tChat.jpg'}
                                    className="h-16 w-16 rounded-full"
                                    alt={post.userName || 'User'}
                                />
                                <div>
                                    <div className="font-semibold">
                                        {post.userName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {post.description || 'No description'}
                                    </div>
                                </div>
                            </div>

                            {authUser._id === post.userId && (
                                <CircleX
                                    className="cursor-pointer text-red-600"
                                    onClick={() => handleDelete(post._id)}
                                />
                            )}
                        </div>

                        {/* Media Content */}
                        <div className="mt-3">

                            {/* IMAGE */}
                            {post.file && post.fileType === 'image' && (
                                <img
                                    src={post.file}
                                    alt="post"
                                    className="w-full h-80 object-cover rounded-lg"
                                />
                            )}

                            {/* VIDEO */}
                            {post.file && post.fileType === 'video' && (
                                <video
                                    controls
                                    className="w-full h-80 object-cover rounded-lg"
                                >
                                    <source src={post.file} type="video/mp4" />
                                </video>
                            )}

                            {/* AUDIO */}
                            {post.file && post.fileType === 'audio' && (
                                <audio controls className="w-full mt-2">
                                    <source src={post.file} type="audio/mpeg" />
                                </audio>
                            )}

                            {/* DOCUMENTS (PDF / Word) */}
                            {post.file && post.fileType === 'document' && (
                                <a
                                    href={post.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 border rounded-lg bg-white shadow"
                                >
                                    <FileText className="text-gray-700" />

                                    {/* Detect PDF or Word by extension */}
                                    {post.file.toLowerCase().endsWith(".pdf") ? (
                                        <span className="font-medium">
                                            View PDF File
                                        </span>
                                    ) : (
                                        <span className="font-medium">
                                            View Word Document
                                        </span>
                                    )}
                                </a>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-2">
                                <Heart
                                    onClick={() => handleLike(post._id)}
                                    className={`cursor-pointer ${
                                        post.likes.includes(authUser._id)
                                            ? 'text-red-600 fill-red-600'
                                            : ''
                                    }`}
                                />
                                <span>{post.likes.length}</span>
                            </div>

                            <MessageCircle className="cursor-pointer" />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Post;
