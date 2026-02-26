<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_schedule':
        $result = makeRequest('GET', '/schedule?order=time_slot.asc');
        echo json_encode($result['data']);
        break;

    case 'add_schedule':
        $data = json_decode(file_get_contents('php://input'), true);
        $result = makeRequest('POST', '/schedule', $data);
        http_response_code($result['status']);
        echo json_encode($result['data']);
        break;

    case 'update_schedule':
        $id = $_GET['id'] ?? '';
        $data = json_decode(file_get_contents('php://input'), true);
        $result = makeRequest('PATCH', '/schedule?id=eq.' . $id, $data);
        http_response_code($result['status']);
        echo json_encode($result['data']);
        break;

    case 'delete_schedule':
        $id = $_GET['id'] ?? '';
        $result = makeRequest('DELETE', '/schedule?id=eq.' . $id);
        http_response_code($result['status']);
        echo json_encode($result['data']);
        break;

    case 'get_links':
        $result = makeRequest('GET', '/useful_links?order=order_index.asc,title.asc');
        echo json_encode($result['data']);
        break;

    case 'add_link':
        $data = json_decode(file_get_contents('php://input'), true);
        $result = makeRequest('POST', '/useful_links', $data);
        http_response_code($result['status']);
        echo json_encode($result['data']);
        break;

    case 'update_link':
        $id = $_GET['id'] ?? '';
        $data = json_decode(file_get_contents('php://input'), true);
        $result = makeRequest('PATCH', '/useful_links?id=eq.' . $id, $data);
        http_response_code($result['status']);
        echo json_encode($result['data']);
        break;

    case 'delete_link':
        $id = $_GET['id'] ?? '';
        $result = makeRequest('DELETE', '/useful_links?id=eq.' . $id);
        http_response_code($result['status']);
        echo json_encode($result['data']);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
?>
