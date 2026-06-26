<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if (strlen($name) < 3) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter your full name.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (strlen($message) < 10) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a message of at least 10 characters.']);
    exit;
}

$brevoApiKey = getenv('BREVO_API_KEY') ?: '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';
$recipientEmail = getenv('CONTACT_TO_EMAIL') ?: 'greenmovies325@gmail.com';
$senderEmail = getenv('BREVO_SENDER_EMAIL') ?: 'araswin325@gmail.com';
$senderName = getenv('BREVO_SENDER_NAME') ?: 'GrapesGenix Website';

if ($brevoApiKey === '') {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Email service is not configured.']);
    exit;
}

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

$payload = [
    'sender' => [
        'name' => $senderName,
        'email' => $senderEmail,
    ],
    'to' => [
        [
            'email' => $recipientEmail,
        ],
    ],
    'replyTo' => [
        'name' => $name,
        'email' => $email,
    ],
    'subject' => 'New contact form message from ' . $name,
    'htmlContent' => "
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> {$safeName}</p>
        <p><strong>Email:</strong> {$safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>{$safeMessage}</p>
    ",
    'textContent' => "New Contact Form Message\n\nName: {$name}\nEmail: {$email}\n\nMessage:\n{$message}",
];

$ch = curl_init('https://api.brevo.com/v3/smtp/email');

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
        'api-key: ' . $brevoApiKey,
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
]);

$responseBody = curl_exec($ch);
$curlError = curl_error($ch);
$statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($responseBody === false || $statusCode < 200 || $statusCode >= 300) {
    error_log('Brevo contact form error: ' . ($curlError ?: $responseBody ?: 'Unknown error'));
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'Unable to send your message right now.']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
