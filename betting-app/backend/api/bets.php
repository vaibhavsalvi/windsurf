<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include models
require_once '../models/Bet.php';
require_once '../utils/auth_helper.php';

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

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

// Verify token
$user_id = verifyToken();
if(!$user_id) {
    $response['message'] = 'Unauthorized';
    http_response_code(401);
    echo json_encode($response);
    exit();
}

// Get action from URL
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Instantiate bet object
$bet = new Bet();

switch($method) {
    case 'POST':
        switch($action) {
            case 'place':
                // Check required fields
                if(!isset($data->participant_id) || !isset($data->amount)) {
                    $response['message'] = 'Missing required fields';
                    http_response_code(400);
                    echo json_encode($response);
                    exit();
                }
                
                // Set bet properties
                $bet->user_id = $user_id;
                $bet->participant_id = $data->participant_id;
                $bet->amount = $data->amount;
                $bet->status = 'pending';
                
                // Place bet
                if($bet->placeBet()) {
                    $response['success'] = true;
                    $response['message'] = 'Bet placed successfully';
                    http_response_code(201);
                } else {
                    $response['message'] = 'Failed to place bet. Check your balance.';
                    http_response_code(400);
                }
                break;
                
            default:
                $response['message'] = 'Invalid action';
                http_response_code(400);
                break;
        }
        break;
        
    case 'GET':
        // Get user bets
        $bet->user_id = $user_id;
        $result = $bet->getBetsByUser();
        
        $bets = array();
        while($row = $result->fetch_assoc()) {
            $bets[] = array(
                'id' => $row['id'],
                'event_title' => $row['event_title'],
                'participant_name' => $row['participant_name'],
                'amount' => $row['amount'],
                'potential_winnings' => $row['potential_winnings'],
                'status' => $row['status'],
                'created_at' => $row['created_at']
            );
        }
        
        $response['success'] = true;
        $response['data'] = $bets;
        http_response_code(200);
        break;
        
    default:
        $response['message'] = 'Method not allowed';
        http_response_code(405);
        break;
}

echo json_encode($response);
?>
