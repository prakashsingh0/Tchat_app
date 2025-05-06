import React from 'react';

const PostSkeletons = () => {
  const skeleton = 2;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginLeft: 'auto', marginRight: 'auto', overflowY:"auto", scrollbarWidth:'none' }}>
      {Array.from({ length: skeleton }).map((_, index) => (
        <div key={index} className="flex w-62 flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-28"></div>
            </div>
          </div>
          <div className="skeleton h-52 w-full"></div>
        </div>
      ))}
    </div>
  );
};

export default PostSkeletons;
