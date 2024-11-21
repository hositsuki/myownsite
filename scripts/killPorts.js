const { exec } = require('child_process');

const ports = [3000, 5000]; // 客户端和服务器端口

function killPort(port) {
    return new Promise((resolve, reject) => {
        const command = `netstat -ano | findstr :${port}`;
        
        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                console.log(`No process found on port ${port}`);
                resolve();
                return;
            }

            const lines = stdout.trim().split('\n');
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                
                if (pid) {
                    exec(`taskkill /F /PID ${pid}`, (err) => {
                        if (err) {
                            console.log(`Failed to kill process on port ${port}`);
                        } else {
                            console.log(`Successfully killed process on port ${port}`);
                        }
                    });
                }
            });
            resolve();
        });
    });
}

async function killAllPorts() {
    for (const port of ports) {
        await killPort(port);
    }
}

killAllPorts().then(() => {
    console.log('Port cleanup completed');
});
