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
    });
});

openTab.addEventListener("click", () => {
    if(currentPage){
        window.open(currentPage, "_blank");
    }else{
        alert("Please select a project first!");
    }
});

// Sidebar sizing helper (auto-scroll disabled)
(function(){
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return; // nothing to do

  // Keep sidebar height in sync with header/footer so overflow is consistent (no auto-scroll)
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');

  function updateSidebarMaxHeight(){
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const footerH = footer ? footer.getBoundingClientRect().height : 0;
    // Reserve the exact space consumed by header + footer
    // const h = Math.max(0, window.innerHeight - headerH - footerH);
    const h = Math.max(0, window.innerHeight  - footerH);
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

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) closeSidebar();
  });

})();