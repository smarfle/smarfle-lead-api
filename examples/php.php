<?php
/**
 * Send one lead to Smarfle from PHP. In WordPress, wp_remote_post() works the same way;
 * keep the key in wp-config.php (define( 'SMARFLE_API_KEY', 'rk_...' );), never in page HTML.
 */
$key = getenv('SMARFLE_API_KEY') ?: (defined('SMARFLE_API_KEY') ? SMARFLE_API_KEY : '');
if (!$key) {
    exit("Set SMARFLE_API_KEY first\n");
}

$lead = [
    'first_name' => 'Morgan',
    'last_name'  => 'Ellis',
    'email'      => 'morgan@example.com',
    'phone'      => '(202) 555-0101',
    'message'    => 'Leaking water heater in the garage.',
    'page_title' => 'Water heater repair',
    'sms_consent' => false,
];

$ch = curl_init('https://www.smarfle.com/api/webhook/leads');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'x-api-key: ' . $key],
    CURLOPT_POSTFIELDS     => json_encode($lead),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
]);
$body   = json_decode((string) curl_exec($ch), true);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status === 200) {
    echo 'Lead created: ' . $body['client_id'] . "\n";
} elseif ($status === 409) {
    echo 'Client already existed, request saved on: ' . $body['client_id'] . "\n";
} else {
    echo 'Failed: ' . $status . ' ' . ($body['error'] ?? '') . "\n";
}
