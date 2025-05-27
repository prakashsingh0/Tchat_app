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

    const handleLike = (index) => {
        likeOrDislike(index);
    };

    const handleDelete = (index) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost(index);
        }
    };
    const goToProfile = (id) => {
        console.log("userId=>", id);

        findUserProfile(id,navigate)
        
    }
    const isLoading = !allPosts || allPosts.length === 0;

    return (
        <div className="flex flex-col gap-5 mx-auto overflow-y-auto scrollbar-none">
            {isLoading ? (
                <PostSkeletons />
            ) : (
                allPosts.map((post, index) => (
                    <div className="flex flex-col m-2 p-2 border rounded-2xl" key={index}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => goToProfile(post.userId)}>
                                <img
                                    src={post.userPic || '/tChat.jpg'}
                                    className="h-16 w-16 rounded-full"
                                    alt={post.fullName || 'User'}
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

                        {post.image && (
                            <div className="mt-3">
                                <img
                                    src={post.image}
                                    alt="post"
                                    className="w-full h-80 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-2">
                                <Heart
                                    onClick={() => handleLike(post._id)}
                                    className={`cursor-pointer ${post.likes.includes(authUser._id)
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
