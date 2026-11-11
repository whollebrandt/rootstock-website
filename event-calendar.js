const eventCategoryLabels = {music:'Music', cornhole:'Cornhole', euchre:'Euchre', jam:'Jam Night', dancing:'Line Dancing', other:'Other events'};
function eventCategory(title, category) {
  if (Object.hasOwn(eventCategoryLabels, category)) return category;
  if (/jam night/i.test(title)) return 'jam';
  if (/cornhole/i.test(title)) return 'cornhole';
  if (/euchre/i.test(title)) return 'euchre';
  return musicShows.has(title) ? 'music' : 'other';
}
function calendarNode(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}
function calendarCategory(entry) {
  return eventCategory(entry[0], entry[4]);
}
function categoryMarkers(listings) {
  const categories = [...new Set(listings.map(calendarCategory))];
  const markers = calendarNode('span', 'day-markers');
  markers.setAttribute('aria-hidden', 'true');
  markers.append(...categories.map(category => calendarNode('span', 'event-dot calendar-' + category)));
  return markers;
}
let year = 2026, month = 10, selected = null;
const cal = document.getElementById('cal'), detail = document.getElementById('detail');
function key(day) {
  return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}
function show(day) {
  selected = day;
  const listings = events[key(day)] || [];
  const date = new Date(year, month, day).toLocaleDateString('en-US', {weekday:'long',month:'long',day:'numeric'});
  const panel = document.createElement('div');
  panel.append(calendarNode('span', 'tag', date), calendarNode('strong', '', listings.map(row => row[0]).join(' · ') || 'No listed events'));
  if (!listings.length) panel.append(calendarNode('small', '', 'Explore another highlighted date.'));
  for (const entry of listings) {
    const [title, time, flyer, description, , , tickets] = entry;
    const category = calendarCategory(entry);
    const line = document.createElement('small');
    const badge = calendarNode('span', 'calendar-category calendar-' + category, eventCategoryLabels[category]);
    badge.prepend(calendarNode('span', 'event-dot'));
    line.append(badge, document.createTextNode(' ' + title + (time ? ' — ' + time : '')));
    panel.append(line);
    if (description) panel.append(calendarNode('small', 'sub', description));
    if (flyer) {
      const link = document.createElement('a');
      link.href = flyer;
      link.target = '_blank';
      link.rel = 'noopener';
      const image = calendarNode('img', 'event-flyer');
      image.src = flyer;
      image.alt = title + ' flyer';
      link.append(image);
      panel.append(link);
    }
    if (tickets) {
      const link = calendarNode('a', 'action', 'Buy Tickets');
      link.href = tickets;
      panel.append(link);
    }
  }
  detail.replaceChildren(panel);
  render();
}
function render() {
  document.getElementById('monthTitle').textContent = new Date(year, month, 1).toLocaleDateString('en-US', {month:'long',year:'numeric'});
  cal.replaceChildren(...['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => calendarNode('div', 'weekday', day)));
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < first; i++) {
    const empty = calendarNode('button', 'day');
    empty.disabled = true;
    cal.append(empty);
  }
  for (let day = 1; day <= days; day++) {
    const listings = events[key(day)] || [];
    const button = calendarNode('button', 'day' + (listings.length ? ' has-event' : '') + (selected === day ? ' selected' : ''));
    button.append(calendarNode('span', 'day-num', String(day)));
    if (listings.length) button.append(calendarNode('span', 'day-label', listings[0][0]), categoryMarkers(listings));
    button.setAttribute('aria-label', day + ' ' + (listings.map(entry => entry[0] + ' (' + eventCategoryLabels[calendarCategory(entry)] + ')').join(', ') || 'no events'));
    button.onclick = () => show(day);
    cal.append(button);
  }
}
function move(change) {
  const next = new Date(year, month + change, 1);
  year = next.getFullYear();
  month = next.getMonth();
  selected = null;
  const panel = document.createElement('div');
  panel.append(calendarNode('span', 'tag', 'Browse events'), calendarNode('strong', '', 'Select a highlighted date'), calendarNode('small', '', 'Event details will appear here.'));
  detail.replaceChildren(panel);
  render();
}
document.getElementById('prev').onclick = () => move(-1);
document.getElementById('next').onclick = () => move(1);
render();

/* Responsive four-day mobile calendar; desktop month grid remains unchanged. */
(function(){
  const style=document.createElement('style');
  style.textContent=`@media(max-width:700px){
    #cal,.calendar-wrap .calendar-legend{display:none!important}
    .mobile-fourday{display:block;margin-top:12px}
    .mobile-fourday-nav{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:15px}
    .mobile-fourday-nav button{border:1px solid #ffffff30;background:#ffffff12;color:#f2eee7;border-radius:999px;min-width:44px;min-height:44px;font-size:24px;transition:transform .25s cubic-bezier(.2,1.5,.4,1),background .2s}
    .mobile-fourday-nav button:active{transform:scale(.9)}
    .mobile-fourday-nav button:disabled{opacity:.3}
    .mobile-fourday-range{font-size:14px;font-weight:650;text-align:center}
    .mobile-fourday-list{display:grid;gap:10px}
    .mobile-day{width:100%;text-align:left;display:flex;gap:15px;align-items:center;min-height:85px;padding:14px;border-radius:20px;border:1px solid #ffffff18;background:linear-gradient(135deg,#ffffff12,#ffffff06);color:#f2eee7;transition:transform .35s cubic-bezier(.2,1.6,.35,1),background .2s,border-color .2s}
    .mobile-day:active{transform:scale(.97)}
    .mobile-day.selected{border-color:#c9a27c;background:#c9a27c20}
    .mobile-day-date{width:51px;flex-shrink:0;text-align:center}
    .mobile-day-weekday{display:block;color:#b7b9b2;font-size:11px;letter-spacing:.09em}
    .mobile-day-number{display:block;font-size:28px;font-weight:700;line-height:1.15}
    .mobile-day-events{display:grid;gap:5px;font-size:14px;min-width:0}
    .mobile-day-events small{display:block;color:#b7b9b2;font-size:12px}
    .mobile-day-events .event-dot{display:inline-block;margin-right:6px}
  }
  @media(min-width:701px){.mobile-fourday{display:none!important}}
  @media(hover:hover) and (max-width:700px){.mobile-day:hover{transform:translateY(-2px) scale(1.01);border-color:#c9a27c80}}
  @media(prefers-reduced-motion:reduce){.mobile-day,.mobile-fourday-nav button{transition:none!important}}`;
  document.head.append(style);
  const mobile=document.createElement('div');
  mobile.className='mobile-fourday';
  mobile.setAttribute('aria-label','Four-day events calendar');
  mobile.innerHTML='<div class="mobile-fourday-nav"><button type="button" class="mobile-back" aria-label="Previous four days">‹</button><span class="mobile-fourday-range"></span><button type="button" class="mobile-forward" aria-label="Next four days">›</button></div><div class="mobile-fourday-list"></div>';
  cal.before(mobile);
  let offset=0;
  function drawMobile(){
    const days=new Date(year,month+1,0).getDate();
    offset=Math.max(0,Math.min(offset,Math.max(0,days-4)));
    const start=offset+1,end=Math.min(days,start+3);
    mobile.querySelector('.mobile-fourday-range').textContent=new Date(year,month,start).toLocaleDateString('en-US',{month:'short',day:'numeric'})+' – '+end;
    mobile.querySelector('.mobile-back').disabled=offset===0;
    mobile.querySelector('.mobile-forward').disabled=end===days;
    const list=mobile.querySelector('.mobile-fourday-list');list.replaceChildren();
    for(let d=start;d<=end;d++){
      const entries=events[key(d)]||[];
      const button=document.createElement('button');
      button.type='button';button.className='mobile-day'+(selected===d?' selected':'');
      button.setAttribute('aria-label',new Date(year,month,d).toDateString()+': '+(entries.length?entries.map(e=>e[0]).join(', '):'No listed events'));
      const date=document.createElement('span');date.className='mobile-day-date';
      date.innerHTML='<span class="mobile-day-weekday">'+new Date(year,month,d).toLocaleDateString('en-US',{weekday:'short'})+'</span><span class="mobile-day-number">'+d+'</span>';
      const content=document.createElement('span');content.className='mobile-day-events';
      if(entries.length){entries.forEach(([name,time])=>{const line=document.createElement('span');line.textContent=name;const sub=document.createElement('small');sub.textContent=time;line.append(sub);content.append(line)})}
      else {const empty=document.createElement('small');empty.textContent='No events scheduled';content.append(empty)}
      button.append(date,content);button.onclick=()=>show(d);list.append(button);
    }
  }
  mobile.querySelector('.mobile-back').onclick=()=>{offset=Math.max(0,offset-4);drawMobile()};
  mobile.querySelector('.mobile-forward').onclick=()=>{offset=Math.min(new Date(year,month+1,0).getDate()-4,offset+4);drawMobile()};
  const originalRender=render;
  render=function(){originalRender();drawMobile()};
  const originalMove=move;
  move=function(n){offset=0;originalMove(n)};
  drawMobile();
})();

