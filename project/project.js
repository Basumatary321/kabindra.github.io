function createTagSpans(typeString) {
    // Split the string by common separators (+, comma, or space)
    const types = typeString.toUpperCase().split(/[+\s,]/g)
                           .map(t => t.trim())
                           .filter(t => t.length > 0)
                           .map(t => t.replace(/\+\+$/, '')); // Remove trailing ++ from the advanced project

    let tagsHtml = '';
    
    // Loop through each technology and create a span
    types.forEach(tag => {
        let tagClass = 'misc-tag'; // Default/Fallback class
        let tagName = tag;

        if (tag.includes('HTML')) {
            tagClass = 'html-tag';
            tagName = 'HTML';
        } else if (tag.includes('CSS')) {
            tagClass = 'css-tag';
            tagName = 'CSS';
        } else if (tag.includes('JAVASCRIPT') || tag.includes('JS')) {
            tagClass = 'javascript-tag';
            tagName = 'JS';
        } 
        
        // Construct the HTML for the individual tag span
        tagsHtml += `<span class="${tagClass}">${tagName}</span>`;
    });
    
    // Wrap the spans in the container div for alignment/spacing (using 'tag-box' class)
    return `<div class="tag-box">${tagsHtml}</div>`;
}

/**
 * 1. Transform Table Rows to Grid Cards
 */
function renderAsCards(tableId, gridId) {
    const table = document.getElementById(tableId);
    const grid = document.getElementById(gridId);
    if (!table || !grid) return;

    const rows = Array.from(table.querySelectorAll('tr:not(:first-child)'));
    const fragment = document.createDocumentFragment();

    rows.forEach(row => {
        const description = row.cells[0].textContent.trim();
        const linkHtml = row.cells[1].innerHTML.trim();
        const type = row.cells[2].textContent.trim();
        
        // Generate the HTML with separate, styled spans
        const tagsHtml = createTagSpans(type);

        const card = document.createElement('div');
        card.classList.add('project-card');

        // Build the inner HTML for the card
        card.innerHTML = `
            <div class="description">${description}</div>
            <div class="link-container">${linkHtml}</div>
            <div class="type-container">${tagsHtml}</div>
        `;

        card._originalRow = row;
        fragment.appendChild(card);
    });

    // Replace the original table content with the new card view
    grid.innerHTML = '';
    grid.appendChild(fragment);
    // Hide the original table
    table.style.display = 'none'; 
}

/**
 * 2. Sorting Logic (Retained)
 */
function sortCards(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.project-card')); 

    cards.sort((cardA, cardB) => {
        const descA = cardA.querySelector('.description').textContent.trim().toUpperCase();
        const descB = cardB.querySelector('.description').textContent.trim().toUpperCase();

        if (descA < descB) {
            return -1;
        }
        if (descA > descB) {
            return 1;
        }
        return 0;
    });

    cards.forEach(card => grid.appendChild(card));
}


// Execute both sorting and rendering functions on page load
document.addEventListener('DOMContentLoaded', () => {
    // Render them as cards
    renderAsCards('htmlCssTable', 'htmlCssGrid');
    renderAsCards('javascriptTable', 'javascriptGrid');
    
    // Re-run sort after rendering to handle the actual card elements
    sortCards('htmlCssGrid');
    sortCards('javascriptGrid');
});