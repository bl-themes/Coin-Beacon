import { NewsItem, EducationalArticle, CategoryItem } from '../types';
import { FALLBACK_NEWS, FALLBACK_LEARN_ARTICLES, FALLBACK_CATEGORIES } from '../constants/fallbackData';

export async function getNews(): Promise<NewsItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('/api/news', { signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Falls back seamlessly on static hosting like Vercel
  }
  return FALLBACK_NEWS;
}

export async function getLearnArticles(): Promise<EducationalArticle[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('/api/learn', { signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Falls back seamlessly on static hosting like Vercel
  }
  return FALLBACK_LEARN_ARTICLES;
}

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('/api/categories', { signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Falls back seamlessly on static hosting like Vercel
  }
  return FALLBACK_CATEGORIES;
}
