import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export type PromoCode = {
  id: string;
  code: string;
  type: 'starter' | 'standard';
  region: 'emea' | 'americas' | 'asia-pacific';
  is_used: boolean;
  created_at: string;
};

export const VALID_TYPES = ['starter', 'standard'] as const;
export const VALID_REGIONS = ['emea', 'americas', 'asia-pacific'] as const;
export type BlogPost = {
  id: string;
  slug: string;
  title_en: string;
  title_fr: string;
  title_es: string;
  title_pt: string;
  title_de: string;
  title_ja: string;
  title_hi: string;
  title_ru: string;
  content_en: string;
  content_fr: string;
  content_es: string;
  content_pt: string;
  content_de: string;
  content_ja: string;
  content_hi: string;
  content_ru: string;
  excerpt_en: string;
  excerpt_fr: string;
  excerpt_es: string;
  excerpt_pt: string;
  excerpt_de: string;
  excerpt_ja: string;
  excerpt_hi: string;
  excerpt_ru: string;
  author: string;
  featured_image: string;
  category: string;
  tags: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
] as const;
