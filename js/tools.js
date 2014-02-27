var bench = false;
var logging = true || bench;

function log() {
    if (logging) {
        if (window.console) {
            console.log.apply(console, arguments);
        }
    }
    return log;
}
log.line = function() {
    if (logging) {
        if (window.console) {
            console.log("===============================");
        }
    }
    return this;
};

function startBench(a) {
    if (bench || a) {
        return new Date();
    }
}
function endBench(startDate, text, a) {
    if (bench || a) {
        var d = new Date() - startDate;
        if (text) {
            return log(text, d);
        } else {
            return log(d);
        }
    }
}
