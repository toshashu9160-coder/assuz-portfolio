/* ================================================
   ASSUZ — Main Application
   Renders all sections, manages state, animations
   ================================================ */

import './style.css';
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomBounce } from "gsap/CustomBounce";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { supabase, getImageUrl, getWorkImageUrl, getProjectCoverUrl, getVideoUrl, BUCKET_NAME } from './lib/supabase.js';

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, ScrollSmoother, SplitText, TextPlugin, RoughEase, ExpoScaleEase, SlowMo, CustomEase, CustomBounce);

// Module-scoped reference to the ScrollSmoother instance so modals can pause it
let scrollSmoother = null;

// --- Projects Data (from /projects/ folder) ---
const projects = [
  {
    name: 'Beeyond',
    folder: '/projects/Beeyond',
    cover: getProjectCoverUrl('Beeyond'),
    category: 'Travel Brand',
    description: 'Complete brand identity for a travel discovery platform — logo, UI, and visual system.',
    images: Array.from({ length: 14 }, (_, i) => getImageUrl('Beeyond', `${i + 1}.png`)),
  },
  {
    name: 'Sunity',
    folder: '/projects/Sunity',
    cover: getProjectCoverUrl('Sunity'),
    category: 'Energy Brand',
    description: 'Brand design for a solar energy company — bold visuals for sustainable power.',
    images: ['1.png', '2.png', '2.5.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png'].map(f => getImageUrl('Sunity', f)),
  },
  {
    name: 'Uri',
    folder: '/projects/Uri',
    cover: getProjectCoverUrl('Uri'),
    category: 'Mobile App',
    description: 'UI/UX design for a gamified language learning app — fun, engaging, modern.',
    images: [...Array.from({ length: 13 }, (_, i) => getImageUrl('Uri', `${i + 1}.png`)), getImageUrl('Uri', '15.mp4')],
  },
];

// --- Gallery Works Data (from /works/ folder) ---
const works = [
  { id: 1, src: getWorkImageUrl('1.jpg'), title: 'Desi Hip-Hop', category: 'Poster Design' },
  { id: 2, src: getWorkImageUrl('2.jpg'), title: 'Travis Scott × Jordan', category: 'Sneaker Art' },
  { id: 3, src: getWorkImageUrl('3.jpg'), title: 'The Weeknd', category: 'Album Art' },
  { id: 4, src: getWorkImageUrl('4.jpg'), title: 'Travis Scott — Cactus Jack', category: 'Concert Poster' },
  { id: 5, src: getWorkImageUrl('5.jpg'), title: 'Playboi Carti — I AM MUSIC', category: 'Editorial Design' },
  { id: 6, src: getWorkImageUrl('6.jpg'), title: 'Nike Air Jordan — We Fly', category: 'Brand Poster' },
  { id: 7, src: getWorkImageUrl('7.jpg'), title: 'Kendrick Lamar — DAMN.', category: 'Album Concept' },
  { id: 8, src: getWorkImageUrl('8.jpg'), title: 'Kendrick Lamar — GNX', category: 'Typographic Poster' },
];

// --- Videos Data ---
const videos = [
  {
    id: 1,
    title: 'Short Form / Reel',
    category: 'Short Form',
    type: 'local',
    src: getVideoUrl('1111.mp4'),
  },
  {
    id: 2,
    title: 'Lyrical Edit',
    category: 'Lyrical Edit',
    type: 'local',
    src: getVideoUrl('222222.mp4'),
  },
  {
    id: 3,
    title: 'Long Form',
    category: 'Long Form',
    type: 'local',
    src: getVideoUrl('3333.mp4'),
  },
];

// --- SVGs ---
const arrowSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>`;
const closeSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
const prevSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`;
const nextSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>`;
const quoteSVG = `<svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" opacity="0.12"><path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"/></svg>`;

// --- Marquee words ---
const marqueeWords = ['Design', 'Typography', 'Branding', 'Art Direction', 'Visual Identity', 'Creative Strategy'];

// --- Render App ---
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Cursor -->
    <div class="cursor-dot" id="cursorDot"></div>
    <div class="cursor-ring" id="cursorRing"></div>

    <!-- Preloader -->
    <div class="preloader" id="preloader">
      <span class="preloader__text">ASSUZ</span>
      <div class="preloader__bar" id="preloaderBar"></div>
    </div>

    <!-- Dynamic Island -->
    <div class="dynamic-island" id="dynamicIsland">
      <div class="dynamic-island__container">
        <!-- Main Header Row -->
        <div class="dynamic-island__header">
          <div class="dynamic-island__profile">
            <img src="${supabase ? supabase.storage.from(BUCKET_NAME).getPublicUrl('avatar.JPG').data.publicUrl : '/avatar.JPG'}" alt="Ashutosh" class="dynamic-island__avatar" />
          </div>
          <div class="dynamic-island__meta">
            <span class="dynamic-island__name">Ashutosh</span>
            <span class="dynamic-island__role">Designer</span>
          </div>
          <div class="dynamic-island__time" id="islandTime">12:00 PM</div>
        </div>

        <!-- Expanded Content Panel -->
        <div class="dynamic-island__expanded-panel">
          <div class="dynamic-island__socials">
            <a href="https://www.behance.net/ashutoshshah5" target="_blank" rel="noopener noreferrer" class="dynamic-island__social-link" data-name="Behance" title="Behance">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.22 8.44H4.5v2.85h3.72c1 0 1.63-.44 1.63-1.4s-.63-1.45-1.63-1.45zM22 11h-5c0-1.12.78-1.78 1.94-1.78S22 10 22 11zm-13.4 3.78H4.5v3.22h4.22c1.17 0 1.9-.53 1.9-1.61 0-1.07-.73-1.61-1.9-1.61zM12.92 12c.93-.8 1.48-1.93 1.48-3.41C14.4 5.37 12 4.44 8.78 4.44H1v15.12h7.82c3.2 0 6-1 6-4.52A4.47 4.47 0 0 0 12.92 12zM24 12.56h-7c0 1.83 1.25 2.78 2.87 2.78 1.41 0 2.5-.72 2.66-1.78h1.41C23.69 16.39 21.69 18 19.81 18c-3.12 0-4.81-2.19-4.81-5.5s1.78-5.5 4.81-5.5c3.09 0 4.19 2.5 4.19 5.56zM17 6h6v1.2h-6z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/ashut_osh2218/" target="_blank" rel="noopener noreferrer" class="dynamic-island__social-link" data-name="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/ashutosh-shah-4386483b9/" target="_blank" rel="noopener noreferrer" class="dynamic-island__social-link" data-name="LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="https://github.com/toshashu9160-coder" target="_blank" rel="noopener noreferrer" class="dynamic-island__social-link" data-name="GitHub" title="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
          
          <div class="dynamic-island__status">
            <span class="dynamic-island__status-dot"></span>
            <span class="dynamic-island__status-text">Available</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Viewer Modal -->
    <div class="project-viewer" id="projectViewer">
      <div class="project-viewer__header">
        <div class="project-viewer__title-block">
          <h3 class="project-viewer__name" id="pvName"></h3>
          <span class="project-viewer__cat" id="pvCat"></span>
        </div>
        <button class="project-viewer__close" id="pvClose" aria-label="Close">${closeSVG}</button>
      </div>
      <div class="project-viewer__scroller" id="pvScroller"></div>
    </div>

    <!-- Lightbox -->
    <div class="lightbox" id="lightbox">
      <img class="lightbox__img" id="lightboxImg" src="" alt="" />
      <button class="lightbox__close" id="lightboxClose" aria-label="Close">${closeSVG}</button>
      <button class="lightbox__nav lightbox__nav--prev" id="lightboxPrev" aria-label="Previous">${prevSVG}</button>
      <button class="lightbox__nav lightbox__nav--next" id="lightboxNext" aria-label="Next">${nextSVG}</button>
      <div class="lightbox__info">
        <span class="lightbox__info-title" id="lightboxTitle"></span>
        <span class="lightbox__info-cat" id="lightboxCat"></span>
      </div>
      <span class="lightbox__counter" id="lightboxCounter"></span>
    </div>

    <!-- GSAP Smooth Scroll Wrapper -->
    <div id="smooth-wrapper">
      <div id="smooth-content">

        <!-- Nav -->
        <nav class="nav" id="nav">
          <a href="#" class="nav__logo">ASSUZ<span class="accent">.</span></a>
          <div class="nav__links">
            <a href="#about" class="nav__link">About</a>
            <a href="#projects" class="nav__link">Projects</a>
            <a href="#gallery" class="nav__link">Gallery</a>
            <a href="#videos" class="nav__link">Videos</a>
            <a href="#services" class="nav__link">Services</a>
            <a href="#contact" class="nav__link">Contact</a>
          </div>
          <button class="nav__menu-btn" id="menuBtn" aria-label="Toggle menu">
            <span></span><span></span>
          </button>
        </nav>

        <!-- Mobile Menu -->
        <div class="mobile-menu" id="mobileMenu">
          <a href="#about" class="mobile-menu__link">About</a>
          <a href="#projects" class="mobile-menu__link">Projects</a>
          <a href="#gallery" class="mobile-menu__link">Gallery</a>
          <a href="#videos" class="mobile-menu__link">Videos</a>
          <a href="#services" class="mobile-menu__link">Services</a>
          <a href="#contact" class="mobile-menu__link">Contact</a>
        </div>

        <!-- Hero -->
        <header class="hero" id="hero">
          <div class="hero__bg-text" aria-hidden="true">ASSUZ</div>
          <div class="hero__content">
            <p class="hero__eyebrow reveal">Graphic Designer &amp; Visual Artist</p>
            <h1 class="hero__title">
              Crafting Visual<br />
              Experiences That<br />
              <span class="italic">Resonate<span class="accent">.</span></span>
            </h1>
            <p class="hero__subtitle reveal">Blending bold aesthetics with purposeful design —<br />creating work that speaks before words do.</p>
            <a href="#projects" class="hero__cta reveal">
              <span>Explore Work</span>
              ${arrowSVG}
            </a>
          </div>
          <div class="hero__scroll-indicator">
            <span>Scroll</span>
            <div class="hero__scroll-line"></div>
          </div>
        </header>

        <!-- About -->
        <section class="about" id="about">
          <div class="section-grid">
            <div class="about__label">
              <span class="section-number">01</span>
              <span class="section-tag">About</span>
            </div>
            <div class="about__content">
              <h2 class="about__heading reveal">
                I create designs that<br />
                <span class="italic">feel alive</span> and<br />
                demand attention.
              </h2>
              <div class="about__text-grid">
                <p class="about__text reveal">With a passion for graphic design, poster art, and visual storytelling, I bring bold ideas to life. Every project is an opportunity to push creative boundaries and make something unforgettable.</p>
                <p class="about__text reveal">My work spans poster design, album artwork, sneaker art, brand visuals, and typographic compositions — always rooted in bold typography, striking color, and raw energy.</p>
              </div>

            </div>
          </div>
        </section>

        <!-- Projects -->
        <section class="projects" id="projects">
          <div class="section-header">
            <div class="section-header__left">
              <span class="section-number">02</span>
              <span class="section-tag">Case Studies</span>
            </div>
            <h2 class="section-header__title reveal">Projects</h2>
          </div>

          <div class="projects__list">
            ${projects.map((proj, idx) => `
              <div class="project-card reveal-up" data-project="${idx}">
                <div class="project-card__image">
                  <img src="${proj.cover}" alt="${proj.name}" loading="lazy" />
                  <div class="project-card__overlay">
                    <span class="project-card__view">View Project ${arrowSVG}</span>
                  </div>
                </div>
                <div class="project-card__info">
                  <span class="project-card__category">${proj.category}</span>
                  <h3 class="project-card__name">${proj.name}</h3>
                  <p class="project-card__desc">${proj.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Gallery — Skiper54 Clip-Path Carousel -->
        <section class="gallery" id="gallery">
          <div class="section-header">
            <div class="section-header__left">
              <span class="section-number">03</span>
              <span class="section-tag">Selected Work</span>
            </div>
            <h2 class="section-header__title reveal">Gallery</h2>
          </div>

          <div class="parallax-gallery" id="parallaxGallery">
            ${[
              [0, 1, 2],
              [3, 4, 5],
              [6, 7, 0],
              [1, 2, 3],
            ].map(group => `
              <div class="parallax-col">
                ${group.map(i => `
                  <div class="parallax-cell" data-index="${i}">
                    <img src="${works[i].src}" alt="${works[i].title}" loading="lazy" />
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Videos -->
        <section class="videos" id="videos">
          <div class="section-header">
            <div class="section-header__left">
              <span class="section-number">04</span>
              <span class="section-tag">Motion & Film</span>
            </div>
            <h2 class="section-header__title reveal">Videos</h2>
          </div>

          <div class="videos__grid">
            ${videos.map((vid, idx) => `
              <div class="video-card reveal-up" data-video="${idx}" data-src="${vid.src}" data-title="${vid.title}" data-cat="${vid.category}">
                <div class="video-card__thumb">
                  <video
                    class="video-card__preview"
                    src="${vid.src}#t=0.1"
                    muted
                    loop
                    playsinline
                    preload="metadata"
                  ></video>
                  <div class="video-card__overlay">
                    <button class="video-card__play-btn" aria-label="Play ${vid.title}">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                  </div>
                </div>
                <div class="video-card__info">
                  <span class="video-card__category">${vid.category}</span>
                  <h3 class="video-card__title">${vid.title}</h3>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Video Lightbox -->
        <div class="video-lightbox" id="videoLightbox">
          <button class="video-lightbox__close" id="videoLightboxClose" aria-label="Close">${closeSVG}</button>
          <div class="video-lightbox__inner" id="videoLightboxInner"></div>
          <div class="video-lightbox__info">
            <span class="video-lightbox__title" id="videoLightboxTitle"></span>
            <span class="video-lightbox__cat" id="videoLightboxCat"></span>
          </div>
        </div>

        <!-- Marquee -->
        <div class="marquee" aria-hidden="true">
          <div class="marquee__track">
            ${[...marqueeWords, ...marqueeWords].map(w => `<span>${w}</span><span class="marquee__separator">✦</span>`).join('')}
          </div>
        </div>

        <!-- Services -->
        <section class="services" id="services">
          <div class="section-header">
            <div class="section-header__left">
              <span class="section-number">05</span>
              <span class="section-tag">Services</span>
            </div>
            <h2 class="section-header__title reveal">What I Do</h2>
          </div>
          <div class="services-list">
            ${[
              { num: '01', title: 'Poster Design', desc: 'Eye-catching posters for artists, albums, events, and brands — designed to stop people in their tracks.' },
              { num: '02', title: 'Brand Identity', desc: 'Visual identities that tell your story through logos, color systems, and cohesive brand guidelines.' },
              { num: '03', title: 'Album & Cover Art', desc: 'Striking artwork for singles, albums, and playlists that capture the energy and emotion of the music.' },
              { num: '04', title: 'Social Media Design', desc: 'Scroll-stopping content design for Instagram, Twitter, and beyond — built for engagement.' },
            ].map(s => `
              <div class="service reveal-up">
                <div class="service__number">${s.num}</div>
                <div class="service__content">
                  <h3 class="service__title">${s.title}</h3>
                  <p class="service__desc">${s.desc}</p>
                </div>
                <div class="service__arrow">${arrowSVG.replace('width="24"', 'width="28"').replace('height="24"', 'height="28"')}</div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Testimonial -->
        <section class="testimonial">
          <div class="testimonial__content reveal">
            ${quoteSVG}
            <blockquote class="testimonial__text">
              "The designs exceeded every expectation. Bold, creative, and delivered with incredible attention to detail. ASSUZ brings a vision you didn't even know you needed."
            </blockquote>
            <div>
              <span class="testimonial__name">Client Review</span><br />
              <span class="testimonial__role">Poster Commission</span>
            </div>
          </div>
        </section>

        <!-- Contact -->
        <section class="contact" id="contact">
          <div class="section-grid">
            <div class="contact__label">
              <span class="section-number">06</span>
              <span class="section-tag">Get In Touch</span>
            </div>
            <div class="contact__content">
              <h2 class="contact__heading reveal">
                Let's create<br />
                something <span class="italic">extraordinary</span><br />
                together<span class="accent">.</span>
              </h2>
              <p class="contact__text reveal">Have a project in mind? Whether it's a poster, album art, or a full brand — reach out directly on WhatsApp.</p>
              <a class="whatsapp-cta reveal-up" id="whatsappCta" href="https://wa.me/7439777953?text=Hi%20Ashutosh%2C%20I'd%20like%20to%20discuss%20a%20project%20with%20you." target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span>Chat on WhatsApp</span>
                <span class="whatsapp-cta__num">+91 74397 77953</span>
                ${arrowSVG}
              </a>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer__top">
            <a href="#" class="footer__logo">ASSUZ<span class="accent">.</span></a>
            <div class="footer__socials">
              <a href="https://www.behance.net/ashutoshshah5" target="_blank" rel="noopener noreferrer" class="footer__social">Behance</a>
              <a href="https://www.instagram.com/ashut_osh2218/" target="_blank" rel="noopener noreferrer" class="footer__social">Instagram</a>
              <a href="https://www.linkedin.com/in/ashutosh-shah-4386483b9/" target="_blank" rel="noopener noreferrer" class="footer__social">LinkedIn</a>
              <a href="https://github.com/toshashu9160-coder" target="_blank" rel="noopener noreferrer" class="footer__social">GitHub</a>
            </div>
          </div>
          <div class="footer__bottom">
            <p>&copy; 2026 ASSUZ. All rights reserved.</p>
            <p>Designed with intention.</p>
          </div>
        </footer>

      </div>
    </div>
  `;

  initApp();
}

// --- Initialize All Functionality ---
function initApp() {
  initPreloader();
  initCursor();
  initNavScroll();
  initMobileMenu();
  initSmoothScroll();
  initGSAP();
  initParallaxGallery();
  initLightbox();
  initProjectCards();
  initVideoSection();
  initDynamicIsland();
  initServices();
}

// --- Preloader ---
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloaderBar');
  const text = preloader.querySelector('.preloader__text');
  let progress = 0;

  // Bold serif load-up reveal
  if (text) {
    gsap.fromTo(text,
      { scale: 1.6, autoAlpha: 0, letterSpacing: '0.4em' },
      { scale: 1, autoAlpha: 1, letterSpacing: '0.04em', duration: 1.1, ease: 'power4.out' }
    );
  }

  const interval = setInterval(() => {
    progress += Math.random() * 25;
    if (progress > 100) progress = 100;
    bar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('hidden');
        // Refresh ScrollTrigger to recalculate DOM offsets after page content displays
        ScrollTrigger.refresh();
      }, 400);
    }
  }, 150);
}

// --- Custom Cursor ---
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || 'ontouchstart' in window) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Robust Event Delegation for Interactive Elements
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .project-card, .parallax-cell, .service, .project-viewer__close, input, select, textarea, .dynamic-island, .dynamic-island__social-link, .video-card');
    if (target) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, .project-card, .parallax-cell, .service, .project-viewer__close, input, select, textarea, .dynamic-island, .dynamic-island__social-link, .video-card');
    if (target) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });
}

// --- Nav Scroll ---
function initNavScroll() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

// --- Mobile Menu ---
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- Smooth Scroll (GSAP ScrollSmoother compatible) ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = a.getAttribute('href');
      const smoother = ScrollSmoother.get();

      if (target === "#" || !target) {
        if (smoother) smoother.scrollTo(0, true);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      try {
        const targetEl = document.querySelector(target);
        if (targetEl) {
          if (smoother) {
            smoother.scrollTo(target, true, "top 80");
          } else {
            window.scrollTo({ top: targetEl.offsetTop - 80, behavior: 'smooth' });
          }
        }
      } catch (err) {
        console.warn("Invalid selector:", target);
      }
    });
  });
}

// --- GSAP Setup (ScrollSmoother, ScrollTrigger, SplitText, TextPlugin) ---
function initGSAP() {
  // 1. ScrollSmoother Setup
  scrollSmoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.6,
    effects: true
  });

  // Clear FOUC CSS classes before splitting to prevent layout conflicts
  gsap.set(".reveal, .reveal-up", { opacity: 1, y: 0, transition: "none" });

  // 2. SplitText Hero Title Reveal Animation
  const splitHero = new SplitText(".hero__title", { type: "lines,words,chars" });
  gsap.fromTo(splitHero.chars, 
    { y: 110, autoAlpha: 0 },
    {
      duration: 1.4,
      y: 0,
      autoAlpha: 1,
      stagger: 0.02,
      ease: "power4.out",
      delay: 0.4
    }
  );

  // 3. Hero Eyebrow + Subtitle + CTA reveals
  gsap.fromTo(".hero__eyebrow",
    { y: 30, autoAlpha: 0 },
    { duration: 1.2, y: 0, autoAlpha: 1, ease: "power3.out", delay: 0.2 }
  );

  gsap.fromTo(".hero__subtitle",
    { y: 30, autoAlpha: 0 },
    { duration: 1.2, y: 0, autoAlpha: 1, ease: "power3.out", delay: 0.8 }
  );

  gsap.fromTo(".hero__cta",
    { y: 30, autoAlpha: 0 },
    { duration: 1.2, y: 0, autoAlpha: 1, ease: "power3.out", delay: 1.0 }
  );

  // 4. SplitText for Main Headings (Reveal from below on scroll)
  document.querySelectorAll(".section-header__title, .about__heading, .contact__heading").forEach(heading => {
    const splitHeading = new SplitText(heading, { type: "lines,words,chars" });
    gsap.fromTo(splitHeading.chars, 
      { y: 60, autoAlpha: 0 },
      {
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        y: 0,
        autoAlpha: 1,
        stagger: 0.02,
        duration: 1.0,
        ease: "power4.out"
      }
    );
  });

  // 5. ScrollTrigger Staggered Reveal Up Elements
  const revealTriggers = [
    { selector: ".about__text", stagger: 0.15 },
    { selector: ".project-card", stagger: 0.2 },
    { selector: ".video-card", stagger: 0.18 },
    { selector: ".service", stagger: 0.15 },
    { selector: ".testimonial__content", stagger: 0 },
    { selector: ".whatsapp-cta", stagger: 0 }
  ];

  revealTriggers.forEach(group => {
    const targets = document.querySelectorAll(group.selector);
    if (targets.length > 0) {
      gsap.fromTo(targets,
        { y: 50, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: targets[0],
            start: "top 88%",
            toggleActions: "play none none none"
          },
          y: 0,
          autoAlpha: 1,
          stagger: group.stagger,
          duration: 0.9,
          ease: "power3.out"
        }
      );
    }
  });

  // 6. Marquee Speed Increase on Scroll
  gsap.to(".marquee__track", {
    scrollTrigger: {
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    },
    xPercent: -40,
    ease: "none"
  });

  // 7. Hero Background Parallax with ScrollTrigger
  gsap.to(".hero__bg-text", {
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    },
    y: 180,
    ease: "none"
  });
}

// ==================================================
// GALLERY — Skiper30 Parallax (Vanilla GSAP port)
// Scroll-driven parallax columns using the existing works images
// ==================================================
function initParallaxGallery() {
  const gallery = document.getElementById('parallaxGallery');
  if (!gallery) return;

  const columns = gsap.utils.toArray('.parallax-col', gallery);
  // Gentle parallax multipliers (relative to viewport height).
  // Motion is symmetric (centered) so every image stays fully visible.
  const multipliers = [0.9, 1.4, 0.6, 1.2];

  columns.forEach((col, i) => {
    const mult = multipliers[i % multipliers.length];
    gsap.fromTo(col,
      { y: () => -window.innerHeight * mult / 2 },
      {
        y: () => window.innerHeight * mult / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: gallery,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  // Click a cell to open the lightbox with the matching work
  gallery.querySelectorAll('.parallax-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const idx = parseInt(cell.dataset.index, 10);
      openGalleryLightbox(idx);
    });
  });
}

// --- Gallery Lightbox (for carousel clicks) ---
function openGalleryLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbCat = document.getElementById('lightboxCat');
  const lbCounter = document.getElementById('lightboxCounter');

  let currentIndex = index;

  function update() {
    const work = works[currentIndex];
    lbImg.src = work.src;
    lbImg.alt = work.title;
    lbTitle.textContent = work.title;
    lbCat.textContent = work.category;
    lbCounter.textContent = `${currentIndex + 1} / ${works.length}`;
  }

  update();
  lightbox.classList.add('open');
  if (scrollSmoother) scrollSmoother.pause();
  document.body.style.overflow = 'hidden';

  // Store for keyboard nav
  lightbox._currentIndex = currentIndex;
  lightbox._update = (newIndex) => {
    currentIndex = newIndex;
    update();
  };
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  function closeLightbox() {
    lightbox.classList.remove('open');
    if (scrollSmoother) scrollSmoother.resume();
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (lightbox._update) {
      lightbox._currentIndex = (lightbox._currentIndex - 1 + works.length) % works.length;
      lightbox._update(lightbox._currentIndex);
    }
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (lightbox._update) {
      lightbox._currentIndex = (lightbox._currentIndex + 1) % works.length;
      lightbox._update(lightbox._currentIndex);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { prevBtn.click(); }
    if (e.key === 'ArrowRight') { nextBtn.click(); }
  });
}

// --- Project Cards + Viewer ---
function initProjectCards() {
  const cards = document.querySelectorAll('.project-card');
  const viewer = document.getElementById('projectViewer');
  const pvName = document.getElementById('pvName');
  const pvCat = document.getElementById('pvCat');
  const pvClose = document.getElementById('pvClose');
  const pvScroller = document.getElementById('pvScroller');

  function openViewer() {
    viewer.classList.add('open');
    if (scrollSmoother) scrollSmoother.pause();
    document.body.style.overflow = 'hidden';
    pvScroller.scrollTop = 0;
  }

  function closeViewer() {
    viewer.classList.remove('open');
    if (scrollSmoother) scrollSmoother.resume();
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.project, 10);
      const proj = projects[idx];
      pvName.textContent = proj.name;
      pvCat.textContent = proj.category;

      pvScroller.innerHTML = proj.images.map(src => {
        if (src.endsWith('.mp4')) {
          return `<video src="${src}" autoplay loop muted playsinline class="project-viewer__img"></video>`;
        }
        return `<img src="${src}" alt="${proj.name}" loading="lazy" class="project-viewer__img" />`;
      }).join('');

      openViewer();
    });
  });

  pvClose.addEventListener('click', closeViewer);

  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) {
      closeViewer();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && viewer.classList.contains('open')) {
      closeViewer();
    }
  });
}

// --- Video Section ---
function initVideoSection() {
  const lightbox = document.getElementById('videoLightbox');
  const lbInner  = document.getElementById('videoLightboxInner');
  const lbTitle  = document.getElementById('videoLightboxTitle');
  const lbCat    = document.getElementById('videoLightboxCat');
  const lbClose  = document.getElementById('videoLightboxClose');

  if (!lightbox) return;

  document.querySelectorAll('.video-card').forEach((card) => {
    const preview = card.querySelector('.video-card__preview');

    // Hover — play / pause the muted preview clip
    if (preview) {
      card.addEventListener('mouseenter', () => {
        preview.play().catch(() => {}); // suppress autoplay errors
      });
      card.addEventListener('mouseleave', () => {
        preview.pause();
        preview.currentTime = 0;
      });
    }

    // Click — open full-screen lightbox with sound
    card.addEventListener('click', () => {
      const src   = card.dataset.src;
      const title = card.dataset.title;
      const cat   = card.dataset.cat;

      lbTitle.textContent = title;
      lbCat.textContent   = cat;

      // All our videos are mp4 from Supabase — always use <video>
      lbInner.innerHTML = `
        <video
          src="${src}"
          controls
          autoplay
          playsinline
          class="video-lightbox__player"
        ></video>
      `;

      lightbox.classList.add('open');
      if (scrollSmoother) scrollSmoother.pause();
      document.body.style.overflow = 'hidden';
    });
  });

  function closeVideoLightbox() {
    lightbox.classList.remove('open');
    lbInner.innerHTML = ''; // kills playback immediately
    if (scrollSmoother) scrollSmoother.resume();
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeVideoLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeVideoLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeVideoLightbox();
  });
}

// --- Service Cards -> Work Pages ---
function initServices() {
  const links = {
    'Poster Design': 'work.html?cat=poster',
    'Brand Identity': 'work.html?cat=brand',
    'Album & Cover Art': 'work.html?cat=album',
    'Social Media Design': 'work.html?cat=social',
  };

  document.querySelectorAll('.service').forEach(service => {
    const title = service.querySelector('.service__title')?.textContent.trim();
    const href = links[title];
    if (!href) return;
    service.style.cursor = 'pointer';
    service.addEventListener('click', () => {
      window.location.href = href;
    });
  });
}

// --- Dynamic Island ---
function initDynamicIsland() {
  const island = document.getElementById('dynamicIsland');
  if (!island) return;

  // Glowing strobe effect starts on load and runs for the first 10 seconds
  island.classList.add('strobe');
  setTimeout(() => island.classList.remove('strobe'), 10000);

  // Open on click (but not when clicking a social link)
  const islandContainer = island.querySelector('.dynamic-island__container');
  island.addEventListener('click', (e) => {
    if (e.target.closest('.dynamic-island__social-link')) {
      return;
    }
    island.classList.add('active');
    // Replay the Apple-style open bounce
    if (islandContainer) {
      islandContainer.classList.remove('island-bounce');
      void islandContainer.offsetWidth; // force reflow to restart animation
      islandContainer.classList.add('island-bounce');
    }
  });

  // Close when the mouse leaves the island (after it was opened)
  island.addEventListener('mouseleave', () => {
    island.classList.remove('active');
  });

  // Time Formatter
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12
    const minStr = minutes < 10 ? '0' + minutes : minutes;
    
    const timeStr = `${hours}:${minStr} ${ampm}`;
    const timeEl = document.getElementById('islandTime');
    if (timeEl) {
      timeEl.textContent = timeStr;
    }
  }

  // Update immediately and on interval
  updateTime();
  setInterval(updateTime, 1000);
}

// --- Boot ---
renderApp();
