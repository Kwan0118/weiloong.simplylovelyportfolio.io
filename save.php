<?php
/** Receives the edited portfolio content as JSON and writes it to data.json. */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid data received.']);
    exit;
}


// Basic shape check so a malformed request can't wipe the file with junk.
$required = ['name', 'tagline', 'about', 'skillsRaw', 'projects', 'certsRaw', 'contactText', 'contactLinksRaw', 'footer'];
foreach ($required as $key) {
    if (!array_key_exists($key, $input)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => "Missing field: $key"]);
        exit;
    }
}

$dataFile = __DIR__ . '/data.json';
$json = json_encode($input, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$fp = fopen($dataFile, 'c+');
if (!$fp || !flock($fp, LOCK_EX)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not open data.json for writing. Check file/folder permissions.']);
    exit;
}
ftruncate($fp, 0);
rewind($fp);
fwrite($fp, $json);
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(['ok' => true]);
