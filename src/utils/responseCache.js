/**
 * Simple in-memory cache for API responses to avoid duplicate calls
 * Cache expires after 5 minutes to ensure fresh responses
 */

class ResponseCache {
    constructor() {
        this.cache = new Map();
        this.expirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    }

    /**
     * Generate cache key from parameters
     * @param {string} functionName - Name of the function being cached
     * @param {Object} params - Parameters used for the API call
     * @returns {string} Cache key
     */
    static generateKey(functionName, params) {
        // Create a stable key by sorting object properties
        const sortedParams = JSON.stringify(params, Object.keys(params).sort());
        return `${functionName}:${btoa(sortedParams).slice(0, 32)}`; // Base64 encode and truncate
    }

    /**
     * Get cached response if available and not expired
     * @param {string} functionName - Name of the function
     * @param {Object} params - Parameters used for the API call
     * @returns {Object|null} Cached response or null if not found/expired
     */
    get(functionName, params) {
        const key = this.generateKey(functionName, params);
        const cached = this.cache.get(key);

        if (!cached) {
            return null;
        }

        // Check if expired
        if (Date.now() - cached.timestamp > this.expirationTime) {
            this.cache.delete(key);
            return null;
        }

        console.log(`📦 Cache hit for ${functionName}`);
        return cached.data;
    }

    /**
     * Store response in cache
     * @param {string} functionName - Name of the function
     * @param {Object} params - Parameters used for the API call
     * @param {Object} response - Response to cache
     */
    set(functionName, params, response) {
        const key = this.generateKey(functionName, params);
        
        this.cache.set(key, {
            data: response,
            timestamp: Date.now()
        });

        console.log(`💾 Cached response for ${functionName}`);
        
        // Clean up expired entries periodically
        if (this.cache.size > 100) {
            this.cleanup();
        }
    }

    /**
     * Remove expired entries from cache
     */
    cleanup() {
        const now = Date.now();
        let cleanedCount = 0;

        this.cache.forEach((value, key) => {
            if (now - value.timestamp > this.expirationTime) {
                this.cache.delete(key);
                cleanedCount += 1;
            }
        });

        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
        }
    }

    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getStats() {
        return {
            size: this.cache.size,
            expirationTime: this.expirationTime,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Create singleton instance
const responseCache = new ResponseCache();

/**
 * Higher-order function to add caching to any async function
 * @param {Function} fn - Async function to cache
 * @param {string} functionName - Name for cache identification
 * @returns {Function} Cached version of the function
 */
export const withCache = (fn, functionName) => async (...args) => {
    // Create params object from arguments
    const params = {
        args,
        timestamp: Math.floor(Date.now() / (60 * 1000)) // Round to minute for similar requests
    };

    // Try to get from cache first
    const cached = responseCache.get(functionName, params);
    if (cached) {
        return cached;
    }

    // Execute function and cache result
    const result = await fn(...args);
    responseCache.set(functionName, params, result);
    return result;
};

export { responseCache };
export default responseCache;