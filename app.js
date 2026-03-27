document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const body = document.body;
const header = document.querySelector('[data-site-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelectorAll('.primary-nav a');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('nav-open', !expanded);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  });
});

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 8);
};

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const searchInput = document.querySelector('[data-topic-search]');
const filterChips = document.querySelectorAll('[data-filter-chip]');
const topicCards = document.querySelectorAll('[data-topic-card]');
const topicCount = document.querySelector('[data-topic-count]');
let activeFilter = 'all';

const updateDirectory = () => {
  if (!topicCards.length) return;

  const query = (searchInput?.value || '').trim().toLowerCase();
  let visibleCount = 0;

  topicCards.forEach((card) => {
    const haystack = card.dataset.search.toLowerCase();
    const categories = (card.dataset.category || '').toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
    const visible = matchesQuery && matchesFilter;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  if (topicCount) {
    topicCount.textContent = `${visibleCount} topic${visibleCount === 1 ? '' : 's'} shown`;
  }
};

filterChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    activeFilter = chip.dataset.filter || 'all';
    filterChips.forEach((item) => item.classList.toggle('is-active', item === chip));
    updateDirectory();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', updateDirectory);
  updateDirectory();
}

const progressBar = document.querySelector('[data-reading-progress]');
const articleBody = document.querySelector('[data-article-body]');

const updateProgress = () => {
  if (!progressBar || !articleBody) return;
  const start = articleBody.offsetTop - 120;
  const end = articleBody.offsetTop + articleBody.offsetHeight - window.innerHeight;
  const percent = Math.min(100, Math.max(0, ((window.scrollY - start) / Math.max(1, end - start)) * 100));
  progressBar.style.width = `${percent}%`;
};

if (progressBar && articleBody) {
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

const tocLinks = document.querySelectorAll('[data-toc-link]');
const spySections = document.querySelectorAll('[data-spy-section]');

if (tocLinks.length && spySections.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        tocLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === id);
        });
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );

  spySections.forEach((section) => observer.observe(section));
}
