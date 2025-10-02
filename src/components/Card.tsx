import React from "react";
import { User } from "@/types";
import { truncateText } from "@/lib/utils";

interface CardProps {
  user: User;
  onClick?: () => void;
  onLike?: () => void;
}

export function Card({ user, onClick, onLike }: CardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="h-48 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
        <svg
          className="w-24 h-24 text-orange-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">
              {user.age}歳 {user.location && `• ${user.location}`}
            </p>
          </div>
        </div>
        {user.bio && (
          <p className="text-sm text-gray-700 mb-3">
            {truncateText(user.bio, 60)}
          </p>
        )}
        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {user.interests.slice(0, 3).map((interest) => (
              <span
                key={interest.id}
                className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full"
              >
                {interest.name}
              </span>
            ))}
          </div>
        )}
        {onLike && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors"
          >
            💝 ハグする
          </button>
        )}
      </div>
    </div>
  );
}
