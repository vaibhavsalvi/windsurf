package com.cache;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cache")
@CrossOrigin(origins = "*")
public class CacheController {
    private static final Logger logger = LoggerFactory.getLogger(CacheController.class);
    private final Cache<String, JsonNode> cache;
    private final ObjectMapper objectMapper;

    public CacheController() {
        this.cache = new CacheImpl<>(CacheMode.LRU, 3);
        this.objectMapper = new ObjectMapper();
        logger.info("Cache initialized with LRU mode and capacity 3");
    }

    @PutMapping("/put")
    public ResponseEntity<Void> put(@RequestBody Map<String, Object> request) {
        String key = (String) request.get("key");
        JsonNode value = objectMapper.valueToTree(request.get("value"));
        logger.info("Adding to cache - key: {}, value: {}", key, value);
        cache.put(key, value);
        logger.info("Current cache size: {}", cache.size());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get")
    public ResponseEntity<JsonNode> get(@RequestParam String key) {
        logger.info("Getting from cache - key: {}", key);
        JsonNode value = cache.get(key);
        if (value != null) {
            logger.info("Cache hit - key: {}, value: {}", key, value);
            return ResponseEntity.ok(value);
        }
        logger.info("Cache miss - key: {}", key);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clear() {
        logger.info("Clearing cache");
        cache.clear();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/size")
    public ResponseEntity<Integer> size() {
        int size = cache.size();
        logger.info("Current cache size: {}", size);
        return ResponseEntity.ok(size);
    }

    @GetMapping("/entries")
    public ResponseEntity<List<Map<String, Object>>> getEntries() {
        if (cache instanceof CacheImpl) {
            CacheImpl<String, JsonNode> cacheImpl = (CacheImpl<String, JsonNode>) cache;
            List<Map<String, Object>> entries = cacheImpl.getEntries();
            logger.info("Retrieved {} entries from cache", entries.size());
            return ResponseEntity.ok(entries);
        }
        return ResponseEntity.ok(new ArrayList<>());
    }
}
