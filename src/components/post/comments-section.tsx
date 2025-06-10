"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { MessageCircle, Reply, Heart } from "lucide-react";

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies: Comment[];
}

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = () => {
    const storedComments = localStorage.getItem(`comments_${postId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  };

  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  const addComment = () => {
    if (!user || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      authorId: user.id,
      authorName: user.name,
      authorAvatar:
        user.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
      content: newComment.trim(),
      createdAt: new Date(),
      likes: 0,
      replies: [],
    };

    const updatedComments = [comment, ...comments];
    saveComments(updatedComments);
    setNewComment("");
  };

  const addReply = (parentId: string) => {
    if (!user || !replyContent.trim()) return;

    const reply: Comment = {
      id: Date.now().toString(),
      postId,
      authorId: user.id,
      authorName: user.name,
      authorAvatar:
        user.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
      content: replyContent.trim(),
      createdAt: new Date(),
      likes: 0,
      replies: [],
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [reply, ...comment.replies] };
      }
      return comment;
    });

    saveComments(updatedComments);
    setReplyContent("");
    setReplyingTo(null);
  };

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <div className={`${isReply ? "ml-8 border-l-2 border-gray-100 pl-4" : ""}`}>
      <div className="flex space-x-3">
        <img
          src={comment.authorAvatar || "/placeholder.svg"}
          alt={comment.authorName}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-gray-900 text-sm">
                {comment.authorName}
              </h4>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 text-sm">{comment.content}</p>
          </div>

          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <button className="flex items-center space-x-1 hover:text-red-500">
              <Heart className="w-3 h-3" />
              <span>{comment.likes}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center space-x-1 hover:text-blue-500"
              >
                <Reply className="w-3 h-3" />
                <span>Reply</span>
              </button>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-3">
              <div className="flex space-x-2">
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`
                  }
                  alt={user?.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={2}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                      className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => addReply(comment.id)}
                      className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div id="comments" className="bg-white rounded-lg shadow-sm p-6 mb-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <MessageCircle className="w-5 h-5 mr-2" />
        Comments ({comments.length})
      </h3>

      {/* Add Comment */}
      {user ? (
        <div className="mb-8">
          <div className="flex space-x-3">
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
              }
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-3">
            Please sign in to leave a comment
          </p>
          <Link href="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
