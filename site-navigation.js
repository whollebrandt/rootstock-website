(() => {

const siteSearch = document.querySelector('#site-search');
const searchInput = document.querySelector('#site-search-query');
const searchResults = document.querySelector('#site-search-results');
const searchStatus = document.querySelector('#site-search-status');
const searchPages = [
  ['Mug Club', 'mug-club.html', 'Membership, mugs, join, renew, weekly free drink, growler, birthday, discounts'],
  ['Our Menu', 'menu.html', 'Food menu, kitchen, dining, lunch, dinner'],
  ['Weekly Specials', './#specials', 'Weekly food special, hot honey dipped chicken sandwich, fries, monthly drink specials, cocktails'],
  ['Events Calendar', './#events', 'What’s happening, calendar, line dancing, euchre, cornhole'],
  ['Upcoming Music', './#music', 'Live bands, shows, tickets, concerts, open jam night'],
  ['Music Photo Gallery', 'music.html#gallery', 'Photos, music venue, bar, Barrel Room'],
  ['Apply to Play at Rootstock', 'music.html#apply', 'Musician application, band booking, perform, artist, gig'],
  ['Cider & Spirits', 'bar-menu.html', 'Cider, spirits, taps, drinks, tasting room'],
  ['Our Roots', 'about.html', 'About Rootstock, history, cider, distillery, applejack, vodka, brandy, liqueur, our people'],
  ['Plan an Event', 'plan-an-event.html', 'Private events, wedding, birthday, party, booking, Barrel Room, inquiry'],
  ['Visit Rootstock', './#visit', 'Williamson New York, address, location, directions']
];
for (const [date, listings] of Object.entries(events)) {
  for (const [name, time] of listings) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {month:'long', day:'numeric', timeZone:'UTC'}).format(new Date(date));
    searchPages.push([name, './#events', formattedDate + ' · ' + time, date]);
  }
}
function showSearchResults() {
  const words = searchInput.value.toLowerCase().match(/[a-z0-9]+/g) || [];
  searchResults.replaceChildren();
  const matches = words.length ? searchPages.filter(([title, , summary]) => {
    const searchable = (title + ' ' + summary).toLowerCase();
    return words.every(word => searchable.includes(word));
  }) : [];
  searchStatus.textContent = words.length ? matches.length ? matches.length + ' results' : 'No matches. Try a different keyword.' : 'Enter a keyword to find a page section or event.';
  for (const [title, target, summary, date] of matches) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = date ? './?event=' + encodeURIComponent(date) + '#events' : target;
    link.textContent = title;
    const description = document.createElement('small');
    description.textContent = summary;
    link.append(description);
    link.addEventListener('click', event => {
      siteSearch.close();
      if (date && typeof show === 'function') {
        event.preventDefault();
        const [eventYear, eventMonth, eventDay] = date.split('-').map(Number);
        year = eventYear;
        month = eventMonth - 1;
        show(eventDay);
        location.hash = 'events';
      }
      const destination = new URL(link.href, location.href);
      if (destination.pathname !== location.pathname || !destination.hash) return;
      const section = document.getElementById(destination.hash.slice(1));
      if (section) {
        section.setAttribute('tabindex', '-1');
        section.focus({preventScroll: true});
      }
    });
    item.append(link);
    searchResults.append(item);
  }
}
document.querySelectorAll('button.search-toggle[aria-haspopup]').forEach(button => {
  button.addEventListener('click', () => {
    showSearchResults();
    siteSearch.showModal();
    searchInput.focus();
  });
});
searchInput.addEventListener('input', showSearchResults);
const desktopDropdowns = [...document.querySelectorAll('.nav > details')];
document.addEventListener('click', event => {
  for (const dropdown of desktopDropdowns) {
    if (!dropdown.contains(event.target) || event.target.closest('a')) dropdown.open = false;
  }
});
for (const dropdown of desktopDropdowns) {
  dropdown.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dropdown.open) {
      dropdown.open = false;
      dropdown.querySelector('summary').focus();
    }
  });
}
const mobileNavigation = document.querySelector('.mobile-links details');
mobileNavigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => { mobileNavigation.open = false; });
});

const requestedEvent = new URLSearchParams(location.search).get('event');
if (requestedEvent && Object.hasOwn(events, requestedEvent) && typeof show === 'function') {
  const [eventYear, eventMonth, eventDay] = requestedEvent.split('-').map(Number);
  year = eventYear;
  month = eventMonth - 1;
  show(eventDay);
}

})();
