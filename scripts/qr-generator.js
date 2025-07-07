import QRCode from 'qrcode';

class QRGenerator {
    constructor() {
        this.currentQR = null;
        this.qrContainer = document.getElementById('qrCode');
        this.revealUrl = this.getRevealUrl();
    }

    getRevealUrl() {
        const currentUrl = window.location.origin;
        return `${currentUrl}/reveal.html`;
    }

    async generateQR() {
        try {
            if (this.qrContainer) {
                // Clear existing QR code
                this.qrContainer.innerHTML = '';
                
                // Generate new QR code
                const qrDataURL = await QRCode.toDataURL(this.revealUrl, {
                    width: 120,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    },
                    errorCorrectionLevel: 'M'
                });

                // Create QR code image
                const qrImage = document.createElement('img');
                qrImage.src = qrDataURL;
                qrImage.alt = 'Scan to reveal reality';
                qrImage.style.width = '100%';
                qrImage.style.height = '100%';
                qrImage.style.borderRadius = '12px';
                qrImage.style.cursor = 'pointer';
                qrImage.style.transition = 'transform 0.2s ease';

                // Make QR code clickable for testing
                qrImage.onclick = () => {
                    console.log('QR Code clicked - navigating to reveal page');
                    window.location.href = this.revealUrl;
                };

                // Add hover effect
                qrImage.onmouseenter = () => {
                    qrImage.style.transform = 'scale(1.05)';
                };
                qrImage.onmouseleave = () => {
                    qrImage.style.transform = 'scale(1)';
                };

                this.qrContainer.appendChild(qrImage);
                this.currentQR = qrDataURL;

                console.log('QR Code generated successfully:', this.revealUrl);
                return qrDataURL;
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showFallbackQR();
        }
    }

    showFallbackQR() {
        if (this.qrContainer) {
            this.qrContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #333; font-size: 0.8rem; text-align: center; cursor: pointer; transition: transform 0.2s ease;" onclick="window.location.href='${this.revealUrl}'">
                    <div style="font-size: 2rem; margin-bottom: 8px;">📱</div>
                    <div>QR Code</div>
                    <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 4px;">Click to reveal</div>
                </div>
            `;
            
            // Add hover effect
            const qrDiv = this.qrContainer.querySelector('div');
            qrDiv.onmouseenter = () => {
                qrDiv.style.transform = 'scale(1.05)';
            };
            qrDiv.onmouseleave = () => {
                qrDiv.style.transform = 'scale(1)';
            };
        }
    }

    getQRData() {
        return {
            url: this.revealUrl,
            qrDataURL: this.currentQR
        };
    }
}

// Initialize QR generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.qrGenerator = new QRGenerator();
    window.qrGenerator.generateQR();
});

// Export for use in other modules
export default QRGenerator; 