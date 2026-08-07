/**
 * Format large numbers for display
 */
export const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
};

/**
 * Calculate time remaining from timestamp
 */
export const getTimeRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
};

/**
 * Standardize matching scores color mapping
 */
export const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-primary';
    return 'text-orange-600';
};