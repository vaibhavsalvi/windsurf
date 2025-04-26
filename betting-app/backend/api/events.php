<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include models
require_once '../models/Event.php';
require_once '../models/Participant.php';

// Initialize response
$response = array(
    'success' => false,
    'message' => '',
    'data' => null
);

// Check request method
$method = $_SERVER['REQUEST_METHOD'];
if($method == 'OPTIONS') {
    http_response_code(200);
    echo json_encode($response);
    exit();
}

// Get event ID from URL if provided
$event_id = isset($_GET['id']) ? $_GET['id'] : null;
$status = isset($_GET['status']) ? $_GET['status'] : null;

// Instantiate event object
$event = new Event();

if($event_id) {
    // Get single event
    $event->id = $event_id;
    
    if($event->getSingleEvent()) {
        // Get participants for this event
        $participant = new Participant();
        $participant->event_id = $event_id;
        $participants_result = $participant->getParticipantsByEvent();
        
        $participants = array();
        while($row = $participants_result->fetch_assoc()) {
            $participants[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'odds' => $row['odds']
            );
        }
        
        $response['success'] = true;
        $response['data'] = array(
            'id' => $event_id,
            'title' => $event->title,
            'description' => $event->description,
            'event_date' => $event->event_date,
            'status' => $event->status,
            'created_at' => $event->created_at,
            'participants' => $participants
        );
        http_response_code(200);
    } else {
        $response['message'] = 'Event not found';
        http_response_code(404);
    }
} else {
    // Get all events
    $result = $event->getEvents($status);
    
    $events = array();
    while($row = $result->fetch_assoc()) {
        $events[] = array(
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'event_date' => $row['event_date'],
            'status' => $row['status'],
            'created_at' => $row['created_at']
        );
    }
    
    $response['success'] = true;
    $response['data'] = $events;
    http_response_code(200);
}

echo json_encode($response);
?>
