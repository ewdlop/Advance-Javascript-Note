import require from 'requirejs';


/**
 * 
Error: Tried loading "d3" at https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js then tried node's require("d3") and it failed with error: Error: Cannot find module 'd3'
Require stack:
 */
const plotlyloader = (require.config({
    paths: {
        d3: 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min',
        jquery: 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
        plotly: 'https://cdn.plot.ly/plotly-2.14.0.min'
    },

    shim: {
        plotly: {
            deps: ['d3', 'jquery'],
            exports: 'plotly'
        }
    }
}) || require);


plotlyloader(['plotly'], function (plotly) {
    var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        mode: 'markers',
        type: 'scatter'
    };
    
    var trace2 = {
        x: [2, 3, 4, 5],
        y: [16, 5, 11, 9],
        mode: 'lines',
        type: 'scatter'
    };
    
    var trace3 = {
        x: [1, 2, 3, 4],
        y: [12, 9, 15, 12],
        mode: 'lines+markers',
        type: 'scatter'
    };
    
    var data = [trace1, trace2, trace3];
    
    plotly.newPlot('target', data);
});