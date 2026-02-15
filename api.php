<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$conn = new mysqli("db", "root", "azerty", "ideastorm");

if ($conn->connect_error) {
    die(json_encode(["error" => "Base de données inaccessible"]));
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// --- INSCRIPTION ---
if ($method === 'POST' && $action === 'signup') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user = $conn->real_escape_string($data['username']);
    $pass = password_hash($data['password'], PASSWORD_BCRYPT);
    $sql = "INSERT INTO users (username, password_hash) VALUES ('$user', '$pass')";
    if ($conn->query($sql)) {
        $newId = $conn->insert_id;
        $conn->query("INSERT INTO game_state (user_id, save_data, score, rebirth_count) VALUES ($newId, '{}', 0, 0)");
        echo json_encode(["id" => $newId, "username" => $user]);
    } else {
        echo json_encode(["error" => "Pseudo déjà pris"]);
    }
}

// --- CONNEXION ---
else if ($method === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user = $conn->real_escape_string($data['username']);
    $res = $conn->query("SELECT * FROM users WHERE username = '$user'");
    $userData = $res->fetch_assoc();
    if ($userData && password_verify($data['password'], $userData['password_hash'])) {
        echo json_encode(["id" => $userData['id'], "username" => $userData['username']]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Identifiants incorrects"]);
    }
}

// --- CHARGER ---
else if ($method === 'GET' && $action === 'load') {
    $userId = intval($_GET['userId']);
    $res = $conn->query("SELECT save_data FROM game_state WHERE user_id = $userId");
    $row = $res->fetch_assoc();
    echo $row['save_data'] ?? json_encode([]);
}

// --- SAUVEGARDER (Version Robuste) ---
else if ($method === 'POST' && $action === 'save') {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = intval($data['user_id'] ?? 0);
    $score = $data['score'] ?? 0;

    // On essaie de trouver le rebirthCount à plusieurs endroits possibles
    $rebirthCount = 0;
    if (isset($data['rebirth_count'])) {
        $rebirthCount = intval($data['rebirth_count']);
    } elseif (isset($data['save_data']['rebirthCount'])) {
        $rebirthCount = intval($data['save_data']['rebirthCount']);
    }

    $saveData = $conn->real_escape_string(json_encode($data['save_data'] ?? []));

    $sql = "UPDATE game_state 
            SET save_data = '$saveData', score = '$score', rebirth_count = $rebirthCount 
            WHERE user_id = $userId";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "saved_rebirth" => $rebirthCount]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}

// --- LEADERBOARD ---
else if ($method === 'GET' && $action === 'leaderboard') {
    $sql = "SELECT u.username, gs.score, gs.rebirth_count 
            FROM game_state gs 
            JOIN users u ON gs.user_id = u.id 
            ORDER BY gs.rebirth_count DESC, gs.score DESC 
            LIMIT 50";

    $result = $conn->query($sql);
    $rows = [];
    if ($result) {
        while($row = $result->fetch_assoc()) {
            $rows[] = [
                "username" => $row['username'],
                "score" => floatval($row['score']),
                "rebirth_count" => intval($row['rebirth_count'])
            ];
        }
    }
    echo json_encode($rows);
}
?>