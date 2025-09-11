const colors = ["#ef476f","#ffd166","#06d6a0","#118ab2","#8338ec","#ff9f1c"];
const ROWS = 10;
const SLOTS = 4;
const board = document.getElementById("board");
const palette = document.getElementById("palette");

let activeRow = 0;
let selectedColor = null;
const state = Array.from({length:ROWS},_=>Array(SLOTS).fill(null));
let spielLaeuft = false;

function createRow(i){
    const row = document.createElement("div");
    row.className='row'+(i===activeRow? ' active':'');
    row.dataset.row = i;

    const holes = document.createElement("div");
    holes.className = "holes";
    for (let s = 0;s < SLOTS; s++) {
        const hole = document.createElement("div");
        hole.className = "hole";
        hole.dataset.slot = s;
        hole.addEventListener('click',()=>{
            if(i!==activeRow) return; 
            if(selectedColor===null) return;
            state[i][s]=selectedColor;
            hole.innerHTML = `<div class="peg" style="background:${selectedColor}"></div>`;
        });
        holes.appendChild(hole);
    }
    const feedback = document.createElement("div"); 
    feedback.className= "feedback";
    for(let f = 0;f < SLOTS;f++){ 
        const fpeg = document.createElement("div"); 
        fpeg.className="fpeg"; 
        feedback.appendChild(fpeg); 
    }
    row.appendChild(holes);
    row.appendChild(feedback);
    return row;
}
//Erstelle Spielfeld
for (let r=0;r<ROWS;r++){
    board.appendChild(createRow(r));
}
//Erstelle Farbpalette
colors.forEach(c=>{
    const sw = document.createElement('div');
    sw.className='color-swatch';
    sw.style.background = c;
    sw.title = c;
    sw.addEventListener('click', ()=>{ 
        selectedColor = c;
        // highlight selected
        document.querySelectorAll('.color-swatch').forEach(el=>el.style.outline='none');
        sw.style.outline = '3px solid rgba(255,255,255,0.12)';
    });
    palette.appendChild(sw);
});

// submit & undo handlers (layout-only behaviour)
document.getElementById('submit').addEventListener('click', ()=>{
    // advance to next row visually
    if(activeRow < ROWS-1){
        document.querySelectorAll('.row')[activeRow].classList.remove('active');
        activeRow++;
        document.querySelectorAll('.row')[activeRow].classList.add('active');
    }
});

document.getElementById('undo').addEventListener('click', ()=>{
    // clear selected color in active row (last filled slot)
    const rowEls = document.querySelectorAll('.row')[activeRow].querySelectorAll('.hole');
    for(let i=SLOTS-1;i>=0;i--){
        if(state[activeRow][i]){ 
            state[activeRow][i]=null; 
            rowEls[i].innerHTML=''; break; 
        }
    }
});

// keyboard shortcuts
window.addEventListener('keydown', (e)=>{
    if(e.key>='1' && e.key<=(colors.length).toString()){
        const idx = Number(e.key)-1; document.querySelectorAll('.color-swatch')[idx].click();
    }
    if(e.key==='Enter') document.getElementById('submit').click();
    if(e.key==='Backspace') document.getElementById('undo').click();
});
function startAufgeben(){


const startButton = document.getElementById("startAufgebeButton");
console.log("Start Knopf gedrückt");
  // Wenn Button nicht aktiv ist -> aktivieren
  if (!startButton.classList.contains("stop")) {
    spielLaeuft = true;
    startButton.classList.add("stop");
    startButton.textContent = "Aufgeben";
  } else {
    // Button aktiv -> spiel wird gestoppt
    spielLaeuft = false;
    startButton.classList.remove("stop");
    startButton.textContent = "Start";
  }
}
  