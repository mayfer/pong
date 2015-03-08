// This polyfill is adapted from the MIT-licensed
// https://github.com/underscorediscovery/realtime-multiplayer-in-html5

(function(animframe) {
    var timestep = 1000/60;
    animframe.requestAnimationFrame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (function() {
        var lastTimestamp = Date.now(),
            now,
            timeout;
        return function(callback) {
            now = Date.now();
            timeout = Math.max(0, timestep - (now - lastTimestamp));
            lastTimestamp = now + timeout;
            return setTimeout(function() {
                callback(now + timeout);
            }, timeout);
        };
    })();
     
    animframe.cancelAnimationFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout;

})(typeof animframe === 'undefined'? this['animframe']={}: animframe);
