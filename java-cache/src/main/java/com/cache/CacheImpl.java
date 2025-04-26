package com.cache;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

public class CacheImpl<K, V> implements Cache<K, V> {
    private final Map<K, V> storage;
    private final CacheMode mode;
    private final int capacity;
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    private final Map<K, Integer> frequencyMap; // For LFU mode

    public CacheImpl(CacheMode mode, int capacity) {
        this.mode = mode;
        this.capacity = capacity;
        
        switch (mode) {
            case LRU:
                storage = new LinkedHashMap<K, V>(capacity, 0.75f, true) {
                    @Override
                    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                        return size() > capacity;
                    }
                };
                frequencyMap = null;
                break;
            case LFU:
                storage = new ConcurrentHashMap<>();
                frequencyMap = new ConcurrentHashMap<>();
                break;
            default:
                storage = new ConcurrentHashMap<>();
                frequencyMap = null;
        }
    }

    @Override
    public void put(K key, V value) {
        lock.writeLock().lock();
        try {
            switch (mode) {
                case FIFO:
                    handleFifoPut(key, value);
                    break;
                case LFU:
                    handleLfuPut(key, value);
                    break;
                default:
                    storage.put(key, value);
            }
        } finally {
            lock.writeLock().unlock();
        }
    }

    private void handleFifoPut(K key, V value) {
        if (storage.size() >= capacity && !storage.containsKey(key)) {
            K firstKey = storage.keySet().iterator().next();
            storage.remove(firstKey);
        }
        storage.put(key, value);
    }

    private void handleLfuPut(K key, V value) {
        if (storage.size() >= capacity && !storage.containsKey(key)) {
            K leastFreqKey = frequencyMap.entrySet().stream()
                .min(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
            if (leastFreqKey != null) {
                storage.remove(leastFreqKey);
                frequencyMap.remove(leastFreqKey);
            }
        }
        storage.put(key, value);
        frequencyMap.merge(key, 1, Integer::sum);
    }

    @Override
    public V get(K key) {
        lock.readLock().lock();
        try {
            if (mode == CacheMode.LFU && storage.containsKey(key)) {
                frequencyMap.merge(key, 1, Integer::sum);
            }
            return storage.get(key);
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public boolean remove(K key) {
        lock.writeLock().lock();
        try {
            if (mode == CacheMode.LFU) {
                frequencyMap.remove(key);
            }
            return storage.remove(key) != null;
        } finally {
            lock.writeLock().unlock();
        }
    }

    @Override
    public void clear() {
        lock.writeLock().lock();
        try {
            storage.clear();
            if (frequencyMap != null) {
                frequencyMap.clear();
            }
        } finally {
            lock.writeLock().unlock();
        }
    }

    @Override
    public int size() {
        lock.readLock().lock();
        try {
            return storage.size();
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public boolean containsKey(K key) {
        lock.readLock().lock();
        try {
            return storage.containsKey(key);
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public CacheMode getMode() {
        return mode;
    }

    public List<Map<String, Object>> getEntries() {
        List<Map<String, Object>> entries = new ArrayList<>();
        lock.readLock().lock();
        try {
            for (Map.Entry<K, V> entry : storage.entrySet()) {
                Map<String, Object> map = new HashMap<>();
                map.put("key", entry.getKey());
                map.put("value", entry.getValue());
                entries.add(map);
            }
            return entries;
        } finally {
            lock.readLock().unlock();
        }
    }
}
