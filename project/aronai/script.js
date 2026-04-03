
const root = document.documentElement;
const svg = document.getElementById("svg");

let scale = 1;
let rotated = false;

/* 🎨 COLOR CONTROL */
document.getElementById("bgPicker").oninput = e => {
  root.style.setProperty('--bg-color', e.target.value);
};

document.getElementById("patternPicker").oninput = e => {
  root.style.setProperty('--pattern-color', e.target.value);
};

/* 🔍 ZOOM + ROTATE */
function zoomIn(){ scale += 0.2; updateTransform(); }
function zoomOut(){ scale -= 0.2; updateTransform(); }
function resetZoom(){ scale = 1; rotated = false; updateTransform(); }

function rotate(){
  rotated = !rotated;
  updateTransform();
}

function updateTransform(){
  let rotateValue = rotated ? 90 : 0;

  svg.style.transform = `
    translate(-50%, -50%)
    rotate(${rotateValue}deg)
    scale(${scale})
  `;

  svg.style.position = "absolute";
  svg.style.top = "50%";
  svg.style.left = "50%";
}

/* 📱 PINCH ZOOM (SMOOTH) */
let initialDistance = 0;

function getDistance(touches){
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx*dx + dy*dy);
}

svg.addEventListener("touchstart", e => {
  if(e.touches.length === 2){
    initialDistance = getDistance(e.touches);
  }
});

svg.addEventListener("touchmove", e => {
  if(e.touches.length === 2){
    e.preventDefault();

    let newDistance = getDistance(e.touches);
    let zoomFactor = newDistance / initialDistance;

    // smooth zoom
    scale = scale * (1 + (zoomFactor - 1) * 0.2);
    scale = Math.min(Math.max(0.5, scale), 5);

    updateTransform();
    initialDistance = newDistance;
  }
});

/* 🎯 PREPARE SVG (CRITICAL FIX) */
function prepareSVG(){
  const clone = svg.cloneNode(true);

  const styles = getComputedStyle(document.documentElement);
  const bg = styles.getPropertyValue('--bg-color').trim();
  const pattern = styles.getPropertyValue('--pattern-color').trim();

  clone.querySelectorAll('.bg').forEach(el => {
    el.setAttribute('fill', bg);
  });

  clone.querySelectorAll('.pattern').forEach(el => {
    el.setAttribute('stroke', pattern);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
  });

  clone.querySelectorAll('.leaf').forEach(el => {
    el.setAttribute('fill', pattern);
    el.setAttribute('stroke', bg);
  });

  clone.querySelectorAll('.pattern2').forEach(el => {
    el.setAttribute('fill', pattern);
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
  });
 clone.querySelectorAll('.circle').forEach(el => {
    el.setAttribute('stroke', pattern);
  });
   clone.querySelectorAll('.pattern3').forEach(el => {
    el.setAttribute('stroke', pattern);
     el.setAttribute('fill', pattern);
  });
  clone.setAttribute("width", "5000");
  clone.setAttribute("height", "1000");
  clone.setAttribute("viewBox", "0 0 51000 9700");

  return clone;
}

/* ⬇ SVG EXPORT */
function downloadSVG(){
  const svgData = new XMLSerializer().serializeToString(prepareSVG());
  const blob = new Blob([svgData], {type: "image/svg+xml"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "design.svg";
  a.click();
}

/* ⬇ JPG EXPORT (HD) */
function downloadPNG(){
  const svgData = new XMLSerializer().serializeToString(prepareSVG());

  const img = new Image();
  const blob = new Blob([svgData], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(blob);

  img.onload = function(){
    const canvas = document.createElement("canvas");

    const exportScale = 3;
    canvas.width = img.width * exportScale;
    canvas.height = img.height * exportScale;

    const ctx = canvas.getContext("2d");

    ctx.scale(exportScale, exportScale);
    ctx.imageSmoothingQuality = "high";

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.drawImage(img,0,0);

    const a = document.createElement("a");
    a.download = "design.jpg";
    a.href = canvas.toDataURL("image/jpeg",1);
    a.click();
  };

  img.src = url;
}

/* ⬇ PDF EXPORT (PRINT READY) */
async function downloadPDF(){
  const { jsPDF } = window.jspdf;

  const svgClone = prepareSVG();
  const svgData = new XMLSerializer().serializeToString(svgClone);

  const img = new Image();
  const blob = new Blob([svgData], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(blob);

  img.onload = function(){

    const widthCM = 200;
    const ratio = 51000 / 9700;
    const heightCM = widthCM / ratio;

    const widthMM = widthCM * 10;
    const heightMM = heightCM * 10;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [widthMM, heightMM]
    });

    const canvas = document.createElement("canvas");
    const exportScale = 3;

    canvas.width = img.width * exportScale;
    canvas.height = img.height * exportScale;

    const ctx = canvas.getContext("2d");
    ctx.scale(exportScale, exportScale);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.drawImage(img,0,0);

    const imgData = canvas.toDataURL("image/jpeg",1);

    pdf.addImage(imgData, "JPEG", 0, 0, widthMM, heightMM);
    pdf.save("scarf-design.pdf");
  };

  img.src = url;
}

// auto rotate on mobile for better fit (important for mobile users)
function isMobile(){
  return window.innerWidth <= 768;
}

function autoRotateMobile(){
  if(!isMobile()) return;

  // wait until SVG is rendered properly
  setTimeout(() => {
    rotated = true;

    // better fit calculation
    const preview = document.querySelector(".preview");
    const svgRect = svg.getBoundingClientRect();

    const scaleX = preview.clientWidth / svgRect.height;
    const scaleY = preview.clientHeight / svgRect.width;

    scale = Math.min(scaleX, scaleY) * 0.9;

    updateTransform();
  }, 300); // delay is IMPORTANT
}

// run on load
window.addEventListener("load", autoRotateMobile);

// run on resize (important for mobile orientation change)
window.addEventListener("resize", autoRotateMobile);




function toggleExportMenu(e){
  e.stopPropagation();
  const menu = document.getElementById("exportMenu");
  menu.classList.toggle("show");
}

/* Close when clicking outside */
document.addEventListener("click", () => {
  document.getElementById("exportMenu").classList.remove("show");
});
