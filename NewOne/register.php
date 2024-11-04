<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    if (strlen($username) < 3 || strlen($password) < 8) {
        echo json_encode(['error' => 'Invalid username or password']);
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    if ($stmt->execute([$username, $email, $hashedPassword])) {
        echo json_encode(['success' => 'User registered successfully']);
    } else {
        echo json_encode(['error' => 'Registration failed']);
    }
}
?>
