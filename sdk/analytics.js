(function (window) {
    class Analytics {
        constructor() {
           this.endpoint = "https://analytics-platform-dzkr.onrender.com/api/track";

            this.sessionId = this.getSessionId();
            this.cheatCount = 0;
        }

        init(options = {}) {
            if (options.endpoint) {
                this.endpoint = options.endpoint;
            }

            console.log("[Analytics] Initialized:", this.sessionId);
            this.setupEventListeners();
        }

        getSessionId() {
            let id = localStorage.getItem("analytics_session_id");
            if (!id) {
                id = "sess_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
                localStorage.setItem("analytics_session_id", id);
            }
            return id;
        }

        async track(event, data = {}) {
            const payload = {
                event,
                data,
                sessionId: this.sessionId,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
            };

            try {
                await fetch(this.endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                console.log("[Analytics] Event:", event, payload);
            } catch (err) {
                console.error("[Analytics] Error sending event:", err);
            }
        }

        flagCheat(reason) {
            this.cheatCount++;

            this.track("cheat_detected", {
                reason,
                cheatCount: this.cheatCount
            });

            if (this.cheatCount >= 3) {
                alert("⚠ Cheating detected multiple times! Your quiz may be disqualified.");
            }
        }

        setupEventListeners() {
            // -------- TAB SWITCHING ----------
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    this.flagCheat("tab_hidden");
                } else {
                    this.track("tab_visible");
                }
            });

            // -------- WINDOW BLUR & FOCUS ----------
            window.addEventListener("blur", () => {
                this.flagCheat("window_blur");
            });

            window.addEventListener("focus", () => {
                this.track("window_focus");
            });

            // -------- COPY DETECT ----------
            document.addEventListener("copy", () => {
                this.flagCheat("copy_attempt");
            });

            // -------- RIGHT CLICK DETECT ----------
            document.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                this.flagCheat("right_click");
            });

            // -------- SCREENSHOT ATTEMPT ----------
            document.addEventListener("keydown", (e) => {
                if (e.key === "PrintScreen") {
                    this.flagCheat("print_screen");
                }
                if (e.ctrlKey && e.shiftKey && e.key === "S") {
                    this.flagCheat("snipping_tool");
                }
            });

            // -------- PAGE EXIT OR REFRESH ----------
            window.addEventListener("beforeunload", () => {
                this.track("exit_or_refresh");
            });
        }
    }

    window.analytics = new Analytics();

})(window);
