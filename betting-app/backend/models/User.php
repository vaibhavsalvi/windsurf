<?php
require_once __DIR__ . '/../config/database.php';

class User {
    private $conn;
    private $table = 'users';
    
    // User properties
    public $id;
    public $username;
    public $password;
    public $email;
    public $balance;
    public $created_at;
    
    public function __construct() {
        $this->conn = getConnection();
    }
    
    // Register new user
    public function register() {
        $query = "INSERT INTO " . $this->table . " 
                  SET username = ?, 
                      password = ?, 
                      email = ?, 
                      balance = 0.00";
        
        $stmt = $this->conn->prepare($query);
        
        // Clean data
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);
        
        // Bind parameters
        $stmt->bind_param("sss", $this->username, $this->password, $this->email);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Login user
    public function login() {
        $query = "SELECT id, username, password, email, balance 
                  FROM " . $this->table . " 
                  WHERE username = ?
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        
        // Clean data
        $this->username = htmlspecialchars(strip_tags($this->username));
        
        // Bind parameter
        $stmt->bind_param("s", $this->username);
        
        // Execute query
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            
            // Verify password
            if(password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->email = $row['email'];
                $this->balance = $row['balance'];
                return true;
            }
        }
        
        return false;
    }
    
    // Get user by ID
    public function getUser() {
        $query = "SELECT username, email, balance, created_at 
                  FROM " . $this->table . " 
                  WHERE id = ?
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameter
        $stmt->bind_param("i", $this->id);
        
        // Execute query
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            
            $this->username = $row['username'];
            $this->email = $row['email'];
            $this->balance = $row['balance'];
            $this->created_at = $row['created_at'];
            
            return true;
        }
        
        return false;
    }
    
    // Update user balance
    public function updateBalance($amount) {
        $query = "UPDATE " . $this->table . " 
                  SET balance = balance + ? 
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameters
        $stmt->bind_param("di", $amount, $this->id);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?>
