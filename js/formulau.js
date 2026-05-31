(function($) {
  'use strict';

  var content = window.FORMULAU_CONTENT || {};
  var SPONSOR_TIERS = content.sponsorTiers || [];
  var SPONSOR_FILES = content.sponsors || [];
  var MEDIA_FILES = content.media || [];
  var VIDEO_FILES = content.videos || [];

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

  function buildSponsorsFromManifest() {
    var grouped = {};
    SPONSOR_TIERS.forEach(function(tier) {
      grouped[tier.folder] = [];
    });

    SPONSOR_FILES.forEach(function(filePath) {
      var parts = filePath.split('/');
      if (parts.length !== 2) {
        return;
      }
      var tierFolder = parts[0];
      var fileName = parts[1];
      var fullPath = 'img/sponsorship_logos/' + filePath;
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

  function loadSponsors() {
    var container = document.getElementById('sponsorTiers');
    if (!container) {
      return;
    }

    var sponsorMap = buildSponsorsFromManifest();
    var totalSponsors = 0;

    container.innerHTML = '';

    SPONSOR_TIERS.forEach(function(tier) {
      var tierFiles = (sponsorMap[tier.folder] || []).sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
      if (!tierFiles.length) {
        return;
      }

      totalSponsors += tierFiles.length;

      var tierSection = createElement('section', 'sponsor-tier');
      tierSection.appendChild(createElement('h3', 'tier-title', tier.label));

      var tierGrid = createElement('div', 'tier-grid');

      tierFiles.forEach(function(file) {
        var card = createElement('a', 'sponsor-card');
        var sponsorLink = inferSponsorLink(file.name);
        var img = document.createElement('img');
        img.src = file.download_url || file.path;
        img.alt = toTitle(file.name) + ' logo';
        img.loading = 'lazy';
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

        tierGrid.appendChild(card);
      });

      tierSection.appendChild(tierGrid);
      container.appendChild(tierSection);
    });

    if (!container.children.length) {
      setEmpty(container, 'Sponsors will be announced soon.');
    }

    setCount('statSponsorCount', totalSponsors);
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

    container.innerHTML = '';

    files.forEach(function(file) {
      var card = createElement('a', 'media-card');
      card.href = file.download_url || file.path;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';

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

  function initializeDynamicContent() {
    loadSponsors();
    loadPhotos();
    loadVideos();
  }

  initializeSmoothScroll();
  initializeNavbarSolidSwitch();
  initializeScrollReveal();
  initializeDynamicContent();
})(jQuery);
