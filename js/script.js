/**
 * Responsive portfolio — viewport-detectie, layout-variabelen & mobiel menu.
 * Werkt op telefoon, tablet, laptop en desktop.
 */
(function () {
    'use strict';

    var BREAKPOINTS = {
        mobile: 767,
        tablet: 1023,
        laptop: 1279,
        desktop: 1439
    };

    var VIEWPORT_CLASSES = [
        'vp-mobile',
        'vp-tablet',
        'vp-laptop',
        'vp-desktop',
        'vp-wide'
    ];

    var LAYOUT = {
        mobile:  { pad: '1.25rem', header: '4.5rem', scale: '0.92' },
        tablet:  { pad: '5%',     header: '4.75rem', scale: '0.96' },
        laptop:  { pad: '7%',     header: '5rem',    scale: '0.98' },
        desktop: { pad: '9%',     header: '5rem',    scale: '1' },
        wide:    { pad: '10%',    header: '5rem',    scale: '1' }
    };

    var root = document.documentElement;
    var body = document.body;
    var navToggle = document.querySelector('.nav-toggle');
    var navbar = document.querySelector('.navbar');
    var navLinks = document.querySelectorAll('.navbar a');
    var resizeTimer;

    function getViewportType(width) {
        if (width <= BREAKPOINTS.mobile) return 'mobile';
        if (width <= BREAKPOINTS.tablet) return 'tablet';
        if (width <= BREAKPOINTS.laptop) return 'laptop';
        if (width <= BREAKPOINTS.desktop) return 'desktop';
        return 'wide';
    }

    function setViewportHeight() {
        root.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
    }

    function applyLayoutVars(type) {
        var config = LAYOUT[type];
        root.style.setProperty('--page-pad-x', config.pad);
        root.style.setProperty('--header-h', config.header);
        root.style.setProperty('--fluid-scale', config.scale);
    }

    function closeNav() {
        body.classList.remove('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    function openNav() {
        body.classList.add('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'true');
        }
    }

    function toggleNav() {
        if (body.classList.contains('nav-open')) {
            closeNav();
        } else {
            openNav();
        }
    }

    function updateViewport() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var type = getViewportType(width);

        VIEWPORT_CLASSES.forEach(function (cls) {
            root.classList.remove(cls);
        });
        root.classList.add('vp-' + type);

        root.classList.toggle('is-landscape', width > height);
        root.classList.toggle('is-portrait', width <= height);

        applyLayoutVars(type);
        setViewportHeight();

        if (width > BREAKPOINTS.mobile) {
            closeNav();
        }
    }

    function initNav() {
        if (!navToggle) return;

        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleNav();
        });

        if (navbar) {
            navbar.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeNav();
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeNav();
            }
        });

        document.addEventListener('click', function (e) {
            if (!body.classList.contains('nav-open')) return;
            if (navbar && navbar.contains(e.target)) return;
            if (navToggle && navToggle.contains(e.target)) return;
            closeNav();
        });
    }

    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateViewport, 100);
    }

    function init() {
        updateViewport();
        initNav();

        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', function () {
            setTimeout(updateViewport, 150);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
