package com.cache;

public enum CacheMode {
    FIFO,    // First In First Out
    LRU,     // Least Recently Used
    LFU,     // Least Frequently Used
    UNLIMITED // No eviction policy
}
