function formatBitsPerSecond(v) {
    if (v <= 1000) return `${v.toFixed(2)} bits/s`;
    v /= 1000;
    if (v <= 1000) return `${v.toFixed(2)} Kbps`;
    v /= 1000;
    return `${v.toFixed(2)} Mbps`
}

function formatDataSize(v) {
    if (v <= 1000) return `${v.toFixed(2)} bytes`;
    v /= 1000;
    if (v <= 1000) return `${v.toFixed(2)} KB`;
    v /= 1000;
    if (v <= 1000) return `${v.toFixed(2)} MB`;
    v /= 1000;
    return `${v.toFixed(2)} GB`
}

export { formatBitsPerSecond, formatDataSize };
