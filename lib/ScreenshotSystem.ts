"use client";

/**
 * ScreenshotSystem - Capture, share, and download simulation states
 * Uses dynamic import for html2canvas to prevent build errors
 */
export class ScreenshotSystem {
    private html2canvas: any = null;

    private async loadHtml2Canvas() {
        if (!this.html2canvas) {
            try {
                // Dynamic import with ignore for build if not installed
                const module = await import('html2canvas' as any);
                this.html2canvas = module.default;
            } catch (e) {
                console.warn('html2canvas not available, using fallback');
                return null;
            }
        }
        return this.html2canvas;
    }

    async captureCurrentState(includeUI: boolean = true): Promise<Blob | null> {
        try {
            const html2canvas = await this.loadHtml2Canvas();

            if (!html2canvas) {
                // Fallback: Use native canvas API for basic capture
                return this.fallbackCapture();
            }

            // Hide UI elements if requested
            const uiElements = document.querySelectorAll('.ui-overlay, .screenshot-hide');
            if (!includeUI) {
                uiElements.forEach(el => {
                    (el as HTMLElement).style.visibility = 'hidden';
                });
            }

            // Capture the main container
            const target = document.querySelector('#simulation-root') || document.body;

            const canvas = await html2canvas(target as HTMLElement, {
                backgroundColor: '#000000',
                scale: 2, // High quality
                logging: false,
                useCORS: true,
                allowTaint: true,
                ignoreElements: (element: Element) => {
                    return element.classList.contains('screenshot-ignore');
                }
            });

            // Restore UI
            if (!includeUI) {
                uiElements.forEach(el => {
                    (el as HTMLElement).style.visibility = '';
                });
            }

            return new Promise((resolve) => {
                canvas.toBlob((blob: Blob | null) => resolve(blob), 'image/png', 1.0);
            });
        } catch (error) {
            console.error('Screenshot capture failed:', error);
            return null;
        }
    }

    private async fallbackCapture(): Promise<Blob | null> {
        // Simple fallback using a canvas element
        try {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#00ffff';
                ctx.font = '24px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('📸 Screenshot feature loading...', canvas.width / 2, canvas.height / 2);
                ctx.fillText('Please install html2canvas: npm install html2canvas', canvas.width / 2, canvas.height / 2 + 40);
            }

            return new Promise((resolve) => {
                canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
            });
        } catch (e) {
            return null;
        }
    }

    async shareOnSocial(blob: Blob, caption: string = 'Check out this geopolitical simulation! #Phoenix'): Promise<boolean> {
        try {
            const file = new File([blob], 'phoenix.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Phoenix Simulation',
                    text: caption,
                    files: [file]
                });
                return true;
            } else {
                // Fallback: Copy to clipboard
                await this.copyToClipboard(blob);
                return true;
            }
        } catch (error) {
            console.error('Share failed:', error);
            return false;
        }
    }

    async copyToClipboard(blob: Blob): Promise<boolean> {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            return true;
        } catch (error) {
            console.error('Clipboard copy failed:', error);
            return false;
        }
    }

    downloadImage(blob: Blob, filename: string = 'phoenix.png') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    generateShareableState(currentState: {
        scenario?: string;
        stability: number;
        timestamp?: number;
    }): string {
        try {
            const encoded = btoa(JSON.stringify({
                scenario: currentState.scenario || 'custom',
                stability: Math.round(currentState.stability),
                timestamp: currentState.timestamp || Date.now()
            }));

            return `${window.location.origin}?state=${encoded}`;
        } catch (error) {
            console.error('State encoding failed:', error);
            return window.location.href;
        }
    }

    parseSharedState(url: string): { scenario: string; stability: number; timestamp: number } | null {
        try {
            const urlParams = new URLSearchParams(new URL(url).search);
            const stateParam = urlParams.get('state');

            if (stateParam) {
                return JSON.parse(atob(stateParam));
            }
        } catch (error) {
            console.error('State parsing failed:', error);
        }
        return null;
    }
}

export const screenshotSystem = new ScreenshotSystem();
