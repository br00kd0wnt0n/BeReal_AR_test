// Admin Dashboard for BeReal AR Billboard Prototype
class AdminManager {
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

        this.currentEditingId = null;
        this.initialize();
    }

    initialize() {
        this.loadContent();
        this.loadAnalytics();
        this.loadSettings();
        this.setupEventListeners();
    }

    loadContent() {
        const contentGrid = document.getElementById('contentGrid');
        if (!contentGrid) return;

        contentGrid.innerHTML = '';

        this.authenticMoments.forEach((moment) => {
            const card = this.createContentCard(moment);
            contentGrid.appendChild(card);
        });
    }

    createContentCard(moment) {
        const card = document.createElement('div');
        card.className = 'content-card';
        
        card.innerHTML = `
            <div class="content-preview" style="background: ${moment.background}">
                <div>
                    <div style="font-size: 1.2rem; margin-bottom: 5px;">${moment.title}</div>
                    <div style="font-size: 0.8rem; opacity: 0.9;">${moment.subtitle}</div>
                </div>
            </div>
            <div class="content-info">
                <h3>${moment.title}</h3>
                <p>${moment.subtitle}</p>
                <p style="font-size: 0.8rem; opacity: 0.6;">${moment.description}</p>
            </div>
            <div class="content-actions">
                <button class="content-btn view-btn" onclick="viewContent(${moment.id})">View Page</button>
                <button class="content-btn preview-btn" onclick="previewContent(${moment.id})">Preview</button>
                <button class="content-btn edit-btn" onclick="editContent(${moment.id})">Edit</button>
                <button class="content-btn delete-btn" onclick="deleteContent(${moment.id})">Delete</button>
            </div>
        `;

        return card;
    }

    loadAnalytics() {
        try {
            // Get analytics data from localStorage
            const storedEvents = JSON.parse(localStorage.getItem('bereal_analytics') || '[]');
            
            // Calculate metrics
            const totalViews = storedEvents.filter(e => e.event === 'page_viewed').length;
            const qrScans = storedEvents.filter(e => e.event === 'qr_code_clicked' || e.event === 'qr_code_detected').length;
            const reveals = storedEvents.filter(e => e.event === 'reveal_completed').length;
            const conversions = storedEvents.filter(e => e.event === 'bereal_cta_clicked').length;

            // Update UI
            document.getElementById('totalViews').textContent = totalViews;
            document.getElementById('qrScans').textContent = qrScans;
            document.getElementById('reveals').textContent = reveals;
            document.getElementById('conversions').textContent = conversions;

        } catch (error) {
            console.error('Failed to load analytics:', error);
            // Set default values if analytics fail to load
            document.getElementById('totalViews').textContent = '0';
            document.getElementById('qrScans').textContent = '0';
            document.getElementById('reveals').textContent = '0';
            document.getElementById('conversions').textContent = '0';
        }
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('bereal_settings') || '{}');
            
            document.getElementById('rotationInterval').value = settings.rotationInterval || 30;
            document.getElementById('revealDuration').value = settings.revealDuration || 4;
            document.getElementById('qrSize').value = settings.qrSize || 140;
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    setupEventListeners() {
        const contentForm = document.getElementById('contentForm');
        if (contentForm) {
            contentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveContent();
            });
        }
    }

    editContent(id) {
        const moment = this.authenticMoments.find(m => m.id === id);
        if (!moment) return;

        this.currentEditingId = id;
        
        document.getElementById('modalTitle').textContent = 'Edit Authentic Moment';
        document.getElementById('contentTitle').value = moment.title;
        document.getElementById('contentSubtitle').value = moment.subtitle;
        document.getElementById('contentDescription').value = moment.description;
        document.getElementById('contentBackground').value = moment.background;
        
        this.showModal();
    }

    addNewContent() {
        this.currentEditingId = null;
        
        document.getElementById('modalTitle').textContent = 'Add New Authentic Moment';
        document.getElementById('contentTitle').value = '';
        document.getElementById('contentSubtitle').value = '';
        document.getElementById('contentDescription').value = '';
        document.getElementById('contentBackground').value = 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb)';
        
        this.showModal();
    }

    saveContent() {
        const title = document.getElementById('contentTitle').value;
        const subtitle = document.getElementById('contentSubtitle').value;
        const description = document.getElementById('contentDescription').value;
        const background = document.getElementById('contentBackground').value;

        if (!title || !subtitle || !description) {
            alert('Please fill in all required fields');
            return;
        }

        if (this.currentEditingId) {
            // Edit existing content
            const index = this.authenticMoments.findIndex(m => m.id === this.currentEditingId);
            if (index !== -1) {
                this.authenticMoments[index] = {
                    ...this.authenticMoments[index],
                    title,
                    subtitle,
                    description,
                    background
                };
            }
        } else {
            // Add new content
            const newId = Math.max(...this.authenticMoments.map(m => m.id)) + 1;
            this.authenticMoments.push({
                id: newId,
                title,
                subtitle,
                description,
                background
            });
        }

        // Save to localStorage
        localStorage.setItem('bereal_authentic_moments', JSON.stringify(this.authenticMoments));
        
        // Reload content
        this.loadContent();
        this.closeModal();
        
        // Show success message
        this.showNotification('Content saved successfully!', 'success');
    }

    deleteContent(id) {
        if (!confirm('Are you sure you want to delete this moment?')) return;

        this.authenticMoments = this.authenticMoments.filter(m => m.id !== id);
        localStorage.setItem('bereal_authentic_moments', JSON.stringify(this.authenticMoments));
        
        this.loadContent();
        this.showNotification('Content deleted successfully!', 'success');
    }

    saveSettings() {
        const settings = {
            rotationInterval: parseInt(document.getElementById('rotationInterval').value),
            revealDuration: parseFloat(document.getElementById('revealDuration').value),
            qrSize: parseInt(document.getElementById('qrSize').value)
        };

        localStorage.setItem('bereal_settings', JSON.stringify(settings));
        this.showNotification('Settings saved successfully!', 'success');
    }

    exportAnalytics() {
        try {
            const storedEvents = JSON.parse(localStorage.getItem('bereal_analytics') || '[]');
            const analyticsData = {
                exportDate: new Date().toISOString(),
                totalEvents: storedEvents.length,
                events: storedEvents,
                summary: {
                    totalViews: storedEvents.filter(e => e.event === 'page_viewed').length,
                    qrScans: storedEvents.filter(e => e.event === 'qr_code_clicked' || e.event === 'qr_code_detected').length,
                    reveals: storedEvents.filter(e => e.event === 'reveal_completed').length,
                    conversions: storedEvents.filter(e => e.event === 'bereal_cta_clicked').length
                }
            };
            
            const dataStr = JSON.stringify(analyticsData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `bereal-analytics-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.showNotification('Analytics data exported successfully!', 'success');
        } catch (error) {
            console.error('Failed to export analytics:', error);
            this.showNotification('Failed to export analytics data', 'error');
        }
    }

    showModal() {
        const modal = document.getElementById('contentModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeModal() {
        const modal = document.getElementById('contentModal');
        if (modal) {
            modal.classList.remove('show');
        }
        this.currentEditingId = null;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getActiveContentId() {
        try {
            return parseInt(localStorage.getItem('bereal_active_content_id') || '1');
        } catch (error) {
            return 1;
        }
    }

    setActiveContent(id) {
        this.activeContentId = id;
        localStorage.setItem('bereal_active_content_id', id.toString());
        this.loadContent(); // Refresh the display
        this.showNotification(`Content ${id} is now active on the billboard`, 'success');
        
        // Open billboard in new tab to preview
        setTimeout(() => {
            if (confirm('Would you like to view the billboard to see the changes?')) {
                window.open('/', '_blank');
            }
        }, 1000);
    }

    previewContent(id) {
        const moment = this.authenticMoments.find(m => m.id === id);
        if (!moment) return;

        // Create preview modal
        const previewModal = document.createElement('div');
        previewModal.className = 'modal show';
        previewModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        previewModal.innerHTML = `
            <div style="
                background: ${moment.background};
                width: 80%;
                max-width: 600px;
                height: 400px;
                border-radius: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: white;
                position: relative;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                ">&times;</button>
                
                <div style="font-size: 2.5rem; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                    ${moment.title}
                </div>
                <div style="font-size: 1.5rem; opacity: 0.9; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                    ${moment.subtitle}
                </div>
                <div style="font-size: 1rem; opacity: 0.7; margin-top: 20px; max-width: 400px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                    ${moment.description}
                </div>
                
                <div style="margin-top: 30px;">
                    <button onclick="viewContent(${moment.id}); this.parentElement.parentElement.parentElement.remove();" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 12px 24px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 600;
                        margin-right: 10px;
                    ">View Page</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: transparent;
                        border: 2px solid rgba(255,255,255,0.5);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(previewModal);
    }

    viewContent(id) {
        const moment = this.authenticMoments.find(m => m.id === id);
        if (!moment) return;

        // Open the content page in a new tab
        const contentUrl = `/?content=${id}`;
        console.log('Opening content URL:', contentUrl);
        console.log('Content ID:', id);
        console.log('Content title:', moment.title);
        
        window.open(contentUrl, '_blank');
        this.showNotification(`Opening content page for: ${moment.title}`, 'success');
    }
}

// Global functions for HTML onclick handlers
window.editContent = (id) => {
    if (window.adminManager) {
        window.adminManager.editContent(id);
    }
};

window.deleteContent = (id) => {
    if (window.adminManager) {
        window.adminManager.deleteContent(id);
    }
};

window.viewContent = (id) => {
    if (window.adminManager) {
        window.adminManager.viewContent(id);
    }
};

window.previewContent = (id) => {
    if (window.adminManager) {
        window.adminManager.previewContent(id);
    }
};

window.addNewContent = () => {
    if (window.adminManager) {
        window.adminManager.addNewContent();
    }
};

window.saveSettings = () => {
    if (window.adminManager) {
        window.adminManager.saveSettings();
    }
};

window.exportAnalytics = () => {
    if (window.adminManager) {
        window.adminManager.exportAnalytics();
    }
};

window.closeModal = () => {
    if (window.adminManager) {
        window.adminManager.closeModal();
    }
};

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminManager = new AdminManager();
}); 