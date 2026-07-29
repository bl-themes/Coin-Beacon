import { NewsItem, EducationalArticle, CategoryItem } from '../types';

export async function getNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch news:', err);
    return [];
  }
}

export async function getLearnArticles(): Promise<EducationalArticle[]> {
  try {
    const res = await fetch('/api/learn');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch learn articles:', err);
    return [];
  }
}

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return [];
  }
}
