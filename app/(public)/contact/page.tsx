'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real implementation, you would send this to your backend
    // For now, we'll just simulate the submission
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-4">感谢您的联系！</h1>
          <p className="text-gray-600">我们已经收到您的信息，会尽快回复您。</p>
          <button
            onClick={() => router.back()}
            className="btn-primary mt-6"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">联系我们</h1>
        <button
          onClick={() => router.back()}
          className="btn-secondary"
        >
          返回
        </button>
      </div>
      
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="form-label">
              邮箱地址
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="form-input"
              placeholder="请输入您的留言..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? '提交中...' : '提交'}
          </button>
        </form>
      </div>
    </div>
  );
}