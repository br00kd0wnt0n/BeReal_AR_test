// WebXR AR Implementation for True AR Experience
class WebXRARManager {
    constructor() {
        this.session = null;
        this.referenceSpace = null;
        this.hitTestSource = null;
        this.hitTestSourceRequested = false;
        this.revealContent = null;
        this.arOverlay = null;
        this.isARSessionActive = false;
        this.billboardDetected = false;
        this.revealAnimation = null;
        
        this.init();
    }

    async init() {
        // Check WebXR support
        if (!navigator.xr) {
            console.log('WebXR not supported');
            return false;
        }

        // Check AR support
        const isArSupported = await navigator.xr.isSessionSupported('immersive-ar');
        if (!isArSupported) {
            console.log('AR not supported');
            return false;
        }

        console.log('WebXR AR supported - ready to enhance experience');
        return true;
    }

    async startARSession() {
        try {
            console.log('Starting WebXR AR session...');
            
            // Request AR session with required features
            this.session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test', 'dom-overlay'],
                domOverlay: { root: document.getElementById('ar-overlay') }
            });

            this.session.addEventListener('end', () => this.onSessionEnd());
            
            // Set up reference spaces
            this.referenceSpace = await this.session.requestReferenceSpace('local');
            const viewerSpace = await this.session.requestReferenceSpace('viewer');
            
            // Create hit test source for surface detection
            this.hitTestSource = await this.session.requestHitTestSource({ space: viewerSpace });
            this.hitTestSourceRequested = true;
            
            // Start the AR session
            await this.session.requestAnimationFrame(this.onFrame.bind(this));
            
            this.isARSessionActive = true;
            console.log('WebXR AR session started successfully');
            
            // Update status
            this.updateStatus('AR mode active - Point camera at surfaces');
            
            return true;
            
        } catch (error) {
            console.error('Failed to start AR session:', error);
            this.isARSessionActive = false;
            return false;
        }
    }

    onFrame(time, frame) {
        if (this.session) {
            this.session.requestAnimationFrame(this.onFrame.bind(this));
        }

        if (frame && this.hitTestSourceRequested) {
            const hitTestResults = frame.getHitTestResults(this.hitTestSource);
            
            if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                const pose = hit.getPose(this.referenceSpace);
                
                // Position content at hit point
                this.positionContentAtHit(pose);
                
                // If billboard is detected, trigger reveal
                if (this.billboardDetected && !this.revealContent) {
                    this.triggerARReveal(pose);
                }
            }
        }
    }

    positionContentAtHit(pose) {
        if (!this.revealContent) {
            this.createARContent();
        }

        // Transform content to hit position in 3D space
        const transform = pose.transform;
        const matrix = transform.matrix;
        
        // Apply 3D transform
        this.revealContent.style.transform = `translate3d(${transform.position.x}px, ${transform.position.y}px, ${transform.position.z}px)`;
        
        // Add subtle floating animation
        this.revealContent.style.animation = 'ar-float 3s ease-in-out infinite';
    }

    createARContent() {
        this.revealContent = document.createElement('div');
        this.revealContent.className = 'ar-billboard-content';
        this.revealContent.innerHTML = `
            <div class="ar-billboard-frame">
                <div class="ar-billboard-header">
                    <div class="ar-logo">📱</div>
                    <div class="ar-title">BeReal Billboard</div>
                </div>
                <div class="ar-billboard-body">
                    <div class="ar-message">Point camera here to reveal authentic moments</div>
                    <div class="ar-scan-indicator">
                        <div class="ar-scan-dot"></div>
                        <div class="ar-scan-dot"></div>
                        <div class="ar-scan-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('ar-overlay').appendChild(this.revealContent);
    }

    triggerARReveal(pose) {
        console.log('Triggering AR reveal...');
        
        // Create the reveal content in AR space
        this.createARRevealContent(pose);
        
        // Start AR reveal animation
        this.startARRevealAnimation();
        
        // Track event
        if (window.trackEvent) {
            window.trackEvent('ar_reveal_triggered');
        }
    }

    createARRevealContent(pose) {
        // Remove existing content
        if (this.revealContent) {
            this.revealContent.remove();
        }

        // Create new reveal content
        this.revealContent = document.createElement('div');
        this.revealContent.className = 'ar-reveal-content';
        this.revealContent.innerHTML = `
            <div class="ar-authentic-moment">
                <div class="ar-moment-header">
                    <div class="ar-sparkle">✨</div>
                    <h2>Authentic Moment</h2>
                    <div class="ar-sparkle">✨</div>
                </div>
                <div class="ar-moment-body">
                    <p>Real friendship, unfiltered</p>
                    <div class="ar-moment-description">
                        When you're ready to be real, everything becomes clear
                    </div>
                </div>
                <div class="ar-interaction-hint">
                    <div class="ar-tap-indicator">👆 Tap to interact</div>
                </div>
            </div>
        `;
        
        // Position at hit point
        const transform = pose.transform;
        this.revealContent.style.transform = `translate3d(${transform.position.x}px, ${transform.position.y}px, ${transform.position.z}px)`;
        
        // Add click interaction
        this.revealContent.addEventListener('click', () => this.handleARInteraction());
        
        document.getElementById('ar-overlay').appendChild(this.revealContent);
    }

    startARRevealAnimation() {
        if (!this.revealContent) return;

        // Progressive reveal animation
        const steps = [
            { opacity: 0, scale: 0.5, blur: 20, duration: 500 },
            { opacity: 0.7, scale: 0.8, blur: 10, duration: 500 },
            { opacity: 0.9, scale: 0.95, blur: 5, duration: 500 },
            { opacity: 1, scale: 1, blur: 0, duration: 500 }
        ];

        let currentStep = 0;
        const animateStep = () => {
            if (currentStep >= steps.length) {
                this.revealContent.classList.add('ar-revealed');
                return;
            }

            const step = steps[currentStep];
            this.revealContent.style.opacity = step.opacity;
            this.revealContent.style.transform += ` scale(${step.scale})`;
            this.revealContent.style.filter = `blur(${step.blur}px)`;
            this.revealContent.style.transition = `all ${step.duration}ms ease-out`;

            currentStep++;
            setTimeout(animateStep, step.duration);
        };

        animateStep();
    }

    handleARInteraction() {
        console.log('AR content interacted with');
        
        // Add interaction feedback
        this.revealContent.style.transform += ' scale(1.1)';
        setTimeout(() => {
            this.revealContent.style.transform = this.revealContent.style.transform.replace(' scale(1.1)', '');
        }, 200);

        // Show CTA in AR
        this.showARCTA();
        
        // Track interaction
        if (window.trackEvent) {
            window.trackEvent('ar_content_interacted');
        }
    }

    showARCTA() {
        const arCTA = document.createElement('div');
        arCTA.className = 'ar-cta-overlay';
        arCTA.innerHTML = `
            <div class="ar-cta-content">
                <h3>Now capture your own clear moment</h3>
                <p>Take your first authentic BeReal</p>
                <button class="ar-bereal-btn" onclick="window.openBeReal && window.openBeReal()">
                    <span>📸</span> Open BeReal Camera
                </button>
            </div>
        `;
        
        document.getElementById('ar-overlay').appendChild(arCTA);
        
        // Animate in
        setTimeout(() => {
            arCTA.classList.add('ar-cta-visible');
        }, 100);
    }

    onSessionEnd() {
        console.log('WebXR AR session ended');
        this.session = null;
        this.referenceSpace = null;
        this.hitTestSource = null;
        this.hitTestSourceRequested = false;
        this.isARSessionActive = false;
        
        // Clean up AR content
        if (this.revealContent) {
            this.revealContent.remove();
            this.revealContent = null;
        }
    }

    // Method to be called when QR code is detected (from camera.js)
    onQRCodeDetected() {
        console.log('QR code detected in AR mode');
        this.billboardDetected = true;
        
        // If AR session is active, show AR content
        if (this.isARSessionActive) {
            this.updateStatus('Billboard detected! Look around for AR content...');
        }
    }

    updateStatus(message) {
        const statusBar = document.getElementById('statusBar');
        if (statusBar) {
            const statusText = statusBar.querySelector('.status-text');
            if (statusText) {
                statusText.textContent = message;
            }
        }
    }

    // Public method to start AR experience
    async startARExperience() {
        const success = await this.startARSession();
        if (success) {
            this.updateStatus('AR mode active - Point camera at surfaces');
        }
        return success;
    }
}

// AR-specific CSS for true spatial positioning
const arStyles = `
.ar-billboard-content {
    position: absolute;
    width: 300px;
    height: 200px;
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.95), rgba(254, 202, 87, 0.95));
    border-radius: 20px;
    padding: 20px;
    color: white;
    text-align: center;
    backdrop-filter: blur(15px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    transform-style: preserve-3d;
    transition: all 0.3s ease;
    pointer-events: auto;
    z-index: 1000;
}

.ar-billboard-frame {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
}

.ar-billboard-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 15px;
}

.ar-logo {
    font-size: 1.5rem;
}

.ar-title {
    font-size: 1.2rem;
    font-weight: 600;
}

.ar-billboard-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.ar-message {
    font-size: 0.9rem;
    margin-bottom: 15px;
    opacity: 0.9;
}

.ar-scan-indicator {
    display: flex;
    gap: 5px;
}

.ar-scan-dot {
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    animation: ar-scan-pulse 1.5s ease-in-out infinite;
}

.ar-scan-dot:nth-child(2) {
    animation-delay: 0.5s;
}

.ar-scan-dot:nth-child(3) {
    animation-delay: 1s;
}

.ar-reveal-content {
    position: absolute;
    width: 350px;
    height: 250px;
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.95), rgba(254, 202, 87, 0.95), rgba(72, 219, 251, 0.95));
    border-radius: 25px;
    padding: 25px;
    color: white;
    text-align: center;
    backdrop-filter: blur(20px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    transform-style: preserve-3d;
    transition: all 0.5s ease;
    pointer-events: auto;
    z-index: 1001;
}

.ar-authentic-moment {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
}

.ar-moment-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
}

.ar-sparkle {
    font-size: 1.5rem;
    animation: ar-sparkle-rotate 2s linear infinite;
}

.ar-moment-header h2 {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
}

.ar-moment-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.ar-moment-body p {
    font-size: 1.1rem;
    margin: 0 0 15px 0;
    font-weight: 500;
}

.ar-moment-description {
    font-size: 0.9rem;
    opacity: 0.8;
    line-height: 1.4;
}

.ar-interaction-hint {
    margin-top: 15px;
}

.ar-tap-indicator {
    font-size: 0.8rem;
    opacity: 0.7;
    animation: ar-tap-bounce 2s ease-in-out infinite;
}

.ar-cta-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1002;
    opacity: 0;
    transition: opacity 0.5s ease;
}

.ar-cta-overlay.ar-cta-visible {
    opacity: 1;
}

.ar-cta-content {
    background: white;
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.ar-cta-content h3 {
    color: #333;
    margin: 0 0 15px 0;
    font-size: 1.3rem;
}

.ar-cta-content p {
    color: #666;
    margin: 0 0 25px 0;
}

.ar-bereal-btn {
    background: linear-gradient(135deg, #ff6b6b, #feca57);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: transform 0.2s ease;
}

.ar-bereal-btn:hover {
    transform: scale(1.05);
}

@keyframes ar-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

@keyframes ar-scan-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
}

@keyframes ar-sparkle-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes ar-tap-bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

#ar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 100;
}
`;

// Inject AR styles
const styleSheet = document.createElement('style');
styleSheet.textContent = arStyles;
document.head.appendChild(styleSheet);

// Make WebXRARManager globally available
window.WebXRARManager = WebXRARManager;

export default WebXRARManager; 