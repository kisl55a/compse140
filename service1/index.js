const http = require("http");
const { exec } = require("child_process");
const { promisify } = require("util");

const hostname = "0.0.0.0";
const port = 3000;
const execAsync = promisify(exec);

const server = http.createServer(async (req, res) => {
  if (req.url === '/stop' && req.method === 'POST') {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify({ message: "Shut down command received" }));
	await execAsync('./stop_containers.sh');
	process.exit(0);
	return;
  }

  try {
	const { stdout: ip } = await execAsync("hostname -i");
	const { stdout: processes } = await execAsync("ps aux");
	const { stdout: disk } = await execAsync("df -h");
	const uptime = process.uptime();

	let service2Data = "";
	await new Promise((resolve, reject) => {
	  http
		.get("http://service2", (service2Res) => {
		  service2Res.on("data", (chunk) => {
			service2Data += chunk;
		  });
		  service2Res.on("end", resolve);
		})
		.on("error", reject);
	});

	const service2Json = JSON.parse(service2Data);

	const response = {
	  service: {
		service: "Service",
		ip: ip.trim(),
		running_processes: processes.trim(),
		available_disk_space: disk.trim(),
		time_since_last_boot: `${Math.floor(uptime)} secs`,
	  },
	  service2: service2Json,
	};

	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify(response, null, 2));

	// Close the server to prevent further requests
	server.close(() => {
		console.log("Server closed after response.");
	});
  } catch (err) {
	  res.statusCode = 500;
	  res.setHeader("Content-Type", "application/json");
	  res.end(JSON.stringify({ error: err.toString() }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
