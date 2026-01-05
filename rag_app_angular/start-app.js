const portfinder = require('portfinder');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const START_PORT = 8000;
const ASSETS_DIR = path.join(__dirname, 'src', 'assets');
const CONFIG_FILE = path.join(ASSETS_DIR, 'backend-config.json');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function startApp() {
    try {
        // 1. Find an available port
        portfinder.basePort = START_PORT;
        const port = await portfinder.getPortPromise();
        console.log(`[Launcher] Found available port for Python backend: ${port}`);

        // 2. Write configuration for Angular
        const config = {
            corefUrl: `http://localhost:${port}/resolve`
        };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        console.log(`[Launcher] Wrote config to ${CONFIG_FILE}`);

        // 3. Start Python Backend
        console.log('[Launcher] Starting Python backend...');
        // Assuming a virtual environment is not strictly enforced by the launcher, 
        // but the user would typically run this in an environment where 'python' is available.
        // Ideally, we should check for 'venv' or 'conda', but simpler is 'python'.
        const pythonProcess = spawn('python', ['python_backend/main.py', '--port', port.toString()], {
            stdio: 'inherit',
            shell: true
        });

        pythonProcess.on('error', (err) => {
            console.error('[Launcher] Failed to start Python backend:', err);
        });

        // 4. Start Angular App
        console.log('[Launcher] Starting Angular app...');
        const angularProcess = spawn('npm', ['run', 'ng', 'serve'], {
            stdio: 'inherit',
            shell: true
        });

        angularProcess.on('error', (err) => {
            console.error('[Launcher] Failed to start Angular app:', err);
        });

        // Handle cleanup
        const cleanup = () => {
            console.log('\n[Launcher] Shutting down processes...');
            pythonProcess.kill();
            angularProcess.kill();
            process.exit();
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

    } catch (err) {
        console.error('[Launcher] Error starting application:', err);
        process.exit(1);
    }
}

startApp();
