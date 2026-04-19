<?php
/**
 * Gemini API Proxy for Shared Hosting
 * This script bypasses CORS issues when calling Gemini API from a browser.
 * 
 * SETUP:
 * 1. Upload this file to your public_html folder.
 * 2. Set your API Key in the variable below OR pass it from the frontend.
 */

// --- CONFIGURATION ---
// You can hardcode your key here for better security (don't pass from frontend)
$HARDCODED_API_KEY = ""; 

// Allow CORS from your domain
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Get the raw POST data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Determine API Key
$apiKey = $HARDCODED_API_KEY;
if (empty($apiKey)) {
    // Check if passed in body metadata (matching our frontend logic)
    if (isset($input['metadata']['apiKey'])) {
        $apiKey = $input['metadata']['apiKey'];
        unset($input['metadata']); // Clean up before forwarding
    }
}

if (empty($apiKey)) {
    http_response_code(401);
    echo json_encode(["error" => ["message" => "No API Key provided in proxy.php or request."]]);
    exit;
}

// Prepare the request to Gemini
$model = isset($input['model']) ? $input['model'] : "gemini-1.5-flash";

$url = "https://generativelanguage.googleapis.com/v1beta/models/" . $model . ":generateContent?key=" . $apiKey;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(["error" => ["message" => curl_error($ch)]]);
} else {
    http_response_code($httpCode);
    header("Content-Type: application/json");
    echo $response;
}

if (version_compare(PHP_VERSION, '8.0.0', '<')) {
    curl_close($ch);
}
?>
