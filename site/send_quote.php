<?php

declare(strict_types=1);

// Update these for your GoDaddy hosting
$toEmail = 'husnaeng&const@outlook.com';
$subjectPrefix = 'New Quote/Enquiry Request';

function respondHtml(int $statusCode, string $title, string $message): void {
  http_response_code($statusCode);
  header('Content-Type: text/html; charset=UTF-8');
  echo '<!doctype html><html lang="en"><head><meta charset="UTF-8" />';
  echo '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
  echo '<title>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</title></head><body style="font-family:system-ui,Segoe UI,Arial,sans-serif; padding:24px;">';
  echo '<h1 style="margin:0 0 12px;">' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</h1>';
  echo '<p style="margin:0 0 16px;">' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p>';
  echo '<p style="margin:0;"><a href="contact.html">Back to Contact</a></p>';
  echo '</body></html>';
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respondHtml(405, 'Method Not Allowed', 'Please submit the form from the website.');
}

// Basic spam honeypot: if filled, silently pretend success.
$honeypot = trim((string)($_POST['website'] ?? ''));
if ($honeypot !== '') {
  respondHtml(200, 'Thank you', 'Your request has been received.');
}

$name = trim((string)($_POST['name'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$location = trim((string)($_POST['location'] ?? ''));
$service = trim((string)($_POST['service'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$siteVisit = ((string)($_POST['siteVisit'] ?? '')) === 'yes' ? 'Yes' : 'No';

if ($name === '' || $phone === '' || $location === '' || $service === '' || $message === '') {
  respondHtml(400, 'Missing information', 'Please fill all required fields and try again.');
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  respondHtml(400, 'Invalid email', 'Please enter a valid email address (or leave it blank).');
}

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? '');
$ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');

$textBody = "New Quote Request\n\n" .
  "Name: {$name}\n" .
  "Phone: {$phone}\n" .
  "Email: " . ($email !== '' ? $email : 'N/A') . "\n" .
  "Location: {$location}\n" .
  "Service: {$service}\n" .
  "Site Visit Requested: {$siteVisit}\n\n" .
  "Message:\n{$message}\n\n" .
  "---\n" .
  "IP: {$ip}\n" .
  "User-Agent: {$ua}\n";

$fromEmail = 'husnaeng&const@outlook.com';
$headers = [];
$headers[] = 'From: ' . $fromEmail;
if ($email !== '') {
  $headers[] = 'Reply-To: ' . $email;
}
$headers[] = 'MIME-Version: 1.0';

// Optional attachment
$hasAttachment = isset($_FILES['attachment']) && is_array($_FILES['attachment']) && ($_FILES['attachment']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;

if (!$hasAttachment) {
  $headers[] = 'Content-Type: text/plain; charset=UTF-8';
  $ok = mail($toEmail, $subjectPrefix . ' - ' . $name, $textBody, implode("\r\n", $headers));
  if (!$ok) {
    respondHtml(500, 'Could not send', 'Mail sending failed. Please call or WhatsApp us instead.');
  }
  respondHtml(200, 'Thank you', 'Your quote request has been sent. We will contact you soon.');
}

$fileError = (int)($_FILES['attachment']['error'] ?? UPLOAD_ERR_NO_FILE);
if ($fileError !== UPLOAD_ERR_OK) {
  respondHtml(400, 'Upload error', 'File upload failed. Please try again without an attachment or use WhatsApp.');
}

$tmpName = (string)($_FILES['attachment']['tmp_name'] ?? '');
$origName = (string)($_FILES['attachment']['name'] ?? 'attachment');
$fileSize = (int)($_FILES['attachment']['size'] ?? 0);

if ($fileSize > 5 * 1024 * 1024) {
  respondHtml(400, 'File too large', 'Please upload a file smaller than 5 MB.');
}

$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
$allowed = ['pdf', 'jpg', 'jpeg', 'png'];
if (!in_array($ext, $allowed, true)) {
  respondHtml(400, 'Unsupported file type', 'Allowed file types: PDF, JPG, JPEG, PNG.');
}

$fileData = file_get_contents($tmpName);
if ($fileData === false) {
  respondHtml(400, 'File read error', 'Could not read the uploaded file.');
}

$boundary = '==Multipart_Boundary_x' . md5((string)microtime(true)) . 'x';
$headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

$body = "--{$boundary}\r\n";
$body .= "Content-Type: text/plain; charset=\"UTF-8\"\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= $textBody . "\r\n\r\n";

$body .= "--{$boundary}\r\n";
$body .= "Content-Type: application/octet-stream; name=\"" . addslashes($origName) . "\"\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n";
$body .= "Content-Disposition: attachment; filename=\"" . addslashes($origName) . "\"\r\n\r\n";
$body .= chunk_split(base64_encode($fileData));
$body .= "\r\n--{$boundary}--\r\n";

$ok = mail($toEmail, $subjectPrefix . ' - ' . $name, $body, implode("\r\n", $headers));
if (!$ok) {
  respondHtml(500, 'Could not send', 'Mail sending failed. Please call or WhatsApp us instead.');
}

respondHtml(200, 'Thank you', 'Your quote request has been sent (with attachment). We will contact you soon.');
