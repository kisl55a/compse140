<?php
header('Content-Type: text/plain');

$current_time = time();

$stat = stat('/');
$start_time = $stat['ctime'];

$container_uptime_seconds = $current_time - $start_time;

$ip = shell_exec('hostname -i');
$processes = shell_exec('ps aux');
$disk = shell_exec('df -h');

echo "Service2\n";
echo " - IP address information: " . trim($ip) . "\n";
echo " - list of running processes: \n" . trim($processes) . "\n";
echo " - available disk space: \n" . trim($disk) . "\n";
echo " - time since last boot: " . $container_uptime_seconds . " secs\n";
?>