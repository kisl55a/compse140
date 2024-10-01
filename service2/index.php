<?php
header('Content-Type: application/json');

$current_time = time();

$stat = stat('/');
$start_time = $stat['ctime'];

$container_uptime_seconds = $current_time - $start_time;

$ip = shell_exec('hostname -i');
$processes = shell_exec('ps aux');
$disk = shell_exec('df -h');

$response = [
	'service' => 'Service2',
	'ip' => trim($ip),
	'running_processes' => trim($processes),
	'available_disk_space' => trim($disk),
	'time_since_last_boot' => $container_uptime_seconds . ' secs'
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>