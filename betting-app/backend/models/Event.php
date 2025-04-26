<?php
require_once __DIR__ . '/../config/database.php';

class Event {
    private $conn;
    private $table = 'events';
    
    // Event properties
    public $id;
    public $title;
    public $description;
    public $event_date;
    public $status;
    public $created_at;
    
    public function __construct() {
        $this->conn = getConnection();
    }
    
    // Get all events
    public function getEvents($status = null) {
        $query = "SELECT e.id, e.title, e.description, e.event_date, e.status, e.created_at
                  FROM " . $this->table . " e";
        
        if($status) {
            $query .= " WHERE e.status = '" . $status . "'";
        }
        
        $query .= " ORDER BY e.event_date ASC";
        
        $result = $this->conn->query($query);
        
        return $result;
    }
    
    // Get single event
    public function getSingleEvent() {
        $query = "SELECT e.id, e.title, e.description, e.event_date, e.status, e.created_at
                  FROM " . $this->table . " e
                  WHERE e.id = ?
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameter
        $stmt->bind_param("i", $this->id);
        
        // Execute query
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            
            $this->title = $row['title'];
            $this->description = $row['description'];
            $this->event_date = $row['event_date'];
            $this->status = $row['status'];
            $this->created_at = $row['created_at'];
            
            return true;
        }
        
        return false;
    }
    
    // Update event status
    public function updateStatus() {
        $query = "UPDATE " . $this->table . " 
                  SET status = ? 
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Clean data
        $this->status = htmlspecialchars(strip_tags($this->status));
        
        // Bind parameters
        $stmt->bind_param("si", $this->status, $this->id);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?>
