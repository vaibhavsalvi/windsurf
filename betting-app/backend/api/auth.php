<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include user model
require_once '../models/User.php';

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

// Get action from URL
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Instantiate user object
$user = new User();

switch($action) {
    case 'register':
        // Check required fields
        if(!isset($data->username) || !isset($data->email) || !isset($data->password)) {
            $response['message'] = 'Missing required fields';
            http_response_code(400);
            echo json_encode($response);
            exit();
        }
        
        // Set user properties
        $user->username = $data->username;
        $user->email = $data->email;
        $user->password = $data->password;
        
        // Register user
        if($user->register()) {
            $response['success'] = true;
            $response['message'] = 'User registered successfully';
            http_response_code(201);
        } else {
            $response['message'] = 'User registration failed';
            http_response_code(500);
        }
        break;
        
    case 'login':
        // Check required fields
        if(!isset($data->username) || !isset($data->password)) {
            $response['message'] = 'Missing required fields';
            http_response_code(400);
            echo json_encode($response);
            exit();
        }
        
        // Set user properties
        $user->username = $data->username;
        $user->password = $data->password;
        
        // Login user
        if($user->login()) {
            // Generate JWT token (simplified for demo)
            $token = md5(time() . $user->id . $user->username);
            
            $response['success'] = true;
            $response['message'] = 'Login successful';
            $response['data'] = array(
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'balance' => $user->balance,
                'token' => $token
            );
            http_response_code(200);
        } else {
            $response['message'] = 'Invalid credentials';
            http_response_code(401);
        }
        break;
        
    default:
        $response['message'] = 'Invalid action';
        http_response_code(400);
        break;
}

echo json_encode($response);
?>
