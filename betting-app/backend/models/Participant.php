<?php
require_once __DIR__ . '/../config/database.php';

class Participant {
    private $conn;
    private $table = 'participants';
    
    // Participant properties
    public $id;
    public $event_id;
    public $name;
    public $odds;
    
    public function __construct() {
        $this->conn = getConnection();
    }
    
    // Get participants by event
    public function getParticipantsByEvent() {
        $query = "SELECT p.id, p.event_id, p.name, p.odds
                  FROM " . $this->table . " p
                  WHERE p.event_id = ?
                  ORDER BY p.odds ASC";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameter
        $stmt->bind_param("i", $this->event_id);
        
        // Execute query
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Get single participant
    public function getSingleParticipant() {
        $query = "SELECT p.id, p.event_id, p.name, p.odds
                  FROM " . $this->table . " p
                  WHERE p.id = ?
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameter
        $stmt->bind_param("i", $this->id);
        
        // Execute query
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            
            $this->event_id = $row['event_id'];
            $this->name = $row['name'];
            $this->odds = $row['odds'];
            
            return true;
        }
        
        return false;
    }
    
    // Update participant odds
    public function updateOdds() {
        $query = "UPDATE " . $this->table . " 
                  SET odds = ? 
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameters
        $stmt->bind_param("di", $this->odds, $this->id);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?>
