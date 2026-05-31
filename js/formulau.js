(function($) {
  'use strict';

  var content = window.FORMULAU_CONTENT || {};
  var SPONSOR_TIERS = content.sponsorTiers || [];
  var CURRENT_SPONSORS = content.sponsorCurrent || [];
  var MEDIA_FILES = content.media || [];
  var VIDEO_FILES = content.videos || [];
  var lightboxFiles = [];
  var lightboxIndex = -1;
  var THEME_KEY = 'formulauTheme';

  function createElement(tag, className, html) {
    var el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    if (html) {
      el.innerHTML = html;
    }
    return el;
  }

  function toTitle(name) {
    return name
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[._-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, function(letter) {
        return letter.toUpperCase();
      });
  }

  function inferSponsorLink(filename) {
    var base = filename.replace(/\.[a-z0-9]+$/i, '');
    if (base.indexOf('.') === -1) {
      return null;
    }
    return 'https://' + base;
  }

  function setCount(id, value) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
  }

  function setEmpty(container, message) {
    container.innerHTML = '';
    container.appendChild(createElement('div', 'empty-note', message));
  }

  function sponsorAssetPath(relativePath) {
    return 'img/sponsorship_logos/' + relativePath;
  }

  function buildCurrentSponsorsFromManifest() {
    var grouped = {};
    SPONSOR_TIERS.forEach(function(tier) {
      grouped[tier.folder] = [];
    });

    CURRENT_SPONSORS.forEach(function(filePath) {
      var parts = filePath.split('/');
      if (parts.length !== 2) {
        return;
      }
      var tierFolder = parts[0];
      var fileName = parts[1];
      var fullPath = sponsorAssetPath(filePath);
      if (grouped[tierFolder]) {
        grouped[tierFolder].push({
          name: fileName,
          path: fullPath,
          download_url: fullPath
        });
      }
    });

    return grouped;
  }

  function createSponsorCard(file) {
    var card = createElement('a', 'sponsor-card');
    var sponsorLink = inferSponsorLink(file.name);
    var img = document.createElement('img');
    img.src = file.download_url || file.path;
    img.alt = toTitle(file.name) + ' logo';
    img.loading = 'lazy';

    if (/slcc\.edu/i.test(file.name)) {
      card.classList.add('sponsor-card-slcc');
      img.classList.add('sponsor-logo-slcc');
    }

    card.appendChild(img);

    if (sponsorLink) {
      card.href = sponsorLink;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    } else {
      card.href = file.download_url || file.path;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    }

    return card;
  }

  function loadSponsors() {
    var container = document.getElementById('sponsorTiers');
    if (!container) {
      return;
    }

    var currentMap = buildCurrentSponsorsFromManifest();
    var currentCount = 0;

    container.innerHTML = '';

    SPONSOR_TIERS.forEach(function(tier) {
      var tierFiles = (currentMap[tier.folder] || []).sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
      if (!tierFiles.length) {
        return;
      }

      currentCount += tierFiles.length;

      var tierSection = createElement('section', 'sponsor-tier');
      tierSection.appendChild(createElement('h3', 'tier-title', tier.label));

      var tierGrid = createElement('div', 'tier-grid');

      tierFiles.forEach(function(file) {
        tierGrid.appendChild(createSponsorCard(file));
      });

      tierSection.appendChild(tierGrid);
      container.appendChild(tierSection);
    });

    if (!container.children.length) {
      setEmpty(container, 'Sponsors will be announced soon.');
    }

    setCount('statSponsorCount', currentCount);
  }

  function loadPhotos() {
    var container = document.getElementById('mediaGallery');
    if (!container) {
      return;
    }

    var files = MEDIA_FILES.map(function(fileName) {
      var path = 'img/media_gallery/' + fileName;
      return {
        name: fileName,
        path: path,
        download_url: path
      };
    });

    files = files.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
    lightboxFiles = files;
    lightboxIndex = -1;

    container.innerHTML = '';

    files.forEach(function(file, index) {
      var card = createElement('button', 'media-card media-card-btn');
      card.type = 'button';
      card.setAttribute('aria-label', 'Open image ' + toTitle(file.name));
      card.addEventListener('click', function() {
        openMediaLightbox(index);
      });

      var image = document.createElement('img');
      image.src = file.download_url || file.path;
      image.alt = toTitle(file.name);
      image.loading = 'lazy';
      card.appendChild(image);

      container.appendChild(card);
    });

    if (!files.length) {
      setEmpty(container, 'Gallery updates are coming soon.');
    }

    setCount('statPhotoCount', files.length);
  }

  function updateLightboxImage() {
    var imageEl = document.getElementById('lightboxImage');
    if (!imageEl || !lightboxFiles.length || lightboxIndex < 0) {
      return;
    }

    var item = lightboxFiles[lightboxIndex];
    imageEl.src = item.download_url || item.path;
    imageEl.alt = toTitle(item.name);
  }

  function cycleLightbox(step) {
    if (!lightboxFiles.length || lightboxIndex < 0) {
      return;
    }

    lightboxIndex = (lightboxIndex + step + lightboxFiles.length) % lightboxFiles.length;
    updateLightboxImage();
  }

  function openMediaLightbox(index) {
    if (!lightboxFiles.length) {
      return;
    }

    lightboxIndex = index;
    updateLightboxImage();
    $('#mediaLightbox').modal('show');
  }

  function initializeMediaLightbox() {
    var modal = document.getElementById('mediaLightbox');
    var prev = document.getElementById('lightboxPrev');
    var next = document.getElementById('lightboxNext');

    if (!modal || !prev || !next) {
      return;
    }

    prev.addEventListener('click', function() {
      cycleLightbox(-1);
    });

    next.addEventListener('click', function() {
      cycleLightbox(1);
    });

    document.addEventListener('keydown', function(event) {
      if (!$('#mediaLightbox').hasClass('show')) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        cycleLightbox(-1);
      } else if (event.key === 'ArrowRight') {
        cycleLightbox(1);
      }
    });

    $('#mediaLightbox').on('hidden.bs.modal', function() {
      lightboxIndex = -1;
    });
  }

  function loadVideos() {
    var container = document.getElementById('videoGallery');
    if (!container) {
      return;
    }

    var files = VIDEO_FILES.map(function(fileName) {
      var path = 'vid/' + fileName;
      return {
        name: fileName,
        path: path,
        download_url: path
      };
    }).filter(function(file) {
      return /\.(mp4|webm)$/i.test(file.name);
    });

    files = files.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    container.innerHTML = '';

    files.forEach(function(file) {
      var card = createElement('article', 'video-card');
      var video = document.createElement('video');
      video.controls = true;
      video.preload = 'metadata';

      var source = document.createElement('source');
      source.src = file.download_url || file.path;
      source.type = file.name.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
      video.appendChild(source);

      card.appendChild(video);
      card.appendChild(createElement('p', 'video-meta', toTitle(file.name)));
      container.appendChild(card);
    });

    if (!files.length) {
      setEmpty(container, 'Video highlights are coming soon.');
    }

    setCount('statVideoCount', files.length);
  }

  function initializeScrollReveal() {
    var revealables = document.querySelectorAll('.reveal-on-scroll');
    if (!revealables.length) {
      return;
    }

    var observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealables.forEach(function(el) {
      observer.observe(el);
    });
  }

  function initializeSmoothScroll() {
    $('a.smoothscroll').on('click', function(event) {
      if (this.hash !== '') {
        event.preventDefault();

        var hash = this.hash;
        var target = $(hash);
        if (!target.length) {
          return;
        }

        history.pushState(null, null, hash);

        $('html, body').animate(
          {
            scrollTop: target.offset().top - 64
          },
          550,
          function() {
            target.focus();

            if (!target.is(':focus')) {
              target.attr('tabindex', '-1');
              target.focus();
            }
          }
        );
      }

      $('.navbar-collapse').collapse('hide');
    });
  }

  function initializeNavbarSolidSwitch() {
    function updateNavbarState() {
      if ($('#navbar').offset().top >= $(window).height() * 0.08) {
        $('#navbar').addClass('navbar-solid');
      } else {
        $('#navbar').removeClass('navbar-solid');
      }
    }

    $(window).on('load scroll', updateNavbarState);
    updateNavbarState();
  }

  function setTheme(theme) {
    var selectedTheme = theme === 'dark' ? 'dark' : 'light';
    var picker = document.getElementById('themePicker');
    var label = document.getElementById('themePickerLabel');
    var icon = picker ? picker.querySelector('i') : null;

    document.body.setAttribute('data-theme', selectedTheme);
    localStorage.setItem(THEME_KEY, selectedTheme);

    if (label) {
      label.textContent = selectedTheme === 'dark' ? 'Light' : 'Dark';
    }

    if (icon) {
      icon.className = selectedTheme === 'dark' ? 'fa fa-sun-o' : 'fa fa-moon-o';
    }
  }

  function initializeThemePicker() {
    var picker = document.getElementById('themePicker');
    if (!picker) {
      return;
    }

    var savedTheme = localStorage.getItem(THEME_KEY);
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    picker.addEventListener('click', function() {
      var currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  function initializeDynamicContent() {
    loadSponsors();
    loadPhotos();
    loadVideos();
  }

  initializeSmoothScroll();
  initializeThemePicker();
  initializeNavbarSolidSwitch();
  initializeScrollReveal();
  initializeMediaLightbox();
  initializeDynamicContent();
})(jQuery);
