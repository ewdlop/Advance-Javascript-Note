// moduleLoader.js
async function loadModule(name, config) {
    console.log(`Loading ${name}...`);
    
    // Browser environment loading
    try {
        // Check if module is already loaded
        if (window[config.globalVar]) {
            console.log(`${name} already loaded`);
            return window[config.globalVar];
        }

        // Load script
        const script = document.createElement('script');
        script.src = config.cdnUrl;
        
        return new Promise((resolve, reject) => {
            script.onload = () => {
                console.log(`${name} loaded successfully`);
                resolve(window[config.globalVar]);
            };
            script.onerror = () => reject(new Error(`Failed to load ${name} from CDN`));
            document.head.appendChild(script);
        });
    } catch (err) {
        throw new Error(`Failed to load ${name}: ${err.message}`);
    }
}

const moduleConfigs = {
    'd3': {
        cdnUrl: 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
        globalVar: 'd3'
    },
    'plotly': {
        cdnUrl: 'https://cdn.plot.ly/plotly-2.14.0.min.js',
        globalVar: 'Plotly'
    },
    'jquery': {
        cdnUrl: 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
        globalVar: 'jQuery'
    }
};

async function initializePlotly() {
    try {
        // Load all dependencies concurrently
        const [d3, plotly, jquery] = await Promise.all([
            loadModule('d3', moduleConfigs.d3),
            loadModule('plotly', moduleConfigs.plotly),
            loadModule('jquery', moduleConfigs.jquery)
        ]);

        // Assign jQuery global
        window.jQuery = window.$ = jquery;

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
        await plotly.newPlot('target', data);
        console.log('Plot created successfully');

    } catch (error) {
        console.error('Failed to initialize:', error);
    }
}

// Start the initialization
initializePlotly();