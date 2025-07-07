// WebXR AR Implementation for True AR Experience
class WebXRARManager {
    constructor() {
        this.session = null;
        this.referenceSpace = null;
        this.hitTestSource = null;
        this.hitTestSourceRequested = false;
        this.reticle = null;
        this.revealContent = null;
        
        this.init();
    }

    async init() {
        // Check WebXR support
        if (!navigator.xr) {
            console.log('WebXR not supported');
            this.fallbackToCameraOverlay();
            return;
        }

        // Check AR support
        const isArSupported = await navigator.xr.isSessionSupported('immersive-ar');
        if (!isArSupported) {
            console.log('AR not supported');
            this.fallbackToCameraOverlay();
            return;
        }

        this.setupARButton();
    }

    setupARButton() {
        const arButton = document.createElement('button');
        arButton.textContent = 'Start AR Experience';
        arButton.className = 'ar-button';
        arButton.onclick = () => this.startARSession();
        
        document.body.appendChild(arButton);
    }

    async startARSession() {
        try {
            // Request AR session
            this.session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test', 'dom-overlay'],
                domOverlay: { root: document.getElementById('ar-overlay') }
            });

            this.session.addEventListener('end', () => this.onSessionEnd());
            
            // Set up the AR session
            await this.session.requestReferenceSpace('viewer');
            this.referenceSpace = await this.session.requestReferenceSpace('local');
            
            // Create hit test source
            const session = this.session;
            const viewerSpace = await session.requestReferenceSpace('viewer');
            this.hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
            
            // Start the AR session
            await this.session.requestAnimationFrame(this.onFrame.bind(this));
            
        } catch (error) {
            console.error('Failed to start AR session:', error);
            this.fallbackToCameraOverlay();
        }
    }

    onFrame(time, frame) {
        if (this.session) {
            this.session.requestAnimationFrame(this.onFrame.bind(this));
        }

        if (frame) {
            const hitTestResults = frame.getHitTestResults(this.hitTestSource);
            
            if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                const pose = hit.getPose(this.referenceSpace);
                
                // Position content at hit point
                this.positionContentAtHit(pose);
            }
        }
    }

    positionContentAtHit(pose) {
        if (!this.revealContent) {
            this.createRevealContent();
        }

        // Transform content to hit position
        const transform = pose.transform;
        this.revealContent.style.transform = `translate3d(${transform.position.x}px, ${transform.position.y}px, ${transform.position.z}px)`;
    }

    createRevealContent() {
        this.revealContent = document.createElement('div');
        this.revealContent.className = 'ar-reveal-content';
        this.revealContent.innerHTML = `
            <div class="authentic-moment-ar">
                <h2>✨ Authentic Moment ✨</h2>
                <p>Real friendship, unfiltered</p>
            </div>
        `;
        
        document.getElementById('ar-overlay').appendChild(this.revealContent);
    }

    onSessionEnd() {
        this.session = null;
        this.referenceSpace = null;
        this.hitTestSource = null;
    }

    fallbackToCameraOverlay() {
        // Fall back to our current camera overlay implementation
        console.log('Using camera overlay fallback');
    }
}

// AR-specific CSS for true spatial positioning
const arStyles = `
.ar-reveal-content {
    position: absolute;
    width: 300px;
    height: 200px;
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(254, 202, 87, 0.9));
    border-radius: 15px;
    padding: 20px;
    color: white;
    text-align: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    transform-style: preserve-3d;
    transition: transform 0.3s ease;
}

.ar-button {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ff6b6b, #feca57);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
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