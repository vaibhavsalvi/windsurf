<?php
// Simple token verification function
// In a production environment, use a proper JWT library

function verifyToken() {
    // Get headers
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    // Check if token exists
    if(empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        return false;
    }
    
    $token = $matches[1];
    
    // In a real application, verify the token against a database or JWT
    // For this demo, we'll use a simple check
    // Normally you would decode the JWT and verify its signature
    
    // For demo purposes, let's say any token starting with 'demo_' is valid for user ID 1
    if(strpos($token, 'demo_') === 0) {
        return 1;
    }
    
    return false;
}
?>
