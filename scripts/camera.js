import QrScanner from 'qr-scanner';
import { trackEvent } from './analytics.js';

class CameraManager {
    constructor() {
        this.video = document.getElementById('cameraVideo');
        this.canvas = document.getElementById('cameraCanvas');
        this.qrScanner = null;
        this.stream = null;
        this.isScanning = false;
        this.scanTimeout = null;
        this.detectionCount = 0;
        this.lastDetectionTime = 0;
        this.isDesktop = !navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
        
        this.initialize();
    }

    async initialize() {
        try {
            // Hide loading screen first
            this.hideLoadingScreen();
            
            // On desktop, start demo mode automatically
            if (this.isDesktop) {
                this.updateStatus('Desktop detected. Starting demo mode...');
                setTimeout(() => {
                    this.startDemoMode();
                }, 1000);
                return;
            }
            
            await this.requestCameraAccess();
            this.setupQRScanner();
            this.updateStatus('Camera ready. Point at BeReal billboard...');
            trackEvent('camera_initialized');
        } catch (error) {
            console.error('Camera initialization failed:', error);
            this.showError();
            trackEvent('camera_error', { error: error.message });
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    async requestCameraAccess() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            if (this.video) {
                this.video.srcObject = this.stream;
                await this.video.play();
            }

            trackEvent('camera_access_granted');
            return this.stream;
        } catch (error) {
            console.error('Camera access denied:', error);
            throw error;
        }
    }

    setupQRScanner() {
        if (!this.video) return;

        this.qrScanner = new QrScanner(
            this.video,
            (result) => {
                this.handleQRDetection(result);
            },
            {
                returnDetailedScanResult: true,
                highlightScanRegion: false,
                highlightCodeOutline: false,
                overlay: null
            }
        );

        this.qrScanner.start();
        this.isScanning = true;
    }

    handleQRDetection(result) {
        const now = Date.now();
        
        // Prevent multiple rapid detections
        if (now - this.lastDetectionTime < 1000) {
            return;
        }

        this.lastDetectionTime = now;
        this.detectionCount++;

        console.log('QR Code detected:', result.data);
        trackEvent('qr_code_detected', { 
            data: result.data,
            detectionCount: this.detectionCount 
        });

        // Check if it's our reveal URL
        if (result.data.includes('/reveal') || result.data.includes('bereal')) {
            this.triggerReveal();
        } else {
            // Simulate billboard detection for demo purposes
            this.simulateBillboardDetection();
        }
    }

    simulateBillboardDetection() {
        // For demo purposes, simulate billboard detection after a few QR scans
        if (this.detectionCount >= 2) {
            this.triggerReveal();
        } else {
            this.updateStatus(`QR detected (${this.detectionCount}/2). Keep scanning...`);
        }
    }

    triggerReveal() {
        if (this.scanTimeout) {
            clearTimeout(this.scanTimeout);
        }

        this.updateStatus('Billboard detected! Starting reveal...');
        trackEvent('reveal_triggered');

        // Stop scanning
        this.stopScanning();

        // Trigger reveal after a short delay
        this.scanTimeout = setTimeout(() => {
            this.startReveal();
        }, 1000);
    }

    startReveal() {
        // Keep camera visible for AR effect
        const cameraSection = document.getElementById('cameraSection');
        if (cameraSection) {
            // Don't hide camera - keep it as background
            cameraSection.style.zIndex = '1';
        }

        // Show reveal section as overlay
        const revealSection = document.getElementById('revealSection');
        if (revealSection) {
            revealSection.classList.remove('hidden');
            revealSection.style.zIndex = '10';
        }

        // Initialize reveal animation
        if (window.revealManager) {
            window.revealManager.startReveal();
        }
    }

    stopScanning() {
        if (this.qrScanner) {
            this.qrScanner.stop();
            this.isScanning = false;
        }
    }

    toggleCamera() {
        if (this.isScanning) {
            this.stopScanning();
            this.updateStatus('Camera paused');
        } else {
            this.qrScanner?.start();
            this.isScanning = true;
            this.updateStatus('Camera active. Point at BeReal billboard...');
        }
    }

    resetExperience() {
        // Reset detection state
        this.detectionCount = 0;
        this.lastDetectionTime = 0;

        if (this.scanTimeout) {
            clearTimeout(this.scanTimeout);
        }

        // Show camera section
        const cameraSection = document.getElementById('cameraSection');
        if (cameraSection) {
            cameraSection.style.display = 'block';
        }

        // Hide reveal section
        const revealSection = document.getElementById('revealSection');
        if (revealSection) {
            revealSection.classList.add('hidden');
        }

        // Restart scanning
        if (this.qrScanner && !this.isScanning) {
            this.qrScanner.start();
            this.isScanning = true;
        }

        this.updateStatus('Camera ready. Point at BeReal billboard...');
        trackEvent('experience_reset');
    }

    showError() {
        const loadingScreen = document.getElementById('loadingScreen');
        const errorScreen = document.getElementById('errorScreen');

        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }

        if (errorScreen) {
            errorScreen.classList.remove('hidden');
        }

        this.updateStatus('Camera access required');
    }

    startDemoMode() {
        this.updateStatus('Demo mode: Simulating billboard detection...');
        trackEvent('demo_mode_started');

        // Hide loading screen
        this.hideLoadingScreen();

        // Show camera section with demo overlay
        const cameraSection = document.getElementById('cameraSection');
        if (cameraSection) {
            cameraSection.style.display = 'block';
            
            // Add demo overlay
            const demoOverlay = document.createElement('div');
            demoOverlay.id = 'demoOverlay';
            demoOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
                z-index: 100;
            `;
            demoOverlay.innerHTML = `
                <div>
                    <h2>Demo Mode</h2>
                    <p>Simulating camera experience...</p>
                    <p>Starting reveal in 3 seconds</p>
                </div>
            `;
            cameraSection.appendChild(demoOverlay);
        }

        // Simulate detection after 3 seconds
        setTimeout(() => {
            // Remove demo overlay
            const demoOverlay = document.getElementById('demoOverlay');
            if (demoOverlay) {
                demoOverlay.remove();
            }
            this.triggerReveal();
        }, 3000);
    }

    updateStatus(message) {
        const statusBar = document.getElementById('statusBar');
        if (statusBar) {
            statusBar.querySelector('.status-text').textContent = message;
        }
    }

    destroy() {
        this.stopScanning();
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        if (this.scanTimeout) {
            clearTimeout(this.scanTimeout);
        }
    }
}

// Initialize camera manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cameraManager = new CameraManager();
});

// Global functions for HTML onclick handlers
window.initializeCamera = () => {
    if (window.cameraManager) {
        window.cameraManager.initialize();
    }
};

window.startDemoMode = () => {
    if (window.cameraManager) {
        window.cameraManager.startDemoMode();
    }
};

window.resetExperience = () => {
    if (window.cameraManager) {
        window.cameraManager.reset();
    }
};

window.toggleCamera = () => {
    if (window.cameraManager) {
        window.cameraManager.toggleCamera();
    }
};

window.manualTriggerReveal = () => {
    console.log('Manual reveal trigger activated');
    if (window.revealManager) {
        window.revealManager.startReveal();
    } else {
        console.error('Reveal manager not found');
    }
};

window.openBeReal = () => {
    if (window.revealManager) {
        window.revealManager.openBeReal();
    }
};

// Export for use in other modules
export default CameraManager; 