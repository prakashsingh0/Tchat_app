import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const usePostStore = create((set, get) => {
    const store = {
        allPosts: [],
        myPost: [],
        followingPost: [],

        // ✅ Fetch all posts (from all users)
        getAllPosts: async () => {
            try {
                const res = await axiosInstance.get('auth/post/getallpost');
                set({ allPosts: res?.data?.posts || [] });
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch all posts');
            }
        },

        // ✅ Create a new post (image + title) then refresh posts
        createPost: async (data) => {
            try {
                const res = await axiosInstance.post('auth/post', data); // expects { image, title }
                toast.success(res?.data?.message || 'Post created');
                await get().getAllPosts();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to create post');
            }
        },

        // ✅ Fetch posts of the logged-in user
        fetchMyPosts: async () => {
            try {
                const res = await axiosInstance.get('auth/post/mypost');
                set({ myPost: res?.data?.posts || [] });
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch your posts');
            }
        },

        // ✅ Like or Dislike a post
        likeOrDislike: async ( postIndex) => {
            try {
                await axiosInstance.post(`auth/post/likeordislike/${postIndex}`);
                await get().getAllPosts();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to like/dislike post');
            }
        },

        // ✅ Delete a post of the current user
        deletePost: async (postIndex) => {
            try {
                await axiosInstance.delete(`auth/post/deletepost/${postIndex}`);
                toast.success('Post deleted successfully');
                await get().getAllPosts();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete post');
            }
        },

        // ✅ Get posts from people the user is following
        getFollowingPosts: async () => {
            try {
                const res = await axiosInstance.get('auth/post/getfollowingpost');
                set({ followingPost: res?.data?.posts || [] });
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch following posts');
            }
        },

        // ✅ Add comment to a post
        addComment: async (userIdOfPostOwner, postIndex, comment) => {
            try {
                await axiosInstance.post(`auth/post/comment/${userIdOfPostOwner}/${postIndex}`, {
                    comment
                });
                toast.success('Comment added');
                await get().getAllPosts();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to add comment');
            }
        }
    };

    // Auto-fetch all posts on store initialization
    store.getAllPosts();

    return store;
});
