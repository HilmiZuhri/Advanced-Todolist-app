// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State untuk menyimpan nilai yang di-retrieve dari localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Ambil nilai dari localStorage berdasarkan key
      const item = window.localStorage.getItem(key);
      // Parse JSON jika ada, jika tidak, kembalikan initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Jika error (misalnya JSON tidak valid), log error dan kembalikan initialValue
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // useEffect untuk menyimpan nilai ke localStorage setiap kali storedValue berubah
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;