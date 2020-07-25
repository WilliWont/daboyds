
//#region variables declaration
let grid;
let flock = new Flock();

let alignSlider = document.getElementById('align');
let separateSlider = document.getElementById('separate');
let coheseSlider = document.getElementById('cohese');
let perceptSlider = document.getElementById('percept');
let amountSlider = document.getElementById('amount');
let reactSlider = document.getElementById('react');
let sizeSlider = document.getElementById('size');

let alignOuput = document.getElementById('alignOutput');
let separateOuput = document.getElementById('separateOutput');
let coheseOuput = document.getElementById('coheseOutput');
let perceptOuput = document.getElementById('perceptOutput');
let amountOuput = document.getElementById('amountOutput');
let reactOuput = document.getElementById('reactOutput');
let sizeOuput = document.getElementById('sizeOutput');

// let alignSliderInput = document.getElementById('alignInput');
// let separateSliderInput = document.getElementById('separateInput');
// let coheseSliderInput = document.getElementById('coheseInput');
// let perceptSliderInput = document.getElementById('perceptInput');
// let amountSliderInput = document.getElementById('amountInput');
// let reactSliderInput = document.getElementById('reactInput');
// let sizeSliderInput = document.getElementById('sizeInput');

let gridOutput = document.getElementById('gridOutput');
let fpsOutput = document.getElementById('fpsOutput');
let comparisonOuput = document.getElementById('comparisonOutput');
let debugBox = document.getElementById('debug');
//#endregion


function setup(){
    var myCanvas = createCanvas(windowWidth,windowHeight);
    myCanvas.parent('canvas-div');

    for(let i = 0; i < amountSlider.value; i++){
        flock.insertBoid(new Boid());
    }

    perceptOuput.value = perceptSlider.value;
    alignOuput.value = alignSlider.value;
    separateOuput.value = separateSlider.value;
    coheseOuput.value = coheseSlider.value;
    amountOuput.value = amountSlider.value;
    reactOuput.value = reactSlider.value;
    sizeOuput.value = sizeSlider.value;

    Boid.alignmentMult = alignSlider.value;
    Boid.separationMult = separateSlider.value;
    Boid.cohesionMult = coheseSlider.value;
    Boid.max_accel_mag = reactSlider.value;
    Boid.setSize(sizeSlider.value);
    Boid.setPerception(perceptSlider.value);

    flock.boid[0].setDebug(debugBox.checked);
    if(!debugBox.checked){
        flock.boid[0].setColor(Boid.possibleColor[0]);
        flock.boid[0].setFill(Boid.possibleColor[0]);
    } else {
        flock.boid[0].setColor(Boid.debugcolor);
        flock.boid[0].setFill(Boid.debugcolor);
    }

    grid = new Grid(Boid.perception);
    // grid.setCellSize(20);
}


function draw(){
    fpsOutput.value = Math.floor(frameRate());
    let comparisons = 0;
    let gridComp = 0;
    background(250);
    gridComp = grid.update(flock.boid);

    if(flock.boid[0].debug){
        grid.showdebug(flock.boid[0],flock.boid[0].getRadius());
        flock.boid[0].showdebug();
    }

    comparisons = flock.show(grid);
    comparisonOutput.value = comparisons;
    gridOutput.value = gridComp;
    // grid.show();
}

//#region sliders and tab
let tabClosed = false;
let settingElem = document.getElementById("setting-tab");
let settingLoc = settingElem.getBoundingClientRect();
function toggleTab(){
    tabClosed = settingElem.classList.contains('tab-close');
    if(tabClosed){
      settingElem.classList.add('tab-open');
      settingElem.classList.remove('tab-close');
      tabClosed = false;
    } else {
      settingElem.classList.add('tab-close');
      settingElem.classList.remove('tab-open');
      settingLoc = settingElem.getBoundingClientRect();
      tabClosed = true;
    }
}

perceptSlider.oninput = function(){
    perceptOuput.value = perceptSlider.value;
    Boid.setPerception(perceptSlider.value);
    grid.reInitGrid(Boid.radius);
}

alignSlider.oninput = function(){
    alignOuput.value = alignSlider.value;
    Boid.alignmentMult = alignSlider.value;
}

separateSlider.oninput = function(){
    separateOuput.value = separateSlider.value;
    Boid.separationMult = separateSlider.value;
}

coheseSlider.oninput = function(){
    coheseOuput.value = coheseSlider.value;
    Boid.cohesionMult = coheseSlider.value;
}

amountSlider.oninput = function(){
    let value = amountSlider.value;
    amountOuput.value = value;
    // console.log('val: ' + value);
    while(flock.boid.length > value){
        flock.removeBoid();
        // console.log('remove');
    }
    while(flock.boid.length < value){
        // console.log('new');
        flock.insertBoid(new Boid());
    }
}

reactSlider.oninput = function(){
    reactOuput.value = reactSlider.value;
    Boid.max_accel_mag = reactSlider.value;
}

sizeSlider.oninput = function(){
    sizeOuput.value = sizeSlider.value;
    Boid.setSize(sizeSlider.value);
    grid.reInitGrid(Boid.radius);
}

debugBox.oninput = function(){
    flock.boid[0].setDebug(debugBox.checked);
    if(!debugBox.checked){
        flock.boid[0].setColor(Boid.possibleColor[0]);
        flock.boid[0].setFill(Boid.possibleColor[0]);
    } else {
        flock.boid[0].setColor(Boid.debugcolor);
        flock.boid[0].setFill(Boid.debugcolor);
    }

}
//#endregion
