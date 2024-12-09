const  = require('lodash');

(function() {
    // Store the original .chunk function
    const originalChunk = .chunk;

    // Override the .chunk function
    .chunk = function(array, size) {
        console.log('Custom chunk function called');
        // Custom behavior
        let result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    // Use the overridden function within this scope
    console.log(.chunk(['a', 'b', 'c', 'd'], 2));
    // Output: Custom chunk function called
    // [['a', 'b'], ['c', 'd']]

    // Restore the original function after use
    .chunk = originalChunk;
})();
