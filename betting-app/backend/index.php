<?php
// Main entry point for the API
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$response = [
    'status' => 'success',
    'message' => 'Betting API is running',
    'version' => '1.0.0',
    'endpoints' => [
        'auth' => '/api/auth.php?action=[register|login]',
        'events' => '/api/events.php?[id=<event_id>|status=<status>]',
        'bets' => '/api/bets.php?action=place (POST) or /api/bets.php (GET)'
    ]
];

echo json_encode($response);
?>
