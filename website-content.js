(() => {
  const studioOrigin = 'https://rootstock-creative-studio-dev-api.onrender.com';
  const params = new URLSearchParams(location.search);
  const page = location.pathname.split('/').pop() || 'index.html';
  const inPreview = params.get('studioPreview') === '1' && parent !== window;
  const requestId = params.get('request');
  const builtInSpecial = {
    title:'Hot Honey Dipped Chicken Sandwich',
    description:'Buttermilk chicken dipped in hot honey butter sauce, topped with sweet and tangy coleslaw on a brioche bun. Served with shoestring fries.',
  };
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function photo(url, alt) {
    const img = element('img');
    img.src = url;
    img.alt = alt || '';
    img.loading = 'lazy';
    return img;
  }
  function link(url, label) {
    const item = element('a', label);
    item.href = url;
    return item;
  }
  function weekly(special) {
    for (const card of document.querySelectorAll('[data-weekly-special]')) {
      const contents = [];
      const imageUrl = special.photo || (special.title === builtInSpecial.title ? 'assets/hot-honey-chicken.webp' : '');
      if (card.hasAttribute('data-special-photo') && imageUrl) {
        const image = photo(imageUrl, special.photoAlt || (special.photo ? special.title : 'Rootstock hot honey chicken sandwich with shoestring fries'));
        image.className = 'special-photo';
        image.width = 900;
        image.height = 1200;
        contents.push(image);
      }
      const previous = card.querySelector('.studio-weekly-content');
      previous?.remove();
      card.querySelector(':scope > h3')?.remove();
      card.querySelector(':scope > p.sub')?.remove();
      const wrapper = element('div', '', 'studio-weekly-content');
      wrapper.append(...contents, element('h3', special.title), element('p', special.description, 'sub'));
      card.append(wrapper);
    }
  }
  function listItem(row, kind) {
    const item = element('li');
    const label = row.price ? row.name + ' · ' + row.price : row.name;
    item.append(element(kind === 'simpleList' ? 'span' : 'strong', label));
    if (row.availability === 'Sold out') item.append(document.createTextNode(' · Sold out'));
    if (row.description) item.append(element('p', row.description, 'sub'));
    if (row.photo) item.append(photo(row.photo, row.name));
    return item;
  }
  function gallery(target, rows) {
    const originals = [...target.children];
    target.replaceChildren(...rows.flatMap(row => {
      const existing = originals[Number(row.original || '-1')]?.querySelector('img');
      const image = row.photo ? photo(row.photo, row.alt) : existing?.cloneNode();
      if (!image) return [];
      image.alt = row.alt || '';
      const figure = element('figure');
      figure.append(image, element('figcaption', row.caption));
      return [figure];
    }));
  }
  function bind(target, attribute, value) {
    switch (attribute) {
      case 'text': target.textContent = value; break;
      case 'leadingText':
        if (target.firstChild?.nodeType === Node.TEXT_NODE) target.firstChild.textContent = value + ' ';
        else target.prepend(document.createTextNode(value + ' '));
        break;
      case 'visible': target.toggleAttribute('data-studio-hidden', !value); break;
      case 'required': target.required = value; break;
      case 'heroPhoto':
        if (value) {
          const style = element('style', '.hero::before{background-image:linear-gradient(90deg,#0e1110e6,#0e111040),url(' + JSON.stringify(value) + ') !important}');
          document.head.append(style);
        }
        break;
      case 'galleryList': gallery(target, value); break;
      case 'drinksList':
      case 'barList':
      case 'simpleList':
        target.replaceChildren(...value.filter(row => row.availability !== 'Hidden').map(row => listItem(row, attribute)));
        break;
      case 'href':
      case 'src':
        if (value) target.setAttribute(attribute, value);
        else if (attribute === 'href') target.removeAttribute(attribute);
        break;
      case 'alt':
      case 'aria-label':
      case 'placeholder':
        target.setAttribute(attribute, value);
        break;
    }
  }
  function reorder(parentNode, nodes, order) {
    if (!parentNode) return;
    const after = [...nodes.values()].at(-1)?.nextSibling || null;
    for (const {id, visible} of order) {
      const node = nodes.get(id);
      if (node) {
        node.toggleAttribute('data-studio-hidden', !visible);
        parentNode.insertBefore(node, after);
      }
    }
  }
  function food(rows) {
    if (page !== 'menu.html') return;
    const categories = new Map();
    for (const row of rows) {
      if (row.availability === 'Hidden') continue;
      const name = row.category || 'Food Menu';
      if (!categories.has(name)) categories.set(name, []);
      categories.get(name).push(row);
    }
    const menu = element('section', '', 'weekly studio-food-menu');
    for (const [name, items] of categories) {
      const list = element('ul');
      list.append(...items.map(row => listItem(row, 'food')));
      menu.append(element('h2', name), list);
    }
    if (categories.size) document.querySelector('#specials')?.before(menu);
  }
  function publicEvents(rows) {
    for (const date of Object.keys(events)) delete events[date];
    const categoryIds = {'Music':'music','Cornhole':'cornhole','Euchre':'euchre','Jam Night':'jam','Line Dancing':'dancing','Other events':'other'};
    for (const row of rows) {
      const category = categoryIds[row.category] || 'other';
      const show = ['music','jam'].includes(category) ? {cover:row.cover,checkoutUrl:row.tickets} : null;
      (events[row.date] ||= []).push([row.name,row.time,row.flyer,row.description,category,show,row.tickets]);
    }
    if (typeof render === 'function') {
      const requested = params.get('event');
      if (requested && Object.hasOwn(events, requested)) {
        const [eventYear, eventMonth, eventDay] = requested.split('-').map(Number);
        year = eventYear;
        month = eventMonth - 1;
        show(eventDay);
      } else if (selected) {
        show(selected);
      } else {
        render();
      }
    }
  }
  function visitorDetails(values) {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const first = footer.querySelector('strong');
    if (first && values.business) first.textContent = values.business;
    const location = footer.querySelector('strong + :is(span,p)');
    if (location && values.location) location.textContent = values.location;
    if (!first && (values.business || values.location)) {
      const text = (values.business || 'Rootstock Cider & Spirits') + ' · ' + (values.location || 'Williamson, New York');
      const label = footer.querySelector(':scope > span');
      if (label) label.textContent = text;
      else if (footer.firstChild?.nodeType === Node.TEXT_NODE) footer.firstChild.textContent = text;
      else footer.prepend(element('span', text));
    }
    const details = element('div', '', 'studio-visit');
    if (values.address) details.append(element('p', values.address));
    if (values.hours) details.append(element('p', values.hours));
    if (values.phone) details.append(link('tel:' + values.phone.replace(/[^+0-9]/g, ''), values.phone));
    if (values.email) details.append(link('mailto:' + values.email, values.email));
    if (values.directions) details.append(link(values.directions, 'Get directions'));
    if (details.childNodes.length) footer.append(details);
  }
  function effect(name, value) {
    switch (name) {
      case 'food': food(value); break;
      case 'events': publicEvents(value); break;
      case 'musicEmail':
        if (value && document.querySelector('#music-application')) document.querySelector('#music-application').dataset.email = value;
        break;
      case 'inquiryEndpoint':
        if (value && !inPreview && document.querySelector('#inquiry-form')) {
          const form = document.querySelector('#inquiry-form');
          form.action = value;
          form.dataset.delivery = 'enabled';
        }
        break;
      case 'showCount':
        if (page === 'index.html') document.querySelector('#music-list').dataset.limit = value;
        break;
      case 'logo':
        if (value) for (const img of document.querySelectorAll('.brand img')) img.src = value;
        break;
      case 'accent':
      case 'background':
      case 'text-color':
      case 'header-color': {
        const variables = {accent:'--copper',background:'--bg','text-color':'--ink','header-color':'--studio-header'};
        if (value) (name === 'header-color' ? document.querySelector('#site-header') : document.documentElement).style.setProperty(variables[name], value);
        break;
      }
      case 'homeLayout': {
        if (page !== 'index.html') break;
        const hero = document.querySelector('.hero');
        const sections = new Map([...hero.parentNode.querySelectorAll(':scope > section')].map(node => [node.id || 'hero', node]));
        reorder(hero.parentNode, sections, value);
        break;
      }
      case 'navLayout':
        for (const nav of document.querySelectorAll('nav.nav,.mobile-links nav')) {
          const items = new Map([...nav.children].filter(node => node.matches('a,details')).map((node, i) => [String(i),node]));
          reorder(nav, items, value);
        }
        break;
    }
  }
  function renderContent(published, draft) {
    const fields = [...(published.fields || []).filter(field => field.section !== draft?.section), ...(draft?.fields || [])];
    const targets = fields.flatMap(field => field.targets.filter(binding => binding.page === page || binding.page === '*').map(binding => ({
      target:document.evaluate(binding.path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
      attribute:binding.attribute, value:field.value,
    })));
    for (const {target, attribute, value} of targets) if (target) bind(target, attribute, value);
    for (const field of fields) if (field.effect) effect(field.effect, field.value);
    const visit = Object.fromEntries(fields.filter(field => field.effect === 'visit').map(field => [field.key,field.value]));
    if (Object.keys(visit).length) visitorDetails(visit);
    const special = draft?.section === 'weekly'
      ? {...draft.values, photoAlt:draft.values['photo-alt']}
      : {...(published.weeklySpecial || builtInSpecial), photo:published.weeklyPhoto, photoAlt:published.weeklyPhotoAlt};
    weekly(special);
    if (typeof renderMusicList === 'function') renderMusicList();
    const form = document.querySelector('#inquiry-form');
    if (form?.dataset.delivery === 'enabled') {
      if (!fields.some(field => field.key === 'inquiry-14')) form.querySelector('button').textContent = 'Send Inquiry';
      if (!fields.some(field => field.key === 'inquiry-5')) document.querySelector('#inquiry-note').textContent = 'We’ll use your contact details to respond to your inquiry.';
    }
  }
  document.head.append(element('style', `
    [data-studio-hidden]{display:none!important}
    header[style*='--studio-header']{background:var(--studio-header)!important}
    .studio-visit p{white-space:pre-line}
    .studio-visit a{display:block}
    .studio-food-menu img,#drink-specials li img,#specials li img{display:block;max-width:min(100%,240px);max-height:240px;object-fit:cover;border-radius:12px;margin:8px 0}
    .studio-weekly-content .special-photo{display:block}
    .studio-draft-badge{position:fixed;bottom:12px;left:12px;z-index:1000;padding:9px 14px;border-radius:8px;background:#dfbd9d;color:#141815;font:600 12px system-ui,sans-serif}
  `));
  weekly(builtInSpecial);
  const published = fetch(studioOrigin + '/api/website/published?page=' + encodeURIComponent(page),
    {credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(10000)})
    .then(response => response.ok ? response.json() : {}).catch(() => ({}));
  if (!inPreview) {
    published.then(data => renderContent(data));
    return;
  }
  let rendered = false;
  window.addEventListener('message', async event => {
    if (event.origin !== studioOrigin || event.source !== parent || rendered ||
        event.data?.type !== 'rootstock-section-preview' || event.data.requestId !== requestId) return;
    rendered = true;
    const draft = event.data;
    try {
      renderContent(await published, draft);
      document.body.append(element('div', 'PRIVATE DRAFT · NOT PUBLISHED', 'studio-draft-badge'));
      if (draft.section === 'events' && /^\d{4}-\d{2}-\d{2}$/.test(draft.date || '') && typeof show === 'function') {
        const [eventYear, eventMonth, eventDay] = draft.date.split('-').map(Number);
        year = eventYear;
        month = eventMonth - 1;
        show(eventDay);
      }
      const target = draft.anchor ? document.getElementById(draft.anchor) : null;
      target?.scrollIntoView({block:'start'});
      parent.postMessage({type:'rootstock-section-previewed', requestId}, studioOrigin);
    } catch (error) {
      console.error('Rootstock preview could not render', error);
      parent.postMessage({type:'rootstock-section-error', requestId}, studioOrigin);
    }
  });
  parent.postMessage({type:'rootstock-website-ready', requestId}, studioOrigin);
})();
