package com.cache;

public class CacheExample {
    public static void main(String[] args) {
        // Create an LRU cache with capacity 3
        Cache<String, Integer> lruCache = new CacheImpl<>(CacheMode.LRU, 3);
        
        // Add some entries
        lruCache.put("one", 1);
        lruCache.put("two", 2);
        lruCache.put("three", 3);
        
        // Access "one" to make it most recently used
        System.out.println("Value for 'one': " + lruCache.get("one"));
        
        // Add a new entry - "two" should be evicted as it's least recently used
        lruCache.put("four", 4);
        
        System.out.println("Contains 'two': " + lruCache.containsKey("two")); // Should print false
        System.out.println("Contains 'one': " + lruCache.containsKey("one")); // Should print true
        
        // Create an LFU cache with capacity 3
        Cache<String, Integer> lfuCache = new CacheImpl<>(CacheMode.LFU, 3);
        
        // Add entries and access them different numbers of times
        lfuCache.put("a", 1);
        lfuCache.put("b", 2);
        lfuCache.put("c", 3);
        
        // Access "a" multiple times
        lfuCache.get("a");
        lfuCache.get("a");
        
        // Access "b" once
        lfuCache.get("b");
        
        // Add new entry - "c" should be evicted as it's least frequently used
        lfuCache.put("d", 4);
        
        System.out.println("Contains 'c': " + lfuCache.containsKey("c")); // Should print false
        System.out.println("Contains 'a': " + lfuCache.containsKey("a")); // Should print true
    }
}
