//const colors = ["#ef476f","#ffd166","#06d6a0","#118ab2","#8338ec","#ff9f1c"];
const colors = ["red","green","blue","violet","yellow","white"];
const ROWS = 10;
const SLOTS = 4;
const board = document.getElementById("board");
const palette = document.getElementById("palette");
const secretSection = document.getElementById("secret");
const secretRow = secretSection.getElementsByClassName("peg");

let activeRow = null;
let selectedColor = null;
const state = Array.from({length:ROWS},_=>Array(SLOTS).fill(null));
let spielLaeuft = false;
let gewonnen = false;
let verloren = false;
let secretCode = [];

createField();

function createRow(i){
    const row = document.createElement("div");
    row.className='row';
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
            hole.innerHTML = `<div class="peg" style="background:${selectedColor}"title="${selectedColor}"></div>`;
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
function createField(){
    board.innerHTML = "";
    for (let r=0;r<ROWS;r++){
        board.appendChild(createRow(r));
    }
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

// submit & undo handlers
document.getElementById('submit').addEventListener('click', ()=>{
    // überprüfe ob gewonnen, wenn nicht gehe zur nächsten Zeile
    let jetzigeZeile = document.querySelectorAll('.row')[activeRow];
    let holes = jetzigeZeile.getElementsByClassName("holes")[0];
    let hole = holes.getElementsByClassName("hole");
    
    let farbenDerReihe = Array.from(hole).map(h => {
        const peg = h.querySelector('.peg');
        return peg ? peg.title : null; 
    }); 
    console.log(farbenDerReihe);
    
    
     // Gewinncheck mit Algorithmus für schwarze/weiße Pins 
    let redPins = 0;
    let whitePins = 0;
    let secretRest = [];
    let guessRest = [];

    for (let i = 0; i < SLOTS; i++) {
        const secretFarbe = colors[secretCode[i]];
        if (farbenDerReihe[i] === secretFarbe) {
            redPins++;
        } else {
            secretRest.push(secretFarbe);
            guessRest.push(farbenDerReihe[i]);
        }
    }

    // Weiße Pins zählen
    guessRest.forEach(g => {
        let idx = secretRest.indexOf(g);
        if (idx > -1) {
            whitePins++;
            secretRest.splice(idx, 1);
        }
    });

    // Feedback-Pegs setzen
    let feedbackPegs = jetzigeZeile.querySelectorAll('.feedback .fpeg');
    let pins = Array(redPins).fill("red").concat(Array(whitePins).fill("white"));

    // mischen wie beim echten Mastermind
    pins.sort(() => Math.random() - 0.5);

    pins.forEach((color, i) => {
        feedbackPegs[i].style.background = (color === "red" ? "#ef476f" : "#fff");
    });

    // --- Gewinn oder nächste Zeile ---
    if (redPins === SLOTS) {
        alert("Gewonnen! 🎉");
        startAufgeben();
    } else {
        if (activeRow < ROWS - 1) { 
            jetzigeZeile.classList.remove('active');
            activeRow++;
            document.querySelectorAll('.row')[activeRow].classList.add('active');
        } else {
            verloren = true;
            alert("Verloren!");
            startAufgeben();
        }
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
        const idx = Number(e.key)-1; 
        document.querySelectorAll('.color-swatch')[idx].click();
    }
    if(e.key==='Enter') document.getElementById('submit').click();
    if(e.key==='Backspace') document.getElementById('undo').click();
});


function startAufgeben(){
  const startButton = document.getElementById("startAufgebeButton");
  // Wenn Button nicht aktiv ist -> aktivieren/spiel starten
  if (!startButton.classList.contains("stop")) {
    clearField();
    spielLaeuft = true;
    generateCode();
    activateAndDeactivateField();
    startButton.classList.add("stop");
    startButton.textContent = "Aufgeben";
  } else {
    // Button aktiv -> spiel wird gestoppt
    spielLaeuft = false;
    activateAndDeactivateField();
    startButton.classList.remove("stop");
    codeAufdecken();
    startButton.textContent = "Start";
}
}

function activateAndDeactivateField(){                      //Diese Funktion kommt mir sehr unnötig vor, aber mir fällt nichts anderes ein
    var rows = document.getElementsByClassName("row");
    if(spielLaeuft){
        var firstRow = rows[0];
        activeRow = 0;
        firstRow.classList.add("active");
    } else{
        var currentRow = rows[activeRow];
        currentRow.classList.remove("active");
        activeRow = null;
    }
}

function generateCode(){
    let arr =[];

    for(let a = 0; a < colors.length;a++){
        arr[a] = a;                         //Es muss eine einfachere Variante geben um so ein Array zu erstellen, aber naja
    }

    for(let r = 0; r < SLOTS; r++){
        let index = Math.floor(Math.random() * arr.length); 
        //console.log(index);
        secretCode[r] = arr[index];
        arr.splice(index,1);
        //console.log(arr);
    }
    //console.log(arr);
    //console.log(secretCode);            //Wenn man cheaten will dann einkommentieren
}

function codeAufdecken(){
  for(let place = 0; place < SLOTS; place++){
      const dw = document.createElement('div');
      dw.className='color-swatch';
      dw.style.background = colors[secretCode[place]];
      dw.title = colors[secretCode[place]];

      secretRow[place].appendChild(dw);
    }
}

function clearField(){ 
   createField();
    for (let i = 0; i < secretRow.length; i++) {
        secretRow[i].innerHTML = "";
    }
    // Palette neu aufbauen, erste Farbe automatisch auswählen
    selectedColor = colors[0];
}