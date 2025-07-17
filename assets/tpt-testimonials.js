/**
 * Testimonials Section with GSAP Animations
 * Elegant horizontal scrolling with luxury animations
 */

class TestimonialsSection {
  constructor(element) {
    this.element = element;
    this.sectionId = element.dataset.sectionId;
    this.autoPlay = element.dataset.autoPlay === 'true';
    this.playSpeed = parseInt(element.dataset.playSpeed) || 5000;
    this.animationStyle = element.dataset.animationStyle || 'slide';
    
    this.track = element.querySelector('.tpt-testimonials__track');
    this.slides = element.querySelectorAll('.tpt-testimonials__slide');
    this.prevBtn = element.querySelector('.tpt-testimonials__nav--prev');
    this.nextBtn = element.querySelector('.tpt-testimonials__nav--next');
    this.dots = element.querySelectorAll('.tpt-testimonials__dot');
    
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.autoPlayTimer = null;
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    if (this.totalSlides === 0) return;
    
    this.setupGSAP();
    this.bindEvents();
    this.setupAutoPlay();
    this.initializeSlides();
    this.animateOnLoad();
  }
  
  setupGSAP() {
    // Register GSAP plugins if available
    if (typeof gsap !== 'undefined') {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }
      
      // Set initial states
      gsap.set(this.slides, { 
        opacity: this.animationStyle === 'fade' ? 0 : 1,
        scale: this.animationStyle === 'scale' ? 0.8 : 1
      });
      
      // Set first slide as active
      if (this.slides[0]) {
        gsap.set(this.slides[0], { 
          opacity: 1,
          scale: 1
        });
        this.slides[0].classList.add('tpt-testimonials__slide--active');
      }
    }
  }
  
  bindEvents() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.goToPrevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.goToNextSlide());
    }
    
    // Pagination dots
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Keyboard navigation
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.goToNextSlide();
      }
    });
    
    // Touch/swipe support
    this.setupTouchEvents();
    
    // Pause autoplay on hover
    this.element.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.element.addEventListener('mouseleave', () => this.resumeAutoPlay());
    
    // Pause autoplay when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoPlay();
      } else {
        this.resumeAutoPlay();
      }
    });
  }
  
  setupTouchEvents() {
    let startX = 0;
    let endX = 0;
    const threshold = 50;
    
    this.element.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    this.element.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.goToNextSlide();
        } else {
          this.goToPrevSlide();
        }
      }
    }, { passive: true });
  }
  
  initializeSlides() {
    // Update ARIA attributes
    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== this.currentSlide);
      slide.setAttribute('tabindex', index === this.currentSlide ? '0' : '-1');
    });
    
    this.updatePagination();
  }
  
  goToSlide(index, direction = 'auto') {
    if (this.isAnimating || index === this.currentSlide || index < 0 || index >= this.totalSlides) {
      return;
    }
    
    this.isAnimating = true;
    const previousSlide = this.currentSlide;
    this.currentSlide = index;
    
    // Determine animation direction if not specified
    if (direction === 'auto') {
      direction = index > previousSlide ? 'next' : 'prev';
    }
    
    this.animateSlideTransition(previousSlide, this.currentSlide, direction)
      .then(() => {
        this.isAnimating = false;
        this.updateSlideStates();
        this.updatePagination();
        this.resetAutoPlay();
      });
  }
  
  goToNextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex, 'next');
  }
  
  goToPrevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(prevIndex, 'prev');
  }
  
  animateSlideTransition(fromIndex, toIndex, direction) {
    return new Promise((resolve) => {
      if (typeof gsap === 'undefined') {
        // Fallback for when GSAP is not available
        this.track.style.transform = `translateX(-${toIndex * 100}%)`;
        setTimeout(resolve, 500);
        return;
      }
      
      const fromSlide = this.slides[fromIndex];
      const toSlide = this.slides[toIndex];
      const timeline = gsap.timeline({
        onComplete: resolve
      });
      
      // Remove active class from previous slide
      fromSlide.classList.remove('tpt-testimonials__slide--active');
      
      switch (this.animationStyle) {
        case 'fade':
          this.animateFade(timeline, fromSlide, toSlide);
          break;
        case 'scale':
          this.animateScale(timeline, fromSlide, toSlide);
          break;
        default:
          this.animateSlide(timeline, fromIndex, toIndex, direction);
          break;
      }
      
      // Add active class to new slide
      toSlide.classList.add('tpt-testimonials__slide--active');
    });
  }
  
  animateFade(timeline, fromSlide, toSlide) {
    timeline
      .to(fromSlide, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      })
      .fromTo(toSlide, 
        { opacity: 0, scale: 0.95 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, 
        "-=0.2"
      );
  }
  
  animateScale(timeline, fromSlide, toSlide) {
    timeline
      .to(fromSlide, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.in"
      })
      .fromTo(toSlide,
        { opacity: 0, scale: 1.2 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)"
        },
        "-=0.2"
      );
  }
  
  animateSlide(timeline, fromIndex, toIndex, direction) {
    const translateX = -toIndex * 100;
    
    timeline.to(this.track, {
      x: `${translateX}%`,
      duration: 0.8,
      ease: "power2.inOut"
    });
    
    // Animate card elements
    const toCard = this.slides[toIndex].querySelector('.tpt-testimonial__card');
    const elements = [
      toCard.querySelector('.tpt-testimonial__quote-icon'),
      toCard.querySelector('.tpt-testimonial__content'),
      toCard.querySelector('.tpt-testimonial__rating'),
      toCard.querySelector('.tpt-testimonial__customer')
    ].filter(el => el);
    
    // Stagger animation for card elements
    timeline.fromTo(elements,
      { 
        opacity: 0, 
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      },
      "-=0.4"
    );
  }
  
  updateSlideStates() {
    this.slides.forEach((slide, index) => {
      const isActive = index === this.currentSlide;
      slide.setAttribute('aria-hidden', !isActive);
      slide.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }
  
  updatePagination() {
    this.dots.forEach((dot, index) => {
      const isActive = index === this.currentSlide;
      dot.classList.toggle('tpt-testimonials__dot--active', isActive);
      dot.setAttribute('aria-pressed', isActive);
    });
  }
  
  setupAutoPlay() {
    if (!this.autoPlay || this.totalSlides <= 1) return;
    
    this.autoPlayTimer = setInterval(() => {
      this.goToNextSlide();
    }, this.playSpeed);
  }
  
  pauseAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }
  
  resumeAutoPlay() {
    if (this.autoPlay && !this.autoPlayTimer && this.totalSlides > 1) {
      this.setupAutoPlay();
    }
  }
  
  resetAutoPlay() {
    this.pauseAutoPlay();
    this.resumeAutoPlay();
  }
  
  animateOnLoad() {
    if (typeof gsap === 'undefined') return;
    
    // Animate section entrance
    const timeline = gsap.timeline();
    
    // Animate the first card on load
    const firstCard = this.slides[0]?.querySelector('.tpt-testimonial__card');
    if (firstCard) {
      const elements = [
        firstCard.querySelector('.tpt-testimonial__quote-icon'),
        firstCard.querySelector('.tpt-testimonial__content'),
        firstCard.querySelector('.tpt-testimonial__rating'),
        firstCard.querySelector('.tpt-testimonial__customer')
      ].filter(el => el);
      
      timeline
        .fromTo(firstCard,
          { 
            opacity: 0, 
            y: 50,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out"
          }
        )
        .fromTo(elements,
          { 
            opacity: 0, 
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out"
          },
          "-=0.4"
        );
    }
    
    // Animate navigation and pagination
    timeline
      .fromTo([this.prevBtn, this.nextBtn],
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)"
        },
        "-=0.3"
      )
      .fromTo(this.dots,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out"
        },
        "-=0.2"
      );
  }
  
  // Public API
  destroy() {
    this.pauseAutoPlay();
    // Remove event listeners and cleanup
    if (this.prevBtn) {
      this.prevBtn.removeEventListener('click', this.goToPrevSlide);
    }
    if (this.nextBtn) {
      this.nextBtn.removeEventListener('click', this.goToNextSlide);
    }
  }
}

// Initialize testimonials sections
document.addEventListener('DOMContentLoaded', () => {
  const testimonialsElements = document.querySelectorAll('.tpt-testimonials');
  const instances = [];
  
  testimonialsElements.forEach(element => {
    instances.push(new TestimonialsSection(element));
  });
  
  // Store instances globally for potential external access
  window.testimonialsInstances = instances;
});

// Handle theme editor updates
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const testimonialsElement = event.target.querySelector('.tpt-testimonials');
    if (testimonialsElement) {
      new TestimonialsSection(testimonialsElement);
    }
  });
  
  document.addEventListener('shopify:section:unload', (event) => {
    const testimonialsElement = event.target.querySelector('.tpt-testimonials');
    if (testimonialsElement && window.testimonialsInstances) {
      const instance = window.testimonialsInstances.find(inst => 
        inst.element === testimonialsElement
      );
      if (instance) {
        instance.destroy();
        window.testimonialsInstances = window.testimonialsInstances.filter(
          inst => inst !== instance
        );
      }
    }
  });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestimonialsSection;
}
