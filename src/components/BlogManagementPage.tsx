import React, { useState } from 'react';
import { useBlogPosts } from '../hooks/useBlogPosts';
import BlogPostForm from './BlogPostForm';
import { BlogPostList } from './BlogPostList';
import { BlogPost } from '../lib/supabase';

export function BlogManagementPage() {
  const { 
    blogPosts, 
    loading, 
    error, 
    addBlogPost, 
    updateBlogPost, 
    deleteBlogPost, 
    refreshBlogPosts 
  } = useBlogPosts();
  
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingPost) {
      const result = await updateBlogPost(editingPost.id, postData);
      if (result.success) {
        setEditingPost(undefined);
        setShowForm(false);
      }
      return result;
    } else {
      return await addBlogPost(postData);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingPost(undefined);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setEditingPost(undefined);
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blog Post Management</h1>
        <p className="text-gray-600">Create, edit, and manage multilingual blog posts</p>
      </div>

      {showForm ? (
        <BlogPostForm
          post={editingPost}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <BlogPostList
          blogPosts={blogPosts}
          loading={loading}
          onEdit={handleEdit}
          onDelete={deleteBlogPost}
          onRefresh={refreshBlogPosts}
          onAddNew={handleAddNew}
        />
      )}
    </div>
  );
}
