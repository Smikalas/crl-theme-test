document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.header-logo__image');
  if (!logo) return;

  // Initial transform origin setup
  gsap.set(logo, {
    transformOrigin: "center center"
  });

  // Create hover animation
  logo.addEventListener('mouseenter', () => {
    gsap.to(logo, {
      duration: 0.3,
      rotationY: 360,
      ease: "power2.inOut"
    });
  });

  logo.addEventListener('mouseleave', () => {
    gsap.to(logo, {
      duration: 0.6,
      rotationY: 0,
      ease: "power2.inOut"
    });
  });
});
