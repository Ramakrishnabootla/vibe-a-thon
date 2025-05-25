/**
 * Saves data to localStorage.
 * @param key The key to store the data under.
 * @param data The data to store. Will be JSON stringified.
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Loads data from localStorage.
 * @param key The key to load the data from.
 * @returns The loaded data, parsed from JSON, or null if not found or error occurs.
 */
export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Removes data from localStorage.
 * @param key The key to remove.
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Gets all keys from localStorage.
 * @returns An array of all keys in localStorage.
 */
export const getAllLocalStorageKeys = (): string[] => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting all localStorage keys:', error);
    return [];
  }
}; 