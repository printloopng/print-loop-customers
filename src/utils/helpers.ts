// Format date to readable string
export const formatDate = (date: Date | string | null): string => {
  if (!date) return "";

  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format date and time
export const formatDateTime = (date: Date | string | null): string => {
  if (!date) return "";

  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text with ellipsis
export const truncate = (text: string, length: number = 100): string => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + "...";
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Local storage helpers
export const storage = {
  get: <T = any>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  set: <T = any>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

// Validation helpers
export const validation = {
  email: (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  password: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return re.test(password);
  },

  phone: (phone: string): boolean => {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ""));
  },
};

// Currency formatting
export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Number formatting
export const formatNumber = (
  number: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat("en-US", options).format(number);
};

// Generate Google Maps URL with route
export const generateGoogleMapsUrl = (
  pickupAddress: string,
  deliveryAddress: string
): string => {
  const baseUrl = "https://www.google.com/maps/dir/";
  const encodedPickup = encodeURIComponent(pickupAddress);
  const encodedDelivery = encodeURIComponent(deliveryAddress);
  return `${baseUrl}${encodedPickup}/${encodedDelivery}`;
};

// Open Google Maps in new tab
export const openInGoogleMaps = (
  pickupAddress: string,
  deliveryAddress: string
): void => {
  const url = generateGoogleMapsUrl(pickupAddress, deliveryAddress);
  window.open(url, "_blank", "noopener,noreferrer");
};

export const formatToGMT = (dateTime: string | Date): string => {
  if (!dateTime) return "";

  const date = new Date(dateTime);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided to formatToGMT");
  }

  return date.toISOString();
};

export const formatFromGMT = (isoString: string): string => {
  if (!isoString) return "";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid ISO string provided to formatFromGMT");
  }

  return date.toISOString().slice(0, 16);
};
