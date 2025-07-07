import { trackEvent } from './analytics.js';

class RevealManager {
    constructor() {
        this.authenticMomentReveal = document.getElementById('authenticMomentReveal');
        this.clarityWave = document.getElementById('clarityWave');
        this.particleSystem = document.getElementById('particleSystem');
        this.ctaOverlay = document.getElementById('ctaOverlay');
        this.isRevealing = false;
        this.currentContentIndex = 0;
        
        this.authenticMoments = [
            {
                id: 1,
                background: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb)',
                title: '✨ Authentic Moment ✨',
                subtitle: 'Real friendship, unfiltered',
                description: 'When you\'re ready to be real, everything becomes clear'
            },
            {
                id: 2,
                background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
                title: '💝 Genuine Connection',
                subtitle: 'Study stress, shared together',
                description: 'Real moments happen when you least expect them'
            },
            {
                id: 3,
                background: 'linear-gradient(135deg, #d299c2, #fef9d7)',
                title: '🌅 Morning Reality',
                subtitle: 'Bedhead and coffee, beautifully real',
                description: 'Authenticity is the most beautiful filter'
            },
            {
                id: 4,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                title: '🎉 Celebration Truth',
                subtitle: 'Real joy, real friends',
                description: 'The best moments are the unplanned ones'
            },
            {
                id: 5,
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                title: '💕 Love in Reality',
                subtitle: 'Imperfectly perfect together',
                description: 'Real love doesn\'t need filters'
            }
        ];

        this.initialize();
    }

    initialize() {
        this.loadContent();
        this.updateStatus('Reveal experience ready...');
        trackEvent('reveal_page_loaded');
    }

    loadContent() {
        // Get content from URL params or use default
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = urlParams.get('content') || 1;
        this.currentContentIndex = (contentId - 1) % this.authenticMoments.length;
        
        this.updateContent();
    }

    updateContent() {
        const content = this.authenticMoments[this.currentContentIndex];
        
        if (this.authenticMomentReveal) {
            this.authenticMomentReveal.style.background = content.background;
            this.authenticMomentReveal.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center;">
                    <div style="font-size: 3.5rem; margin-bottom: 25px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        ${content.title}
                    </div>
                    <div style="font-size: 2rem; opacity: 0.9; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                        ${content.subtitle}
                    </div>
                    <div style="font-size: 1.2rem; opacity: 0.7; margin-top: 30px; max-width: 500px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                        ${content.description}
                    </div>
                </div>
            `;
        }
    }

    startReveal() {
        if (this.isRevealing) return;
        
        this.isRevealing = true;
        this.updateStatus('Revealing authentic moment...');
        trackEvent('reveal_animation_started');

        // Start progressive blur removal
        this.startProgressiveReveal();
        
        // Start clarity wave effect
        this.startClarityWave();
        
        // Start particle effects
        this.startParticleEffects();
        
        // Show CTA after reveal completes
        setTimeout(() => {
            this.showCTA();
        }, 4500);
    }

    startProgressiveReveal() {
        if (!this.authenticMomentReveal) return;

        const revealSteps = [
            { blur: 25, brightness: 0.7, duration: 1000 },
            { blur: 18, brightness: 0.8, duration: 1000 },
            { blur: 12, brightness: 0.9, duration: 1000 },
            { blur: 6, brightness: 0.95, duration: 1000 },
            { blur: 0, brightness: 1, duration: 1000 }
        ];

        let currentStep = 0;

        const animateStep = () => {
            if (currentStep >= revealSteps.length) {
                this.authenticMomentReveal.classList.add('revealed');
                return;
            }

            const step = revealSteps[currentStep];
            this.authenticMomentReveal.style.filter = `blur(${step.blur}px) brightness(${step.brightness})`;
            this.authenticMomentReveal.style.transition = `filter ${step.duration}ms ease-out`;

            currentStep++;
            setTimeout(animateStep, step.duration);
        };

        animateStep();
    }

    startClarityWave() {
        if (!this.clarityWave) return;

        // Create multiple wave layers
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const wave = this.clarityWave.cloneNode(true);
                wave.style.animationDelay = `${i * 0.5}s`;
                this.clarityWave.parentNode.appendChild(wave);
                
                // Remove wave after animation
                setTimeout(() => {
                    wave.remove();
                }, 4000);
            }, i * 500);
        }
    }

    startParticleEffects() {
        if (!this.particleSystem) return;

        // Create particles for 4 seconds
        const particleInterval = setInterval(() => {
            this.createParticle();
        }, 100);

        setTimeout(() => {
            clearInterval(particleInterval);
        }, 4000);
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (2 + Math.random() * 2) + 's';
        
        this.particleSystem.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 4000);
    }

    showCTA() {
        if (!this.ctaOverlay) return;

        this.ctaOverlay.classList.add('visible');
        this.updateStatus('Moment revealed! Ready to capture your own authentic reality?');
        trackEvent('reveal_completed');
    }

    updateStatus(message) {
        const statusBar = document.getElementById('statusBar');
        if (statusBar) {
            statusBar.querySelector('.status-text').textContent = message;
        }
    }

    openBeReal() {
        trackEvent('bereal_cta_clicked');
        this.updateStatus('Opening BeReal app...');
        
        // Simulate app opening
        setTimeout(() => {
            this.updateStatus('BeReal camera opened! Take your first authentic dual-camera photo...');
        }, 1000);
        
        setTimeout(() => {
            this.updateStatus('First BeReal captured! Welcome to authentic social connection. 📸');
        }, 3000);
    }

    changeContent() {
        this.currentContentIndex = (this.currentContentIndex + 1) % this.authenticMoments.length;
        this.updateContent();
        trackEvent('reveal_content_changed', { contentId: this.authenticMoments[this.currentContentIndex].id });
    }

    resetReveal() {
        this.isRevealing = false;
        
        if (this.authenticMomentReveal) {
            this.authenticMomentReveal.classList.remove('revealed');
            this.authenticMomentReveal.style.filter = 'blur(25px) brightness(0.7)';
        }
        
        if (this.ctaOverlay) {
            this.ctaOverlay.classList.remove('visible');
        }
        
        // Clear particles
        if (this.particleSystem) {
            this.particleSystem.innerHTML = '';
        }
        
        this.updateStatus('Reveal experience ready...');
    }
}

// Initialize reveal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.revealManager = new RevealManager();
});

// Global functions for HTML onclick handlers
window.openBeReal = function() {
    if (window.revealManager) {
        window.revealManager.openBeReal();
    }
};

// Export for use in other modules
export default RevealManager; 