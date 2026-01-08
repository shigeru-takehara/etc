import portfinder from 'portfinder';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MANAGER_PORT = 8000;
const PYTHON_BASE_PORT = 8001;
const ASSETS_DIR = path.join(__dirname, 'src', 'assets');
const CONFIG_FILE = path.join(ASSETS_DIR, 'backend-config.json');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

let activePythonProcess = null;
let pythonPort = null;
let idleTimer = null;
const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        if (activePythonProcess) {
            console.log('[Manager] Idle timeout reached. Shutting down Python server...');
            activePythonProcess.kill();
            activePythonProcess = null;
        }
    }, IDLE_TIMEOUT_MS);
}

async function startApp() {
    try {
        // 1. Write configuration for Angular
        const config = {
            corefUrl: `http://localhost:${MANAGER_PORT}/resolve`
        };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        console.log(`[Launcher] Wrote config to ${CONFIG_FILE}`);

        // 2. Start Co-reference Manager
        const server = http.createServer(async (req, res) => {
            // Add CORS headers
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }

            // Status endpoint
            if (req.url === '/status' && req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: activePythonProcess ? 'ready' : 'off',
                    port: pythonPort
                }));
                return;
            }

            if (req.url === '/resolve' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => { body += chunk; });
                req.on('end', async () => {
                    try {
                        resetIdleTimer();

                        // Start Python server if not running
                        if (!activePythonProcess) {
                            console.log('[Manager] No active Python server. Starting lazy process...');
                            portfinder.basePort = PYTHON_BASE_PORT;
                            pythonPort = await portfinder.getPortPromise();

                            activePythonProcess = spawn('python', ['python_backend/main.py', '--port', pythonPort.toString()], {
                                stdio: 'pipe',
                                shell: true
                            });

                            activePythonProcess.stdout.on('data', (data) => {
                                console.log(`[Python STDOUT] ${data}`);
                            });
                            activePythonProcess.stderr.on('data', (data) => {
                                console.error(`[Python STDERR] ${data}`);
                            });

                            // Wait for readiness
                            let isReady = false;
                            for (let i = 0; i < 60; i++) {
                                try {
                                    const healthCheck = await new Promise((resolve) => {
                                        const hReq = http.get(`http://localhost:${pythonPort}/health`, (hRes) => {
                                            resolve(hRes.statusCode === 200);
                                        });
                                        hReq.on('error', () => resolve(false));
                                        hReq.setTimeout(500, () => { hReq.destroy(); resolve(false); });
                                    });
                                    if (healthCheck) {
                                        isReady = true;
                                        break;
                                    }
                                } catch (e) { }
                                await new Promise(r => setTimeout(r, 1000));
                            }

                            if (!isReady) {
                                activePythonProcess.kill();
                                activePythonProcess = null;
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Python server failed to start' }));
                                return;
                            }
                            console.log('[Manager] Python server ready on port', pythonPort);
                        }

                        // Forward request
                        const options = {
                            hostname: 'localhost',
                            port: pythonPort,
                            path: '/resolve',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': Buffer.byteLength(body)
                            }
                        };

                        const fReq = http.request(options, (fRes) => {
                            let fBody = '';
                            fRes.on('data', chunk => { fBody += chunk; });
                            fRes.on('end', () => {
                                res.writeHead(fRes.statusCode, { 'Content-Type': 'application/json' });
                                res.end(fBody);
                            });
                        });

                        fReq.on('error', (e) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: e.message }));
                        });

                        fReq.write(body);
                        fReq.end();

                    } catch (err) {
                        console.error('[Manager] Error:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: err.message }));
                    }
                });
            } else {
                res.writeHead(404);
                res.end();
            }
        });

        server.listen(MANAGER_PORT, () => {
            console.log(`[Launcher] Co-reference Manager listening on port ${MANAGER_PORT}`);
        });

        // 3. Start Angular App
        console.log('[Launcher] Starting Angular app...');
        const angularProcess = spawn('npm', ['run', 'ng', 'serve'], {
            stdio: 'inherit',
            shell: true
        });

        // Handle cleanup for the launcher itself
        const cleanup = () => {
            console.log('\n[Launcher] Shutting down launcher...');
            angularProcess.kill();
            if (activePythonProcess) {
                console.log('[Launcher] Killing co-reference server...');
                activePythonProcess.kill();
            }
            server.close();
            process.exit();
        };

        angularProcess.on('exit', cleanup);
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

    } catch (err) {
        console.error('[Launcher] Error starting application:', err);
        process.exit(1);
    }
}

startApp();
