let flock = new Flock();

let alignSlider = document.getElementById('align');
let separateSlider = document.getElementById('separate');
let coheseSlider = document.getElementById('cohese');
let perceptSlider = document.getElementById('percept');
let amountSlider = document.getElementById('amount');
let reactSlider = document.getElementById('react');
let sizeSlider = document.getElementById('size');

let alignSliderOutput = document.getElementById('alignOutput');
let separateSliderOutput = document.getElementById('separateOutput');
let coheseSliderOutput = document.getElementById('coheseOutput');
let perceptSliderOutput = document.getElementById('perceptOutput');
let amountSliderOutput = document.getElementById('amountOutput');
let reactSliderOutput = document.getElementById('reactOutput');
let sizeSliderOuput = document.getElementById('sizeOutput');

let debugBox = document.getElementById('debug');



function setup(){
    var myCanvas = createCanvas(windowWidth,windowHeight);
    myCanvas.parent('canvas-div');

    for(let i = 0; i < amountSlider.value; i++){
        flock.insertBoid(new Boid());
    }

    perceptSliderOutput.value = perceptSlider.value;
    alignSliderOutput.value = alignSlider.value;
    separateSliderOutput.value = separateSlider.value;
    coheseSliderOutput.value = coheseSlider.value;
    amountSliderOutput.value = amountSlider.value;
    reactSliderOutput.value = reactSlider.value;
    sizeSliderOuput.value = sizeSlider.value;

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
}

function draw(){
    background(250);
    if(flock.boid[0].debug)
        flock.boid[0].showdebug();
    
    flock.show();
}

let tabClosed = false;
let settingElem = document.getElementById("setting-tab");
let settingArrow = document.getElementById("setting-tab-arrow");
let settingLoc = settingElem.getBoundingClientRect();
function toggleTab(){
    tabClosed = settingElem.classList.contains('tab-close');
    if(tabClosed){
      settingElem.classList.add('tab-open');
      settingElem.classList.remove('tab-close');
      settingArrow.classList.remove("text-flip");
      tabClosed = false;
    } else {
      settingElem.classList.add('tab-close');
      settingElem.classList.remove('tab-open');
      settingArrow.classList.add("text-flip");
      settingLoc = settingElem.getBoundingClientRect();
      tabClosed = true;
    }
  }

perceptSlider.oninput = function(){
    perceptSliderOutput.value = perceptSlider.value;
    Boid.setPerception(perceptSlider.value);
}

alignSlider.oninput = function(){
    alignSliderOutput.value = alignSlider.value;
    Boid.alignmentMult = alignSlider.value;
}

separateSlider.oninput = function(){
    separateSliderOutput.value = separateSlider.value;
    Boid.separationMult = separateSlider.value;
}

coheseSlider.oninput = function(){
    coheseSliderOutput.value = coheseSlider.value;
    Boid.cohesionMult = coheseSlider.value;
}

amountSlider.oninput = function(){
    let value = amountSlider.value;
    amountSliderOutput.value = value;
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
    reactSliderOutput.value = reactSlider.value;
    Boid.max_accel_mag = reactSlider.value;
}

sizeSlider.oninput = function(){
    sizeSliderOuput.value = sizeSlider.value;
    Boid.setSize(sizeSlider.value);
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