import { NewsItem, EducationalArticle, CategoryItem } from '../types';
import {
  FALLBACK_NEWS,
  FALLBACK_LEARN_ARTICLES,
  FALLBACK_CATEGORIES,
} from '../constants/fallbackData';

export async function getNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('/api/news');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && json.data) return json.data;
    }
  } catch (err) {
    console.warn('Failed to fetch news from API, using fallback:', err);
  }
  return FALLBACK_NEWS;
}

export async function getLearnArticles(): Promise<EducationalArticle[]> {
  try {
    const res = await fetch('/api/learn');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && json.data) return json.data;
    }
  } catch (err) {
    console.warn('Failed to fetch learn articles from API, using fallback:', err);
  }
  return FALLBACK_LEARN_ARTICLES;
}

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const res = await fetch('/api/categories');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && json.data) return json.data;
    }
  } catch (err) {
    console.warn('Failed to fetch categories from API, using fallback:', err);
  }
  return FALLBACK_CATEGORIES;
}

