package com.cache;

public interface Cache<K, V> {
    void put(K key, V value);
    V get(K key);
    boolean remove(K key);
    void clear();
    int size();
    boolean containsKey(K key);
    CacheMode getMode();
}
