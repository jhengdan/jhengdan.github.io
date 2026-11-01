import { projects, profile } from './projects.js';

const content = document.getElementById('content');
const featuredProjects = projects.filter(project => project.collection !== 'additional');
const additionalProjects = projects.filter(project => project.collection === 'additional');
const posterCache = new Map();
let currentRoute = '';
let homeScroll = 0;
let renderSequence = 0;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const asset = value => new URL(value, document.baseURI).href;
const image = (item, {className = '', eager = false, cover = false, hero = false, compact = false} = {}) => `<img src="${escapeHtml(item.src)}"${item.thumb ? ` srcset="${escapeHtml(item.thumb)} 960w, ${escapeHtml(item.src)} ${item.width}w" sizes="${compact ? '(max-width:600px) calc(50vw - 34px), (max-width:1000px) 28vw, 320px' : hero ? '(max-width:1600px) 90vw, 1440px' : cover ? '(max-width:600px) calc(100vw - 44px), calc((100vw - 180px) / 2)' : '(max-width:600px) calc(100vw - 44px), (max-width:1440px) calc(50vw - 90px), 700px'}"` : ''} width="${item.width}" height="${item.height}" alt="${escapeHtml(item.alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${className ? ` class="${className}"` : ''}>`;

function card(project, index) {
  const movie = project.kind === 'film';
  const poster = movie && project.videos[0].poster;
  const secondary = !movie && project.preview;
  const media = movie ? `<img ${poster ? `src="${escapeHtml(poster)}" loading="${index < 2 ? 'eager' : 'lazy'}"` : `data-poster="${escapeHtml(project.id)}"`} alt="${escapeHtml(project.title)} 動畫封面" width="1280" height="720"><span class="cover-status" role="status">擷取影片封面中</span><span class="film-tag"><span class="play-mark" aria-hidden="true"></span>FILM</span>` : image(project.cover, {eager:index < 2, cover:true});
  return `<article class="project-card"><a class="project-link" href="#/projects/${escapeHtml(project.id)}" aria-label="觀看 ${escapeHtml(project.title)}，${escapeHtml(project.subtitle)}"><div class="card-visual${secondary ? ' has-secondary' : ''}"><div class="cover-frame${movie ? ` is-film${poster ? ' is-ready' : ''}` : ' is-ready'}" style="--cover-position:${escapeHtml(project.coverPosition || '50% 50%')}">${media}</div>${secondary ? `<div class="secondary-frame" style="--preview-position:${escapeHtml(project.previewPosition || '50% 50%')}">${image(secondary,{cover:true})}</div>` : ''}</div><div class="card-info"><div class="card-topline"><span class="project-index">${String(index+1).padStart(2,'0')}</span><span class="project-type">${movie ? 'ANIMATION' : '3D VISUALS'}</span></div><h3>${escapeHtml(project.title)}</h3><p class="project-subtitle">${escapeHtml(project.subtitle)}</p>${project.role ? `<p class="card-description">${escapeHtml(project.role)}</p>` : ''}<div class="card-bottom">${project.production ? `<span>${escapeHtml(project.production)}</span>` : ''}<span class="card-open">查看專案</span></div></div></a></article>`;
}

function smallCard(project) {
  const movie = project.kind === 'film';
  const poster = movie && project.videos[0].poster;
  const media = movie ? `<img ${poster ? `src="${escapeHtml(poster)}" loading="lazy"` : `data-poster="${escapeHtml(project.id)}"`} alt="${escapeHtml(project.title)} 動畫封面" width="1280" height="720"><span class="cover-status" role="status">擷取影片封面中</span><span class="film-tag"><span class="play-mark" aria-hidden="true"></span>FILM</span>` : image(project.cover, {compact:true});
  return `<article class="more-card"><a class="more-project-link" href="#/projects/${escapeHtml(project.id)}" aria-label="觀看 ${escapeHtml(project.title)}，${escapeHtml(project.category)}"><div class="cover-frame more-cover${movie ? ` is-film${poster ? ' is-ready' : ''}` : ' is-ready'}" style="--cover-position:${escapeHtml(project.coverPosition || '50% 50%')};--cover-fit:${escapeHtml(project.coverFit || 'cover')}">${media}</div><div class="more-card-meta"><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.category)}</p></div></a></article>`;
}

function moreWork() {
  if (!additionalProjects.length) return '';
  return `<section class="more-works" id="more-works" aria-labelledby="more-title"><div class="section-line"><h2 id="more-title"><span class="section-kicker">MORE WORK</span>更多作品</h2><span class="section-count">${String(additionalProjects.length).padStart(2,'0')} PROJECTS</span></div><div class="more-grid">${additionalProjects.map(smallCard).join('')}</div></section>`;
}

function home() {
  document.title = 'Wilson｜邱政典 — Portfolio';
  content.innerHTML = `<section class="profile-section" aria-labelledby="home-title"><p class="section-kicker">PROFILE</p><div class="intro"><figure class="intro-art"><img src="${escapeHtml(profile.hero.src)}" srcset="${escapeHtml(profile.hero.thumb)} 960w, ${escapeHtml(profile.hero.src)} ${profile.hero.width}w" sizes="(max-width:760px) 90vw, 42vw" width="${profile.hero.width}" height="${profile.hero.height}" alt="${escapeHtml(profile.hero.alt)}" fetchpriority="high" decoding="async"><figcaption><span>3D ARTIST / PRODUCT VISUALS</span><strong>Wilson<span class="name-divider">｜</span>邱政典</strong></figcaption></figure><div class="intro-content"><p class="eyebrow">Product Visualization &amp; Animation</p><h1 id="home-title"><span>3D 產品視覺</span><span>與動畫設計</span></h1><div class="intro-copy"><p>${escapeHtml(profile.summary)}</p><p class="intro-tools">Cinema 4D / OctaneRender<br>Photoshop / DaVinci Resolve</p></div></div></div><div class="profile-highlights" aria-label="經驗與製作能力"><div class="highlight"><strong class="highlight-number">8<span> YEARS</span></strong><p>3D 視覺與動畫經驗</p></div><div class="highlight"><strong class="highlight-number">${featuredProjects.length}<span> PROJECTS</span></strong><p>精選商業專案</p></div><div class="highlight"><strong>STILL<span> / MOTION</span></strong><p>產品圖像與動畫</p></div><div class="highlight"><strong>FULL<span> PROCESS</span></strong><p>建模、渲染與後製</p></div></div></section><section id="works" aria-labelledby="work-title"><div class="section-line"><h2 id="work-title"><span class="section-kicker">SELECTED WORKS</span>精選作品</h2><span class="section-count">${String(featuredProjects.length).padStart(2,'0')} PROJECTS</span></div><div class="projects-grid">${featuredProjects.map(card).join('')}</div></section>${moreWork()}<section class="about" id="about" aria-labelledby="about-title"><div><p class="eyebrow">About</p><h2 id="about-title">Wilson｜邱政典</h2></div><div><p>${escapeHtml(profile.bio)}</p><p>${escapeHtml(profile.workflow)}</p><ul class="tools-list">${profile.tools.map(tool => `<li>${escapeHtml(tool)}</li>`).join('')}</ul></div></section>`;
  prepareCoverPosters();
}

function fact(label, value) {
  if (!value) return '';
  return `<div class="fact-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
}

function player(video, {hero = false} = {}) {
  return `<video controls playsinline preload="${hero ? 'metadata' : 'none'}" aria-label="${escapeHtml(video.label)}"${video.poster ? ` poster="${escapeHtml(video.poster)}"` : ''}${hero ? ' data-hero-video' : ''}><source src="${escapeHtml(video.src)}" type="video/mp4">你的瀏覽器不支援影片播放。<a href="${escapeHtml(video.src)}">開啟原影片</a></video>`;
}

function gallery(group) {
  return `<section class="media-section" aria-label="${escapeHtml(group.title)}"><div class="media-section-header"><h2>${escapeHtml(group.title)}</h2><span>${String(group.images.length).padStart(2,'0')} IMAGES</span></div><div class="image-grid">${group.images.map(item => `<figure><div class="image-panel${item.background === 'light' ? ' is-light' : ''}">${image(item)}</div><figcaption>${escapeHtml(item.caption)}</figcaption></figure>`).join('')}</div></section>`;
}

function detail(project) {
  document.title = `${project.title} — Wilson｜邱政典`;
  const movie = project.kind === 'film';
  const extra = project.collection === 'additional';
  const returnRoute = extra ? '#/more' : '#/';
  const returnLabel = extra ? '返回更多作品' : '返回作品首頁';
  const client = project.client || (extra ? '' : 'MAGEASY');
  const headingLabel = project.category || (movie ? 'Product Animation' : 'Product Visuals');
  const hero = movie ? player(project.videos[0], {hero:true}) : image(project.cover, {eager:true,hero:true});
  const videos = !movie && project.videos.length ? `<section class="media-section"><div class="media-section-header"><h2>產品動態</h2><span>${String(project.videos.length).padStart(2,'0')} FILMS</span></div><div class="video-grid${project.videos.length === 1 ? ' is-single' : ''}">${project.videos.map(video => `<figure class="video-panel">${player(video)}<figcaption>${escapeHtml(video.label)}</figcaption></figure>`).join('')}</div></section>` : '';
  content.innerHTML = `<a href="${returnRoute}" class="project-back">${returnLabel}</a><section class="project-heading" aria-labelledby="project-title"><div><p class="eyebrow">${client ? `${escapeHtml(client)} / ` : ''}${escapeHtml(headingLabel)}</p><h1 id="project-title">${escapeHtml(project.title)}</h1><p class="detail-subtitle">${escapeHtml(project.subtitle)}</p></div><dl class="project-facts">${extra ? fact('作品類型',project.category) : ''}${fact('製作方式',project.production)}${fact('負責範圍',project.role)}${fact('使用工具',project.tools)}${fact('製作說明',project.note)}</dl></section><figure class="hero-media${movie ? ' video-hero' : ''}">${hero}</figure>${videos}${project.groups.map(gallery).join('')}<div class="detail-bottom"><a href="${returnRoute}">${extra ? '返回更多作品' : '返回所有作品'}</a></div>`;
  wirePlayers();
  if (movie) prepareHeroPoster(project);
  else prepareShortPosters(project);
}

async function prepareShortPosters(project) {
  const players = [...content.querySelectorAll('video')];
  await Promise.allSettled(project.videos.map(async (video, index) => {
    if (video.poster) return;
    const target = players[index];
    const src = await filmPoster({id:video.src,videos:[video]});
    if (target?.isConnected && target.paused && target.currentTime === 0) target.poster = src;
  }));
}

function wirePlayers() {
  content.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => content.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); }));
    video.addEventListener('error', () => {
      if (video.nextElementSibling?.classList.contains('media-error')) return;
      const note = document.createElement('p'); note.className = 'media-error';
      note.textContent = '影片暫時無法播放，請重新整理後再試。'; video.after(note);
    });
  });
}

async function filmPoster(project) {
  if (posterCache.has(project.id)) return posterCache.get(project.id);
  const promise = new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true; video.playsInline = true; video.preload = 'metadata';
    const timeout = setTimeout(() => finish(new Error('Poster decode timed out')), 30000);
    let complete = false;
    function finish(error, value) {
      if (complete) return; complete = true; clearTimeout(timeout);
      video.pause(); video.removeAttribute('src'); video.load();
      if (error) reject(error); else resolve(value);
    }
    video.addEventListener('error', () => finish(new Error('Video could not be decoded')), {once:true});
    video.addEventListener('loadedmetadata', () => { video.currentTime = video.duration * Math.max(0,Math.min(.95,project.posterFraction ?? .25)); }, {once:true});
    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(1280,video.videoWidth); canvas.height = Math.round(canvas.width * video.videoHeight / video.videoWidth);
        canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
        finish(null,canvas.toDataURL('image/webp',.9));
      } catch (error) { finish(error); }
    }, {once:true});
    video.src = asset(project.videos[0].src); video.load();
  });
  posterCache.set(project.id,promise);
  try { return await promise; } catch (error) { posterCache.delete(project.id); throw error; }
}

async function prepareCoverPosters() {
  const sequence = renderSequence;
  await Promise.allSettled(projects.filter(project => project.kind === 'film').map(async project => {
    const target = content.querySelector(`[data-poster="${project.id}"]`);
    if (!target) return;
    try {
      const src = await filmPoster(project);
      if (renderSequence !== sequence || !target.isConnected) return;
      target.src = src; target.closest('.cover-frame').classList.add('is-ready');
    } catch {
      if (!target.isConnected) return;
      target.closest('.cover-frame').classList.add('is-error');
      target.nextElementSibling.textContent = '點擊觀看完整動畫';
    }
  }));
}

async function prepareHeroPoster(project) {
  const video = content.querySelector('[data-hero-video]');
  if (project.videos[0].poster) return;
  try { const src = await filmPoster(project); if (video.isConnected && video.paused && video.currentTime === 0) video.poster = src; } catch { /* Native controls remain usable. */ }
}

function render() {
  const route = location.hash.slice(1) || '/';
  const oldHome = ['/', '/about', '/more'].includes(currentRoute);
  const returningFromProject = currentRoute.startsWith('/projects/');
  if (oldHome && route.startsWith('/projects/')) homeScroll = window.scrollY;
  content.querySelectorAll('video').forEach(video => video.pause());
  const nextHome = ['/', '/about', '/more'].includes(route);
  if (!nextHome || !oldHome || !currentRoute) renderSequence++;
  if (nextHome && !oldHome) home();
  else if (nextHome && !currentRoute) home();
  else if (!nextHome) {
    const project = projects.find(project => route === `/projects/${project.id}`);
    if (project) detail(project);
    else { document.title = '找不到專案 — Wilson'; content.innerHTML = '<section class="notice"><h1>找不到這個專案</h1><p>請返回作品首頁，選擇你想觀看的作品。</p><a href="#/">返回作品首頁</a></section>'; }
  }
  document.querySelectorAll('[data-nav]').forEach(link => {
    const active = (link.dataset.nav === 'work' && route === '/') || (link.dataset.nav === 'about' && route === '/about') || (link.dataset.nav === 'more' && route === '/more');
    if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  currentRoute = route;
  requestAnimationFrame(() => {
    if (route === '/about') document.getElementById('about')?.scrollIntoView({behavior:'instant'});
    else if (route === '/more') {
      if (returningFromProject && homeScroll > 0) window.scrollTo({top:homeScroll,behavior:'instant'});
      else document.getElementById('more-works')?.scrollIntoView({behavior:'instant'});
    }
    else window.scrollTo({top:nextHome && !oldHome ? homeScroll : 0,behavior:'instant'});
  });
}

document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); content.focus(); content.scrollIntoView(); });
window.addEventListener('hashchange', render);
render();

