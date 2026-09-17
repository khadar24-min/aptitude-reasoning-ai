const dailyTests = [
  {day:1,title:'Number System & Percentage',topics:['Number System','Percentage'],resources:['Number types & divisibility notes','Percentage formulas & shortcuts','Practice examples and previous questions'],classActivity:'Learned number properties, divisibility rules, fractions, decimals and percentage basics. Complete the Day 1 practice before the test.',url:'https://form.jotform.com/262584389690069'},
  {day:2,title:'Profit & Loss, Ratio & Proportion, Discounts',topics:['Profit & Loss','Ratio & Proportion','Discounts'],resources:['Profit, loss & discount formula sheet','Ratio and proportion methods','Practice problems on marked price and selling price'],classActivity:'Covered cost price, selling price, profit/loss percentage, ratios, proportions and discount calculations. Review formulas and solve timed examples.',url:'https://form.jotform.com/262583785245064'},
  {day:3,title:'Partnership & Interest',topics:['Partnership','Simple Interest','Compound Interest'],resources:['Partnership investment-ratio notes','Simple Interest formula sheet','Compound Interest and amount examples'],classActivity:'Covered partnership shares, investment and time ratios, simple interest and compound interest calculations. Practice comparing SI and CI.',url:'https://form.jotform.com/262583763359066'},
  {day:4,title:'Time & Work, Pipes & Cisterns',topics:['Time & Work','Pipes & Cisterns'],resources:['Work-rate and efficiency notes','LCM method for work problems','Pipes filling and emptying examples'],classActivity:'Covered work efficiency, individual and combined work rates, and pipes filling or emptying tanks. Focus on rate-based problem solving.',url:'https://form.jotform.com/262584010232042'},
  {day:5,title:'Time & Distance, Trains, Boats & Streams',topics:['Time & Distance','Problems on Trains','Boats & Streams'],resources:['Speed, distance and time formula sheet','Train crossing practice','Upstream and downstream examples'],classActivity:'Covered speed-distance-time relationships, relative speed, train crossing problems, and upstream/downstream calculations.',url:'https://form.jotform.com/262583998705071'},
  {day:6,title:'Averages, Ages, Mixtures & Allegations',topics:['Averages','Ages','Mixtures & Allegations'],resources:['Average and weighted-average notes','Age relationship problems','Mixture and allegation method examples'],classActivity:'Covered average and weighted average, age-based equations, mixture ratios and allegation problems. Practice translating word problems into equations.',url:'https://form.jotform.com/262593847661066'},
  {day:7,title:'Mensuration & Probability',topics:['Mensuration','Probability'],resources:['Area and volume formula sheet','Basic probability rules','Probability and mensuration practice set'],classActivity:'Covered common 2D/3D mensuration formulas and basic probability using favorable outcomes over total outcomes. Practice formula selection.',url:'https://form.jotform.com/262584333992063'},
  {day:8,title:'Permutations & Combinations, Data Interpretation',topics:['Permutations & Combinations','Data Interpretation'],resources:['nPr and nCr formula notes','Arrangement and selection examples','Tables, charts and graph DI practice'],classActivity:'Covered arrangements versus selections, permutation/combination formulas, and extracting calculations from tables, charts and graphs.',url:'https://form.jotform.com/262584559384068'},
  {day:9,title:'Series, Coding-Decoding, Analogy & Directions',topics:['Series','Coding-Decoding','Analogy','Directions'],resources:['Number and letter series patterns','Coding-decoding pattern practice','Analogy and direction-sense questions'],classActivity:'Covered pattern recognition in series, coding-decoding rules, analogy relationships and direction-sense problems. Focus on identifying patterns quickly.',url:'https://form.jotform.com/262584448472063'},
  {day:10,title:'Ranking, Syllogisms & Seating Arrangement',topics:['Ranking','Syllogisms','Seating Arrangement'],resources:['Ranking position shortcuts','Syllogism/Venn diagram notes','Linear and circular seating practice'],classActivity:'Covered ranking and position problems, syllogism relationships using logical diagrams, and seating arrangement strategies. Practice structured deduction.',url:'https://form.jotform.com/262593423132049'}
];

const views = {overview:'Overview',students:'Students',analytics:'Analytics',reports:'Reports',tests:'Daily Tests'};
let latestSubmission = null;
let allSubmissions = [];
let latestAnalysis = null;

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const finite = value => Number.isFinite(Number(value));
const pctFor = s => finite(s?.percentage) ? Number(s.percentage) : (finite(s?.score) ? Number(s.score) / 30 * 100 : null);
const initials = name => String(name || '').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'AI';
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function showView(view){
  Object.entries({overview:$('#overviewView'),students:$('#studentsView'),analytics:$('#analyticsView'),reports:$('#reportsView'),tests:$('#testsView')}).forEach(([key,el])=>el?.classList.toggle('hidden',key!==view));
  $$('.nav-item').forEach(item=>item.classList.toggle('active',item.dataset.view===view));
  $('#pageTitle') && ($('#pageTitle').textContent=views[view] || view);
  $('#viewHeading') && ($('#viewHeading').textContent=view==='overview'?'Good evening, Creator.':views[view]);
  if(window.innerWidth<=760) $('#sidebar')?.classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}

function ensureDailyTests(){
  const nav=$('.sidebar nav');
  if(nav && !nav.querySelector('[data-view="tests"]')){
    const item=document.createElement('button');
    item.className='nav-item'; item.dataset.view='tests'; item.innerHTML='<span>✓</span>Daily Tests';
    nav.appendChild(item);
  }
  const content=$('.content');
  if(content && !$('#testsView')){
    const section=document.createElement('div');
    section.id='testsView'; section.className='view hidden';
    content.appendChild(section);
  }
  const section=$('#testsView');
  if(section){
    section.innerHTML=`<div class="section-head"><div><p class="eyebrow">10-DAY PROGRAM</p><h2>Daily Aptitude Tests</h2><p>Study resources, class progress and the dedicated assessment for each day.</p></div></div><div class="daily-tests-grid">${dailyTests.map(t=>`<article class="daily-test-card"><div class="day-number">DAY ${t.day}</div><h3>${esc(t.title)}</h3><div class="topic-list">${t.topics.map(x=>`<span>${esc(x)}</span>`).join('')}</div><div class="daily-info"><div class="info-block"><h4>Resources</h4><ul>${t.resources.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="info-block"><h4>Class activity</h4><p>${esc(t.classActivity)}</p></div></div><div class="test-meta"><span>30 Questions</span><span>30 Minutes</span></div><button class="primary-btn start-test" data-test-url="${t.url}">Start Day ${t.day} Test ↗</button></article>`).join('')}</div>`;
  }
}

function renderOverview(){
  const metricCards=$$('.metric-card');
  const scored=allSubmissions.filter(s=>finite(s.score));
  const avg=scored.length ? scored.reduce((sum,s)=>sum+(finite(s.percentage)?Number(s.percentage):Number(s.score)/30*100),0)/scored.length : null;
  if(metricCards[0]) metricCards[0].querySelector('strong').textContent=allSubmissions.length;
  if(metricCards[1]) metricCards[1].querySelector('strong').textContent=avg==null?'—':`${avg.toFixed(1)}%`;
  if(metricCards[2]) metricCards[2].querySelector('strong').textContent=scored.length?scored.length*30:'—';
  if(metricCards[3]){metricCards[3].querySelector('strong').textContent='—';metricCards[3].querySelector('.trend').textContent='Topic analytics pending';}
  if(!latestSubmission) return;
  const s=latestSubmission, pct=pctFor(s), name=s.name||'Unknown candidate';
  $$('.student-strip b,.report-top h2,.modal-head h2').forEach(el=>el.textContent=name);
  $$('.student-strip .avatar,.report-top .avatar,.modal-head .avatar').forEach(el=>el.textContent=initials(name));
  $$('.student-strip small').forEach(el=>el.textContent=`Roll No. ${s.rollNumber||'—'} · Latest submission`);
  const scoreBlock=$('.score-block');
  if(scoreBlock){scoreBlock.querySelector('strong').innerHTML=finite(s.score)?`${Number(s.score)}<span>/30</span>`:'—';scoreBlock.querySelector('small').textContent=pct==null?'Not scored':`${pct.toFixed(2)}%`;}
  const progress=$('.performance-panel .progress span'); if(progress) progress.style.width=`${Math.max(0,Math.min(100,pct||0))}%`;
  const progressLabel=$('.performance-panel .progress-label b'); if(progressLabel) progressLabel.textContent=pct==null?'—':`${Math.round(pct)}%`;
  const mini=$$('.mini-columns b'); if(mini.length){mini[0].textContent=finite(s.score)?Number(s.score):'—';mini[1].textContent=finite(s.score)?String(30-Number(s.score)):'—';mini[2].textContent='—';mini[3].textContent=finite(s.score)?'Reviewed':'Awaiting score';}
  const recent=$('#overviewView tbody tr');
  if(recent){const cells=recent.querySelectorAll('td');if(cells[0]){cells[0].querySelector('b').textContent=name;cells[0].querySelector('.avatar').textContent=initials(name);}if(cells[1])cells[1].textContent=s.rollNumber||'—';if(cells[2])cells[2].textContent=finite(s.score)?`${Number(s.score)} / 30`:'Not scored';if(cells[3]){const bar=cells[3].querySelector('.table-progress span');if(bar)bar.style.width=`${Math.max(0,Math.min(100,pct||0))}%`;const small=cells[3].querySelector('small');if(small)small.textContent=pct==null?'—':`${pct.toFixed(2)}%`;}if(cells[4])cells[4].querySelector('.status').textContent=finite(s.score)?'AI reviewed':'Awaiting score';}
}

function renderStudents(){
  const tbody=$('#studentsView tbody'); if(!tbody)return;
  tbody.innerHTML=allSubmissions.length?allSubmissions.map((s,i)=>{const pct=pctFor(s);return `<tr><td><div class="candidate"><span class="avatar small">${initials(s.name)}</span><b>${esc(s.name||'Unknown candidate')}</b></div></td><td>${esc(s.rollNumber||'—')}</td><td>${finite(s.score)?`${Number(s.score)} / 30`:'Not scored'}</td><td>${pct==null?'—':`${pct.toFixed(2)}%`}</td><td><span class="status reviewed">${finite(s.score)?'AI reviewed':'Awaiting score'}</span></td><td><button class="row-btn" data-student-index="${i}">Report</button></td></tr>`}).join(''):`<tr><td colspan="6">No submissions found.</td></tr>`;
}

function renderAnalytics(){
  const view=$('#analyticsView'); if(!view)return;
  const topicData=latestAnalysis?.topicPerformance;
  const bars=view.querySelector('.bars');
  if(!bars)return;
  if(Array.isArray(topicData)&&topicData.length){
    bars.innerHTML=topicData.map(t=>{const value=Number(t.percentage ?? t.score ?? 0);return `<div><span>${esc(t.topic||t.name||'Topic')}</span><b>${Number.isFinite(value)?value.toFixed(0):0}%</b><i><em style="width:${Math.max(0,Math.min(100,Number.isFinite(value)?value:0))}%"></em></i></div>`}).join('');
  }else{
    bars.innerHTML='<div style="padding:16px 0;color:#8d95a6;font-size:11px">No verified topic analytics available yet.</div>';
  }
}

function renderReports(){
  if(!latestSubmission)return;
  const s=latestSubmission,pct=pctFor(s);
  const score=$('.report-score');
  if(score){score.querySelector('strong').textContent=finite(s.score)?`${Number(s.score)}/30`:'Not scored';score.querySelector('span').textContent=pct==null?'Awaiting score':`${pct.toFixed(2)}%`;}
  $$('.report-top span,.modal-head span').forEach(el=>el.textContent=`${s.rollNumber||'—'} · ${s.testTitle||'Assessment'}`);
  const cols=$('#reportsView .report-columns');
  if(cols && latestAnalysis){
    const strengths=Array.isArray(latestAnalysis.strengths)?latestAnalysis.strengths:[];
    const weaknesses=Array.isArray(latestAnalysis.weaknesses)?latestAnalysis.weaknesses:[];
    const recommendation=Array.isArray(latestAnalysis.recommendations)?latestAnalysis.recommendations.join(' '):(latestAnalysis.recommendations||'');
    cols.innerHTML=`<div><h3>Strengths</h3><ul>${(strengths.length?strengths:['No AI strengths available yet.']).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h3>Weaknesses</h3><ul>${(weaknesses.length?weaknesses:['No AI weaknesses available yet.']).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h3>AI recommendation</h3><p>${esc(recommendation||'Generate a report after verified scoring is available.')}</p></div>`;
  }
}

function openReport(){ $('#reportModal')?.classList.remove('hidden'); document.body.style.overflow='hidden'; renderReports(); }
function closeReport(){ $('#reportModal')?.classList.add('hidden'); document.body.style.overflow=''; }

async function generateReport(){
  if(!latestSubmission)return openReport();
  const button=$('#reportBtn2'); if(button){button.disabled=true;button.textContent='Generating…';}
  try{
    const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({submission:latestSubmission})});
    if(!r.ok)throw new Error('AI service unavailable');
    latestAnalysis=await r.json();
    renderOverview();renderAnalytics();renderReports();
  }catch(error){console.error(error);}
  finally{if(button){button.disabled=false;button.textContent='Generate latest report';}openReport();}
}

async function loadSubmissions(){
  try{
    const r=await fetch('/api/submissions',{cache:'no-store'});
    if(!r.ok)throw new Error('Jotform connection unavailable');
    const data=await r.json();
    allSubmissions=Array.isArray(data.submissions)?data.submissions:[];
    latestSubmission=allSubmissions[0]||null;
    renderOverview();renderStudents();renderAnalytics();renderReports();
  }catch(error){console.warn(error.message);}
}

function bindEvents(){
  document.addEventListener('click',event=>{
    const nav=event.target.closest('.nav-item');
    if(nav){showView(nav.dataset.view);return;}
    const viewLink=event.target.closest('[data-view-link]');
    if(viewLink){showView(viewLink.dataset.viewLink);return;}
    const test=event.target.closest('.start-test');
    if(test){window.open(test.dataset.testUrl,'_blank','noopener,noreferrer');return;}
    const report=event.target.closest('[data-report="true"], [data-student-index]');
    if(report){const index=report.dataset.studentIndex;if(index!==undefined)latestSubmission=allSubmissions[Number(index)]||latestSubmission;openReport();return;}
  });
  $('#openReport')?.addEventListener('click',openReport);
  $('#closeModal')?.addEventListener('click',closeReport);
  $('#reportModal .modal-backdrop')?.addEventListener('click',closeReport);
  $('#reportBtn2')?.addEventListener('click',generateReport);
  $('#menuBtn')?.addEventListener('click',()=>$('#sidebar')?.classList.toggle('open'));
  $('#jotformBtn')?.addEventListener('click',()=>window.open('https://form.jotform.com/262574105301043','_blank','noopener,noreferrer'));
  $('#studentSearch')?.addEventListener('input',event=>{const q=event.target.value.toLowerCase();$$('#studentsView tbody tr').forEach(row=>row.classList.toggle('hidden',!row.innerText.toLowerCase().includes(q)));});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeReport();});
}

ensureDailyTests();
bindEvents();
loadSubmissions();
