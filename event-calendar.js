const eventCategoryLabels = {music:'Music', cornhole:'Cornhole', euchre:'Euchre', jam:'Jam Night', other:'Other events'};
function eventCategory(title) {
  if (/jam night/i.test(title)) return 'jam';
  if (/cornhole/i.test(title)) return 'cornhole';
  if (/euchre/i.test(title)) return 'euchre';
  return musicShows.has(title) ? 'music' : 'other';
}
function categoryMarkers(listings) {
  const categories = [...new Set(listings.map(([title]) => eventCategory(title)))];
  return categories.length ? '<span class="day-markers" aria-hidden="true">' + categories.map(category => '<span class="event-dot calendar-' + category + '"></span>').join('') + '</span>' : '';
}
function calendarListing([title, time]) {
  const category = eventCategory(title);
  return '<span class="calendar-category calendar-' + category + '"><span class="event-dot" aria-hidden="true"></span>' + eventCategoryLabels[category] + '</span> ' + title + ' — ' + time;
}
let year=2026,month=10,selected=null;const cal=document.getElementById("cal"),detail=document.getElementById("detail");function key(d){return year+"-"+String(month+1).padStart(2,"0")+"-"+String(d).padStart(2,"0")}function show(d){selected=d;const es=events[key(d)]||[];const date=new Date(year,month,d).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});detail.innerHTML='<div><span class="tag">'+date+'</span><strong>'+ (es.length?es.map(x=>x[0]).join(" · "):"No listed events")+'</strong><small>'+(es.length?es.map(calendarListing).join("<br>"):"Explore another highlighted date.")+'</small>'+es.map(([title, , flyer, description]) => flyer ? '<a href="'+flyer+'" target="_blank" rel="noopener"><img class="event-flyer" src="'+flyer+'" alt="'+title+' flyer. '+description+'"></a>' : '').join("")+'</div>';render()}function render(){document.getElementById("monthTitle").textContent=new Date(year,month,1).toLocaleDateString("en-US",{month:"long",year:"numeric"});cal.innerHTML="";["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(x=>{let el=document.createElement("div");el.className="weekday";el.textContent=x;cal.append(el)});const first=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate();for(let i=0;i<first;i++){let b=document.createElement("button");b.className="day";b.disabled=true;cal.append(b)}for(let d=1;d<=days;d++){let es=events[key(d)]||[];let b=document.createElement("button");b.className="day"+(es.length?" has-event":"")+(selected===d?" selected":"");b.innerHTML='<span class="day-num">'+d+'</span>'+(es.length?'<span class="day-label">'+es[0][0]+'</span>':"")+categoryMarkers(es);b.setAttribute("aria-label",d+" "+(es.length?es.map(([title])=>title+" ("+eventCategoryLabels[eventCategory(title)]+")").join(", "):"no events"));b.onclick=()=>show(d);cal.append(b)}}function move(n){month+=n;if(month>11){month=0;year++}if(month<0){month=11;year--}selected=null;detail.innerHTML='<div><span class="tag">Browse events</span><strong>Select a highlighted date</strong><small>Event details will appear here.</small></div>';render()}document.getElementById("prev").onclick=()=>move(-1);document.getElementById("next").onclick=()=>move(1);render();

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
