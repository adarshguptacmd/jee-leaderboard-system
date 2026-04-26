// ============================================
// MAIN APPLICATION INITIALIZATION
// ============================================

// Initialize all features
window.addEventListener('DOMContentLoaded', () => {
    // Initialize database
    DB.init();
    
    // Log for debugging
    console.log('🚀 JEE Leaderboard System Initialized');
    console.log('📊 Total Students:', getAllStudents().length);
    console.log('📚 Batches:', getBatches());
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
        // Refresh data if needed
        if (document.getElementById('leaderboardBody')) {
            loadLeaderboard();
        }
    }
});

// Handle before unload
window.addEventListener('beforeunload', () => {
    // Optional: Any cleanup needed
});

// Error handling
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Service Worker (optional - for offline support)
if ('serviceWorker' in navigator) {
    // Uncomment when service worker is ready
    // navigator.serviceWorker.register('sw.js');
}
