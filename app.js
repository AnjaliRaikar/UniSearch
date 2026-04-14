const API = "http://localhost:5000";
let colleges = [];
let currentPage = 1;

// ===========================
// LOAD COLLEGES
// ===========================

async function loadColleges() {
  try {
    const response = await fetch(
      `${API}/api/colleges?page=${currentPage}&limit=10`
    );

    const data = await response.json();

    colleges = data.data;

    renderCards(colleges, data.total);
    renderPagination(data.total, data.limit, data.page);

  } catch (err) {
    console.error(err);
  }
}

function loadFilterCounts() {
  fetch(`${API}/api/colleges/counts`)
    .then(res => res.json())
    .then(data => updateCountsUI(data))
    .catch(err => console.error(err));
}

function updateCountsUI(data) {

  if (!data) return;

  data.typeCounts.forEach(item => {
    const el = document.querySelector(`[data-type="${item._id}"] .count`);
    if (el) el.innerText = item.count;
  });

  data.stateCounts.forEach(item => {
    const el = document.querySelector(`[data-state="${item._id}"] .count`);
    if (el) el.innerText = item.count;
  });

  data.naacCounts.forEach(item => {
    const el = document.querySelector(`[data-naac="${item._id}"] .count`);
    if (el) el.innerText = item.count;
  });
}

// ===========================
// HELPERS
// ===========================

function getTypeClass(type) {
  if (type.includes("IT") || type.includes("Engineering")) return "it";
  if (type.includes("Management")) return "mgmt";
  return "science";
}

function getNaacClass(naac) {
  if (naac === "A++" || naac === "A+") return "naac-a";
  if (naac === "A" || naac === "B++") return "naac-b";
  return "naac-c";
}

// ===========================
// RENDER CARDS
// ===========================

function renderCards(list, total) {
  const grid = document.getElementById('collegeGrid');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('resultsCount');

  console.log("Rendering list:", list);

  if (!list || list.length === 0) {
    grid.innerHTML = '';
    empty.classList.add('visible');
    count.innerHTML = 'No colleges found';
    return;
  }

  empty.classList.remove('visible');
  count.innerHTML = `Showing <strong>${list.length}</strong> of ${total}`;

  grid.innerHTML = list.map(c => `
    <div class="college-card" onclick="openModal('${c._id}')">
      
      <div class="college-logo" style="background:${c.bg};color:${c.color}">
        ${c.name.split(' ').map(w => w[0]).slice(0,2).join('')}
      </div>

      <div class="college-main">
        <div class="college-name">${c.name}</div>
        <div class="college-location">📍 ${c.location}</div>

        <div class="course-tags">
          ${c.type.map(t => `<span class="course-tag ${getTypeClass(t)}">${t}</span>`).join('')}
          ${c.courses.slice(0,2).map(co => `<span class="course-tag">${co}</span>`).join('')}
          ${c.courses.length > 2 ? `<span class="course-tag">+${c.courses.length - 2} more</span>` : ''}
        </div>
      </div>

      <div class="college-meta">
        <div class="rating">⭐ ${c.rating}</div>
        <div class="naac-badge ${getNaacClass(c.naac)}">NAAC ${c.naac}</div>
        <button class="view-btn">Details →</button>
      </div>

    </div>
  `).join('');
}

function renderPagination(total, limit, currentPage) {
  const container = document.getElementById('pagination');
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  // PREV
  if (currentPage > 1) {
    html += `<button class="page-btn" onclick="changePage(${currentPage - 1})">&#x2039;</button>`;
  }

  const pages = [];

  // Always include first page
  pages.push(1);

  // Pages around current
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  // Always include last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  // Remove duplicates & sort
  const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

  let lastPage = 0;

  uniquePages.forEach(page => {
    if (page - lastPage > 1) {
      html += `<span class="dots">...</span>`;
    }

    html += `
      <button 
        class="page-btn ${page === currentPage ? 'active' : ''}" 
        onclick="changePage(${page})">
        ${page}
      </button>
    `;

    lastPage = page;
  });

  // NEXT
  if (currentPage < totalPages) {
    html += `<button class="page-btn" onclick="changePage(${currentPage + 1})">&#x203A;</button>`;
  }

  container.innerHTML = html;
}

function changePage(page) {
  currentPage = page;
  applyFilters(false);
}

// ===========================
// FILTERS
// ===========================

function applyFilters(resetPage = false) {
  if (resetPage) currentPage = 1;
  const params = new URLSearchParams();

  params.append('page', currentPage);
  params.append('limit', 10); // or 5 or 10 

  const q = document.getElementById('searchInput').value.trim();
  if (q) params.append('q', q);

  const typeDropdown = document.getElementById('typeFilter').value;
  if (typeDropdown) params.append('type', typeDropdown);

  const checkedTypes = [];
  document.querySelectorAll('.type-checkbox:checked').forEach(cb => checkedTypes.push(cb.value));
  if (checkedTypes.length) params.append('type', checkedTypes.join(','));

  const checkedStates = [];
  document.querySelectorAll('.state-checkbox:checked').forEach(cb => checkedStates.push(cb.value));
  if (checkedStates.length) params.append('state', checkedStates.join(','));

  const checkedNaac = [];
  document.querySelectorAll('.naac-checkbox:checked').forEach(cb => checkedNaac.push(cb.value));
  if (checkedNaac.length) params.append('naac', checkedNaac.join(','));

  const feeMin = parseInt(document.getElementById('feeMin').value);
  const feeMax = parseInt(document.getElementById('feeMax').value);

  if (!isNaN(feeMin)) params.append('feeMin', feeMin);
  if (!isNaN(feeMax)) params.append('feeMax', feeMax);

  const sort = document.querySelector('.sort-select')?.value;
  if (sort) params.append('sort', sort);

  fetch(`${API}/api/colleges?${params}`)
    .then(res => res.json())
    .then(data => {
      colleges = data.data; // ✅ important
      renderCards(colleges, data.total);
      renderPagination(data.total, data.limit, data.page);
    })
    .catch(err => console.error('Filter error:', err));

  document.getElementById('searchLabel').innerHTML =
    q ? `for <strong>"${q}"</strong>` : '';
}

// ===========================
// MODAL
// ===========================

function openModal(id) {
  let c = colleges.find(x => String(x._id) === String(id));

  if (!c) {
    fetch(`${API}/api/colleges/${id}`)
      .then(res => res.json())
      .then(data => renderModal(data))
      .catch(err => console.error(err));
    return;
  }

  renderModal(c);
}

function renderModal(c) {
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-header">
      <div class="modal-logo" style="background:${c.bg};color:${c.color}">
        ${c.short.charAt(0)}
      </div>

      <div>
        <div class="modal-title">${c.name}</div>
        <div class="modal-sub">📍 ${c.location} · Est. ${c.established} · ${c.affiliation}</div>
      </div>

      <button class="modal-close" onclick="closeModalBtn()">✕</button>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">About</div>
      <p>${c.about}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Key Info</div>
      <div class="info-grid">
        <div>⭐ ${c.rating}</div>
        <div>NAAC ${c.naac}</div>
        <div>₹${c.fees.toLocaleString('en-IN')}</div>
        <div>${c.type.join(', ')}</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Courses</div>
      ${c.courses.map(co => `<span class="course-chip">${co}</span>`).join('')}
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('active');
}

function closeModalBtn() {
  document.getElementById('modalOverlay').classList.remove('active');
}

function quickSearch(term, el) {
  const input = document.getElementById('searchInput');

  // 🔥 If already active → remove filter
  if (el.classList.contains('active')) {
    el.classList.remove('active');
    input.value = '';        // clear search
    applyFilters(true);          // reload all data
    return;
  }

  // 🔥 Remove active from all
  document.querySelectorAll('.tag').forEach(tag => {
    tag.classList.remove('active');
  });

  // 🔥 Set new active
  el.classList.add('active');
  input.value = term;

  applyFilters(true);
}

// ===========================
// INIT
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  loadColleges();
  loadFilterCounts();
  document.getElementById('searchInput').addEventListener('input', () => applyFilters(true));
  document.getElementById('searchInput').addEventListener('keyup', e => {
    if (e.key === 'Enter') applyFilters(true);
  });

  document.getElementById('searchInput').addEventListener('input', () => {
    document.querySelectorAll('.tag').forEach(tag => {
      tag.classList.remove('active');
    });
  });

  document.getElementById('typeFilter').addEventListener('change', applyFilters);

  document.querySelectorAll('.type-checkbox, .state-checkbox, .naac-checkbox')
    .forEach(cb => cb.addEventListener('change', () => applyFilters(true)));

});