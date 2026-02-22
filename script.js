  const links = document.querySelectorAll(".project-list a");
const iframe = document.getElementById("viewer");
const pageTitle = document.getElementById("pageTitle");
const openTab = document.getElementById("openTab");

let currentPage = "";

links.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        iframe.src = link.href;
        pageTitle.textContent = link.textContent;
        currentPage = link.href;

        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        

        ensureHeaderVisible();
    });
});


function ensureHeaderVisible() {
    const header = document.querySelector('header');
    if (header) {
        header.style.display = 'flex !important';
        header.style.visibility = 'visible';
        header.style.opacity = '1';
    }
}


setInterval(() => {
    ensureHeaderVisible();
}, 500);

openTab.addEventListener("click", () => {
    if(currentPage){
        window.open(currentPage, "_blank");
    }else{
        alert("Please select a project first!");
    }
});


(function(){
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return; // nothing to do


  const header = document.querySelector('header');
  const footer = document.querySelector('footer');

  function updateSidebarMaxHeight(){
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const footerH = footer ? footer.getBoundingClientRect().height : 0;
    // Reserve the exact space consumed by header + footer
    const h = Math.max(0, window.innerHeight - headerH - footerH);
    sidebar.style.maxHeight = h + 'px';
  }

  updateSidebarMaxHeight();
  window.addEventListener('resize', updateSidebarMaxHeight);
})();

/* Mobile sidebar toggle */
(function(){
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('overlay');

  if (!sidebar || !menuToggle || !overlay) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    menuToggle.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden','false');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden','true');
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener('click', closeSidebar);

  // Close when clicking a link in mobile
  document.querySelectorAll('.project-list a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 600) closeSidebar();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) closeSidebar();
  });

})();


 /* Project Search/Filter Functionality */
(function () {

  const searchInput = document.querySelector('.project-search');
  const projectLists = document.querySelectorAll('.project-list');

  if (!searchInput || projectLists.length === 0) return;

  // 🔹 Filter function (reusable)
  function filterProjects() {
    const searchTerm = searchInput.value.toLowerCase();

    projectLists.forEach(list => {
      const projectItems = list.querySelectorAll('li');
      let visibleCount = 0;

      projectItems.forEach(item => {
        const linkText = item.querySelector('a').textContent.toLowerCase();

        if (linkText.includes(searchTerm)) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });

      // Find the h3 heading that precedes this project list
      let heading = list.previousElementSibling;
      while (heading && heading.tagName !== 'H3') {
        heading = heading.previousElementSibling;
      }

      // Show/hide the heading based on whether there are visible items
      if (heading) {
        if (visibleCount > 0) {
          heading.classList.remove('hidden');
          heading.style.display = '';
        } else {
          heading.classList.add('hidden');
          heading.style.display = 'none';
        }
      }
    });
  }


  searchInput.addEventListener('input', filterProjects);

 
  searchInput.addEventListener('focus', function () {
    this.value = '';
    filterProjects(); // refresh immediately
  });

})();
