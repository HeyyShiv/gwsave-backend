import React, { useState, useEffect } from 'react';
import { Save, X, Globe, FileText, Tag, Image as ImageIcon } from 'lucide-react';
import { BlogPost, SUPPORTED_LANGUAGES } from '../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from './ui/ui/button';
import { Input } from './ui/ui/input';
import { Label } from './ui/ui/label';
import { Textarea } from './ui/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/ui/card';
import { Alert, AlertDescription } from './ui/ui/alert';
import { Checkbox } from './ui/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/ui/tabs';

interface BlogPostFormProps {
  post?: BlogPost;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

export default function BlogPostForm({ post, onSave, onCancel }: BlogPostFormProps) {
  const [formData, setFormData] = useState({
    slug: '',
    title_en: '', title_fr: '', title_es: '', title_pt: '',
    title_de: '', title_ja: '', title_hi: '', title_ru: '',
    content_en: '', content_fr: '', content_es: '', content_pt: '',
    content_de: '', content_ja: '', content_hi: '', content_ru: '',
    excerpt_en: '', excerpt_fr: '', excerpt_es: '', excerpt_pt: '',
    excerpt_de: '', excerpt_ja: '', excerpt_hi: '', excerpt_ru: '',
    author: '',
    featured_image: '',
    category: '',
    tags: '',
    published: false,
    featured: false,
  });

  const [activeTab, setActiveTab] = useState('en');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (post) {
      setFormData({
        slug: post.slug,
        title_en: post.title_en, title_fr: post.title_fr, title_es: post.title_es, title_pt: post.title_pt,
        title_de: post.title_de, title_ja: post.title_ja, title_hi: post.title_hi, title_ru: post.title_ru,
        content_en: post.content_en, content_fr: post.content_fr, content_es: post.content_es, content_pt: post.content_pt,
        content_de: post.content_de, content_ja: post.content_ja, content_hi: post.content_hi, content_ru: post.content_ru,
        excerpt_en: post.excerpt_en, excerpt_fr: post.excerpt_fr, excerpt_es: post.excerpt_es, excerpt_pt: post.excerpt_pt,
        excerpt_de: post.excerpt_de, excerpt_ja: post.excerpt_ja, excerpt_hi: post.excerpt_hi, excerpt_ru: post.excerpt_ru,
        author: post.author,
        featured_image: post.featured_image,
        category: post.category,
        tags: post.tags,
        published: post.published,
        featured: post.featured,
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!formData.slug || !formData.title_en) {
      setMessage({ type: 'error', text: 'Slug and English title are required' });
      setLoading(false);
      return;
    }

    const result = await onSave(formData);

    if (result.success) {
      setMessage({ type: 'success', text: `Blog post ${post ? 'updated' : 'created'} successfully` });
      if (!post) {
        // Reset form for new posts
        setFormData({
          slug: '', title_en: '', title_fr: '', title_es: '', title_pt: '',
          title_de: '', title_ja: '', title_hi: '', title_ru: '',
          content_en: '', content_fr: '', content_es: '', content_pt: '',
          content_de: '', content_ja: '', content_hi: '', content_ru: '',
          excerpt_en: '', excerpt_fr: '', excerpt_es: '', excerpt_pt: '',
          excerpt_de: '', excerpt_ja: '', excerpt_hi: '', excerpt_ru: '',
          author: '', featured_image: '', category: '', tags: '',
          published: false, featured: false,
        });
      }
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save blog post' });
    }

    setLoading(false);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'script', 'indent', 'blockquote', 'code-block',
    'color', 'background', 'align', 'link', 'image'
  ];

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from English title
    if (field === 'title_en' && !post) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-2xl">
            {post ? 'Edit Blog Post' : 'Create New Blog Post'}
          </CardTitle>
          <CardDescription>
            {post ? 'Update your blog post content' : 'Create a new multilingual blog post'}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="blog-post-slug"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Technology, News, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1,tag2,tag3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featured_image">Featured Image URL</Label>
              <Input
                id="featured_image"
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: !!checked }))}
              />
              <Label htmlFor="published">Published</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </div>

          {/* Language Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-4">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code} className="text-xs">
                  <span className="mr-1">{lang.flag}</span>
                  <span className="hidden sm:inline">{lang.name}</span>
                  <span className="sm:hidden">{lang.code.toUpperCase()}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {SUPPORTED_LANGUAGES.map((lang) => (
              <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`title_${lang.code}`}>
                    Title ({lang.name})
                    {lang.code === 'en' && ' *'}
                  </Label>
                  <Input
                    id={`title_${lang.code}`}
                    type="text"
                    value={formData[`title_${lang.code}` as keyof typeof formData] as string}
                    onChange={(e) => handleTitleChange(`title_${lang.code}`, e.target.value)}
                    placeholder={`Enter title in ${lang.name}`}
                    required={lang.code === 'en'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`excerpt_${lang.code}`}>
                    Excerpt ({lang.name})
                  </Label>
                  <Textarea
                    id={`excerpt_${lang.code}`}
                    value={formData[`excerpt_${lang.code}` as keyof typeof formData] as string}
                    onChange={(e) => setFormData(prev => ({ ...prev, [`excerpt_${lang.code}`]: e.target.value }))}
                    rows={3}
                    placeholder={`Enter excerpt in ${lang.name}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`content_${lang.code}`}>
                    Content ({lang.name})
                  </Label>
                  <div className="border rounded-md">
                    <ReactQuill
                      theme="snow"
                      value={formData[`content_${lang.code}` as keyof typeof formData] as string}
                      onChange={(value) => setFormData(prev => ({ ...prev, [`content_${lang.code}`]: value }))}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder={`Enter content in ${lang.name}`}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px]"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
