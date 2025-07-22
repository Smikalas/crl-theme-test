/* Video scroll animation using GSAP ScrollTrigger
 * Handles smooth video scrubbing on scroll
 */

class VideoScroll {
  constructor(videoSelector) {
    this.video = document.querySelector(videoSelector);
    if (!this.video) return;
    
    this.src = this.video.currentSrc || this.video.src;
    this.init();
  }

  once(el, event, fn, opts) {
    const onceFn = (e) => {
      el.removeEventListener(event, onceFn);
      fn.apply(this, arguments);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
  }

  initIOSVideo() {
    this.once(document.documentElement, "touchstart", () => {
      this.video.play();
      this.video.pause();
    });
  }

  initScrollAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: "#videoscrolls",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    this.once(this.video, "loadedmetadata", () => {
      tl.fromTo(
        this.video,
        {
          currentTime: 0
        },
        {
          currentTime: this.video.duration || 1
        }
      );
    });
  }

  initVideoBuffer() {
    if (!window.fetch) return;

    setTimeout(() => {
      fetch(this.src)
        .then((response) => response.blob())
        .then((response) => {
          const blobURL = URL.createObjectURL(response);
          const currentTime = this.video.currentTime;
          
          this.initIOSVideo();
          this.video.setAttribute("src", blobURL);
          this.video.currentTime = currentTime + 0.01;
        });
    }, 1000);
  }

  init() {
    this.initIOSVideo();
    this.initScrollAnimation();
    this.initVideoBuffer();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new VideoScroll('.video-scroll');
});
