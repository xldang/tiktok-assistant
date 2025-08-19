'use server';

import { createClient } from '@/lib/supabase/server';

export async function addComment(videoId: string, name: string, email: string, content: string) {
  const supabase = createClient();
  
  // Basic validation
  if (!name.trim() || !email.trim() || !content.trim()) {
    return { success: false, error: '所有字段都是必填的' };
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: '请输入有效的邮箱地址' };
  }
  
  // Insert comment
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        video_id: videoId,
        name: name.trim(),
        email: email.trim(),
        content: content.trim()
      }
    ])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: '添加评论时出错，请稍后再试' };
  }
  
  return { success: true, data };
}