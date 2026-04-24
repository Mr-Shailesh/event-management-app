export function setLocalStorage(key: string, value: any): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set localStorage key "${key}":`, error);
    }
  }
}

export function getLocalStorage(key: string, defaultValue: any = null): any {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to get localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function removeLocalStorage(key: string): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove localStorage key "${key}":`, error);
    }
  }
}

export function clearLocalStorage(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }
}
