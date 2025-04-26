'use client';

import { useState } from 'react';
import { useModel } from '../contexts/ModelContext';

interface PostProps {
  username: string;
  content: string;
  likes: number;
  timestamp: string;
}

export default function Post({ username, content, likes: initialLikes, timestamp }: PostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const { state, setData } = useModel();

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    // Update the model state with new like count
    setData({ ...state.data, likes: newLikes });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
        <div>
          <h3 className="font-bold">{username}</h3>
          <p className="text-sm text-gray-500">{timestamp}</p>
        </div>
      </div>
      <p className="mb-4">{content}</p>
      <div className="flex items-center">
        <button
          onClick={handleLike}
          className="flex items-center text-gray-600 hover:text-blue-500"
        >
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {likes}
        </button>
      </div>
    </div>
  );
}
