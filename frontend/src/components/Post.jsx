import { CircleX, Heart, MessageCircle } from 'lucide-react';
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
                    <div className="flex flex-col m-2 p-2 border rounded-2xl" key={post._id}>
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
                                    <div className="font-semibold">{post.userName}</div>
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

                        {/* Media Content (Image, Video, Audio) */}
                        <div className="mt-3">
                            {post.file && post.fileType === 'image' && (
                                <img
                                    src={post.file}
                                    alt="post"
                                    className="w-full h-80 object-cover rounded-lg"
                                />
                            )}

                            {post.file && post.fileType === 'video' && (
                                <video
                                    controls
                                    className="w-full h-80 object-cover rounded-lg"
                                >
                                    <source src={post.file} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}

                            {post.file && post.fileType === 'audio' && (
                                <audio
                                    controls
                                    className="w-full mt-2"
                                >
                                    <source src={post.file} type="audio/mpeg" />
                                    Your browser does not support the audio tag.
                                </audio>
                            )}
                        </div>

                        {/* Actions (Like + Comment) */}
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
