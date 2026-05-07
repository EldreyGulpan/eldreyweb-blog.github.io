<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

$response = ['success' => false, 'message' => '', 'filePath' => ''];

// Create images directory if it doesn't exist
$imagesDir = __DIR__ . DIRECTORY_SEPARATOR . 'images';
if (!is_dir($imagesDir)) {
    if (!@mkdir($imagesDir, 0755, true)) {
        $response['message'] = 'Failed to create images directory';
        echo json_encode($response);
        exit;
    }
}

// Check directory is writable
if (!is_writable($imagesDir)) {
    @chmod($imagesDir, 0755);
    if (!is_writable($imagesDir)) {
        $response['message'] = 'Images directory is not writable';
        echo json_encode($response);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $response['message'] = 'No image file provided or upload error';
    echo json_encode($response);
    exit;
}

$file = $_FILES['image'];
$maxSize = 5 * 1024 * 1024; // 5MB limit per image

// Validate file size
if ($file['size'] > $maxSize) {
    $response['message'] = 'File size exceeds 5MB limit';
    echo json_encode($response);
    exit;
}

$allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
if (!in_array($file['type'], $allowedMimes)) {
    $response['message'] = 'Invalid image format. Allowed: JPEG, PNG, GIF, WebP';
    echo json_encode($response);
    exit;
}

// Validate file content
$fileContent = file_get_contents($file['tmp_name']);
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->buffer($fileContent);
if (!in_array($mimeType, $allowedMimes)) {
    $response['message'] = 'File content is not a valid image';
    echo json_encode($response);
    exit;
}

// Generate unique filename
$timestamp = time();
$randomStr = bin2hex(random_bytes(4));
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$newFilename = 'uploaded_' . $timestamp . '_' . $randomStr . '.' . $extension;
$filePath = $imagesDir . DIRECTORY_SEPARATOR . $newFilename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filePath)) {
    // Ensure file is readable
    chmod($filePath, 0644);
    
    $relativePath = 'images/' . $newFilename;
    $response['success'] = true;
    $response['message'] = 'Image uploaded successfully';
    $response['filePath'] = $relativePath;
} else {
    $response['message'] = 'Failed to save image file';
}

echo json_encode($response);
?>
