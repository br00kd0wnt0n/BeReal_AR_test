import { trackEvent } from './analytics.js';

class BillboardManager {
    constructor() {
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

        this.currentContentIndex = this.getContentIndexFromUrl();
        this.initialize();
    }

    getContentIndexFromUrl() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const contentId = parseInt(urlParams.get('content') || '1');
            const index = this.authenticMoments.findIndex(moment => moment.id === contentId);
            
            console.log('URL content parameter:', urlParams.get('content'));
            console.log('Parsed content ID:', contentId);
            console.log('Found index:', index);
            console.log('Selected content:', this.authenticMoments[index]?.title);
            
            return index >= 0 ? index : 0;
        } catch (error) {
            console.error('Error parsing content from URL:', error);
            return 0;
        }
    }

    initialize() {
        this.updateBillboardContent();
        this.setupEventListeners();
        
        // Track page view
        trackEvent('billboard_viewed');
    }

    setupEventListeners() {
        // QR code click event
        const qrCode = document.getElementById('qrCode');
        if (qrCode) {
            qrCode.addEventListener('click', () => {
                trackEvent('qr_code_clicked');
                window.location.href = '/reveal.html';
            });
        }

        // Testing buttons
        this.setupTestingButtons();
    }

    setupTestingButtons() {
        const testButtons = document.querySelectorAll('.test-btn');
        
        testButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const contentId = parseInt(e.target.dataset.content);
                this.switchToContent(contentId);
                
                // Update active button state
                testButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                trackEvent('test_content_switched', { contentId });
            });
        });

        // Set initial active button
        const currentContentId = this.authenticMoments[this.currentContentIndex].id;
        const activeButton = document.querySelector(`[data-content="${currentContentId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    switchToContent(contentId) {
        const index = this.authenticMoments.findIndex(moment => moment.id === contentId);
        if (index >= 0) {
            this.currentContentIndex = index;
            this.updateBillboardContent();
            
            // Update URL without page reload
            const url = new URL(window.location);
            url.searchParams.set('content', contentId);
            window.history.pushState({}, '', url);
            
            console.log(`Switched to content ${contentId}: ${this.authenticMoments[index].title}`);
        }
    }

    updateBillboardContent() {
        const content = this.authenticMoments[this.currentContentIndex];
        const contentArea = document.getElementById('contentArea');
        const authenticMoment = document.getElementById('authenticMoment');

        if (contentArea && authenticMoment) {
            // Update background
            contentArea.style.background = content.background;
            
            // Update content
            authenticMoment.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        ${content.title}
                    </div>
                    <div style="font-size: 1.5rem; opacity: 0.9; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                        ${content.subtitle}
                    </div>
                    <div style="font-size: 1rem; opacity: 0.7; margin-top: 20px; max-width: 400px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                        ${content.description}
                    </div>
                </div>
            `;
        }
    }

    getCurrentContent() {
        return this.authenticMoments[this.currentContentIndex];
    }

    getAllContent() {
        return this.authenticMoments;
    }
}

// Initialize billboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.billboardManager = new BillboardManager();
});

// Export for use in other modules
export default BillboardManager; 