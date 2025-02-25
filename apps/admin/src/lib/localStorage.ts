// "" -> empty, null -> key not there
export const getLocal = (key?: string): string | '' | null => {
  if (!key) return null;
  try {
    const value = localStorage.getItem(key);
    if (value === null || value === 'undefined') return '';
    return value;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};
