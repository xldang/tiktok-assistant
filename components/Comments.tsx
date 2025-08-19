'use client';

import { useState } from 'react';
import { addComment } from '@/lib/actions/comments';
import { Comment as CommentType } from '@/lib/types';

type CommentFormProps = {
  videoId: string;
};

export default function CommentForm({ videoId }: CommentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const result = await addComment(videoId, name, email, content);
      
      if (result.success) {
        setSubmitMessage({ type: 'success', text: '评论已成功提交！' });
        // Clear form
        setName('');
        setEmail('');
        setContent('');
        // Refresh the page to show the new comment
        window.location.reload();
      } else {
        setSubmitMessage({ type: 'error', text: result.error || '提交评论时出错' });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setSubmitMessage({ type: 'error', text: '提交评论时出错，请稍后再试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">发表评论</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              姓名 *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱 *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            评论内容 *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? '提交中...' : '发表评论'}
          </button>
        </div>
        {submitMessage && (
          <div
            className={`p-3 rounded-md ${
              submitMessage.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {submitMessage.text}
          </div>
        )}
      </form>
    </div>
  );
}

type CommentItemProps = {
  comment: CommentType;
};

function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{comment.name}</h4>
          <p className="text-sm text-gray-500">
            {new Date(comment.created_at).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
      <div className="mt-2 text-gray-700">
        <p>{comment.content}</p>
      </div>
    </div>
  );
}

type CommentsListProps = {
  comments: CommentType[];
};

export function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">暂无评论，快来发表第一条评论吧！</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">评论 ({comments.length})</h3>
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}