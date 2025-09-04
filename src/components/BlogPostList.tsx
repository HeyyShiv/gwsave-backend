import React, { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Star, StarOff, RefreshCw, Plus } from 'lucide-react';
import { BlogPost } from '../lib/supabase';
import { Button } from './ui/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/ui/table';
import { Badge } from './ui/ui/badge';
import { Label } from './ui/ui/label';
import { cn } from '../lib/utils';

interface BlogPostListProps {
  blogPosts: BlogPost[];
  loading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onAddNew: () => void;
}

export function BlogPostList({ 
  blogPosts, 
  loading, 
  onEdit, 
  onDelete, 
  onRefresh, 
  onAddNew 
}: BlogPostListProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPublished, setFilterPublished] = useState<string>('all');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const categories = Array.from(new Set(blogPosts.map(post => post.category).filter(Boolean)));

  const filteredPosts = blogPosts.filter(post => {
    if (filterCategory !== 'all' && post.category !== filterCategory) return false;
    if (filterPublished !== 'all') {
      if (filterPublished === 'published' && !post.published) return false;
      if (filterPublished === 'draft' && post.published) return false;
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    setDeleteLoading(id);
    await onDelete(id);
    setDeleteLoading(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Blog Posts ({filteredPosts.length})</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-1", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              onClick={onAddNew}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Post
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filterCategory}
              onValueChange={setFilterCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filterPublished}
              onValueChange={setFilterPublished}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Loading blog posts...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No blog posts found matching the current filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {truncateText(post.title_en, 50)}
                          </span>
                          {post.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">{post.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{post.author}</TableCell>
                    <TableCell>
                      {post.category && (
                        <Badge variant="secondary">{post.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Draft
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(post.updated_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(post)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(post.id)}
                          disabled={deleteLoading === post.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
