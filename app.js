'use strict';
/* ═══════════════ Bitch Catli ═══════════════ */

// ── утиліти ──
const $ = s => document.querySelector(s);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => ymd(new Date());
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return ymd(d); };
const daysBetween = (a, b) => Math.round((parseD(b) - parseD(a)) / 864e5);
const monthKey = s => s.slice(0, 7);
const addMonths = (mk, n) => { const [y, m] = mk.split('-').map(Number); const d = new Date(y, m - 1 + n, 1); return ymd(d).slice(0, 7); };
const lastDay = mk => { const [y, m] = mk.split('-').map(Number); return new Date(y, m, 0).getDate(); };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const money = n => Math.round(n || 0).toLocaleString('uk-UA') + ' ₴';
const num = v => { const x = parseFloat(String(v).replace(',', '.').replace(/\s/g, '')); return isFinite(x) ? x : 0; };
const MONTHS = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
const MONTHS_G = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
const WDAYS = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', "п'ятниця", 'субота'];
const fmtDate = s => { const d = parseD(s); return `${d.getDate()} ${MONTHS_G[d.getMonth()]}`; };
const plural = (n, a, b, c) => { n = Math.abs(n); const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c); };
const days = n => `${n} ${plural(n, 'день', 'дні', 'днів')}`;

// ── довідники ──
const TASK_CATS = { 'Навчання': '#8d7fe0', 'Робота': '#6f9fd8', "Здоров'я": '#86b26b', 'Коти': '#d1a05a', 'Дім': '#c98a6b', 'Купити': '#d4b05a', 'Фінанси': '#5fb29a', 'Хобі': '#d97aa0', 'Книги': '#7aa7d1', 'Цифровий порядок': '#a8a29a', 'Краса': '#e08aa8', 'Друзі': '#d99a4e', 'Подорожі': '#6fb8c9', 'Цілі': '#e07a8e', 'Інше': '#9a9290' };
const PRIOS = { urgent: ['Терміново', 'bad'], soon: ['Скоро', 'warn'], someday: ['Колись', 'info'] };
const TIERS = { global: ['Глобальні цілі', '#c23d5c', 'Великі, на які піде найбільше часу'], medium: ['Середні цілі', '#d9798c', 'Те, що потрібно для життя'], small: ['Маленькі цілі', '#efb7c1', 'Просто хочу 💫'] };
const EXP_CATS = {
  'Їжа': ['Основне', 'Смаколики', 'Доставка / кафе', 'Алкоголь', 'Рецепт на спробу'],
  'Гігієна': ['Основне', 'Фарба для волосся', 'Засоби гігієни'],
  'Косметика': ['Догляд', 'Декоративна', 'Манікюр / лак'],
  'Догляд за собою': ['Процедури', 'Салон'],
  'Хімія для дому': [],
  'Кіт': ['Корм', 'Наповнювач', 'Ветеринар', 'Іграшки'],
  'Оренда': [], 'Комунальні': [], 'Інтернет': [], 'Київстар': [],
  'Проїзд': [], 'Навчання': [],
  'Книги': ['Потрібні', 'Хотіла', 'Спонтанно'],
  'Одяг': ['Потрібний', 'Хотілка'],
  'Онлайн покупки': ['AliExpress', 'Temu', 'Інші магазини'],
  'Хобі': [], 'Дозвілля': [], 'Подорожі': [], 'Подарунки': [], "Здоров'я": [], 'Спорт': [],
  'Ремонт / дім': [], "Сім'я": [], 'Кредит': [], 'Неочікуване': [], 'Інше': []
};
const INC_CATS = ['Зарплата', 'Подарунки', 'Продаж книг', 'Продаж речей', 'Інвестиції', 'Інше'];
const SPEND = { must: ['✅ Необхідно', 'ok'], want: ['💖 Хотілка', 'info'], spontan: ['⚡ Спонтанно', 'warn'] };
const URGENCY = ["Термінове / регулярне / обов'язково", 'Можна відкласти', 'Коли будуть вільні гроші', 'Взагалі не треба — просто хочу', 'Ти єбобо на це витрачатися?'];
const ACCS = { cash: 'Готівка', mono: 'Monobank', privat: 'Приват', transit: 'Проїзний' };
const ACC_COLORS = { cash: '#9aa77a', mono: '#4a4144', privat: '#7d9a78', transit: '#c0975a' };
const accIcon = (k, s = 30) => k === 'cash'
  ? `<svg width="${s}" height="${s}" viewBox="0 0 32 32"><rect x="3" y="9" width="26" height="15" rx="3" fill="${ACC_COLORS.cash}"/><circle cx="16" cy="16.5" r="4" fill="none" stroke="#f3efe3" stroke-width="1.6"/><circle cx="7.5" cy="16.5" r="1.2" fill="#f3efe3"/><circle cx="24.5" cy="16.5" r="1.2" fill="#f3efe3"/></svg>`
  : `<svg width="${s}" height="${s}" viewBox="0 0 32 32"><rect x="3" y="7" width="26" height="18" rx="3.5" fill="${ACC_COLORS[k]}"/><rect x="3" y="11" width="26" height="3.2" fill="rgba(0,0,0,.28)"/><rect x="6.5" y="18" width="7" height="3" rx="1" fill="rgba(255,255,255,.55)"/></svg>`;

// ── стан ──
const STORE = 'bc_state_v2';
const APP_VERSION = 8;
function defaultBudget() {
  const env = n => ({ id: uid(), name: n, amount: 0, carry: 0 });
  const envs = ['Оренда', 'Комуналка', "Інтернет і зв'язок", 'Їжа', 'Кіт', 'Проїзд', 'Гігієна і дім', 'Наступний місяць'].map(env);
  const E = n => envs.find(e => e.name === n).id;
  const mk = monthKey(today());
  return {
    accounts: { cash: 0, mono: 0, privat: 0, transit: 0 },
    envelopes: envs,
    txs: [],
    recurring: [
      { id: uid(), name: 'Оренда', amount: 9000, day: 6, cat: 'Оренда', envId: E('Оренда'), approx: false, from: mk },
      { id: uid(), name: 'Комуналка', amount: 1000, day: 6, cat: 'Комунальні', envId: E('Комуналка'), approx: true, from: mk },
      { id: uid(), name: 'Інтернет', amount: 300, day: 3, cat: 'Інтернет', envId: E("Інтернет і зв'язок"), approx: false, from: mk },
      { id: uid(), name: 'Київстар', amount: 200, day: 10, cat: 'Київстар', envId: E("Інтернет і зв'язок"), approx: false, from: mk },
    ],
    payments: [],
    savings: [{ id: uid(), name: 'Фінансова подушка', target: 60000, saved: 0, cushion: true }],
    debts: [],
    monthStart: null,
    limits: { spontan: 2000 },
    payday: 27,
  };
}
function defaultState() {
  return { v: 2, updated: 0, migrated: false, tasks: [], notes: [], goals: [], pinned: [], quotesExtra: [], ui: { view: 'today', bsub: 'day', theme: 'auto', fold: {}, pick: {}, sec: {} }, budget: defaultBudget() };
}
const B = () => S.budget;
let S = (() => { try { const s = JSON.parse(localStorage.getItem(STORE)); if (s && s.v === 2) return s; } catch (e) { } return null; })();

function persist(sync = true) {
  S.updated = Date.now();
  try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { }
  if (sync && window.Sync) window.Sync.push();
}
function commit() { persist(); render(); }

// ── міграція зі старого «Мій простір» ──
function migrateFrom(get) {
  const T = today();
  let any = false;
  const ot = safeJSON(get('liza_tasks'));
  if (Array.isArray(ot) && ot.length) {
    any = true;
    S.tasks = ot.map(t => ({ id: 't' + t.id, text: t.text, cat: t.cat || 'Інше', priority: t.priority || 'someday', deadline: t.deadlineDate || null, done: !!t.done, doneAt: t.done ? T : null, inFolder: true, today: (t.todaySelected && !t.done) ? T : null, star: !!t.starred, goalId: null, created: T }));
  }
  const on = safeJSON(get('liza_notes'));
  if (Array.isArray(on)) S.notes = on.map(n => ({ id: uid(), text: n.text, created: n.date || T }));
  const og = safeJSON(get('liza_goals'));
  if (Array.isArray(og) && og.length) {
    any = true;
    S.goals = og.map((g, i) => ({ id: g.id || uid(), name: g.name, desc: g.desc || '', tier: i === 0 ? 'global' : 'medium', created: T, doneAt: null }));
    og.forEach(g => (g.tasks || []).forEach(gt => (gt.subtasks || []).forEach(sub => {
      S.tasks.push({ id: uid(), text: sub.text, cat: 'Цілі', priority: 'someday', deadline: null, done: !!sub.done, doneAt: sub.done ? T : null, inFolder: true, today: null, star: false, goalId: g.id, created: T });
    })));
    S.pinned = S.goals.slice(0, 3).map(g => g.id);
  }
  const ob = safeJSON(get('liza_budget_v1'));
  if (ob && typeof ob === 'object') {
    any = true;
    const b = B();
    const bal = ob.balances || {};
    b.accounts = { cash: num(bal.cash), mono: num(bal.mono), privat: num(bal.privat), transit: 0 };
    b.txs = (ob.transactions || []).map(t => ({ id: uid(), type: t.type === 'saving' ? 'save_legacy' : t.type, amount: num(t.amount), account: t.payMethod || 'mono', cat: t.cat || 'Інше', sub: '', desc: t.desc || '', spend: t.spendType || 'must', date: t.date || T, legacy: true }));
    b.payments = (ob.payments || []).filter(p => p.status !== 'paid' && p.date >= addDays(T, -31)).map(p => ({ id: uid(), name: p.name, amount: num(p.amount), date: p.date, cat: p.cat || 'Інше', envId: null, status: 'planned' }));
    (ob.savingTargets || []).forEach(st => {
      const ex = b.savings.find(s => s.name === st.cat);
      if (ex) { ex.target = num(st.target) || ex.target; ex.saved = num(st.saved); }
      else b.savings.push({ id: uid(), name: st.cat, target: num(st.target), saved: num(st.saved) });
    });
  }
  if (any) S.migrated = true;
  return any;
}
function safeJSON(s) { try { return typeof s === 'string' ? JSON.parse(s) : s; } catch (e) { return null; } }
function migrateLocal() { if (migrateFrom(k => localStorage.getItem(k))) persist(false); }
if (!S) { S = defaultState(); migrateLocal(); }

// ── синхронізація (викликається з sync.js) ──
window.App = {
  setSync(text, kind, user) { App._user = user; const el = $('#sync'); if (el) { el.textContent = user ? text : (kind === 'busy' ? text : 'Не увійшла · натисни, щоб увійти'); el.className = 'sync ' + (user ? kind : 'warn') + (user ? '' : ' login'); el.onclick = user ? null : () => window.Sync && Sync.signIn(); } },
  markSynced() { if (App._user && !S.cloudSynced) { S.cloudSynced = true; try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { } } },
  needsMigration: () => !S.migrated && S.tasks.length === 0,
  migrateFromCloud(d) { if (migrateFrom(k => d[k] ?? null)) { persist(); render(); toast('Підтягнула твої дані зі старої версії 💾'); } },
  exportForSync: () => ({ _ts: S.updated || Date.now(), state: JSON.stringify(S) }),
  onRemote(d, initial) {
    const rs = safeJSON(d.state);
    if (!rs || rs.v !== 2) return;
    // Новий/очищений пристрій ще ніколи не синхронізувався: завжди беремо дані з хмари, а не перезаписуємо їх
    const fresh = initial && App._user && !S.cloudSynced;
    if (fresh || (rs.updated || 0) > (S.updated || 0)) {
      if (App._user) rs.cloudSynced = true;
      const ui = S.ui; S = rs; S.ui = { ...rs.ui, view: ui.view, bsub: ui.bsub };
      try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { }
      render();
    } else if ((rs.updated || 0) < (S.updated || 0)) window.Sync && window.Sync.push();
  },
  toast: m => toast(m),
};

/* ═══════════════ МОДАЛКИ / ТОСТ ═══════════════ */
// back — куди повертатись при закритті (×, Esc, клік повз), щоб вікна відкривались «одне в одному»
let modalBack = null;
function openModal(html, onOpen, back) {
  const prev = $('#ov'); prev && prev.remove();
  modalBack = back || null;
  const o = document.createElement('div');
  o.className = 'overlay'; o.id = 'ov';
  o.innerHTML = `<div class="modal" role="dialog">${html}</div>`;
  o.addEventListener('mousedown', e => { if (e.target === o) closeModal(); });
  document.body.appendChild(o);
  const f = o.querySelector('[autofocus]'); if (f) setTimeout(() => f.focus(), 50);
  onOpen && onOpen(o);
}
function closeModal() { const o = $('#ov'); o && o.remove(); const b = modalBack; modalBack = null; if (b) b(); }
function closeAllModals() { modalBack = null; const o = $('#ov'); o && o.remove(); }
let toastT;
function toast(msg, undoFn) {
  const old = $('#toast'); old && old.remove(); clearTimeout(toastT);
  const t = document.createElement('div'); t.className = 'toast'; t.id = 'toast';
  t.innerHTML = `<span>${esc(msg)}</span>${undoFn ? '<button>Скасувати</button>' : ''}`;
  if (undoFn) t.querySelector('button').onclick = () => { undoFn(); t.remove(); };
  document.body.appendChild(t);
  toastT = setTimeout(() => t.remove(), undoFn ? 5000 : 3000);
}
function snapshot() { const s = JSON.stringify(S); return () => { const ui = S.ui; S = JSON.parse(s); S.ui = ui; commit(); }; }
const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
const checked = id => !!(document.getElementById(id) || {}).checked;
const segVal = id => { const b = document.querySelector(`#${id} button.on`); return b ? b.dataset.v : null; };
function seg(id, opts, cur) { return `<div class="seg" id="${id}">${Object.entries(opts).map(([k, v]) => `<button type="button" data-v="${k}" class="${k === cur ? 'on' : ''}" onclick="segPick(this)">${v}</button>`).join('')}</div>`; }
window.segPick = b => { b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); b.parentNode.dispatchEvent(new Event('change')); };
const opts = (list, cur) => list.map(x => Array.isArray(x) ? `<option value="${esc(x[0])}" ${x[0] === cur ? 'selected' : ''}>${esc(x[1])}</option>` : `<option ${x === cur ? 'selected' : ''}>${esc(x)}</option>`).join('');

/* ═══════════════ ТЕМА ═══════════════ */
function applyTheme() {
  const t = S.ui.theme === 'auto' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : S.ui.theme;
  document.documentElement.dataset.theme = t;
  const m = document.querySelector('meta[name=theme-color]'); m && m.setAttribute('content', '#3a0814');
}
matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => S.ui.theme === 'auto' && applyTheme());

/* ═══════════════ ЗАДАЧІ: логіка ═══════════════ */
const catColor = c => TASK_CATS[c] || '#b79aa0';
const allCats = () => [...new Set([...Object.keys(TASK_CATS), ...S.tasks.map(t => t.cat)])];
const findTask = id => S.tasks.find(t => t.id === id);
const todayTasks = () => S.tasks.filter(t => t.today && !t.done);

function taskBadges(t, ctx) {
  const T = today(), b = [];
  if (t.deadline) {
    const d = daysBetween(T, t.deadline);
    if (d < 0) b.push(`<span class="chip bad">прострочено на ${days(-d)} 😬</span>`);
    else if (d === 0) b.push(`<span class="chip warn">дедлайн сьогодні</span>`);
    else b.push(`<span class="chip ${d <= 3 ? 'warn' : ''}">до ${fmtDate(t.deadline)}</span>`);
  }
  if (ctx === 'today' && t.today && t.today < T) {
    const d = daysBetween(t.today, T);
    b.push(`<span class="chip bad">${d === 1 ? 'з учора' : 'висить уже ' + days(d)}</span>`);
  }
  if (ctx !== 'today' && t.today && !t.done) b.push(`<span class="chip warn">☀ на сьогодні</span>`);
  if (ctx !== 'today' && t.priority && PRIOS[t.priority]) b.push(`<span class="chip ${PRIOS[t.priority][1]}">${PRIOS[t.priority][0]}</span>`);
  if (t.goalId) { const g = S.goals.find(g => g.id === t.goalId); g && b.push(`<span class="chip">🎯 ${esc(g.name)}</span>`); }
  if (ctx === 'today' && !t.inFolder) b.push(`<span class="chip">лише сьогодні</span>`);
  return b.join('');
}

window.T = {
  toggle(id) {
    const t = findTask(id); if (!t) return;
    const undo = snapshot();
    if (!t.done) {
      t.done = true; t.doneAt = today();
      if (!t.inFolder && !t.goalId) S.tasks = S.tasks.filter(x => x !== t);
      commit(); toast('Готово ✨ ' + t.text.slice(0, 40), undo);
    } else { t.done = false; t.doneAt = null; commit(); }
  },
  star(id) { const t = findTask(id); t.star = !t.star; commit(); },
  removeToday(id) {
    const t = findTask(id); const undo = snapshot();
    if (!t.inFolder && !t.goalId) S.tasks = S.tasks.filter(x => x !== t); else t.today = null;
    commit(); toast('Прибрала з задач дня', undo);
  },
  toggleToday(id) { const t = findTask(id); t.today = t.today ? null : today(); commit(); },
  del(id) { const t = findTask(id); const undo = snapshot(); S.tasks = S.tasks.filter(x => x !== t); commit(); toast('Задачу видалено', undo); },
  clearDeadline(id) { const t = findTask(id); const undo = snapshot(); t.deadline = null; commit(); toast('Прибрала з дедлайнів', undo); },
  gcal(id) {
    const t = findTask(id); const d = (t.deadline || today()).replace(/-/g, ''); const e = addDays(t.deadline || today(), 1).replace(/-/g, '');
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t.text)}&dates=${d}/${e}&details=${encodeURIComponent('[' + t.cat + ']')}`, '_blank');
  },
  edit(id, ctx, preset = {}) {
    const t = id ? findTask(id) : { text: '', cat: preset.cat || 'Інше', priority: 'soon', deadline: preset.deadline || null, inFolder: ctx !== 'today', today: ctx === 'today' ? today() : null, goalId: preset.goalId || null };
    const cats = allCats();
    openModal(`<h3>${id ? 'Редагувати задачу' : (preset.deadline === '' ? 'Новий дедлайн' : 'Нова задача')}</h3>
      <div class="field"><label>Що треба зробити</label><textarea id="f-text" rows="2" autofocus>${esc(t.text)}</textarea></div>
      <div class="row2">
        <div class="field"><label>Категорія (папка)</label><select id="f-cat" onchange="if(this.value==='__new'){const n=prompt('Назва нової категорії');if(n){const o=new Option(n,n,true,true);this.add(o,0);}else this.value='Інше'}">${opts(cats, t.cat)}<option value="__new">+ Нова категорія…</option></select></div>
        <div class="field"><label>Дедлайн</label><input type="date" id="f-dl" value="${t.deadline || ''}"></div>
      </div>
      <div class="field"><label>Терміновість</label>${seg('f-prio', { urgent: 'Терміново', soon: 'Скоро', someday: 'Колись' }, t.priority)}</div>
      <div class="field"><label>Прив'язати до цілі</label><select id="f-goal"><option value="">— без цілі —</option>${S.goals.filter(g => !g.doneAt).map(g => `<option value="${g.id}" ${g.id === t.goalId ? 'selected' : ''}>${esc(g.name)}</option>`).join('')}</select></div>
      <div class="field"><label>Куди додати</label><div class="checks">
        <label><input type="checkbox" id="f-today" ${t.today ? 'checked' : ''}> ☀ На сьогодні</label>
        <label><input type="checkbox" id="f-folder" ${t.inFolder ? 'checked' : ''}> 📁 У папку (вкладка «Задачі»)</label></div></div>
      <div class="m-foot">${id ? `<button class="btn danger" onclick="T.del('${id}');closeModal()">Видалити</button>` : ''}<button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="T.save('${id || ''}')">Зберегти</button></div>`, null, preset.back || null);
  },
  save(id) {
    const text = val('f-text'); if (!text) return toast('Напиши, що треба зробити');
    const inToday = checked('f-today'), inFolder = checked('f-folder');
    if (!inToday && !inFolder) return toast('Обери: на сьогодні, у папку або обидва');
    const data = { text, cat: val('f-cat') || 'Інше', deadline: val('f-dl') || null, priority: segVal('f-prio') || 'soon', goalId: val('f-goal') || null, inFolder };
    if (id) { const t = findTask(id); Object.assign(t, data); t.today = inToday ? (t.today || today()) : null; }
    else S.tasks.push({ id: uid(), ...data, today: inToday ? today() : null, done: false, doneAt: null, star: false, created: today() });
    closeModal(); commit();
  },
  pick() {
    const cats = allCats().filter(c => S.tasks.some(t => t.cat === c && t.inFolder && !t.done));
    const body = () => cats.map(c => {
      const list = S.tasks.filter(t => t.cat === c && t.inFolder && !t.done);
      const closed = S.ui.pick[c] !== false && S.ui.pick[c] !== undefined ? true : (S.ui.pick[c] === undefined ? true : false);
      const sel = list.filter(t => t.today).length;
      return `<div class="folder ${closed ? 'closed' : ''}"><button class="folder-h" onclick="T.pickFold('${esc(c)}')"><span class="dot" style="background:${catColor(c)}"></span>${esc(c)}<span class="cnt">${sel ? '☀ ' + sel + ' · ' : ''}${list.length}</span><span class="chev">▾</span></button>
        <div class="folder-b">${list.map(t => `<div class="trow" onclick="T.pickToggle('${t.id}')"><span class="check ${t.today ? 'on' : ''}"></span><div class="body"><div class="txt">${esc(t.text)}</div><div class="meta">${taskBadges(t, 'pick')}</div></div></div>`).join('')}</div></div>`;
    }).join('') || '<div class="empty">У папках поки немає невиконаних задач</div>';
    openModal(`<h3>📂 Обери задачі на сьогодні</h3>
      <div class="toolbar"><button class="btn ghost sm" onclick="T.pickAll(false)">Розгорнути все</button><button class="btn ghost sm" onclick="T.pickAll(true)">Згорнути все</button></div>
      <div id="pick-body">${body()}</div><div class="m-foot"><button class="btn" onclick="closeModal()">Готово ✓</button></div>`);
    T._pickBody = body;
  },
  _repick() { const el = $('#pick-body'); if (el) el.innerHTML = T._pickBody(); },
  pickFold(c) { const cur = S.ui.pick[c] === undefined ? true : S.ui.pick[c]; S.ui.pick[c] = !cur; persist(false); T._repick(); },
  pickAll(close) { allCats().forEach(c => S.ui.pick[c] = close); persist(false); T._repick(); },
  pickToggle(id) { const t = findTask(id); t.today = t.today ? null : today(); persist(); T._repick(); render(); },
  fold(c) { S.ui.fold[c] = !S.ui.fold[c]; persist(false); render(); },
  foldAll(close) { allCats().forEach(c => S.ui.fold[c] = close); persist(false); render(); },
  clearDone() {
    const n = S.tasks.filter(t => t.done).length; if (!n) return toast('Виконаних немає');
    if (!confirm(`Видалити ${n} виконаних задач назавжди?`)) return;
    const undo = snapshot(); S.tasks = S.tasks.filter(t => !t.done || t.goalId); commit(); toast('Прибрала виконані', undo);
  },
};

/* ═══════════════ НОТАТКИ ═══════════════ */
window.N = {
  add() { const el = $('#note-inp'); const v = el.value.trim(); if (!v) return; S.notes.unshift({ id: uid(), text: v, created: today() }); commit(); setTimeout(() => $('#note-inp') && $('#note-inp').focus(), 0); },
  edit(id) {
    const n = S.notes.find(x => x.id === id);
    openModal(`<h3>Нотатка</h3><div class="field"><textarea id="f-note" rows="4" autofocus>${esc(n.text)}</textarea></div>
      <div class="m-foot"><button class="btn danger" onclick="N.del('${id}');closeModal()">Видалити</button><button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="N.save('${id}')">Зберегти</button></div>`);
  },
  save(id) { const n = S.notes.find(x => x.id === id); n.text = val('f-note') || n.text; closeModal(); commit(); },
  del(id) { const undo = snapshot(); S.notes = S.notes.filter(x => x.id !== id); commit(); toast('Нотатку видалено', undo); },
};

/* ═══════════════ ЦИТАТИ ═══════════════ */
// Кожне відкриття — нова цитата; йдемо по перемішаному списку, поки не покажемо всі
function quotes() { return [...(window.QUOTES || []), ...S.quotesExtra]; }
function quoteOrder() {
  const n = quotes().length;
  let o = S.ui.qOrder;
  if (!Array.isArray(o) || o.length !== n || (S.ui.qPos || 0) >= n) {
    o = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
    S.ui.qOrder = o; S.ui.qPos = 0;
  }
  return o;
}
function quoteOfDay() {
  const q = quotes(); if (!q.length) return null;
  const o = quoteOrder();
  return q[o[S.ui.qPos || 0]] || q[0];
}
function nextQuote() { quoteOrder(); S.ui.qPos = (S.ui.qPos || 0) + 1; quoteOrder(); try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { } }
window.Q = {
  next() { nextQuote(); render(); },
  add() {
    openModal(`<h3>Своя цитата</h3><div class="field"><label>Фраза (мовою оригіналу)</label><textarea id="q-q" rows="2" autofocus></textarea></div>
      <div class="row2"><div class="field"><label>Хто каже</label><input id="q-who"></div><div class="field"><label>Звідки</label><input id="q-src" placeholder="Arcane"></div></div>
      <div class="m-foot"><button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Q.save()">Додати</button></div>`);
  },
  save() { const q = val('q-q'); if (!q) return; S.quotesExtra.push({ q, who: val('q-who'), src: val('q-src') }); S.ui.qOrder = null; quoteOrder(); S.ui.qPos = S.ui.qOrder.indexOf(quotes().length - 1); closeModal(); commit(); toast('Цитату додано'); },
};

/* ═══════════════ ЦІЛІ ═══════════════ */
const goalSteps = g => S.tasks.filter(t => t.goalId === g.id);
const goalPct = g => { const s = goalSteps(g); if (g.doneAt) return 100; return s.length ? Math.round(s.filter(t => t.done).length / s.length * 100) : 0; };
function ring(p, size = 64, color = 'var(--accent)') {
  const r = 26, c = 2 * Math.PI * r;
  return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--raised)" stroke-width="7"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}"/></svg><span class="pct">${p}%</span></div>`;
}
function goalTile(g, small) {
  const s = goalSteps(g), p = goalPct(g);
  return `<div class="gtile t-${g.tier}" onclick="G.open('${g.id}')">${S.pinned.includes(g.id) && !small ? '<span class="pin">📌</span>' : ''}${ring(p, small ? 56 : 64, TIERS[g.tier][1])}<div><div class="gname">${esc(g.emoji ? g.emoji + ' ' : '')}${esc(g.name)}</div><div class="gsub">${s.filter(t => t.done).length}/${s.length} кроків</div></div></div>`;
}
function pinnedGoals() {
  const act = S.goals.filter(g => !g.doneAt);
  let p = S.pinned.map(id => act.find(g => g.id === id)).filter(Boolean);
  return p.slice(0, 3);
}
window.G = {
  open(id) {
    const g = S.goals.find(x => x.id === id); if (!g) return;
    const steps = goalSteps(g).sort((a, b) => a.done - b.done);
    openModal(`<div class="card-h"><h3 style="margin:0">${esc(g.emoji || '')} ${esc(g.name)}</h3><span class="chip" style="background:${TIERS[g.tier][1]};color:#2a0a12">${TIERS[g.tier][0].replace(' цілі', '')}</span></div>
      ${g.desc ? `<p class="muted small" style="margin-bottom:10px">${esc(g.desc)}</p>` : ''}
      <div style="display:flex;justify-content:center;margin:6px 0 12px">${ring(goalPct(g), 84, TIERS[g.tier][1])}</div>
      <div class="add-inline"><input id="g-step" placeholder="Новий крок…" onkeydown="if(event.key==='Enter')G.addStep('${id}')"><button class="btn" onclick="G.addStep('${id}')">+</button></div>
      <div>${steps.map(t => `<div class="trow ${t.done ? 'done' : ''}"><span class="check ${t.done ? 'on' : ''}" onclick="G.stepToggle('${t.id}','${id}')"></span><div class="body"><div class="txt">${esc(t.text)}</div><div class="meta"><span class="chip"><span class="dot" style="background:${catColor(t.cat)}"></span>${esc(t.cat)}</span>${t.today && !t.done ? '<span class="chip warn">☀ сьогодні</span>' : ''}</div></div>
        <div class="acts"><button class="act" title="На сьогодні" onclick="T.toggleToday('${t.id}');G.open('${id}')">☀</button><button class="act" title="Відв'язати від цілі" onclick="G.unlink('${t.id}','${id}')">⛓</button><button class="act x" title="Видалити" onclick="T.del('${t.id}');G.open('${id}')">×</button></div></div>`).join('') || '<div class="empty">Кроків ще немає. Додай новий або обери з папок.</div>'}</div>
      <button class="btn ghost sm" style="margin-top:10px" onclick="G.link('${id}')">🔗 Обрати задачі з папок</button>
      <div class="m-foot">
        <button class="btn danger" onclick="G.del('${id}')">Видалити</button>
        <button class="btn ghost" onclick="G.edit('${id}')">✎ Змінити</button>
        <button class="btn ghost" onclick="G.pin('${id}')">${S.pinned.includes(id) ? '📌 Прибрати з «Сьогодні»' : '📌 На «Сьогодні»'}</button>
        ${g.doneAt ? `<button class="btn ghost" onclick="G.undone('${id}')">↺ Повернути в активні</button>` : `<button class="btn" onclick="G.done('${id}')">✓ Досягнуто!</button>`}
      </div>`);
  },
  addStep(id) { const v = val('g-step'); if (!v) return; S.tasks.push({ id: uid(), text: v, cat: 'Цілі', priority: 'someday', deadline: null, done: false, doneAt: null, inFolder: true, today: null, star: false, goalId: id, created: today() }); commit(); G.open(id); },
  stepToggle(tid, gid) { const t = findTask(tid); t.done = !t.done; t.doneAt = t.done ? today() : null; commit(); G.open(gid); },
  unlink(tid, gid) { findTask(tid).goalId = null; commit(); G.open(gid); },
  link(gid) {
    const list = S.tasks.filter(t => !t.done && t.goalId !== gid && t.inFolder);
    const cats = [...new Set(list.map(t => t.cat))];
    openModal(`<h3>🔗 Додати до цілі</h3><p class="muted small" style="margin-bottom:8px">Натисни на задачі, які належать до цієї цілі.</p>
      ${cats.map(c => `<div class="group-h"><span class="dot" style="background:${catColor(c)}"></span>${esc(c)}</div>${list.filter(t => t.cat === c).map(t => `<div class="trow" onclick="findTask('${t.id}').goalId='${gid}';persist();this.remove()"><span class="check"></span><div class="body"><div class="txt">${esc(t.text)}</div>${t.goalId ? '<div class="meta"><span class="chip">зараз в іншій цілі</span></div>' : ''}</div></div>`).join('')}`).join('') || '<div class="empty">Немає задач у папках</div>'}
      <div class="m-foot"><button class="btn" onclick="closeModal()">Готово</button></div>`, null, () => { render(); G.open(gid); });
  },
  edit(id) {
    const g = id ? S.goals.find(x => x.id === id) : { name: '', desc: '', tier: 'medium', emoji: '' };
    openModal(`<h3>${id ? 'Змінити ціль' : 'Нова ціль'}</h3>
      <div class="row2" style="grid-template-columns:70px 1fr"><div class="field"><label>Емодзі</label><input id="g-emoji" value="${esc(g.emoji || '')}" maxlength="4" placeholder="🎯"></div><div class="field"><label>Назва</label><input id="g-name" value="${esc(g.name)}" autofocus></div></div>
      <div class="field"><label>Опис (необов'язково)</label><input id="g-desc" value="${esc(g.desc || '')}"></div>
      <div class="field"><label>Рівень</label>${seg('g-tier', { global: '🔥 Глобальна', medium: '🌷 Середня', small: '💫 Маленька' }, g.tier)}</div>
      ${id ? '' : `<label class="checks"><label><input type="checkbox" id="g-pin" ${S.pinned.length < 3 ? 'checked' : ''}> 📌 Показувати на «Сьогодні»</label></label>`}
      <div class="m-foot"><button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="G.save('${id || ''}')">Зберегти</button></div>`, null, id ? () => G.open(id) : null);
  },
  save(id) {
    const name = val('g-name'); if (!name) return toast('Назви ціль');
    const d = { name, desc: val('g-desc'), emoji: val('g-emoji'), tier: segVal('g-tier') || 'medium' };
    if (id) Object.assign(S.goals.find(x => x.id === id), d);
    else { const g = { id: uid(), ...d, created: today(), doneAt: null }; S.goals.push(g); if (checked('g-pin')) S.pinned = [...S.pinned, g.id].slice(-3); id = g.id; }
    commit(); G.open(id);
  },
  pin(id) {
    if (S.pinned.includes(id)) S.pinned = S.pinned.filter(x => x !== id);
    else { if (S.pinned.length >= 3) { toast('На «Сьогодні» вже 3 цілі. Замінила найстарішу.'); S.pinned.shift(); } S.pinned.push(id); }
    commit(); G.open(id);
  },
  done(id) { const g = S.goals.find(x => x.id === id); g.doneAt = today(); S.pinned = S.pinned.filter(x => x !== id); closeAllModals(); commit(); toast('Ціль досягнуто! 🎉 Ти неймовірна'); },
  undone(id) { S.goals.find(x => x.id === id).doneAt = null; commit(); G.open(id); },
  del(id) {
    if (!confirm('Видалити ціль? Кроки залишаться в папках.')) return;
    const undo = snapshot();
    S.goals = S.goals.filter(x => x.id !== id); S.pinned = S.pinned.filter(x => x !== id);
    S.tasks.forEach(t => { if (t.goalId === id) t.goalId = null; });
    closeModal(); commit(); toast('Ціль видалено', undo);
  },
  choosePin() {
    const act = S.goals.filter(g => !g.doneAt && !S.pinned.includes(g.id));
    openModal(`<h3>Яку ціль показувати?</h3><div class="goal-grid">${act.map(g => `<div onclick="S.pinned.push('${g.id}');S.pinned=S.pinned.slice(-3);closeModal();commit()">${goalTile(g, true).replace(/onclick="[^"]*"/, '')}</div>`).join('')}</div>
      ${act.length ? '' : '<div class="empty">Усі активні цілі вже на «Сьогодні»</div>'}
      <div class="m-foot"><button class="btn ghost" onclick="closeModal()">Закрити</button><button class="btn" onclick="G.edit()">+ Нова ціль</button></div>`);
  },
};

/* ═══════════════ БЮДЖЕТ: логіка ═══════════════ */
const balance = () => Object.values(B().accounts).reduce((a, b) => a + b, 0);
const reserved = () => B().envelopes.reduce((a, e) => a + Math.max(0, e.amount), 0);
const freeMoney = () => balance() - reserved();
const savedTotal = () => B().savings.reduce((a, s) => a + s.saved, 0);
const bMonthStart = () => B().monthStart || (monthKey(today()) + '-01');
const txIn = (from, to) => B().txs.filter(t => t.date >= from && t.date <= to);
const sumT = (list, type) => list.filter(t => t.type === type).reduce((a, t) => a + t.amount, 0);
const spentSince = from => sumT(txIn(from, '9999'), 'expense');
const spontanSince = from => txIn(from, '9999').filter(t => t.type === 'expense' && t.spend === 'spontan').reduce((a, t) => a + t.amount, 0);
const envById = id => B().envelopes.find(e => e.id === id);
const goalById = id => B().savings.find(s => s.id === id);

function nextPayday() {
  const b = B(), T = today();
  let mk = monthKey(T);
  const dateFor = m => `${m}-${pad(Math.min(b.payday, lastDay(m)))}`;
  let d = dateFor(mk);
  if (d < T || (b.monthStart && daysBetween(b.monthStart, d) < 15)) d = dateFor(addMonths(mk, 1));
  return d;
}

// Генерація постійних платежів на поточний і 2 наступні місяці
function ensureRecurring() {
  const b = B(), mk0 = monthKey(today());
  let changed = false;
  for (let i = 0; i < 3; i++) {
    const mk = addMonths(mk0, i);
    b.recurring.forEach(r => {
      if (r.from && mk < r.from) return;
      if (b.payments.some(p => p.recurringId === r.id && monthKey(p.date) === mk)) return;
      const date = `${mk}-${pad(Math.min(r.day, lastDay(mk)))}`;
      if (mk === r.from && date < today()) return; // минулі дати першого місяця не створюємо
      b.payments.push({ id: uid(), name: r.name, amount: r.amount, date: `${mk}-${pad(Math.min(r.day, lastDay(mk)))}`, cat: r.cat, envId: r.envId, status: 'planned', recurringId: r.id, approx: r.approx });
      changed = true;
    });
  }
  return changed;
}
// Розподіл грошей конверта між неоплаченими платежами (за датою)
function coverage() {
  const map = {};
  const b = B();
  b.envelopes.forEach(e => {
    let left = Math.max(0, e.amount);
    b.payments.filter(p => p.envId === e.id && p.status === 'planned').sort((a, c) => a.date.localeCompare(c.date)).forEach(p => {
      const c = Math.min(left, p.amount); map[p.id] = c; left -= c;
    });
  });
  return map;
}
function payStatus(p, cov) {
  if (p.status === 'paid') return ['Оплачено ✓', 'ok'];
  const c = cov[p.id] || 0;
  if (c >= p.amount) return ['Відкладено', 'ok'];
  if (c > 0) return [`Збираю ${Math.round(c / p.amount * 100)}%`, 'warn'];
  return ['Не відкладено', 'bad'];
}
const visiblePayments = () => B().payments.filter(p => p.status !== 'skipped');

// Застосування транзакції до рахунків (sign=+1 застосувати, -1 відкотити)
function applyTx(t, sign) {
  const b = B(), a = t.amount * sign;
  const acc = k => { if (k && b.accounts[k] !== undefined) return k; return 'mono'; };
  switch (t.type) {
    case 'income': b.accounts[acc(t.account)] += a; break;
    case 'expense': b.accounts[acc(t.account)] -= a;
      if (t.envId) { const e = envById(t.envId); if (e) { if (sign > 0) { t.envTaken = Math.min(Math.max(0, e.amount), t.amount); e.amount -= t.envTaken; } else e.amount += (t.envTaken || 0); } }
      break;
    case 'save': b.accounts[acc(t.account)] -= a; { const g = goalById(t.goalId); g && (g.saved += a); } break;
    case 'unsave': b.accounts[acc(t.account)] += a; { const g = goalById(t.goalId); g && (g.saved -= a); } break;
    case 'repay': b.accounts[acc(t.account)] -= a; { const g = goalById(t.goalId); g && (g.saved += a); const d = b.debts.find(x => x.id === t.debtId); d && (d.repaid += a); } break;
    case 'transfer': b.accounts[acc(t.account)] -= a; b.accounts[acc(t.to)] += a; break;
  }
}
function addTx(t) { t.id = t.id || uid(); applyTx(t, 1); B().txs.push(t); return t; }
function removeTx(id) { const b = B(); const t = b.txs.find(x => x.id === id); if (!t) return; if (!t.legacy) applyTx(t, -1); b.txs = b.txs.filter(x => x !== t); b.payments.forEach(p => { if (p.txId === id) { p.status = 'planned'; p.txId = null; } }); }

const accSeg = (id, cur) => seg(id, Object.fromEntries(Object.entries(ACCS).map(([k, v]) => [k, v])), cur || 'mono');
const envSelect = (cur, label = '— не з конверта —') => `<select id="f-env"><option value="">${label}</option>${B().envelopes.map(e => `<option value="${e.id}" ${e.id === cur ? 'selected' : ''}>${esc(e.name)} · ${money(e.amount)}</option>`).join('')}</select>`;
const savSelect = cur => `<select id="f-goal">${B().savings.map(s => `<option value="${s.id}" ${s.id === cur ? 'selected' : ''}>${esc(s.name)} · ${money(s.saved)}</option>`).join('')}</select>`;

window.Bd = {
  sub(s) { S.ui.bsub = s; persist(false); render(); },
  sec(k) { S.ui.sec[k] = !S.ui.sec[k]; persist(false); render(); },
  // ── транзакції ──
  tx(type, id, preset = {}) {
    const b = B(); const t = id ? b.txs.find(x => x.id === id) : { type, amount: '', account: 'mono', cat: type === 'income' ? 'Зарплата' : '', sub: '', desc: '', spend: 'must', urgency: URGENCY[0], date: preset.date || today(), envId: '', goalId: b.savings[0] && b.savings[0].id, ...preset };
    type = t.type;
    const title = { income: 'Надходження', expense: 'Витрата', save: 'Відкладаю в заощадження', unsave: 'Беру із заощаджень' }[type];
    let f = `<h3>${id ? '✎ ' : '+ '}${title}</h3>
      <div class="row2"><div class="field"><label>Сума, ₴</label><input id="f-amt" inputmode="decimal" value="${t.amount || ''}" autofocus></div><div class="field"><label>Дата</label><input type="date" id="f-date" value="${t.date}"></div></div>`;
    if (type === 'income') f += `<div class="field"><label>Звідки</label><select id="f-cat">${opts(INC_CATS, t.cat)}</select></div>
      <div class="field"><label>Куди прийшло</label>${accSeg('f-acc', t.account)}</div>
      ${id ? '' : `<label class="checks" id="f-ms-wrap"><label><input type="checkbox" id="f-ms" checked> 🗓 Це зарплата: почати новий бюджетний місяць</label></label>`}`;
    if (type === 'expense') {
      const cats = Object.keys(EXP_CATS);
      f += `<div class="row2"><div class="field"><label>Категорія</label><select id="f-cat" onchange="Bd._subs()"><option value="">— обери —</option>${opts(cats, t.cat)}</select></div><div class="field"><label>Підкатегорія</label><select id="f-sub"></select></div></div>
        <div class="field"><label>Тип</label>${seg('f-spend', { must: SPEND.must[0], want: SPEND.want[0], spontan: SPEND.spontan[0] }, t.spend)}</div>
        <div class="field"><label>Чим платила</label>${accSeg('f-acc', t.account)}</div>
        <div class="field"><label>Взяти з конверта</label>${envSelect(t.envId)}</div>
        <div class="field"><label>Терміновість</label><select id="f-urg">${opts(URGENCY, t.urgency)}</select></div>`;
    }
    if (type === 'save' || type === 'unsave') f += `<div class="field"><label>${type === 'save' ? 'На що відкладаю' : 'З якої цілі беру'}</label>${savSelect(t.goalId)}</div>
      <div class="field"><label>${type === 'save' ? 'З якого рахунку' : 'На який рахунок'}</label>${accSeg('f-acc', t.account)}</div>
      ${type === 'unsave' && !id ? `<label class="checks"><label><input type="checkbox" id="f-debt" checked> 🔁 Записати як борг, який я поверну</label></label>` : ''}`;
    f += `<div class="field"><label>Опис (необов'язково)</label><input id="f-desc" value="${esc(t.desc || '')}"></div>
      <div class="m-foot">${id ? `<button class="btn danger" onclick="Bd.delTx('${id}')">Видалити</button>` : ''}<button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Bd.saveTx('${type}','${id || ''}')">Зберегти</button></div>`;
    openModal(f, () => { if (type === 'expense') Bd._subs(t.sub); if (type === 'income') { const c = $('#f-cat'), w = $('#f-ms-wrap'); if (c && w) { const upd = () => w.classList.toggle('hidden', c.value !== 'Зарплата'); c.onchange = upd; upd(); } } });
  },
  _subs(cur) { const c = val('f-cat'), s = $('#f-sub'); if (!s) return; const list = EXP_CATS[c] || []; s.innerHTML = `<option value="">—</option>` + opts(list, cur); s.disabled = !list.length; },
  saveTx(type, id) {
    const b = B();
    const amount = num(val('f-amt')); if (amount <= 0) return toast('Вкажи суму');
    const t = { id: id || uid(), type, amount, date: val('f-date') || today(), account: segVal('f-acc') || 'mono', desc: val('f-desc') };
    if (type === 'income') t.cat = val('f-cat');
    if (type === 'expense') { t.cat = val('f-cat'); t.sub = val('f-sub'); t.spend = segVal('f-spend') || 'must'; t.envId = val('f-env') || null; t.urgency = val('f-urg'); t.unsorted = !t.cat; }
    if (type === 'save' || type === 'unsave') t.goalId = val('f-goal');
    const flags = { ms: checked('f-ms'), debt: checked('f-debt') };
    if (type === 'expense' && t.spend === 'spontan') {
      const old = id ? (b.txs.find(x => x.id === id) || {}) : {};
      const was = spontanSince(bMonthStart()) - (old.spend === 'spontan' && old.date >= bMonthStart() ? old.amount : 0);
      if (was + amount > b.limits.spontan) return Bd.warn(was, amount, () => Bd._commitTx(t, id, flags));
    }
    Bd._commitTx(t, id, flags);
  },
  _commitTx(t, id, flags) {
    const b = B(), type = t.type, amount = t.amount;
    const undo = snapshot();
    if (id) { const old = b.txs.find(x => x.id === id); if (old && !old.legacy) applyTx(old, -1); b.txs = b.txs.filter(x => x.id !== id); }
    addTx(t);
    let msg = 'Збережено';
    if (type === 'income' && !id && t.cat === 'Зарплата' && flags.ms) { Bd.startMonth(t.date); msg = 'Новий бюджетний місяць почався 🌙'; }
    if (type === 'unsave' && !id && flags.debt) { const g = goalById(t.goalId); b.debts.push({ id: uid(), goalId: t.goalId, name: 'Повернути в «' + (g ? g.name : '') + '»', amount, repaid: 0, date: t.date, reason: t.desc }); }
    closeModal(); commit();
    if (type === 'expense' && t.spend === 'spontan') { const s = spontanSince(bMonthStart()), l = b.limits.spontan; if (s >= l * .8 && s <= l) msg = `Спонтанне: ${money(s)} з ${money(l)} — вже близько до ліміту 👀`; }
    toast(msg, undo);
    if (msg.startsWith('Новий')) setTimeout(() => Bd.distribute(), 400);
  },
  warn(was, amount, go) {
    const l = B().limits.spontan;
    Bd._go = go;
    openModal(`<div class="warn-pop"><div class="e">🤔</div><h3>А чи справді це треба?</h3>
      <p>Цього місяця на спонтанне вже пішло <b>${money(was)}</b> з ліміту <b>${money(l)}</b>.<br>З цією покупкою буде <b class="bad">${money(was + amount)}</b>.</p>
      <div class="m-foot" style="justify-content:center"><button class="btn ghost" onclick="closeModal()">Ні, не треба 💪</button><button class="btn" onclick="Bd._go()">Так, треба</button></div></div>`);
  },
  delTx(id) { const undo = snapshot(); removeTx(id); closeModal(); commit(); toast('Запис видалено', undo); },
  quick() {
    openModal(`<h3>⚡ Швидка витрата</h3>
      <div class="field"><label>Сума, ₴</label><input id="f-amt" inputmode="decimal" autofocus></div>
      <div class="field">${seg('f-spend', { must: SPEND.must[0], want: SPEND.want[0], spontan: SPEND.spontan[0] }, 'must')}</div>
      <div class="field">${accSeg('f-acc', 'mono')}</div>
      <div class="field"><input id="f-desc" placeholder="Що купила (можна пізніше)"></div>
      <input type="hidden" id="f-date" value="${today()}">
      <p class="muted tiny">Категорію допишеш увечері: запис буде позначено «не розібрано».</p>
      <div class="m-foot"><button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Bd.saveTx('expense','')">Зберегти</button></div>`);
  },
  startMonth(date) {
    const b = B(); b.monthStart = date;
    b.envelopes.forEach(e => e.carry = Math.max(0, e.amount));
  },
  // ── конверти ──
  distribute() {
    const b = B(), cov = coverage();
    const until = addMonths(monthKey(nextPayday()), 0) + '-31';
    const need = {};
    visiblePayments().filter(p => p.status === 'planned' && p.envId && p.date <= until).forEach(p => need[p.envId] = (need[p.envId] || 0) + p.amount);
    openModal(`<h3>💌 Розкласти по конвертах</h3>
      <p class="muted small">Вільно зараз: <b id="d-free">${money(freeMoney())}</b>. Вкажи, скільки <b>додати</b> в кожен конверт. Підказка: скільки ще треба на оплати до наступної зарплати.</p>
      ${b.envelopes.map(e => { const sug = Math.max(0, (need[e.id] || 0) - e.amount); return `<div class="env"><div class="n">${esc(e.name)}<div class="tiny muted">зараз ${money(e.amount)}${sug ? ` · треба ще ~${money(sug)}` : ''}</div></div><input style="width:110px" inputmode="decimal" data-env="${e.id}" placeholder="${sug || 0}" oninput="Bd._dsum()"></div>`; }).join('')}
      <div class="kv"><span>Розкладаю</span><b id="d-sum">0 ₴</b></div>
      <div class="m-foot"><button class="btn ghost sm" onclick="document.querySelectorAll('[data-env]').forEach(i=>i.value=i.placeholder==='0'?'':i.placeholder);Bd._dsum()">Заповнити підказками</button><button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Bd.saveDistribute()">Розкласти</button></div>`);
  },
  _dsum() { let s = 0; document.querySelectorAll('[data-env]').forEach(i => s += num(i.value)); $('#d-sum').textContent = money(s); $('#d-sum').className = s > freeMoney() ? 'bad' : ''; },
  saveDistribute() { const undo = snapshot(); document.querySelectorAll('[data-env]').forEach(i => { const e = envById(i.dataset.env); e.amount += num(i.value); }); closeModal(); commit(); toast('Розклала по конвертах 💌', undo); },
  env(id) {
    const e = id ? envById(id) : { name: '', amount: 0 };
    openModal(`<h3>${id ? 'Конверт' : 'Новий конверт'}</h3>
      <div class="field"><label>Назва</label><input id="e-name" value="${esc(e.name)}" autofocus></div>
      ${id ? `<div class="field"><label>Зараз у конверті: <b>${money(e.amount)}</b>. Додати (+) або забрати у вільні (−)</label><input id="e-delta" inputmode="decimal" placeholder="напр. 500 або -200"></div>` : `<div class="field"><label>Покласти одразу, ₴</label><input id="e-delta" inputmode="decimal"></div>`}
      <div class="m-foot">${id ? `<button class="btn danger" onclick="Bd.delEnv('${id}')">Видалити</button>` : ''}<button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Bd.saveEnv('${id || ''}')">Зберегти</button></div>`);
  },
  saveEnv(id) {
    const name = val('e-name'); if (!name) return toast('Назви конверт');
    const d = num(val('e-delta'));
    if (id) { const e = envById(id); e.name = name; e.amount = Math.max(0, e.amount + d); }
    else B().envelopes.push({ id: uid(), name, amount: Math.max(0, d), carry: 0 });
    closeModal(); commit();
  },
  delEnv(id) { if (!confirm('Видалити конверт? Гроші з нього стануть вільними.')) return; const b = B(); b.envelopes = b.envelopes.filter(e => e.id !== id); b.recurring.forEach(r => r.envId === id && (r.envId = null)); b.payments.forEach(p => p.envId === id && (p.envId = null)); closeModal(); commit(); },
  // ── рахунки ──
  acc(k) {
    openModal(`<h3>${accIcon(k, 26)} ${ACCS[k]}</h3><p class="muted small" style="margin-bottom:10px">Якщо сума в додатку не збігається з реальною, просто впиши, скільки там зараз.</p>
      <div class="field"><label>Зараз на рахунку, ₴</label><input id="a-v" inputmode="decimal" value="${Math.round(B().accounts[k] * 100) / 100}" autofocus></div>
      <div class="m-foot"><button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="B().accounts['${k}']=num(val('a-v'));closeModal();commit()">Зберегти</button></div>`);
  },
  transfer(preset = {}) {
    openModal(`<h3>↔ Переказ між рахунками</h3>
      <div class="field"><label>Звідки</label>${accSeg('t-from', preset.from || 'mono')}</div>
      <div class="field"><label>Куди</label>${accSeg('t-to', preset.to || 'cash')}</div>
      <div class="field"><label>Сума, ₴</label><input id="t-amt" inputmode="decimal" autofocus></div>
      <div class="m-foot"><button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Bd.doTransfer()">Перевести</button></div>`);
  },
  doTransfer() {
    const from = segVal('t-from'), to = segVal('t-to'), a = num(val('t-amt'));
    if (!a || from === to) return toast('Обери різні рахунки й суму');
    const undo = snapshot(); addTx({ type: 'transfer', amount: a, account: from, to, date: today(), desc: `${ACCS[from]} → ${ACCS[to]}` }); closeModal(); commit(); toast(`↔ ${money(a)}: ${ACCS[from]} → ${ACCS[to]}`, undo);
  },
  ride() {
    openModal(`<h3>🚌 Поїздка</h3><div class="field"><label>Скільки списати з проїзного, ₴</label><input id="r-amt" inputmode="decimal" value="${S.ui.ride || ''}" autofocus></div>
      <div class="m-foot"><button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Bd.saveRide()">Списати</button></div>`);
  },
  saveRide() { const a = num(val('r-amt')); if (!a) return; S.ui.ride = a; const undo = snapshot(); addTx({ type: 'expense', amount: a, account: 'transit', cat: 'Проїзд', spend: 'must', date: today(), desc: 'Поїздка' }); closeModal(); commit(); toast(`🚌 −${money(a)} з проїзного`, undo); },
  // ── оплати ──
  pay(id, preset = {}) {
    const p = id ? B().payments.find(x => x.id === id) : { name: '', amount: '', date: preset.date || today(), cat: 'Інше', envId: '' };
    openModal(`<h3>${id ? 'Оплата' : 'Нова оплата'}</h3>
      <div class="field"><label>Назва</label><input id="p-name" value="${esc(p.name)}" autofocus placeholder="напр. Подарунок Каті"></div>
      <div class="row2"><div class="field"><label>Сума${p.approx ? ' (орієнтовно)' : ''}, ₴</label><input id="p-amt" inputmode="decimal" value="${p.amount}"></div><div class="field"><label>Дата</label><input type="date" id="p-date" value="${p.date}"></div></div>
      <div class="row2"><div class="field"><label>Категорія витрати</label><select id="p-cat">${opts(Object.keys(EXP_CATS), p.cat)}</select></div><div class="field"><label>З якого конверта</label>${envSelect(p.envId, '— без конверта —')}</div></div>
      ${!id ? `<label class="checks"><label><input type="checkbox" id="p-rec"> 🔁 Повторювати щомісяця</label></label>` : (p.recurringId ? '<p class="muted tiny">Це постійний платіж: зміни стосуються лише цього місяця. Змінити назавжди можна в ⚙ → Постійні платежі.</p>' : '')}
      <div class="m-foot">${id ? `<button class="btn danger" onclick="Bd.delPay('${id}')">Видалити</button>` : ''}<button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Bd.savePay('${id || ''}')">Зберегти</button></div>`);
  },
  savePay(id) {
    const b = B(); const name = val('p-name'), amount = num(val('p-amt')), date = val('p-date');
    if (!name || !amount || !date) return toast('Заповни назву, суму й дату');
    const d = { name, amount, date, cat: val('p-cat'), envId: val('f-env') || null };
    if (id) Object.assign(b.payments.find(x => x.id === id), d, { approx: false });
    else if (checked('p-rec')) { b.recurring.push({ id: uid(), name, amount, day: parseD(date).getDate(), cat: d.cat, envId: d.envId, approx: false, from: monthKey(date) }); ensureRecurring(); }
    else b.payments.push({ id: uid(), ...d, status: 'planned' });
    closeModal(); commit();
  },
  delPay(id) {
    const b = B(); const p = b.payments.find(x => x.id === id); const undo = snapshot();
    if (p.txId) removeTx(p.txId);
    if (p.recurringId) p.status = 'skipped'; else b.payments = b.payments.filter(x => x !== p);
    closeModal(); commit(); toast('Оплату прибрано', undo);
  },
  markPaid(id) {
    const p = B().payments.find(x => x.id === id);
    openModal(`<h3>✓ Оплатила «${esc(p.name)}»</h3>
      <div class="row2"><div class="field"><label>Скільки фактично, ₴</label><input id="f-amt" inputmode="decimal" value="${p.amount}" autofocus></div><div class="field"><label>Дата</label><input type="date" id="f-date" value="${today()}"></div></div>
      <div class="field"><label>Чим платила</label>${accSeg('f-acc', 'mono')}</div>
      <div class="field"><label>З конверта</label>${envSelect(p.envId)}</div>
      <div class="m-foot"><button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Bd.savePaid('${id}')">Оплачено</button></div>`);
  },
  savePaid(id) {
    const p = B().payments.find(x => x.id === id); const undo = snapshot();
    const amount = num(val('f-amt')) || p.amount;
    const t = addTx({ type: 'expense', amount, account: segVal('f-acc'), cat: p.cat, desc: p.name, spend: 'must', envId: val('f-env') || null, date: val('f-date') || today(), urgency: URGENCY[0] });
    p.status = 'paid'; p.txId = t.id; p.paidAmount = amount;
    const e = t.envId && envById(t.envId);
    closeModal(); commit();
    toast(e && e.amount > 0 ? `Оплачено ✓ У конверті «${e.name}» лишилось ${money(e.amount)}: переходить далі` : 'Оплачено ✓', undo);
  },
  unpay(id) { const p = B().payments.find(x => x.id === id); const undo = snapshot(); if (p.txId) removeTx(p.txId); p.status = 'planned'; commit(); toast('Позначку «оплачено» знято', undo); },
  // ── заощадження ──
  sav(id) {
    const s = id ? goalById(id) : { name: '', target: '', saved: 0 };
    openModal(`<h3>${id ? 'Ціль накопичення' : 'Нова ціль накопичення'}</h3>
      <div class="field"><label>Назва</label><input id="s-name" value="${esc(s.name)}" autofocus placeholder="Тату, зуби, подушка…"></div>
      <div class="row2"><div class="field"><label>Скільки треба, ₴</label><input id="s-target" inputmode="decimal" value="${s.target}"></div><div class="field"><label>Вже є, ₴</label><input id="s-saved" inputmode="decimal" value="${s.saved}"></div></div>
      <p class="muted tiny">«Вже є» міняй вручну, лише якщо гроші вже десь лежать. Нові внески краще робити кнопкою «+ Відкласти».</p>
      <div class="m-foot">${id ? `<button class="btn danger" onclick="Bd.delSav('${id}')">Видалити</button>` : ''}<button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Bd.saveSav('${id || ''}')">Зберегти</button></div>`);
  },
  saveSav(id) { const name = val('s-name'); if (!name) return; const d = { name, target: num(val('s-target')), saved: num(val('s-saved')) }; if (id) Object.assign(goalById(id), d); else B().savings.push({ id: uid(), ...d }); closeModal(); commit(); },
  delSav(id) { if (!confirm('Видалити ціль накопичення?')) return; const b = B(); b.savings = b.savings.filter(s => s.id !== id); closeModal(); commit(); },
  calc(id) {
    const s = goalById(id), a = num(document.getElementById('c-' + id).value), per = document.getElementById('cp-' + id).value;
    const out = document.getElementById('co-' + id); S.ui['calc_' + id] = [a, per]; persist(false);
    const left = Math.max(0, s.target - s.saved);
    if (!left) { out.textContent = 'Ціль уже закрита 🎉'; return; }
    if (!a) { out.textContent = ''; return; }
    const n = Math.ceil(left / a); const step = { day: 1, week: 7, month: 30 }[per];
    const end = addDays(today(), n * step);
    const unit = { day: ['день', 'дні', 'днів'], week: ['тиждень', 'тижні', 'тижнів'], month: ['місяць', 'місяці', 'місяців'] }[per];
    out.innerHTML = `→ закриєш за <b>${n} ${plural(n, ...unit)}</b> (≈ ${fmtDate(end)}${end.slice(0, 4) !== today().slice(0, 4) ? ' ' + end.slice(0, 4) : ''})`;
  },
  repay(debtId) {
    const d = B().debts.find(x => x.id === debtId);
    openModal(`<h3>🔁 ${esc(d.name)}</h3><p class="muted small">Лишилось повернути ${money(d.amount - d.repaid)}</p>
      <div class="field"><label>Сума, ₴</label><input id="f-amt" inputmode="decimal" value="${d.amount - d.repaid}" autofocus></div>
      <div class="field"><label>З якого рахунку</label>${accSeg('f-acc', 'mono')}</div>
      <div class="m-foot"><button class="btn danger" onclick="B().debts=B().debts.filter(x=>x.id!=='${debtId}');closeModal();commit()">Списати борг</button><button class="btn ghost" onclick="closeModal()">Скасувати</button><button class="btn" onclick="Bd.saveRepay('${debtId}')">Повернути</button></div>`);
  },
  saveRepay(debtId) {
    const d = B().debts.find(x => x.id === debtId); const a = num(val('f-amt')); if (!a) return;
    const undo = snapshot(); addTx({ type: 'repay', amount: a, account: segVal('f-acc'), goalId: d.goalId, debtId, date: today(), desc: d.name });
    if (d.repaid >= d.amount - 0.5) B().debts = B().debts.filter(x => x !== d);
    closeModal(); commit(); toast('Повернула в заощадження 💚', undo);
  },
  // ── календар ──
  calNav(n) { S.ui.calM = n === 0 ? monthKey(today()) : addMonths(S.ui.calM || monthKey(today()), n); S.ui.calSel = null; persist(false); render(); },
  calSel(d) { S.ui.calSel = d; persist(false); render(); },
  monNav(n) { S.ui.monM = n === 0 ? monthKey(today()) : addMonths(S.ui.monM || monthKey(today()), n); persist(false); render(); },
};

/* ═══════════════ НАЛАШТУВАННЯ ═══════════════ */
window.Set_ = {
  open() {
    const b = B(), u = App._user;
    openModal(`<h3>⚙ Налаштування</h3>
      <div class="field"><label>Тема</label>${seg('s-theme', { auto: '🌗 Як на пристрої', light: '☀ Денна', dark: '🌙 Нічна' }, S.ui.theme)}</div>
      <div class="card" style="box-shadow:none"><div class="card-h"><h3>Акаунт і синхронізація</h3></div>
        ${u ? `<p class="small">Увійшла як <b>${esc(u.email)}</b></p><button class="btn ghost sm" style="margin-top:8px" onclick="Sync.signOut()">Вийти</button>` : `<p class="small muted">Увійди через Google, щоб дані були захищені й однакові на всіх пристроях.</p><button class="btn sm" style="margin-top:8px" onclick="Sync.signIn()">Увійти через Google</button>`}</div>
      <div class="card"><div class="card-h"><h3>Бюджет</h3></div>
        <div class="row2"><div class="field"><label>Ліміт на спонтанне / міс, ₴</label><input id="s-lim" inputmode="decimal" value="${b.limits.spontan}"></div><div class="field"><label>Зарплата зазвичай приходить</label><input id="s-pay" inputmode="numeric" value="${b.payday}"></div></div>
        <button class="btn ghost sm" onclick="Set_.recurring()">🔁 Постійні платежі (${b.recurring.length})</button>
        <button class="btn ghost sm" onclick="closeModal();Bd.env()">+ Новий конверт</button></div>
      <div class="card"><div class="card-h"><h3>Резервна копія</h3></div><p class="muted tiny" style="margin-bottom:8px">Файл з усіма твоїми даними, про всяк випадок.</p>
        <button class="btn ghost sm" onclick="Set_.export()">⬇ Завантажити</button> <label class="btn ghost sm">⬆ Відновити<input type="file" accept=".json" class="hidden" onchange="Set_.import(this.files[0])"></label></div>
      <p class="muted tiny" style="margin-top:12px">Версія додатку: ${APP_VERSION}</p><div class="m-foot"><button class="btn" onclick="Set_.save()">Готово</button></div>`);
  },
  save() { S.ui.theme = segVal('s-theme') || 'auto'; const b = B(); b.limits.spontan = num(val('s-lim')) || 2000; b.payday = Math.min(31, Math.max(1, parseInt(val('s-pay')) || 27)); applyTheme(); closeAllModals(); commit(); },
  recurring() {
    const b = B();
    openModal(`<h3>🔁 Постійні платежі</h3><p class="muted small" style="margin-bottom:8px">Вони самі з'являються в календарі й «Найближчих оплатах» щомісяця.</p>
      ${b.recurring.map(r => `<div class="pay"><div class="body"><div>${esc(r.name)}</div><div class="tiny muted">щомісяця ${r.day}-го${r.envId && envById(r.envId) ? ' · конверт «' + esc(envById(r.envId).name) + '»' : ''}</div></div><span class="amt">${r.approx ? '~' : ''}${money(r.amount)}</span><button class="act" onclick="Set_.rec('${r.id}')">✎</button></div>`).join('') || '<div class="empty">Поки порожньо</div>'}
      <div class="m-foot"><button class="btn ghost" onclick="closeModal()">Назад</button><button class="btn" onclick="Set_.rec()">+ Додати</button></div>`, null, () => Set_.open());
  },
  rec(id) {
    const r = id ? B().recurring.find(x => x.id === id) : { name: '', amount: '', day: 1, cat: 'Інше', envId: '', approx: false };
    openModal(`<h3>${id ? 'Постійний платіж' : 'Новий постійний платіж'}</h3>
      <div class="field"><label>Назва</label><input id="r-name" value="${esc(r.name)}" autofocus></div>
      <div class="row2"><div class="field"><label>Сума, ₴</label><input id="r-amt" inputmode="decimal" value="${r.amount}"></div><div class="field"><label>Число місяця</label><input id="r-day" inputmode="numeric" value="${r.day}"></div></div>
      <div class="row2"><div class="field"><label>Категорія</label><select id="r-cat">${opts(Object.keys(EXP_CATS), r.cat)}</select></div><div class="field"><label>Конверт</label>${envSelect(r.envId, '— без конверта —')}</div></div>
      <label class="checks"><label><input type="checkbox" id="r-approx" ${r.approx ? 'checked' : ''}> Сума орієнтовна (як комуналка)</label></label>
      <div class="m-foot">${id ? `<button class="btn danger" onclick="Set_.delRec('${id}')">Видалити</button>` : ''}<button class="btn ghost" onclick="closeModal()">Назад</button><button class="btn" onclick="Set_.saveRec('${id || ''}')">Зберегти</button></div>`, null, () => Set_.recurring());
  },
  saveRec(id) {
    const b = B(); const d = { name: val('r-name'), amount: num(val('r-amt')), day: Math.min(31, Math.max(1, parseInt(val('r-day')) || 1)), cat: val('r-cat'), envId: val('f-env') || null, approx: checked('r-approx') };
    if (!d.name || !d.amount) return toast('Заповни назву й суму');
    if (id) {
      const r = b.recurring.find(x => x.id === id); Object.assign(r, d);
      b.payments.filter(p => p.recurringId === id && p.status === 'planned' && p.date >= today()).forEach(p => { p.name = d.name; p.amount = d.amount; p.cat = d.cat; p.envId = d.envId; p.approx = d.approx; p.date = `${monthKey(p.date)}-${pad(Math.min(d.day, lastDay(monthKey(p.date))))}`; });
    } else b.recurring.push({ id: uid(), ...d, from: monthKey(today()) });
    ensureRecurring(); commit(); Set_.recurring();
  },
  delRec(id) { if (!confirm('Видалити постійний платіж? Майбутні неоплачені теж зникнуть.')) return; const b = B(); b.recurring = b.recurring.filter(r => r.id !== id); b.payments = b.payments.filter(p => !(p.recurringId === id && p.status !== 'paid' && p.date >= today())); commit(); Set_.recurring(); },
  export() { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' })); a.download = `bitch-catli-${today()}.json`; a.click(); },
  import(f) { if (!f) return; const r = new FileReader(); r.onload = () => { const s = safeJSON(r.result); if (!s || s.v !== 2) return toast('Це не схоже на копію Bitch Catli'); if (!confirm('Замінити всі поточні дані цією копією?')) return; S = s; closeModal(); commit(); toast('Відновлено з копії'); }; r.readAsText(f); },
};

/* ═══════════════ РЕНДЕР ═══════════════ */
function render() {
  if (ensureRecurring()) persist();
  const v = S.ui.view;
  document.body.dataset.view = v;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.v === v));
  applyTheme();
  const html = { today: vToday, goals: vGoals, tasks: vTasks, budget: vBudget }[v]();
  const y = scrollY; $('#view').innerHTML = html; scrollTo(0, y);
  $('#fab').classList.toggle('hidden', v !== 'budget');
}
window.go = v => { S.ui.view = v; persist(false); render(); scrollTo(0, 0); };

// ── СЬОГОДНІ ──
function taskRow(t, ctx) {
  return `<div class="trow ${t.done ? 'done' : ''}"><span class="check ${t.done ? 'on' : ''}" onclick="T.toggle('${t.id}')"></span>
    <div class="body"><div class="txt">${esc(t.text)}</div><div class="meta">${taskBadges(t, ctx)}</div></div>
    <div class="acts">${ctx === 'today' ? `<button class="act star-btn ${t.star ? 'on' : ''}" title="Суперзадача" onclick="T.star('${t.id}')">${t.star ? '★' : '☆'}</button>` : `<button class="act" title="${t.today ? 'Прибрати з сьогодні' : 'На сьогодні'}" onclick="T.toggleToday('${t.id}')" style="${t.today ? 'color:var(--warn)' : ''}">☀</button>`}
      <button class="act" title="Редагувати" onclick="T.edit('${t.id}','${ctx}')">✎</button>
      <button class="act" title="Google Календар" onclick="T.gcal('${t.id}')">📅</button>
      ${ctx === 'today' ? `<button class="act x" title="Прибрати з задач дня" onclick="T.removeToday('${t.id}')">×</button>` : `<button class="act x" title="Видалити" onclick="T.del('${t.id}')">×</button>`}</div></div>`;
}
function deadlineItems(maxDays) {
  const T = today(), lim = addDays(T, maxDays);
  const items = S.tasks.filter(t => !t.done && t.deadline && t.deadline <= lim).map(t => ({ kind: 't', date: t.deadline, t }));
  visiblePayments().filter(p => p.status === 'planned' && p.date <= lim && p.date >= addDays(T, -31)).forEach(p => items.push({ kind: 'p', date: p.date, p }));
  return items.sort((a, b) => a.date.localeCompare(b.date));
}
function whenChip(date) {
  const d = daysBetween(today(), date);
  if (d < 0) return `<span class="dl-when bad">прострочено ${days(-d)}</span>`;
  if (d === 0) return `<span class="dl-when warn">сьогодні</span>`;
  if (d === 1) return `<span class="dl-when warn">завтра</span>`;
  return `<span class="dl-when">через ${days(d)}</span>`;
}
function dlItem(it) {
  if (it.kind === 't') {
    const t = it.t;
    return `<div class="leo-item dl-item"><div style="flex:1;min-width:0">${whenChip(t.deadline)}<div class="dl-t">${esc(t.text)}</div><div class="tiny" style="opacity:.75">${esc(t.cat)} · ${fmtDate(t.deadline)}</div></div>
      <button class="act" title="Виконано" onclick="T.toggle('${t.id}')">✓</button><button class="act" title="Редагувати" onclick="T.edit('${t.id}','tasks')">✎</button><button class="act x" title="Прибрати дедлайн" onclick="T.clearDeadline('${t.id}')">×</button></div>`;
  }
  const p = it.p;
  return `<div class="leo-item dl-item"><div style="flex:1;min-width:0">${whenChip(p.date)}<div class="dl-t">₴ ${esc(p.name)} · <b>${p.approx ? '~' : ''}${money(p.amount)}</b></div><div class="tiny" style="opacity:.75">оплата · ${fmtDate(p.date)}</div></div>
    <button class="act" title="Оплачено" onclick="Bd.markPaid('${p.id}')">✓</button><button class="act" title="Редагувати" onclick="Bd.pay('${p.id}')">✎</button><button class="act x" title="Видалити" onclick="Bd.delPay('${p.id}')">×</button></div>`;
}
function vToday() {
  const T = today(), d = parseD(T);
  const pg = pinnedGoals();
  const slots = [...pg.map(g => goalTile(g, true))];
  while (slots.length < 3) slots.push(`<div class="gtile empty-slot" onclick="${S.goals.some(g => !g.doneAt && !S.pinned.includes(g.id)) ? 'G.choosePin()' : 'G.edit()'}"><div style="font-size:26px">+</div><div class="gsub">${S.goals.some(g => !g.doneAt && !S.pinned.includes(g.id)) ? 'обрати ціль' : 'нова ціль'}</div></div>`);
  const q = quoteOfDay();
  const tt = todayTasks();
  const stars = tt.filter(t => t.star);
  const rest = tt.filter(t => !t.star);
  const groups = [...new Set(rest.map(t => t.cat))].sort((a, b) => allCats().indexOf(a) - allCats().indexOf(b));
  const dl = deadlineItems(7);
  return `
  <div class="date-line"><span class="d">${d.getDate()} ${MONTHS_G[d.getMonth()]}</span><span class="wd">${WDAYS[d.getDay()]}, ${d.getFullYear()}</span></div>
  <div class="goals-row">${slots.join('')}</div>
  ${q ? `<div class="leo quote"><div class="quote-box"><div class="quote-q">“${esc(q.q)}”</div><div class="quote-src">— ${esc(q.who)}${q.src ? ', <i>' + esc(q.src) + '</i>' : ''}</div></div>
    <div class="quote-acts"><button class="act" title="Інша цитата" onclick="Q.next()">↻</button><button class="act" title="Додати свою" onclick="Q.add()">+</button></div></div>` : ''}
  <div class="today-grid">
    <section class="card a-notes"><div class="card-h"><h2>Нотатки дня</h2></div>
      <div class="add-inline"><input id="note-inp" placeholder="Щось швидко запам'ятати…" onkeydown="if(event.key==='Enter')N.add()"><button class="btn" onclick="N.add()">+</button></div>
      ${S.notes.map(n => `<div class="note"><div class="txt" onclick="N.edit('${n.id}')">${esc(n.text)}</div><button class="act" onclick="N.edit('${n.id}')">✎</button><button class="act x" onclick="N.del('${n.id}')">×</button></div>`).join('') || '<div class="empty">Порожньо. Тут живуть швидкі думки.</div>'}
    </section>
    <section class="card a-tasks"><div class="card-h"><h2>Задачі дня</h2><button class="btn ghost sm" onclick="T.pick()">📂 Зі списку</button><button class="btn sm" onclick="T.edit(null,'today')">+ Додати</button></div>
      ${stars.length ? `<div class="group-h star">★ Суперзадачі</div><div class="super">${stars.map(t => taskRow(t, 'today')).join('')}</div>` : `<p class="muted tiny">Натисни ☆ біля задачі, щоб зробити її суперзадачею дня (найкраще 3).</p>`}
      ${groups.map(c => `<div class="group-h"><span class="dot" style="background:${catColor(c)}"></span>${esc(c)}</div>${rest.filter(t => t.cat === c).map(t => taskRow(t, 'today')).join('')}`).join('')}
      ${!tt.length ? '<div class="empty">На сьогодні задач немає. Обери зі списку або додай нову 🌙</div>' : ''}
    </section>
    <section class="leo a-dl"><div class="card-h"><h2>⚠ Найближчі дедлайни</h2><button class="btn ghost sm" onclick="T.edit(null,'tasks',{deadline:''})">+ Дедлайн</button></div>
      ${dl.map(dlItem).join('') || '<div class="empty">На найближчий тиждень дедлайнів немає 🐆</div>'}
    </section>
  </div>`;
}

// ── ЦІЛІ ──
function vGoals() {
  const T = today(), wk = addDays(T, -6), mk = monthKey(T);
  const doneG = S.goals.filter(g => g.doneAt);
  const gw = doneG.filter(g => g.doneAt >= wk).length, gm = doneG.filter(g => monthKey(g.doneAt) === mk).length;
  const steps = S.tasks.filter(t => t.done && t.doneAt);
  const sw = steps.filter(t => t.doneAt >= wk).length, sm = steps.filter(t => monthKey(t.doneAt) === mk).length;
  const act = S.goals.filter(g => !g.doneAt);
  return `
  <div class="stats">
    <div class="stat"><div class="muted small">Цілей досягнуто</div><b>${gw}</b> <span class="muted small">за тиждень</span> · <b>${gm}</b> <span class="muted small">за місяць</span></div>
    <div class="stat"><div class="muted small">Задач виконано</div><b>${sw}</b> <span class="muted small">за тиждень</span> · <b>${sm}</b> <span class="muted small">за місяць</span></div>
  </div>
  <div class="toolbar" style="margin-top:14px"><span class="muted small" style="flex:1">📌 — показується на «Сьогодні» (до 3 цілей)</span><button class="btn" onclick="G.edit()">+ Нова ціль</button></div>
  ${Object.entries(TIERS).map(([k, [name, color, hint]]) => {
    const list = act.filter(g => g.tier === k);
    return `<div class="tier-h"><span class="tier-badge" style="background:${color}"></span><h2>${name}</h2><span class="muted small">${hint}</span></div>
      <div class="goal-grid">${list.map(g => goalTile(g)).join('')}<div class="gtile empty-slot" onclick="G.edit();setTimeout(()=>{const b=document.querySelector('#g-tier [data-v=${k}]');b&&segPick(b)},60)"><div style="font-size:24px">+</div><div class="gsub">додати</div></div></div>`;
  }).join('')}
  <div class="folder ${S.ui.fold.__achieved === false ? '' : 'closed'}" style="margin-top:22px"><button class="folder-h" onclick="S.ui.fold.__achieved=S.ui.fold.__achieved===false;persist(false);render()">🏆 Досягнуте<span class="cnt">${doneG.length}</span><span class="chev">▾</span></button>
    <div class="folder-b"><div class="goal-grid">${doneG.map(g => goalTile(g)).join('') || '<div class="empty">Поки порожньо, але це ненадовго 💪</div>'}</div></div></div>`;
}

// ── ЗАДАЧІ ──
function vTasks() {
  const q = (S.ui.search || '').toLowerCase(), f = S.ui.filter || 'all';
  const match = t => (!q || t.text.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)) && (f === 'all' || (f === 'done' ? t.done : (!t.done && t.priority === f)));
  const list = S.tasks.filter(t => t.inFolder && match(t));
  const cats = allCats().filter(c => list.some(t => t.cat === c));
  const T = today();
  const dl = S.tasks.filter(t => !t.done && t.deadline).sort((a, b) => a.deadline.localeCompare(b.deadline));
  const w = dl.filter(t => t.deadline <= addDays(T, 7)), m = dl.filter(t => t.deadline > addDays(T, 7) && t.deadline <= addDays(T, 31)), l = dl.filter(t => t.deadline > addDays(T, 31));
  const dlBlock = (title, arr) => `<div class="group-h" style="color:#fff;text-shadow:0 1px 4px #000">${title} · ${arr.length}</div>${arr.map(t => dlItem({ kind: 't', t })).join('') || '<div class="empty">—</div>'}`;
  return `
  <div class="tasks-layout">
    <div>
      <div class="toolbar"><input id="search" placeholder="🔍 Пошук…" value="${esc(S.ui.search || '')}" oninput="S.ui.search=this.value;render();const s=$('#search');s.focus();s.setSelectionRange(s.value.length,s.value.length)"><button class="btn" onclick="T.edit(null,'tasks')">+ Нова</button></div>
      <div class="toolbar" style="margin-top:8px">${seg('flt', { all: 'Всі', urgent: 'Терміново', soon: 'Скоро', someday: 'Колись', done: 'Виконані' }, f).replace('class="seg"', 'class="seg" style="flex:1" onchange="S.ui.filter=segVal(\'flt\');persist(false);render()"')}</div>
      <div class="toolbar" style="margin-top:8px"><button class="btn ghost sm" onclick="T.foldAll(false)">Розгорнути все</button><button class="btn ghost sm" onclick="T.foldAll(true)">Згорнути все</button><span style="flex:1"></span><button class="btn ghost sm" onclick="T.clearDone()">🧹 Прибрати виконані</button></div>
      ${cats.map(c => { const ct = list.filter(t => t.cat === c).sort((a, b) => a.done - b.done); return `<div class="folder ${S.ui.fold[c] ? 'closed' : ''}"><button class="folder-h" onclick="T.fold('${esc(c)}')"><span class="dot" style="background:${catColor(c)}"></span>${esc(c)}<span class="cnt">${ct.filter(t => !t.done).length}${ct.some(t => t.done) ? ' · ✓' + ct.filter(t => t.done).length : ''}</span><span class="chev">▾</span></button><div class="folder-b">${ct.map(t => taskRow(t, 'tasks')).join('')}</div></div>`; }).join('') || '<div class="empty">Нічого не знайдено</div>'}
    </div>
    <aside class="leo tasks-side"><div class="card-h"><h2>⏳ Дедлайни</h2></div>${dlBlock('Цього тижня', w)}${dlBlock('Цього місяця', m)}${dlBlock('Колись потім', l)}</aside>
  </div>`;
}

// ── БЮДЖЕТ ──
function txRow(t) {
  const sign = { income: ['+', 'in'], expense: ['−', 'out'], save: ['→', 'sv'], unsave: ['←', 'in'], repay: ['→', 'sv'], transfer: ['↔', 'out'], save_legacy: ['→', 'sv'] }[t.type] || ['', ''];
  const title = t.type === 'expense' ? (t.unsorted ? '⚠ Не розібрано' : esc(t.cat) + (t.sub ? ' · ' + esc(t.sub) : '')) : t.type === 'save' || t.type === 'unsave' || t.type === 'repay' ? esc((goalById(t.goalId) || {}).name || t.cat || 'Заощадження') : esc(t.cat || t.desc || '');
  const meta = [fmtDate(t.date), ACCS[t.account] || '', t.desc && t.type !== 'transfer' ? esc(t.desc) : '', t.envId && envById(t.envId) ? '✉ ' + esc(envById(t.envId).name) : ''].filter(Boolean).join(' · ');
  const editable = t.type !== 'transfer' && t.type !== 'repay' && !t.legacy;
  return `<div class="tx ${t.unsorted ? 'unsorted' : ''}"><div class="body"><div>${title} ${t.type === 'expense' && SPEND[t.spend] && t.spend !== 'must' ? `<span class="chip ${SPEND[t.spend][1]}">${SPEND[t.spend][0]}</span>` : ''}</div><div class="tiny muted">${meta}</div></div><span class="amt ${sign[1]}">${sign[0]}${money(t.amount)}</span>
    ${editable ? `<button class="act" onclick="Bd.tx('${t.type}','${t.id}')">✎</button>` : ''}<button class="act x" onclick="Bd.delTx('${t.id}')">×</button></div>`;
}
function payRow(p, cov) {
  const [st, cls] = payStatus(p, cov);
  return `<div class="pay ${p.status === 'paid' ? 'paid' : ''}"><div class="body"><div class="name">${esc(p.name)}</div><div class="tiny muted">${fmtDate(p.date)} · <span class="${cls}">${st}</span></div></div>
    <span class="amt">${p.approx && p.status !== 'paid' ? '~' : ''}${money(p.status === 'paid' ? (p.paidAmount || p.amount) : p.amount)}</span>
    ${p.status === 'paid' ? `<button class="act" title="Зняти позначку" onclick="Bd.unpay('${p.id}')">↺</button>` : `<button class="act" title="Оплачено" onclick="Bd.markPaid('${p.id}')">✓</button><button class="act" title="Редагувати" onclick="Bd.pay('${p.id}')">✎</button><button class="act x" title="Видалити" onclick="Bd.delPay('${p.id}')">×</button>`}</div>`;
}
function sec(key, title, inner, defOpen) {
  const closed = S.ui.sec[key] === undefined ? !defOpen : S.ui.sec[key];
  return `<div class="acc-sec ${closed ? 'closed' : ''}"><button onclick="S.ui.sec['${key}']=${!closed};persist(false);render()">${title}<span class="chev">▾</span></button><div class="acc-b">${inner}</div></div>`;
}
function vBudget() {
  const s = S.ui.bsub;
  return `<div class="subtabs">${seg('bsub', { day: 'День', cal: 'Календар', month: 'Місяць' }, s).replace('class="seg"', 'class="seg" onchange="Bd.sub(segVal(\'bsub\'))"')}<button class="icon-btn" style="background:var(--surface);color:var(--text)" title="Налаштування бюджету" onclick="Set_.open()">⚙</button></div>
    ${s === 'cal' ? vCal() : s === 'month' ? vMonth() : vDay()}`;
}
function vDay() {
  const b = B(), T = today(), ms = bMonthStart(), cov = coverage();
  const spent = spentSince(ms), spon = spontanSince(ms), lim = b.limits.spontan, sp = Math.min(100, spon / lim * 100);
  const envOpen = S.ui.sec.env;
  const soon = visiblePayments().filter(p => p.status === 'planned' && p.date <= addDays(T, 7)).sort((a, c) => a.date.localeCompare(c.date));
  const np = nextPayday();
  const before = visiblePayments().filter(p => p.status === 'planned' && p.date <= np).sort((a, c) => a.date.localeCompare(c.date));
  const needBefore = before.reduce((a, p) => a + p.amount - (cov[p.id] || 0), 0);
  const fm = freeMoney();
  const monthTx = txIn(ms, '9999').sort((a, c) => c.date.localeCompare(a.date));
  const unsorted = b.txs.filter(t => t.unsorted);
  return `
  <section class="card">
    <div class="sum-grid">
      <div class="sum"><div class="l">Баланс</div><div class="v">${money(balance())}</div></div>
      <button class="sum" onclick="S.ui.sec.env=!S.ui.sec.env;persist(false);render()"><div class="l">Відкладено ${envOpen ? '▴' : '▾'}</div><div class="v">${money(reserved())}</div></button>
      <div class="sum hl"><div class="l">Вільно</div><div class="v ${fm < 0 ? 'bad' : ''}">${money(fm)}</div></div>
      <div class="sum"><div class="l">Витрачено з ${fmtDate(ms)}</div><div class="v">${money(spent)}</div></div>
    </div>
    ${envOpen ? `<div style="margin-top:10px">${b.envelopes.map(e => `<div class="env"><div class="n">✉ ${esc(e.name)}${e.carry > 0 ? `<div class="tiny ok">+${money(e.carry)} перейшло з минулого місяця</div>` : ''}</div><span class="a">${money(e.amount)}</span><button class="act" onclick="Bd.env('${e.id}')">✎</button></div>`).join('')}
      <div class="toolbar" style="margin-top:8px"><button class="btn sm" onclick="Bd.distribute()">💌 Розкласти гроші</button><button class="btn ghost sm" onclick="Bd.env()">+ Конверт</button></div></div>` : ''}
    <div style="margin-top:12px;display:flex;gap:14px;flex-wrap:wrap;align-items:center">
      <span class="small">🏺 Заощадження: <b>${money(savedTotal())}</b></span>
      <div style="flex:1;min-width:200px"><div class="small" style="display:flex;justify-content:space-between"><span>⚡ Спонтанне</span><span>${money(spon)} / ${money(lim)}</span></div><div class="bar ${sp >= 100 ? 'b' : sp >= 80 ? 'w' : ''}"><i style="width:${sp}%"></i></div></div>
    </div>
  </section>
  <section class="card"><div class="card-h"><h3>Рахунки</h3><button class="btn ghost sm" onclick="Bd.ride()">🚌 Поїздка</button><button class="btn ghost sm" onclick="Bd.transfer()">↔ Переказ</button></div>
    <div class="acc-grid">${Object.keys(ACCS).map(k => `<button class="acc" onclick="Bd.acc('${k}')">${accIcon(k)}<div><div class="l">${ACCS[k]}</div><div class="v">${money(b.accounts[k])}</div></div></button>`).join('')}</div></section>
  <section class="card"><div class="card-h"><h3>⚠ Найближчі оплати</h3><button class="btn sm" onclick="Bd.pay()">+ Оплата</button></div>
    ${soon.map(p => payRow(p, cov)).join('') || '<div class="empty">Тиждень без оплат 🎉</div>'}</section>
  <section class="card"><div class="card-h"><h3>💡 До зарплати (${fmtDate(np)})</h3></div>
    ${before.length ? `<div class="kv"><span>Треба оплатити</span><b>${money(before.reduce((a, p) => a + p.amount, 0))}</b></div><div class="kv"><span>З них уже в конвертах</span><b class="ok">${money(before.reduce((a, p) => a + (cov[p.id] || 0), 0))}</b></div>
      <div class="kv"><span>Ще потрібно</span><b>${money(needBefore)}</b></div>
      <p class="small" style="margin-top:6px">${needBefore <= 0 ? '<span class="ok">✓ Усе покрито конвертами</span>' : needBefore <= fm ? `<span class="ok">✓ Вистачає: після цього вільних лишиться ${money(fm - needBefore)}</span>` : `<span class="bad">Не вистачає ${money(needBefore - fm)}</span>`}</p>` : '<div class="empty">До зарплати оплат немає</div>'}</section>
  ${b.debts.length ? `<section class="card"><div class="card-h"><h3>🔁 Повернути собі</h3></div>${b.debts.map(d => `<div class="pay"><div class="body"><div>${esc(d.name)}</div><div class="bar" style="margin-top:5px"><i style="width:${d.repaid / d.amount * 100}%"></i></div><div class="tiny muted">${money(d.repaid)} з ${money(d.amount)}${d.reason ? ' · ' + esc(d.reason) : ''}</div></div><button class="btn sm" onclick="Bd.repay('${d.id}')">Повернути</button></div>`).join('')}</section>` : ''}
  <section class="card"><div class="card-h"><h3>🏺 Мої цілі накопичення</h3><button class="btn ghost sm" onclick="Bd.tx('unsave')">− Взяти</button><button class="btn sm" onclick="Bd.tx('save')">+ Відкласти</button></div>
    <div class="sv-grid">${b.savings.map(s => { const p = s.target ? Math.min(100, s.saved / s.target * 100) : 0; const c = S.ui['calc_' + s.id] || ['', 'month']; return `<div class="sv-card"><div style="display:flex;gap:10px;align-items:center">${ring(Math.round(p), 56)}<div style="flex:1;min-width:0"><b>${esc(s.name)}</b><div class="small">${money(s.saved)} <span class="muted">з ${money(s.target)}</span></div><div class="tiny muted">лишилось ${money(Math.max(0, s.target - s.saved))}</div></div><button class="act" onclick="Bd.sav('${s.id}')">✎</button></div>
      <div class="calc">Якщо відкладати <input id="c-${s.id}" inputmode="decimal" value="${c[0] || ''}" placeholder="1000" oninput="Bd.calc('${s.id}')"> ₴ на <select id="cp-${s.id}" onchange="Bd.calc('${s.id}')">${opts([['day', 'день'], ['week', 'тиждень'], ['month', 'місяць']], c[1])}</select></div><div class="small" id="co-${s.id}" style="margin-top:4px"></div>
      <button class="btn ghost sm" style="margin-top:8px" onclick="Bd.tx('save',null,{goalId:'${s.id}'})">+ Відкласти сюди</button></div>`; }).join('')}
      <button class="gtile empty-slot" style="aspect-ratio:auto;min-height:120px" onclick="Bd.sav()"><div style="font-size:24px">+</div><div class="gsub">нова ціль</div></button></div></section>
  <section class="card"><div class="card-h"><h3>Записи бюджетного місяця</h3><span class="muted small">з ${fmtDate(ms)}</span></div>
    ${unsorted.length ? `<p class="small warn" style="margin-bottom:6px">⚠ Не розібрано: ${unsorted.length}. Натисни ✎, щоб дописати категорію.</p>` : ''}
    ${sec('d-in', `💚 Надходження · ${money(sumT(monthTx, 'income'))}`, `<button class="btn sm" onclick="Bd.tx('income')">+ Додати</button>${monthTx.filter(t => t.type === 'income').map(txRow).join('') || '<div class="empty">—</div>'}`, false)}
    ${sec('d-out', `🌹 Витрати · ${money(sumT(monthTx, 'expense'))}`, `<button class="btn sm" onclick="Bd.tx('expense')">+ Додати</button>${monthTx.filter(t => t.type === 'expense').sort((a, c) => (c.unsorted ? 1 : 0) - (a.unsorted ? 1 : 0)).map(txRow).join('') || '<div class="empty">—</div>'}`, unsorted.length > 0)}
    ${sec('d-sv', `🏺 Відкладаю · ${money(sumT(monthTx, 'save'))}`, `<button class="btn sm" onclick="Bd.tx('save')">+ Додати</button>${monthTx.filter(t => ['save', 'unsave', 'repay'].includes(t.type)).map(txRow).join('') || '<div class="empty">—</div>'}`, false)}
    ${sec('d-tr', `↔ Перекази`, monthTx.filter(t => t.type === 'transfer').map(txRow).join('') || '<div class="empty">—</div>', false)}
  </section>`;
}
function monthSummary(mk) {
  const from = mk + '-01', to = mk + '-31', list = txIn(from, to);
  const inc = sumT(list, 'income'), exp = sumT(list, 'expense'), sv = sumT(list, 'save') + sumT(list, 'repay') - sumT(list, 'unsave');
  const wantSp = list.filter(t => t.type === 'expense' && (t.spend === 'want' || t.spend === 'spontan')).reduce((a, t) => a + t.amount, 0);
  const isCur = mk === monthKey(today());
  const a = B().accounts;
  return `<div class="kv"><span>💚 Надходження</span><b class="ok">${money(inc)}</b></div><div class="kv"><span>🌹 Витрати</span><b>${money(exp)}</b></div>
    <div class="kv"><span>🏺 Відкладено</span><b class="warn">${money(sv)}</b></div>
    <div class="kv"><span>💖⚡ На хотілки і спонтанне</span><b>${money(wantSp)} <span class="muted small">(${exp ? Math.round(wantSp / exp * 100) : 0}%)</span></b></div>
    ${isCur ? `<div class="kv"><span>Залишилось готівкою</span><b>${money(a.cash)}</b></div><div class="kv"><span>Залишилось на картках</span><b>${money(a.mono + a.privat)}</b></div>${a.transit ? `<div class="kv"><span>На проїзному</span><b>${money(a.transit)}</b></div>` : ''}` : ''}`;
}
function vCal() {
  const mk = S.ui.calM || monthKey(today()), T = today();
  const [y, m] = mk.split('-').map(Number);
  const first = new Date(y, m - 1, 1), off = (first.getDay() + 6) % 7;
  const start = ymd(new Date(y, m - 1, 1 - off));
  const cells = [];
  const pays = visiblePayments(), txs = B().txs;
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i);
    if (i >= 35 && monthKey(d) !== mk) break;
    const dots = [];
    pays.filter(p => p.date === d).forEach(p => dots.push(p.status === 'paid' ? 'c-paid' : 'c-pay'));
    txs.filter(t => t.date === d).forEach(t => { if (t.type === 'income') dots.push('c-in'); else if (t.type === 'save' || t.type === 'repay') dots.push('c-sv'); else if (t.type === 'expense' && !pays.some(p => p.txId === t.id)) dots.push('c-out'); });
    cells.push(`<button class="cday ${monthKey(d) !== mk ? 'other' : ''} ${d === T ? 'today' : ''} ${d === S.ui.calSel ? 'sel' : ''}" onclick="Bd.calSel('${d}')"><span class="n">${parseD(d).getDate()}</span><span class="dots">${[...new Set(dots)].slice(0, 5).map(c => `<i class="${c}"></i>`).join('')}</span></button>`);
  }
  const sel = S.ui.calSel;
  const cov = coverage();
  const mp = pays.filter(p => monthKey(p.date) === mk);
  const unpaid = mp.filter(p => p.status === 'planned').sort((a, c) => a.date.localeCompare(c.date));
  const paid = mp.filter(p => p.status === 'paid').sort((a, c) => a.date.localeCompare(c.date));
  const exp = mp.reduce((a, p) => a + (p.status === 'paid' ? (p.paidAmount || p.amount) : p.amount), 0);
  const coveredSum = unpaid.reduce((a, p) => a + (cov[p.id] || 0), 0), needSum = unpaid.reduce((a, p) => a + p.amount, 0);
  return `<div class="cal-wrap">
    <div>
      <section class="card">
        <div class="cal-head leo" style="padding:10px 12px"><button class="act" onclick="Bd.calNav(-1)">‹</button><h2>${MONTHS[m - 1]} ${y}</h2><button class="act" style="width:auto;padding:0 10px" onclick="Bd.calNav(0)">сьогодні</button><button class="act" onclick="Bd.calNav(1)">›</button></div>
        <div class="cal">${['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(w => `<div class="wd">${w}</div>`).join('')}${cells.join('')}</div>
        <div class="legend"><span><i class="c-pay"></i>оплата</span><span><i class="c-paid"></i>оплачено</span><span><i class="c-in"></i>надходження</span><span><i class="c-sv"></i>відкладено</span><span><i class="c-out"></i>витрата</span></div>
      </section>
      ${sel ? `<section class="card"><div class="card-h"><h3>${fmtDate(sel)}</h3><button class="act x" onclick="Bd.calSel(null)">×</button></div>
        ${pays.filter(p => p.date === sel).map(p => payRow(p, cov)).join('')}${txs.filter(t => t.date === sel && !pays.some(p => p.txId === t.id)).map(txRow).join('')}
        ${!pays.some(p => p.date === sel) && !txs.some(t => t.date === sel) ? '<div class="empty">У цей день нічого немає</div>' : ''}
        <div class="toolbar" style="margin-top:10px"><button class="btn sm" onclick="Bd.pay(null,{date:'${sel}'})">+ Оплата</button><button class="btn ghost sm" onclick="Bd.tx('income',null,{date:'${sel}'})">+ Надходження</button><button class="btn ghost sm" onclick="Bd.tx('expense',null,{date:'${sel}'})">+ Витрата</button><button class="btn ghost sm" onclick="Bd.tx('save',null,{date:'${sel}'})">+ Відкласти</button></div></section>` : ''}
    </div>
    <div>
      <section class="card"><div class="card-h"><h3>📅 Оплати ${MONTHS_G[m - 1]}</h3><button class="btn sm" onclick="Bd.pay(null,{date:'${mk === monthKey(T) ? T : mk + '-01'}'})">+</button></div>
        <div class="kv"><span>Очікувані витрати</span><b>${money(exp)}</b></div>
        ${unpaid.length ? `<div class="kv"><span>Вже відкладено в конвертах</span><b class="ok">${money(coveredSum)}</b></div><div class="kv"><span>Треба ще відкласти</span><b class="${needSum - coveredSum > 0 ? 'bad' : 'ok'}">${money(needSum - coveredSum)}</b></div>` : ''}
        <div style="margin-top:8px">${unpaid.map(p => payRow(p, cov)).join('')}${paid.map(p => payRow(p, cov)).join('')}${!mp.length ? '<div class="empty">Оплат цього місяця немає</div>' : ''}</div></section>
      <section class="card"><div class="card-h"><h3>Підсумок місяця</h3></div>${monthSummary(mk)}</section>
    </div></div>`;
}
function vMonth() {
  const mk = S.ui.monM || monthKey(today()), [y, m] = mk.split('-').map(Number);
  const list = txIn(mk + '-01', mk + '-31');
  const exps = list.filter(t => t.type === 'expense');
  const tot = exps.reduce((a, t) => a + t.amount, 0) || 1;
  const bySpend = k => exps.filter(t => (t.spend || 'must') === k).reduce((a, t) => a + t.amount, 0);
  const cats = {};
  exps.forEach(t => { const c = t.unsorted ? '⚠ Не розібрано' : (t.cat || 'Інше'); cats[c] = cats[c] || { sum: 0, subs: {}, sp: { must: 0, want: 0, spontan: 0 } }; cats[c].sum += t.amount; const s = t.sub || '—'; cats[c].subs[s] = (cats[c].subs[s] || 0) + t.amount; cats[c].sp[t.spend || 'must'] += t.amount; });
  const cov = coverage();
  const unpaid = visiblePayments().filter(p => p.status === 'planned' && monthKey(p.date) === mk).sort((a, c) => a.date.localeCompare(c.date));
  const sv = list.filter(t => ['save', 'unsave', 'repay', 'save_legacy'].includes(t.type));
  return `
  <div class="cal-head leo" style="padding:10px 12px"><button class="act" onclick="Bd.monNav(-1)">‹</button><h2>${MONTHS[m - 1]} ${y}</h2><button class="act" style="width:auto;padding:0 10px" onclick="Bd.monNav(0)">зараз</button><button class="act" onclick="Bd.monNav(1)">›</button></div>
  <section class="card"><div class="sum-grid">
    <div class="sum"><div class="l">Баланс</div><div class="v">${money(balance())}</div></div>
    <div class="sum"><div class="l">Надійшло</div><div class="v ok">${money(sumT(list, 'income'))}</div></div>
    <div class="sum"><div class="l">Витрачено</div><div class="v">${money(sumT(list, 'expense'))}</div></div>
    <div class="sum"><div class="l">Заощаджено</div><div class="v warn">${money(savedTotal())}</div></div></div></section>
  <section class="card"><div class="card-h"><h3>⏳ Ще оплатити</h3><button class="btn sm" onclick="Bd.pay()">+ Оплата</button></div>
    ${unpaid.map(p => payRow(p, cov)).join('') || '<div class="empty">Усе оплачено 🎉</div>'}</section>
  <section class="card"><div class="card-h"><h3>🔍 Куди пішли гроші</h3></div>
    ${exps.length ? `<div class="split">${['must', 'want', 'spontan'].map(k => `<i style="width:${bySpend(k) / tot * 100}%;background:var(--${SPEND[k][1]})"></i>`).join('')}</div>
    <div class="legend" style="margin-bottom:8px">${['must', 'want', 'spontan'].map(k => `<span><i style="background:var(--${SPEND[k][1]})"></i>${SPEND[k][0]} ${money(bySpend(k))} (${Math.round(bySpend(k) / tot * 100)}%)</span>`).join('')}</div>
    ${Object.entries(cats).sort((a, b) => b[1].sum - a[1].sum).map(([c, o]) => sec('m-' + c, `<span style="flex:1">${esc(c)}</span><b style="margin-right:8px">${money(o.sum)}</b>`, Object.entries(o.subs).sort((a, b) => b[1] - a[1]).map(([s, v]) => `<div class="kv"><span>${esc(s)}</span><b>${money(v)}</b></div>`).join('') + `<div class="tiny muted" style="padding:4px 0 8px">необхідне ${money(o.sp.must)} · хотілки ${money(o.sp.want)} · спонтанне ${money(o.sp.spontan)}</div>`, false)).join('')}` : '<div class="empty">Витрат цього місяця ще немає</div>'}
  </section>
  <section class="card">
    ${sec('m-in', `💚 Всі надходження · ${money(sumT(list, 'income'))}`, list.filter(t => t.type === 'income').sort((a, c) => c.date.localeCompare(a.date)).map(txRow).join('') || '<div class="empty">—</div>', false)}
    ${sec('m-out', `🌹 Всі витрати · ${money(sumT(list, 'expense'))}`, exps.sort((a, c) => c.date.localeCompare(a.date)).map(txRow).join('') || '<div class="empty">—</div>', false)}
    ${sec('m-sv', `🏺 Відкладання / заощадження`, sv.sort((a, c) => c.date.localeCompare(a.date)).map(txRow).join('') || '<div class="empty">—</div>', false)}
  </section>`;
}

/* ═══════════════ СТАРТ ═══════════════ */
// Нова доба → перемальовуємо (дата завжди береться з пристрою)
let lastDay_ = today();
setInterval(() => { if (today() !== lastDay_) { lastDay_ = today(); render(); } }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && today() !== lastDay_) { lastDay_ = today(); render(); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
if (!S.migrated && !S.budget.payments.length) { // одноразовий платіж, про який ми знаємо
  if (today() <= '2026-11-30') S.budget.payments.push({ id: uid(), name: 'Навчання (останній платіж)', amount: 2465, date: '2026-11-30', cat: 'Навчання', envId: null, status: 'planned' });
}
if (S.migrated && !S.ui._oneoff) { S.ui._oneoff = 1; if (today() <= '2026-11-30' && !S.budget.payments.some(p => /навчан/i.test(p.name))) S.budget.payments.push({ id: uid(), name: 'Навчання (останній платіж)', amount: 2465, date: '2026-11-30', cat: 'Навчання', envId: null, status: 'planned' }); }
nextQuote();
render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => { });
