<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/User.php';
require_once __DIR__ . '/Participant.php';

class Bet {
    private $conn;
    private $table = 'bets';
    
    // Bet properties
    public $id;
    public $user_id;
    public $participant_id;
    public $event_id;
    public $amount;
    public $potential_winnings;
    public $status;
    public $created_at;
    
    public function __construct() {
        $this->conn = getConnection();
    }
    
    // Place a bet
    public function placeBet() {
        // First check if user has enough balance
        $user = new User();
        $user->id = $this->user_id;
        $user->getUser();
        
        if($user->balance < $this->amount) {
            return false;
        }
        
        // Get participant odds
        $participant = new Participant();
        $participant->id = $this->participant_id;
        if(!$participant->getSingleParticipant()) {
            return false;
        }
        
        // Calculate potential winnings
        $this->potential_winnings = $this->amount * $participant->odds;
        $this->event_id = $participant->event_id;
        
        // Begin transaction
        $this->conn->begin_transaction();
        
        try {
            // Insert bet
            $query = "INSERT INTO " . $this->table . " 
                    SET user_id = ?, 
                        participant_id = ?, 
                        event_id = ?,
                        amount = ?,
                        potential_winnings = ?,
                        status = 'pending'";
            
            $stmt = $this->conn->prepare($query);
            
            // Bind parameters
            $stmt->bind_param("iiidds", 
                $this->user_id, 
                $this->participant_id, 
                $this->event_id,
                $this->amount,
                $this->potential_winnings,
                $this->status
            );
            
            // Execute query
            $stmt->execute();
            $this->id = $this->conn->insert_id;
            
            // Deduct from user balance
            $user->updateBalance(-$this->amount);
            
            // Record transaction
            $query = "INSERT INTO transactions 
                    SET user_id = ?, 
                        amount = ?, 
                        type = 'bet',
                        status = 'completed',
                        reference_id = ?";
            
            $stmt = $this->conn->prepare($query);
            
            // Bind parameters
            $amount = -$this->amount;
            $stmt->bind_param("idi", $this->user_id, $amount, $this->id);
            
            // Execute query
            $stmt->execute();
            
            // Commit transaction
            $this->conn->commit();
            
            return true;
        } catch (Exception $e) {
            // Rollback transaction on error
            $this->conn->rollback();
            return false;
        }
    }
    
    // Get bets by user
    public function getBetsByUser() {
        $query = "SELECT b.id, b.participant_id, b.event_id, b.amount, b.potential_winnings, b.status, b.created_at,
                        p.name as participant_name, e.title as event_title
                  FROM " . $this->table . " b
                  LEFT JOIN participants p ON b.participant_id = p.id
                  LEFT JOIN events e ON b.event_id = e.id
                  WHERE b.user_id = ?
                  ORDER BY b.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameter
        $stmt->bind_param("i", $this->user_id);
        
        // Execute query
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Update bet status (for admin use)
    public function updateStatus($winner_id) {
        // Get all bets for this event
        $query = "SELECT b.id, b.user_id, b.participant_id, b.amount, b.potential_winnings
                  FROM " . $this->table . " b
                  WHERE b.event_id = ? AND b.status = 'pending'";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameter
        $stmt->bind_param("i", $this->event_id);
        
        // Execute query
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Begin transaction
        $this->conn->begin_transaction();
        
        try {
            while($row = $result->fetch_assoc()) {
                $status = ($row['participant_id'] == $winner_id) ? 'won' : 'lost';
                
                // Update bet status
                $query = "UPDATE " . $this->table . " 
                        SET status = ? 
                        WHERE id = ?";
                
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param("si", $status, $row['id']);
                $stmt->execute();
                
                // If bet won, add winnings to user balance
                if($status == 'won') {
                    $user = new User();
                    $user->id = $row['user_id'];
                    $user->updateBalance($row['potential_winnings']);
                    
                    // Record transaction
                    $query = "INSERT INTO transactions 
                            SET user_id = ?, 
                                amount = ?, 
                                type = 'win',
                                status = 'completed',
                                reference_id = ?";
                    
                    $stmt = $this->conn->prepare($query);
                    $stmt->bind_param("idi", $row['user_id'], $row['potential_winnings'], $row['id']);
                    $stmt->execute();
                }
            }
            
            // Commit transaction
            $this->conn->commit();
            
            return true;
        } catch (Exception $e) {
            // Rollback transaction on error
            $this->conn->rollback();
            return false;
        }
    }
}
?>
