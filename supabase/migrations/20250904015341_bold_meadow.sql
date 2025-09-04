/*
  # Create blog_posts table

  1. New Tables
     - `blog_posts`
       - `id` (uuid, primary key)
       - `slug` (text, unique, for URL-friendly identifiers)
       - Multilingual title fields for 8 languages (title_en, title_fr, etc.)
       - Multilingual content fields for 8 languages (content_en, content_fr, etc.)
       - Multilingual excerpt fields for 8 languages (excerpt_en, excerpt_fr, etc.)
       - `author` (text, blog post author)
       - `featured_image` (text, URL to featured image)
       - `category` (text, blog post category)
       - `tags` (text, comma-separated tags)
       - `published` (boolean, publication status)
       - `featured` (boolean, featured post flag)
       - `created_at` (timestamp)
       - `updated_at` (timestamp)

  2. Security
     - Enable RLS on `blog_posts` table
     - Add policy for service role to manage all blog posts
     - Add policy for public to read published posts only

  3. Indexes
     - Index on slug for fast lookups
     - Index on published status for filtering
     - Index on category for categorization
     - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_en text DEFAULT '',
  title_fr text DEFAULT '',
  title_es text DEFAULT '',
  title_pt text DEFAULT '',
  title_de text DEFAULT '',
  title_ja text DEFAULT '',
  title_hi text DEFAULT '',
  title_ru text DEFAULT '',
  content_en text DEFAULT '',
  content_fr text DEFAULT '',
  content_es text DEFAULT '',
  content_pt text DEFAULT '',
  content_de text DEFAULT '',
  content_ja text DEFAULT '',
  content_hi text DEFAULT '',
  content_ru text DEFAULT '',
  excerpt_en text DEFAULT '',
  excerpt_fr text DEFAULT '',
  excerpt_es text DEFAULT '',
  excerpt_pt text DEFAULT '',
  excerpt_de text DEFAULT '',
  excerpt_ja text DEFAULT '',
  excerpt_hi text DEFAULT '',
  excerpt_ru text DEFAULT '',
  author text DEFAULT '',
  featured_image text DEFAULT '',
  category text DEFAULT '',
  tags text DEFAULT '',
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage all blog posts
CREATE POLICY "Service role can manage blog posts"
  ON blog_posts
  FOR ALL
  TO service_role
  USING (true);

-- Policy for public to read published posts only
CREATE POLICY "Public can read published posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
