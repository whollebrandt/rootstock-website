const musicList = document.querySelector('#music-list');
const ticketDialog = document.querySelector('#ticket-preview');
const todayInWilliamson = new Intl.DateTimeFormat('en-CA', {timeZone: 'America/New_York', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
function renderMusicList() {
  musicList.replaceChildren();
  const listingLimit = Number(musicList.dataset.limit || Infinity);
for (const [date, listings] of Object.entries(events).sort(([a], [b]) => a.localeCompare(b))) {
  if (date < todayInWilliamson) continue;
  const dateLabel = new Intl.DateTimeFormat('en-US', {weekday:'short', month:'short', day:'numeric', timeZone:'UTC'}).format(new Date(date));
  for (const [name, time, , , category, metadata] of listings) {
    const show = category ? metadata : musicShows.get(name);
    if (!show || musicList.childElementCount >= listingLimit) continue;
    const row = document.createElement('article');
    row.className = 'show-row';
    const copy = document.createElement('div');
    const day = document.createElement('div');
    day.className = 'tag';
    day.textContent = dateLabel;
    const title = document.createElement('h3');
    title.textContent = name;
    const details = document.createElement('p');
    details.className = 'sub';
    details.textContent = show.cover ? time + ' · ' + show.cover : time;
    copy.append(day, title, details);
    row.append(copy);
    if (show.checkoutUrl || show.cover) {
      const control = document.createElement(show.checkoutUrl ? 'a' : 'button');
      control.className = 'action feature-action';
      control.textContent = show.checkoutUrl ? 'Buy Tickets' : 'Ticket Preview';
      control.setAttribute('aria-label', control.textContent + ' for ' + name);
      if (show.checkoutUrl) {
        control.href = show.checkoutUrl;
      } else {
        control.type = 'button';
        control.addEventListener('click', () => {
          document.querySelector('#ticket-title').textContent = name;
          ticketDialog.showModal();
        });
      }
      row.append(control);
    }
    musicList.append(row);
  }
}
if (!musicList.childElementCount) musicList.textContent = 'Check back for upcoming shows.';
}
renderMusicList();
