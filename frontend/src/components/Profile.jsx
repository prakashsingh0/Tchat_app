import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import Post from './Post';
import { Heart, MessageCircle } from 'lucide-react';
import PostSkeletons from './skeletons/PostSkeletons';

const Profile = () => {
  const {authUser, userProfile } = useAuthStore();

  const user = userProfile?.user;
  const posts = userProfile?.posts;
  console.log(posts);
  

  if (!user) {
    return (
      <div className="h-screen pt-20 flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }
const isLoading = !posts || posts.length === 0;
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-base-content/20 rounded-xl p-6 space-y-8 z-50">
          <div className='flex'>
            <div className="flex gap-4 items-center ">
              <img src={user.profilePic} alt="Profile" className="h-16 w-16 rounded-full" />
              <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between '>
                <div className="font-semibold text-lg">{user.fullName}</div>
                {/* Example: Followers count */}
                <div>
                  <div className="text-sm text-gray-500">{user.followers?.length} followers</div>
                  <div className="text-sm text-gray-500 ms-auto">{user.following?.length} following</div>
                </div>
              </div>
            </div>
            <div className='ms-auto'>
              <button className='border -1 px-4 py-1 rounded-lg'>Follow</button>
            </div>
          </div>
<hr />
          {/* post for selected user */}
           <div className="flex flex-col gap-5 mx-auto overflow-y-auto scrollbar-none">
            {isLoading ? (
                <PostSkeletons />
            ) : (
                posts.map((post, index) => (
                    <div className="flex flex-col m-2 p-2 border rounded-2xl" key={index}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 cursor-pointer">
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
        </div>
        
      </div>
    </div>
  );
};

export default Profile;
