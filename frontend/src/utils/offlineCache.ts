// trading-post-mobile/src/utils/offlineCache.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheEntry<T> {
  timestamp: number;
  ttl: number | null;
  data: T;
}

const DEFAULT_TTL = 3600; // seconds

export async function setCache<T>(
  key: string,
  data: T,
  ttl: number | null = DEFAULT_TTL
): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      timestamp: Date.now(),
      ttl,
      data,
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch (err) {
    console.warn(`offlineCache.setCache("${key}") error:`, err);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const { timestamp, ttl, data } = entry;
    if (ttl !== null && Date.now() - timestamp > ttl * 1000) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (err) {
    console.warn(`offlineCache.getCache("${key}") error:`, err);
    return null;
  }
}

export async function removeCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn(`offlineCache.removeCache("${key}") error:`, err);
  }
}

export async function clearAllCache(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    console.warn('offlineCache.clearAllCache() error:', err);
  }
}

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number | null = DEFAULT_TTL
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }
  const fresh = await fetcher();
  await setCache<T>(key, fresh, ttl);
  return fresh;
}
