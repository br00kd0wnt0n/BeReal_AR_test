// Analytics Module for BeReal AR Billboard Prototype
class Analytics {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.isEnabled = true;
        
        this.initialize();
    }

    initialize() {
        // Track page load
        this.trackPageView();
        
        // Track session start
        this.trackEvent('session_started', {
            sessionId: this.sessionId,
            userAgent: navigator.userAgent,
            screenSize: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        });

        // Track performance metrics
        this.trackPerformance();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    trackEvent(eventName, properties = {}) {
        if (!this.isEnabled) return;

        const event = {
            event: eventName,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            url: window.location.href,
            properties: {
                ...properties,
                pageTitle: document.title
            }
        };

        this.events.push(event);
        console.log('Analytics Event:', event);

        // In a real implementation, you would send this to your analytics service
        // this.sendToAnalyticsService(event);
        
        // For demo purposes, store in localStorage
        this.storeEvent(event);
    }

    trackPageView() {
        this.trackEvent('page_viewed', {
            page: window.location.pathname,
            referrer: document.referrer
        });
    }

    trackPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        this.trackEvent('performance_metrics', {
                            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            firstPaint: this.getFirstPaint(),
                            firstContentfulPaint: this.getFirstContentfulPaint()
                        });
                    }
                }, 1000);
            });
        }
    }

    getFirstPaint() {
        if ('performance' in window) {
            const paintEntries = performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            return firstPaint ? firstPaint.startTime : null;
        }
        return null;
    }

    getFirstContentfulPaint() {
        if ('performance' in window) {
            const paintEntries = performance.getEntriesByType('paint');
            const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            return firstContentfulPaint ? firstContentfulPaint.startTime : null;
        }
        return null;
    }

    storeEvent(event) {
        try {
            const storedEvents = JSON.parse(localStorage.getItem('bereal_analytics') || '[]');
            storedEvents.push(event);
            
            // Keep only last 100 events to prevent localStorage overflow
            if (storedEvents.length > 100) {
                storedEvents.splice(0, storedEvents.length - 100);
            }
            
            localStorage.setItem('bereal_analytics', JSON.stringify(storedEvents));
        } catch (error) {
            console.error('Failed to store analytics event:', error);
        }
    }

    getEvents() {
        return this.events;
    }

    getStoredEvents() {
        try {
            return JSON.parse(localStorage.getItem('bereal_analytics') || '[]');
        } catch (error) {
            console.error('Failed to retrieve stored events:', error);
            return [];
        }
    }

    clearEvents() {
        this.events = [];
        localStorage.removeItem('bereal_analytics');
    }

    exportData() {
        const data = {
            sessionId: this.sessionId,
            startTime: this.startTime,
            endTime: Date.now(),
            events: this.getStoredEvents(),
            summary: this.generateSummary()
        };

        return data;
    }

    generateSummary() {
        const events = this.getStoredEvents();
        const summary = {
            totalEvents: events.length,
            sessionDuration: Date.now() - this.startTime,
            uniquePages: [...new Set(events.map(e => e.url))].length,
            eventTypes: {}
        };

        events.forEach(event => {
            summary.eventTypes[event.event] = (summary.eventTypes[event.event] || 0) + 1;
        });

        return summary;
    }

    // Mock analytics service integration
    sendToAnalyticsService(event) {
        // In a real implementation, this would send to Google Analytics, Mixpanel, etc.
        // Example for Google Analytics 4:
        /*
        if (typeof gtag !== 'undefined') {
            gtag('event', event.event, {
                event_category: 'bereal_billboard',
                event_label: event.properties.pageTitle,
                value: 1,
                custom_parameters: event.properties
            });
        }
        */
        
        // Example for Mixpanel:
        /*
        if (typeof mixpanel !== 'undefined') {
            mixpanel.track(event.event, event.properties);
        }
        */
    }

    // Track specific user interactions
    trackQRCodeInteraction(action) {
        this.trackEvent('qr_code_interaction', {
            action: action,
            timestamp: Date.now()
        });
    }

    trackRevealProgress(step) {
        this.trackEvent('reveal_progress', {
            step: step,
            progress: step / 5 * 100
        });
    }

    trackCameraInteraction(action) {
        this.trackEvent('camera_interaction', {
            action: action,
            timestamp: Date.now()
        });
    }

    trackContentEngagement(contentId, action) {
        this.trackEvent('content_engagement', {
            contentId: contentId,
            action: action,
            timestamp: Date.now()
        });
    }

    // Track conversion events
    trackConversion(type, value = null) {
        this.trackEvent('conversion', {
            type: type,
            value: value,
            timestamp: Date.now()
        });
    }

    // Track errors
    trackError(error, context = {}) {
        this.trackEvent('error', {
            message: error.message,
            stack: error.stack,
            context: context,
            timestamp: Date.now()
        });
    }
}

// Initialize analytics
const analytics = new Analytics();

// Export tracking function
export function trackEvent(eventName, properties = {}) {
    analytics.trackEvent(eventName, properties);
}

// Export other useful functions
export function trackError(error, context = {}) {
    analytics.trackError(error, context);
}

export function trackConversion(type, value = null) {
    analytics.trackConversion(type, value);
}

export function getAnalyticsData() {
    return analytics.exportData();
}

// Global error tracking
window.addEventListener('error', (event) => {
    trackError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), {
        type: 'unhandledrejection'
    });
});

// Export analytics instance for advanced usage
export default analytics; 