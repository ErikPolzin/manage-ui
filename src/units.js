function formatBitsPerSecond(v) {
    if (v <= 1000) return `${v.toFixed(2)} bits/s`;
    v /= 1000;
    if (v <= 1000) return `${v.toFixed(2)} Kbps`;
    v /= 1000;
    return `${v.toFixed(2)} Mbps`
}

export { formatBitsPerSecond };
