const views={overview:'Overview',students:'Students',analytics:'Analytics',reports:'Reports'};
const navItems=document.querySelectorAll('.nav-item');
const viewEls={overview:document.getElementById('overviewView'),students:document.getElementById('studentsView'),analytics:document.getElementById('analyticsView'),reports:document.getElementById('reportsView')};
const title=document.getElementById('pageTitle');
const heading=document.getElementById('viewHeading');
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
document.getElementById('reportBtn2')?.addEventListener('click',openReport);
document.getElementById('menuBtn')?.addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
const search=document.getElementById('studentSearch');
search?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('#studentsView tbody tr').forEach(row=>row.classList.toggle('hidden',!row.innerText.toLowerCase().includes(q)))});
