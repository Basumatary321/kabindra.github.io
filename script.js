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

// Auto-scroll sidebar upward and pause when hovered ✅
(function(){
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return; // nothing to do

  // Keep sidebar height in sync with header/footer so overflow is consistent
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

  let isHover = false;
  let lastTime = null;
  const speed = 0.03; // pixels per millisecond (≈30px/s) - increase to be noticeable

  function shouldScroll() {
    return sidebar.scrollHeight > sidebar.clientHeight + 1;
  }

  // Pause when hovering anywhere inside sidebar
  sidebar.addEventListener('mouseenter', () => { isHover = true; });
  sidebar.addEventListener('mouseleave', () => { isHover = false; });

  // Also pause on focus within (keyboard navigation)
  sidebar.addEventListener('focusin', () => { isHover = true; });
  sidebar.addEventListener('focusout', () => { isHover = false; });

  function step(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    if (!isHover && shouldScroll()) {
      sidebar.scrollTop += speed * dt;
      // Loop back to top when reaching the end
      if (sidebar.scrollTop >= sidebar.scrollHeight - sidebar.clientHeight - 1) {
        sidebar.scrollTop = 0;
      }
    }

    requestAnimationFrame(step);
  }

  // Delay start slightly to allow layout to stabilize
  setTimeout(() => requestAnimationFrame(step), 100);
})();