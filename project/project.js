 /**
 * 1. Data Processing
 */
function initializeGallery() {
    const mainGrid = document.getElementById('mainGrid');
    const tables = ['htmlCssTable', 'javascriptTable'];

    tables.forEach(tableId => {
        const table = document.getElementById(tableId);
        if (!table) return;

        const rows = Array.from(table.querySelectorAll('tr'));
        rows.forEach(row => {
            const name = row.cells[0].textContent;
            const link = row.cells[1].querySelector('a').href;
            const rawType = row.cells[2].textContent.toUpperCase();

            const card = document.createElement('div');
            card.className = 'project-card';
            
            // Assign filtering classes
            if (rawType.includes('HTML')) card.classList.add('cat-html');
            if (rawType.includes('CSS')) card.classList.add('cat-css');
            if (rawType.includes('JS') || rawType.includes('JAVASCRIPT')) card.classList.add('cat-js');

            // Generate Tag HTML
            const types = rawType.split(/[+\s,]/g).filter(t => t.length > 0);
            let tagsHtml = '<div class="tag-box">';
            types.forEach(t => {
                let label = t === 'JAVASCRIPT' ? 'JS' : t;
                let cls = `tag-${label.toLowerCase()}`;
                tagsHtml += `<span class="tag ${cls}">${label}</span>`;
            });
            tagsHtml += '</div>';

            card.innerHTML = `
                <div class="card-title">${name}</div>
                ${tagsHtml}
                <a href="${link}" target="_blank" class="view-link">View Project</a>
            `;
            mainGrid.appendChild(card);
        });
    });
}

/**
 * 2. Filtering Logic
 */
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Toggle
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter').toLowerCase();

            cards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'flex';
                } else if (card.classList.contains(`cat-${filter}`)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * 3. Star Rotation
 */
window.addEventListener('scroll', () => {
    const val = window.scrollY * 0.3;
    document.getElementById('star-svg').style.transform = `rotate(${val}deg)`;
    document.getElementById('star-svg2').style.transform = `rotate(-${val}deg)`;
});

document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    setupFilters();
});