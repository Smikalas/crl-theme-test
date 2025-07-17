/**
 * Scroll Video Component
 * Handles video playback based on scroll position using GSAP ScrollTrigger
 */

class ScrollVideoComponent {
  constructor(videoElement, options = {}) {
    this.video = videoElement;
    this.container = videoElement.closest('.scroll-video-container');
    this.options = {
      scrubSmoothness: 1,
      speedBasedPlayback: false,
      mobileTouch: true,
      showProgress: true,
      ...options
    };
    
    this.isVideoReady = false;
    this.videoDuration = 0;
    this.scrollSpeed = 0;
    this.lastScrollY = window.scrollY;
    
    this.init();
  }

  init() {
    if (!this.video || !this.container) return;

    this.setupVideo();
    this.setupScrollTrigger();
    this.setupEventListeners();
  }

  setupVideo() {
    this.video.addEventListener('loadedmetadata', () => {
      this.isVideoReady = true;
      this.videoDuration = this.video.duration;
      this.initScrollTrigger();
    });

    // Force load metadata if already loaded
    if (this.video.readyState >= 1) {
      this.isVideoReady = true;
      this.videoDuration = this.video.duration;
      this.initScrollTrigger();
    }

    // Ensure video is muted for autoplay
    this.video.muted = true;
    this.video.playsInline = true;
  }

  initScrollTrigger() {
    if (!this.isVideoReady || typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Main scroll trigger for video playback
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.container,
      start: "top bottom",
      end: "bottom top",
      scrub: this.options.scrubSmoothness,
      onUpdate: (self) => this.handleScrollUpdate(self),
      onToggle: (self) => this.handleScrollToggle(self)
    });

    // Animate content elements
    this.animateContent();

    // Setup scroll speed tracking
    if (this.options.speedBasedPlayback) {
      this.setupScrollSpeedTracking();
    }
  }

  handleScrollUpdate(self) {
    if (!this.isVideoReady || this.videoDuration <= 0) return;

    const progress = self.progress;
    const targetTime = progress * this.videoDuration;

    // Only update if the difference is significant to avoid jitter
    if (Math.abs(this.video.currentTime - targetTime) > 0.1) {
      this.video.currentTime = targetTime;
    }

    // Update progress bar
    this.updateProgressBar(progress);

    // Handle video playback
    if (self.isActive && this.video.paused) {
      this.playVideo();
    }
  }

  handleScrollToggle(self) {
    if (!self.isActive) {
      this.video.pause();
    }
  }

  updateProgressBar(progress) {
    if (!this.options.showProgress) return;
    
    const progressBar = this.container.querySelector('.scroll-progress-bar');
    if (progressBar) {
      progressBar.style.width = (progress * 100) + '%';
    }
  }

  playVideo() {
    this.video.play().catch(error => {
      console.log('Video play prevented:', error);
      // Handle autoplay restrictions
      this.handleAutoplayRestriction();
    });
  }

  handleAutoplayRestriction() {
    // Create a user interaction prompt if needed
    const interactionPrompt = document.createElement('div');
    interactionPrompt.className = 'video-interaction-prompt';
    interactionPrompt.innerHTML = `
      <button class="video-play-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        Click to enable video
      </button>
    `;
    interactionPrompt.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 10;
      text-align: center;
    `;

    const playButton = interactionPrompt.querySelector('.video-play-button');
    playButton.style.cssText = `
      background: none;
      border: 2px solid white;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    playButton.addEventListener('click', () => {
      this.video.play();
      interactionPrompt.remove();
    });

    this.container.appendChild(interactionPrompt);
  }

  animateContent() {
    const title = this.container.querySelector('.scroll-video-title');
    const description = this.container.querySelector('.scroll-video-description');

    if (title) {
      gsap.to(title, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: this.container,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse"
        }
      });
    }

    if (description) {
      gsap.to(description, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: this.container,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse"
        }
      });
    }
  }

  setupScrollSpeedTracking() {
    this.updateScrollSpeed = () => {
      const currentScrollY = window.scrollY;
      this.scrollSpeed = Math.abs(currentScrollY - this.lastScrollY);
      this.lastScrollY = currentScrollY;
      
      // Adjust video playback rate based on scroll speed
      if (!this.video.paused) {
        const minRate = 0.5;
        const maxRate = 2.0;
        const rate = Math.min(maxRate, Math.max(minRate, this.scrollSpeed / 10));
        this.video.playbackRate = rate;
      }
    };

    gsap.ticker.add(this.updateScrollSpeed);
  }

  setupEventListeners() {
    // Handle video loading error
    this.video.addEventListener('error', () => {
      console.error('Video failed to load');
      this.showErrorState();
    });

    // Reset playback rate when video ends
    this.video.addEventListener('ended', () => {
      this.video.playbackRate = 1;
    });

    // Handle mobile touch scrolling
    if (this.options.mobileTouch) {
      this.setupMobileTouch();
    }

    // Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  }

  setupMobileTouch() {
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
      touchEndY = e.touches[0].clientY;
      const touchDiff = Math.abs(touchStartY - touchEndY);
      
      if (touchDiff > 10) {
        ScrollTrigger.refresh();
      }
    });
  }

  showErrorState() {
    const errorElement = document.createElement('div');
    errorElement.className = 'video-error-state';
    errorElement.innerHTML = `
      <div style="text-align: center; color: #666; padding: 40px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="margin-bottom: 16px;">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <p>Video could not be loaded</p>
      </div>
    `;
    
    this.container.appendChild(errorElement);
  }

  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    
    // Remove scroll speed tracking if it exists
    if (this.updateScrollSpeed && typeof gsap !== 'undefined') {
      gsap.ticker.remove(this.updateScrollSpeed);
    }
  }
}

// Auto-initialize scroll video components
document.addEventListener('DOMContentLoaded', () => {
  // Wait for GSAP to load
  const initScrollVideos = () => {
    if (typeof gsap === 'undefined') {
      setTimeout(initScrollVideos, 100);
      return;
    }

    const scrollVideos = document.querySelectorAll('[id^="scroll-video-"]');
    scrollVideos.forEach(video => {
      new ScrollVideoComponent(video);
    });
  };

  initScrollVideos();
});

// Handle Shopify section reloads
document.addEventListener('shopify:section:load', () => {
  ScrollTrigger.refresh();
});

// Export for use in other scripts
window.ScrollVideoComponent = ScrollVideoComponent;
