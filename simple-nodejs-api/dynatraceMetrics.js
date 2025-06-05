const dynatrace = require('@dynatrace/oneagent-sdk');

let sdk;
try {
    sdk = dynatrace.createInstance();
} catch (err) {
    console.error('Failed to initialize Dynatrace OneAgent SDK', err);
    sdk = null;
}

function trackItemCount(count) {
    if (sdk) {
        sdk.addCustomRequestAttribute('itemCount', count);
    }
}

function trackApiCallDuration(endpoint, duration) {
    if (sdk) {
        sdk.addCustomRequestAttribute(`apiCallDuration_${endpoint}`, duration);
    }
}

function startTracer(name) {
    return sdk ? sdk.traceIncoming(name) : null;
}

function endTracer(tracer) {
    if (tracer) {
        tracer.end();
    }
}

module.exports = {
    trackItemCount,
    trackApiCallDuration,
    startTracer,
    endTracer
};
