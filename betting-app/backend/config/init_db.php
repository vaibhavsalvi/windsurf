<?php
require_once 'database.php';

// Create connection
$conn = getConnection();

// Read SQL file
$sql = file_get_contents(__DIR__ . '/schema.sql');

// Execute multi query
if ($conn->multi_query($sql)) {
    echo "Database schema created successfully\n";
    
    // Process all result sets
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
} else {
    echo "Error creating database schema: " . $conn->error . "\n";
}

// Insert sample data
$conn->query("INSERT IGNORE INTO users (username, password, email, balance) VALUES 
    ('demo', '" . password_hash('demo123', PASSWORD_DEFAULT) . "', 'demo@example.com', 1000.00)");

$conn->query("INSERT IGNORE INTO events (title, description, event_date, status) VALUES 
    ('Premier League: Liverpool vs Manchester United', 'Premier League match between Liverpool and Manchester United', DATE_ADD(NOW(), INTERVAL 1 DAY), 'upcoming'),
    ('NBA: Lakers vs Warriors', 'NBA match between LA Lakers and Golden State Warriors', DATE_ADD(NOW(), INTERVAL 2 DAY), 'upcoming'),
    ('Formula 1: Monaco Grand Prix', 'Formula 1 race at Monaco circuit', DATE_ADD(NOW(), INTERVAL 5 DAY), 'upcoming')");

// Get the event IDs
$result = $conn->query("SELECT id FROM events LIMIT 3");
$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row['id'];
}

if (count($events) >= 3) {
    // Add participants for football match
    $conn->query("INSERT IGNORE INTO participants (event_id, name, odds) VALUES 
        ({$events[0]}, 'Liverpool', 1.75),
        ({$events[0]}, 'Manchester United', 2.10),
        ({$events[0]}, 'Draw', 3.25)");
        
    // Add participants for NBA match
    $conn->query("INSERT IGNORE INTO participants (event_id, name, odds) VALUES 
        ({$events[1]}, 'LA Lakers', 1.90),
        ({$events[1]}, 'Golden State Warriors', 1.85)");
        
    // Add participants for F1 race
    $conn->query("INSERT IGNORE INTO participants (event_id, name, odds) VALUES 
        ({$events[2]}, 'Max Verstappen', 1.50),
        ({$events[2]}, 'Lewis Hamilton', 2.25),
        ({$events[2]}, 'Charles Leclerc', 3.75),
        ({$events[2]}, 'Lando Norris', 4.50)");
    
    echo "Sample data inserted successfully\n";
} else {
    echo "Error: Could not retrieve event IDs\n";
}

$conn->close();
echo "Database initialization complete\n";
?>
