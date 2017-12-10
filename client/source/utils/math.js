export function clamp(number, lowerBound, upperBound) {
    return Math.min(Math.max(number, lowerBound), upperBound);
}
