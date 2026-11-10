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
