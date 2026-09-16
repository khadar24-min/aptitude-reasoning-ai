const dailyTests=[
  {day:1,title:'Number System & Percentage',topics:['Number System','Percentage'],url:'https://www.jotform.com/build/262584389690069'},
  {day:2,title:'Profit & Loss, Ratio & Proportion, Discounts',topics:['Profit & Loss','Ratio & Proportion','Discounts'],url:'https://www.jotform.com/build/262583785245064'},
  {day:3,title:'Partnership & Interest',topics:['Partnership','Simple Interest','Compound Interest'],url:'https://www.jotform.com/build/262583763359066'},
  {day:4,title:'Time & Work, Pipes & Cisterns',topics:['Time & Work','Pipes & Cisterns'],url:'https://www.jotform.com/build/262584010232042'},
  {day:5,title:'Time & Distance, Trains, Boats & Streams',topics:['Time & Distance','Problems on Trains','Boats & Streams'],url:'https://www.jotform.com/build/262583998705071'},
  {day:6,title:'Averages, Ages, Mixtures & Allegations',topics:['Averages','Ages','Mixtures & Allegations'],url:'https://www.jotform.com/build/262583819114057'},
  {day:7,title:'Mensuration & Probability',topics:['Mensuration','Probability'],url:'https://www.jotform.com/build/262584333992063'},
  {day:8,title:'Permutations & Combinations, Data Interpretation',topics:['Permutations & Combinations','Data Interpretation'],url:'https://www.jotform.com/build/262584559384068'},
  {day:9,title:'Series, Coding-Decoding, Analogy & Directions',topics:['Series','Coding-Decoding','Analogy','Directions'],url:'https://www.jotform.com/build/262584448472063'},
  {day:10,title:'Ranking, Syllogisms & Seating Arrangement',topics:['Ranking','Syllogisms','Seating Arrangement'],url:'https://www.jotform.com/build/262584252409056'}
];

const views={overview:'Overview',students:'Students',analytics:'Analytics',reports:'Reports',tests:'Daily Tests'};
const nav=document.querySelector('.sidebar nav');
if(nav&&!nav.querySelector('[data-view="tests"]')){
  const item=document.createElement('button');
  item.className='nav-item'; item.dataset.view='tests'; item.innerHTML='<span>✓</span>Daily Tests';
  nav.insertBefore(item,nav.querySelector('[data-view="analytics"]'));
}
const mainContent=document.querySelector('.content');
if(mainContent&&!document.getElementById('testsView')){
  const section=document.createElement('div');
  section.id='testsView'; section.className='view hidden';
  section.innerHTML=`<div class="section-head"><div><p class="eyebrow">10-DAY PROGRAM</p><h2>Daily Aptitude Tests</h2><p>Separate assessments for each day, using only the topics allocated to that day.</p></div></div><div class="daily-tests-grid">${dailyTests.map(t=>`<article class="daily-test-card"><div class="day-number">DAY ${t.day}</div><h3>${t.title}</h3><div class="topic-list">${t.topics.map(x=>`<span>${x}</span>`).join('')}</div><div class="test-meta"><span>30 Questions</span><span>30 Minutes</span></div><button class="primary-btn start-test" data-test-url="${t.url}">Start Day ${t.day} Test ↗</button></article>`).join('')}</div>`;
  mainContent.appendChild(section);
}
const style=document.createElement('style');
style.textContent=`.daily-tests-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.daily-test-card{background:#fff;border:1px solid #e8eaf0;border-radius:20px;padding:24px;box-shadow:0 8px 24px rgba(20,25,45,.05);display:flex;flex-direction:column;min-height:230px}.daily-test-card .day-number{font-size:12px;font-weight:800;letter-spacing:.12em;color:#6d5dfc;margin-bottom:10px}.daily-test-card h3{font-size:20px;line-height:1.25;margin:0 0 14px}.topic-list{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px}.topic-list span{font-size:12px;background:#f4f5f8;border-radius:999px;padding:7px 10px;color:#555b6e}.test-meta{display:flex;gap:18px;font-size:12px;color:#73798a;margin-top:auto;margin-bottom:16px}.start-test{width:100%;justify-content:center}.daily-test-card .primary-btn{display:flex}@media(max-width:800px){.daily-tests-grid{grid-template-columns:1fr}}`;
document.head.appendChild(style);

const navItems=document.querySelectorAll('.nav-item');
const viewEls={overview:document.getElementById('overviewView'),students:document.getElementById('studentsView'),analytics:document.getElementById('analyticsView'),reports:document.getElementById('reportsView'),tests:document.getElementById('testsView')};
const title=document.getElementById('pageTitle');
const heading=document.getElementById('viewHeading');
let latestSubmission=null;
function showView(view){Object.keys(viewEls).forEach(k=>viewEls[k]?.classList.toggle('hidden',k!==view));document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));if(title)title.textContent=views[view];if(heading)heading.textContent=view==='overview'?'Good evening, Creator.':views[view];window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('.nav-item').forEach(item=>item.addEventListener('click',()=>showView(item.dataset.view)));
document.querySelectorAll('[data-view-link]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.viewLink)));
document.querySelectorAll('.start-test').forEach(btn=>btn.addEventListener('click',()=>window.open(btn.dataset.testUrl,'_blank','noopener,noreferrer')));
const modal=document.getElementById('reportModal');
function openReport(){modal?.classList.remove('hidden');document.body.style.overflow='hidden'}
function closeReport(){modal?.classList.add('hidden');document.body.style.overflow=''}
document.getElementById('openReport')?.addEventListener('click',openReport);
document.querySelectorAll('[data-report="true"]').forEach(btn=>btn.addEventListener('click',openReport));
document.getElementById('closeModal')?.addEventListener('click',closeReport);
modal?.querySelector('.modal-backdrop')?.addEventListener('click',closeReport);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeReport()});
document.getElementById('jotformBtn')?.addEventListener('click',()=>window.open('https://form.jotform.com/262574105301043','_blank','noopener,noreferrer'));
document.getElementById('reportBtn2')?.addEventListener('click',async()=>{if(latestSubmission){try{const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({submission:latestSubmission})});if(!r.ok)throw new Error('AI service unavailable');const data=await r.json();renderAnalysis(data)}catch(e){console.error(e)}}openReport()});
document.getElementById('menuBtn')?.addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
const search=document.getElementById('studentSearch');
search?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('#studentsView tbody tr').forEach(row=>row.classList.toggle('hidden',!row.innerText.toLowerCase().includes(q)))});
async function loadSubmissions(){try{const r=await fetch('/api/submissions');if(!r.ok)throw new Error('Jotform connection unavailable');const data=await r.json();if(data.submissions?.length){latestSubmission=data.submissions[0];const s=latestSubmission;document.querySelectorAll('.student-strip b').forEach(el=>el.textContent=s.name);document.querySelectorAll('.student-strip small').forEach(el=>el.textContent=`Roll No. ${s.rollNumber} · Latest submission`);document.querySelectorAll('.candidate b').forEach(el=>el.textContent=s.name);document.querySelectorAll('td:nth-child(2)').forEach(el=>el.textContent=s.rollNumber);}}catch(e){console.warn(e.message)}}
function renderAnalysis(data){if(!data||data.error)return;const score=Number(data.score);const total=Number(data.totalQuestions)||30;const pct=Number(data.percentage);document.querySelector('.score-block strong').innerHTML=`${Number.isFinite(score)?score:'—'}<span>/${total}</span>`;document.querySelector('.score-block small').textContent=Number.isFinite(pct)?`${pct.toFixed(2)}%`:'AI reviewed';document.querySelector('.report-score strong').textContent=`${Number.isFinite(score)?score:'—'}/${total}`;document.querySelector('.report-score span').textContent=Number.isFinite(pct)?`${pct.toFixed(2)}%`:'AI reviewed';}
loadSubmissions();
