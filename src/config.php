<?php
$supabase_url = getenv('VITE_SUPABASE_URL');
$supabase_key = getenv('VITE_SUPABASE_ANON_KEY');
$service_role_key = getenv('VITE_SUPABASE_SERVICE_ROLE_KEY') ?: $supabase_key;

define('SUPABASE_URL', $supabase_url);
define('SUPABASE_KEY', $supabase_key);
define('SERVICE_ROLE_KEY', $service_role_key);

function makeRequest($method, $endpoint, $body = null) {
    $url = SUPABASE_URL . '/rest/v1' . $endpoint;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    if ($body) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'data' => json_decode($response, true),
        'status' => $http_code
    ];
}
?>
