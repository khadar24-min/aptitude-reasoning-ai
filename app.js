const views={overview:'Overview',students:'Students',analytics:'Analytics',reports:'Reports'};
const navItems=document.querySelectorAll('.nav-item');
const viewEls={overview:document.getElementById('overviewView'),students:document.getElementById('studentsView'),analytics:document.getElementById('analyticsView'),reports:document.getElementById('reportsView')};
const title=document.getElementById('pageTitle');
const heading=document.getElementById('viewHeading');
let latestSubmission=null;
function showView(view){Object.keys(viewEls).forEach(k=>viewEls[k].classList.toggle('hidden',k!==view));navItems.forEach(n=>n.classList.toggle('active',n.dataset.view===view));title.textContent=views[view];heading.textContent=view==='overview'?'Good evening, Creator.':views[view];window.scrollTo({top:0,behavior:'smooth'});}
navItems.forEach(item=>item.addEventListener('click',()=>showView(item.dataset.view)));
document.querySelectorAll('[data-view-link]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.viewLink)));
const modal=document.getElementById('reportModal');
function openReport(){modal.classList.remove('hidden');document.body.style.overflow='hidden'}
function closeReport(){modal.classList.add('hidden');document.body.style.overflow=''}
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
