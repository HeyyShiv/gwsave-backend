import { useState, useEffect } from 'react';
import { supabaseAdmin, BlogPost } from '../lib/supabase';

export function useBlogPosts() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const addBlogPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .insert([{
          ...postData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
      await fetchBlogPosts();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to add blog post' 
      };
    }
  };

  const updateBlogPost = async (id: string, postData: Partial<BlogPost>) => {
    try {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update({
          ...postData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      await fetchBlogPosts();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update blog post' 
      };
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchBlogPosts();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete blog post' 
      };
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return {
    blogPosts,
    loading,
    error,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    refreshBlogPosts: fetchBlogPosts
  };
}
