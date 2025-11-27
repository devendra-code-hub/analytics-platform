(function (window) {
    class Analytics {
        constructor() {
            this.endpoint = 'http://localhost:5000/api/track'; // Default
            this.sessionId = this.getSessionId();
        }

        init(options = {}) {
            if (options.endpoint) {
                this.endpoint = options.endpoint;
            }
            console.log('Analytics initialized with session:', this.sessionId);
        }

        getSessionId() {
            let sessionId = localStorage.getItem('analytics_session_id');
            if (!sessionId) {
                sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now();
                localStorage.setItem('analytics_session_id', sessionId);
            }
            return sessionId;
        }

        async track(eventName, data = {}) {
            const payload = {
                event: eventName,
                data: {
                    ...data,
                    sessionId: this.sessionId,
                    url: window.location.href,
                    referrer: document.referrer,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                }
            };

            try {
                await fetch(this.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                console.log(`[Analytics] Tracked: ${eventName}`);
            } catch (err) {
                console.error('[Analytics] Error tracking event:', err);
            }
        }

        pageView() {
            this.track('page_view');
        }
    }

    // Expose to window
    window.Analytics = new Analytics();

})(window);
