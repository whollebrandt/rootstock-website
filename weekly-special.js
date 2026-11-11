(() => {
  const studioOrigin = 'https://rootstock-creative-studio-dev-api.onrender.com';
  const endpoint = studioOrigin + '/api/website/published';
  const cards = [...document.querySelectorAll('[data-weekly-special]')];
  const defaultSpecial = {
    title: 'Hot Honey Dipped Chicken Sandwich',
    description: 'Buttermilk chicken dipped in hot honey butter sauce, topped with sweet and tangy coleslaw on a brioche bun. Served with shoestring fries.',
  };
  let showingDraft = false;

  function validSpecial(special) {
    return special && typeof special.title === 'string' && special.title.trim().length > 0 && special.title.length <= 160 &&
      typeof special.description === 'string' && special.description.trim().length > 0 && special.description.length <= 2000;
  }

  function renderSpecial(special) {
    if (!validSpecial(special)) return;
    for (const card of cards) {
      let title = card.querySelector('h3');
      let description = card.querySelector('p.sub');
      if (!title) {
        if (card.hasAttribute('data-special-photo')) {
          const photo = document.createElement('img');
          photo.className = 'special-photo';
          photo.src = 'assets/hot-honey-chicken.webp';
          photo.alt = 'Rootstock hot honey chicken sandwich with shoestring fries';
          photo.width = 900;
          photo.height = 1200;
          photo.loading = 'lazy';
          card.append(photo);
        }
        title = document.createElement('h3');
        description = document.createElement('p');
        description.className = 'sub';
        card.append(title, description);
      }
      title.textContent = special.title;
      description.textContent = special.description;
      // The existing photo is specific to the current sandwich.
      const photo = card.querySelector('.special-photo');
      if (photo) photo.style.display = special.title === defaultSpecial.title ? '' : 'none';
    }
  }

  renderSpecial(defaultSpecial);
  fetch(endpoint, {credentials: 'omit', cache: 'no-store'})
    .then(response => {
      if (!response.ok) throw new Error('Published special is temporarily unavailable');
      return response.json();
    })
    .then(data => { if (!showingDraft) renderSpecial(data.weeklySpecial); })
    .catch(() => { /* Retain the last built-in special when the Studio is unavailable. */ });

  if (new URLSearchParams(location.search).get('studioPreview') !== '1' || window.parent === window) return;
  window.addEventListener('message', event => {
    if (event.origin !== studioOrigin || event.source !== window.parent || event.data?.type !== 'rootstock-weekly-special-preview') return;
    if (!validSpecial(event.data.weeklySpecial)) return;
    showingDraft = true;
    renderSpecial(event.data.weeklySpecial);
    let badge = document.getElementById('studio-draft-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'studio-draft-badge';
      badge.textContent = 'PRIVATE DRAFT · NOT PUBLISHED';
      badge.style.cssText = 'position:fixed;bottom:12px;left:12px;z-index:1000;padding:9px 14px;border-radius:8px;background:#dfbd9d;color:#141815;font:600 12px system-ui,sans-serif';
      document.body.append(badge);
    }
    cards[0]?.scrollIntoView({block: 'center'});
    window.parent.postMessage({type: 'rootstock-weekly-special-previewed', requestId: event.data.requestId}, studioOrigin);
  });
  window.parent.postMessage({type: 'rootstock-website-ready'}, studioOrigin);
})();
