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
        if (window.confirm("Are you sure you want to delete this post?")) {
            deletePost(postId);
        }
    };

    const goToProfile = (id) => findUserProfile(id, navigate);

    const isLoading = !allPosts || allPosts.length === 0;

    return (
        <div className="flex flex-col gap-5 mx-auto overflow-y-auto scrollbar-none">
            {isLoading ? (
                <PostSkeletons />
            ) : (
                allPosts.map((post) => (
                    <div className="flex flex-col m-2 p-2 border rounded-2xl" key={post._id}>

                        {/* USER INFO */}
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
                                        {post.description || "No description"}
                                    </div>
                                </div>
                            </div>

                            {/* DELETE BUTTON */}
                            {authUser._id === post.userId && (
                                <CircleX
                                    className="cursor-pointer text-red-600"
                                    onClick={() => handleDelete(post._id)}
                                />
                            )}
                        </div>

                        {/* MEDIA CONTENT */}
                        <div className="mt-3">

                            {/* IMAGE */}
                            {post.file && post.fileType === "image" && (
                                <img
                                    src={post.file}
                                    alt="post"
                                    className="w-full h-80 object-cover rounded-lg"
                                />
                            )}

                            {/* VIDEO */}
                            {post.file && post.fileType === "video" && (
                                <video controls className="w-full h-80 object-cover rounded-lg">
                                    <source src={post.file} />
                                </video>
                            )}

                            {/* AUDIO */}
                            {post.file && post.fileType === "audio" && (
                                <audio controls className="w-full mt-2">
                                    <source src={post.file} />
                                </audio>
                            )}

                            {/* DOCUMENTS (PDF / DOCX / DOC) */}
                            {post.file && post.fileType === "document" && (
                                <div className="p-4 border rounded-lg bg-gray-50 shadow flex flex-col gap-3">

                                    {/* FILE HEADER */}
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-7 h-7 text-gray-700" />

                                        {/* File name */}
                                        <span className="font-semibold truncate">
                                            {post.file.split("/").pop()}
                                        </span>

                                        {/* FILE SIZE */}
                                        {post.fileSize && (
                                            <span className="text-sm text-gray-500">
                                                {(post.fileSize / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        )}
                                    </div>

                                    {/* PDF EMBED */}
                                    {post.file.toLowerCase().endsWith(".pdf") && (
                                        <embed
                                            src={post.file}
                                            type="application/pdf"
                                            className="w-full h-96 rounded-lg border"
                                        />
                                    )}

                                    {/* DOCX OR DOC — GOOGLE DOCS VIEWER */}
                                    {(post.file.toLowerCase().endsWith(".docx") ||
                                        post.file.toLowerCase().endsWith(".doc")) && (
                                        <iframe
                                            src={`https://docs.google.com/gview?url=${post.file}&embedded=true`}
                                            className="w-full h-96 rounded-lg border bg-white"
                                            title="Word Document Preview"
                                        ></iframe>
                                    )}

                                    {/* DOWNLOAD BUTTON */}
                                    <a
                                        href={post.file}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
                                    >
                                        Download File
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-2">
                                <Heart
                                    onClick={() => handleLike(post._id)}
                                    className={`cursor-pointer ${
                                        post.likes.includes(authUser._id)
                                            ? "text-red-600 fill-red-600"
                                            : ""
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
