import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { CircleX, Heart, MessageCircle } from 'lucide-react';
import PostSkeletons from './skeletons/PostSkeletons';
import { usePostStore } from '../store/usePostStore';

const Profile = () => {
  const { authUser, userProfile } = useAuthStore();
  const { likeOrDislike, deletePost } = usePostStore();

  const user = userProfile?.user;
  const posts = userProfile?.posts;

  const handleLike = (postId) => {
    likeOrDislike(postId);
  };

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  if (!user) {
    return (
      <div className="h-screen pt-20 flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const isLoading = !posts;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-base-content/20 rounded-xl p-6 space-y-8 z-50">
          {/* User Info */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-4 items-center">
              <img
                src={user.profilePic || '/user.png'}
                alt="Profile"
                className="h-16 w-16 rounded-full"
              />
              <div className="space-y-1">
                <div className="font-semibold text-lg">{user.fullName}</div>
                <div className="text-sm text-gray-500">
                  {user.followers?.length} followers • {user.following?.length} following
                </div>
              </div>
            </div>
            <button className="border px-4 py-1 rounded-lg">Follow</button>
          </div>

          <hr />

          {/* Posts */}
          <div className="flex flex-col gap-5 mx-auto overflow-y-auto scrollbar-none">
            {isLoading ? (
              <PostSkeletons />
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-500">No posts yet.</div>
            ) : (
              posts.map((post) => (
                <div className="flex flex-col p-4 border rounded-2xl" key={post._id}>
                  {/* Post Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.userPic || '/tChat.jpg'}
                        className="h-14 w-14 rounded-full"
                        alt={post.fullName || 'User'}
                      />
                      <div>
                        <div className="font-semibold">{post.userName}</div>
                        <div className="text-sm text-gray-500">
                          {post.description || 'No description'}
                        </div>
                      </div>
                    </div>
                    {authUser?._id === post.userId && (
                      <CircleX
                        className="cursor-pointer text-red-600"
                        onClick={() => handleDelete(post._id)}
                      />
                    )}
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="mt-3">
                      <img
                        src={post.image}
                        alt="post"
                        className="w-full h-80 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
