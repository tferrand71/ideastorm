<?php
// Connexion à la base de données
$conn = new mysqli("db", "root", "azerty", "ideastorm");

if ($conn->connect_error) {
    die("Erreur de connexion : " . $conn->connect_error);
}

echo "<h2>Mise à jour des mots de passe en cours...</h2>";

// 1. On récupère tous les utilisateurs
$sql = "SELECT id, password_hash FROM users";
$result = $conn->query($sql);

$count = 0;

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $currentPassword = $row['password_hash'];
        $userId = $row['id'];

        // Vérifier si le mot de passe est déjà haché (un hash bcrypt commence par '$2y$')
        if (strpos($currentPassword, '$2y$') !== 0) {

            // Hachage du mot de passe en clair
            $newHash = password_hash($currentPassword, PASSWORD_BCRYPT);

            // Mise à jour dans la base de données
            $updateSql = "UPDATE users SET password_hash = '$newHash' WHERE id = $userId";

            if ($conn->query($updateSql)) {
                echo "✅ Utilisateur ID $userId mis à jour.<br>";
                $count++;
            } else {
                echo "❌ Erreur pour ID $userId : " . $conn->error . "<br>";
            }
        } else {
            echo "ℹ️ Utilisateur ID $userId déjà haché, ignoré.<br>";
        }
    }
}

echo "<h3>Terminé ! $count mots de passe ont été sécurisés.</h3>";
echo "<p style='color:red;'><b>IMPORTANT : Supprimez ce fichier de votre serveur maintenant.</b></p>";

$conn->close();
?>