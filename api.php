<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

// Connexion à la BDD (Le nom de l'hôte est "db" car c'est le nom du service Docker)
$conn = new mysqli("db", "root", "azerty", "ideastorm");

if ($conn->connect_error) {
    die(json_encode(["error" => "Base de données inaccessible"]));
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// --- 1. INSCRIPTION ---
if ($method === 'POST' && $action === 'signup') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user = $conn->real_escape_string($data['username']);
    $pass = password_hash($data['password'], PASSWORD_BCRYPT);

    $sql = "INSERT INTO users (username, password_hash) VALUES ('$user', '$pass')";
    if ($conn->query($sql)) {
        $newId = $conn->insert_id;
        // Créer une ligne de sauvegarde vide
        $conn->query("INSERT INTO game_state (user_id, save_data, score) VALUES ($newId, '{}', 0)");
        echo json_encode(["id" => $newId, "username" => $user]);
    } else {
        echo json_encode(["error" => "Pseudo déjà pris ou erreur serveur"]);
    }
}

// --- 2. CONNEXION ---
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

// --- 3. CHARGER LA PARTIE ---
else if ($method === 'GET' && $action === 'load') {
    $userId = intval($_GET['userId']);
    $res = $conn->query("SELECT save_data FROM game_state WHERE user_id = $userId");
    $row = $res->fetch_assoc();
    // On renvoie les données brutes (qui sont déjà du JSON en BDD)
    echo $row['save_data'] ?? json_encode([]);
}

// --- 4. SAUVEGARDER ---
else if ($method === 'POST' && $action === 'save') {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = intval($data['user_id']);
    $score = $data['score'];
    $saveData = $conn->real_escape_string(json_encode($data['save_data']));

    $conn->query("UPDATE game_state SET save_data = '$saveData', score = '$score' WHERE user_id = $userId");
    echo json_encode(["success" => true]);
}
else if ($method === 'GET' && $action === 'leaderboard') {
    // On récupère les 10 meilleurs scores en joignant la table users pour avoir les pseudos
    $sql = "SELECT u.username, gs.score 
            FROM game_state gs 
            JOIN users u ON gs.user_id = u.id 
            ORDER BY gs.score DESC 
            LIMIT 10";

    $result = $conn->query($sql);
    $rows = [];
    while($row = $result->fetch_assoc()) {
        $rows[] = [
            "username" => $row['username'],
            "score" => floatval($row['score'])
        ];
    }
    echo json_encode($rows);
}
// --- ROUTE : SAUVEGARDER (Dans api.php) ---
else if ($method === 'POST' && $action === 'save') {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = intval($data['user_id']);
    $score = $data['score']; // On récupère le score envoyé par le jeu
    $saveData = $conn->real_escape_string(json_encode($data['save_data']));

    // On met à jour save_data ET le score pour le leaderboard
    $sql = "UPDATE game_state SET save_data = '$saveData', score = '$score' WHERE user_id = $userId";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}
?>

