/**
 * demo.js
 *
 * Licensed under the MIT license.
 * https://opensource.org/license/mit/
 * 
 * Copyright 2023, WANNABEDEV
 * https://wannabedev.io
 */

 const initWannabeGallery = () => {
  const grid = document.querySelector('.grid');
  const masonry = new Masonry(grid, {
    itemSelector: '.masonry__item',
    resize: true
  });

  imagesLoaded(grid).on('progress', () => {
    masonry.layout();
  }).on('done', () => {
    document.querySelector('.loader').classList.add('is-loaded');
  });

  var width = window.innerWidth;
  window.addEventListener('resize', function() {
    if (this.innerWidth !== width) {
      window.location.reload();
    }
  });

  const scrollTime = 0.8;
  const scrollDistance = 240;
  const windowScrollTop = () => window.scrollTop || document.documentElement.scrollTop;

  window.addEventListener('wheel touchmove', (event) => {
    event.preventDefault();
    const delta = event.originalEvent.wheelDelta / 120 || -event.originalEvent.detail / 3;
    const scrollTop = windowScrollTop();
    const finalScroll = scrollTop - parseInt(delta * scrollDistance);

    gsap.to(window, {
      duration: scrollTime,
      scrollTo: { y: finalScroll, autoKill: true },
      ease: 'power4.out',
      autoKill: true,
      overwrite: 5
    });
  });

  const timelineItems = document.querySelectorAll('.masonry__item');
  timelineItems.forEach((item) => {
    const timeline = gsap.timeline().timeScale(6);
    const background = item.querySelector('.background');
    const h2 = item.querySelector('h2');
    const detail = item.querySelector('.detail');
    const overlay = document.querySelector('.close-detail-view');

    timeline.fromTo(item, { autoAlpha: 0.15 }, { autoAlpha: 1, duration: 0.35, ease: 'power4.inOut' })
      .set(item, { className: '+=active', duration: 0.35 })
      .to('.masonry__item', { scale: 0.95, opacity: 0.05, duration: 1.25, transformOrigin:'50% 50%', ease: 'power4.inOut', stagger: 0.025 }, '-=0.35')
      .fromTo(background, { autoAlpha: 0.35, rotation: -5, scale: 1.5 }, { autoAlpha: 0.65, rotation: 0, scale: 1.75, duration: 0.35, ease: 'power4.inOut' }, '-=0.35')
      .to(item, { zIndex: 15, rotation: 5, scale: 1.35, duration: 1.25, transformOrigin:'50% 50%', ease: Back.easeOut.config(3.7) })
      .fromTo(h2, { autoAlpha: 0.15, rotation: 0 }, { autoAlpha: 1, rotation: 0, duration: 0.35, ease: 'power4.inOut' }, '-=0.35')
      .set(detail, { className: '+=detail-active', duration: 0.35 })
      .fromTo(detail, { autoAlpha: 0, rotation: 0 }, { autoAlpha: 1, rotation: 0, duration: 0.35, ease: 'power4.inOut' }, '-=0.35')
      .pause(0)
      .reversed(true);

    item.animation = timeline;

    overlay.addEventListener('click', () => {
      overlay.classList.remove('active');
      timeline.reverse();
    });
  });

  const masonryItems = document.querySelectorAll('.masonry__item');
  masonryItems.forEach((item) => {
    item.addEventListener('click', function() {
      const overlay = document.querySelector('.close-detail-view');
      overlay.classList.toggle('active');

      this.animation.reversed() ? this.animation.play() : this.animation.reverse();
    });

    // Button hover
    const detailActive = item.querySelector('.detail');
    if (detailActive) {
      const hoverTimeline = gsap.timeline({ paused: true });
      const circle2 = detailActive.querySelector('.circle2');
      const circle1 = detailActive.querySelector('.circle1');

      hoverTimeline.fromTo(circle2.querySelector('span'), { x: 0 }, { x: 100, duration: 0.35, ease: 'power4.inOut' })
        .fromTo(circle1, { x: 0 }, { x: 24, duration: 0.35, ease: 'power4.inOut' }, '-=.20');

      detailActive.addEventListener('mouseover', () => {
        hoverTimeline.play();
      });

      detailActive.addEventListener('mouseout', () => {
        hoverTimeline.reverse();
      });
    }
  });

  const controller = new ScrollMagic.Controller();
  const scrollItems = Array.from(document.querySelectorAll('.masonry__item'));
  scrollItems.forEach((item) => {
    const sceneTimelineIn = gsap.timeline();
    const sceneTimelineOut = gsap.timeline();

    sceneTimelineIn.fromTo(item, { y: 120 }, { y: 0, duration: 0.35 });
    sceneTimelineOut.fromTo(item, { y: 0 }, { y: -120, duration: 0.35 });

    const sceneIn = new ScrollMagic.Scene({
      triggerElement: item,
      triggerHook: 'onEnter',
      duration: window.innerHeight / 2,
      offset: -60
    })
    .setTween(sceneTimelineIn)
    .setClassToggle(item, 'centered')
    .addTo(controller);

    const sceneOut = new ScrollMagic.Scene({
      triggerElement: item,
      triggerHook: 'onLeave',
      duration: window.innerHeight / 2,
      offset: 60
    })
    .setTween(sceneTimelineOut)
    .setClassToggle(item, 'centered')
    .addTo(controller);
  });

  let proxy = { skew: 0 },
      skewSetter = gsap.quickSetter('.masonry__item', 'skewY', 'deg'), // fast
      clamp = gsap.utils.clamp(-20, 20); // don't let the skew go beyond 20 degrees. 

  ScrollTrigger.create({
    onUpdate: (self) => {
      let skew = clamp(self.getVelocity() / -300);
      // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {skew: 0, duration: 0.8, ease: 'power3', overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
      }
    }
  });

  // make the right edge "stick" to the scroll bar. force3D: true improves performance
  gsap.set('.masonry__item', {transformOrigin: 'right center', force3D: true});
};

initWannabeGallery();
