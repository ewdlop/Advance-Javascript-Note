// moduleLoader.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function loadModule(name, config) {
    console.log(`Loading ${name}...`);
    

    // Check if the environment is Node.js or browser
    if (typeof window === 'undefined') {
        // Node.js environment
        try {
            // Try npm package first
            return require(config.package);
        } catch (err) {
            console.log(`Failed to load ${name} from npm, trying alternative...`);
            // For Node.js specific modules like JSDOM, return null if not found
            if (config.nodeOnly) {
                return null;
            }
            // For browser modules in Node.js, create minimal shim
            return config.shim ? config.shim() : null;
        }
    } else {
        // Browser environment
        try {

            // Create a script element and load the module from CDN
            const script = document.createElement('script');
            script.src = config.cdnUrl;
            
            // Load the script and return the global variable
            return new Promise((resolve, reject) => {
                script.onload = () => resolve(window[config.globalVar]);
                script.onerror = () => reject(new Error(`Failed to load ${name} from CDN`));
                document.head.appendChild(script);
            });
        } catch (err) {
            throw new Error(`Failed to load ${name} in browser environment`);
        }
    }
}

const moduleConfigs = {
    'd3': {
        package: 'd3',
        cdnUrl: 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
        globalVar: 'd3',
        shim: () => ({}) // Minimal shim for Node.js
    },
    'plotly': {
        package: 'plotly.js-dist',
        cdnUrl: 'https://cdn.plot.ly/plotly-2.14.0.min.js',
        globalVar: 'Plotly',
        shim: () => ({
            newPlot: () => console.log('Plotly.newPlot called in Node.js environment')
        })
    },
    'jquery': {
        package: 'jquery',
        cdnUrl: 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
        globalVar: 'jQuery',
        shim: () => ({})
    },
    'jsdom': {
        package: 'jsdom',
        nodeOnly: true,
        shim: () => null
    }
};

async function initializeEnvironment() {
    try {
        // Try to load JSDOM in Node.js environment
        if (typeof window === 'undefined') {

            console.log('Initializing Node.js environment...');
            // Load JSDOM
            const jsdom = await loadModule('jsdom', moduleConfigs.jsdom);

            // Initialize JSDOM if available
            if (jsdom) {
                const { JSDOM } = jsdom;
                const dom = new JSDOM('<!DOCTYPE html><div id="target"></div>');
                global.window = dom.window;
                global.document = dom.window.document;
                global.navigator = dom.window.navigator;
            }
        }
    } catch (error) {
        console.error('Failed to initialize environment:', error);
    }
}

async function initializePlotly() {
    try {
        // Initialize environment first
        await initializeEnvironment();

        // Load all dependencies concurrently
        const [d3, plotly, jquery] = await Promise.all([
            loadModule('d3', moduleConfigs.d3),
            loadModule('plotly', moduleConfigs.plotly),
            loadModule('jquery', moduleConfigs.jquery)
        ]);

        // Assign globals if needed
        if (typeof window !== 'undefined') {
            window.d3 = d3;
            window.jQuery = window.$ = jquery;
        }

        // Your plotting code
        const trace1 = {
            x: [1, 2, 3, 4],
            y: [10, 15, 13, 17],
            mode: 'markers',
            type: 'scatter'
        };
        
        const trace2 = {
            x: [2, 3, 4, 5],
            y: [16, 5, 11, 9],
            mode: 'lines',
            type: 'scatter'
        };
        
        const trace3 = {
            x: [1, 2, 3, 4],
            y: [12, 9, 15, 12],
            mode: 'lines+markers',
            type: 'scatter'
        };
        
        const data = [trace1, trace2, trace3];
        
        // Create the plot
        if (plotly && plotly.newPlot) {
            await plotly.newPlot('target', data);
            console.log('Plot created successfully');
        } else {
            console.log('Plotly not available in this environment');
        }

    } catch (error) {
        console.error('Failed to initialize:', error);
    }
}

// Start the initialization
initializePlotly();