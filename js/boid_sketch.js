
//#region variables declaration

//#region environment variables
let myCanvas;
let grid;
let obGrid;
let world = new World();
let flock = new Flock();
//#endregion

//#region UI constants
const SLD_ALIGN = document.getElementById('align');
const SLD_SEPARATE = document.getElementById('separate');
const SLD_COHESE = document.getElementById('cohese');
const SLD_PERCEPT = document.getElementById('percept');
const SLD_AMOUNT = document.getElementById('amount');
const SLD_REACT = document.getElementById('react');
const SLD_SIZE = document.getElementById('size');
const SLD_FOV = document.getElementById('fov');

const OUT_ALIGN = document.getElementById('alignOutput');
const OUT_SEPARATE = document.getElementById('separateOutput');
const OUT_COHESE = document.getElementById('coheseOutput');
const OUT_PERCEPT = document.getElementById('perceptOutput');
const OUT_AMOUNT = document.getElementById('amountOutput');
const OUT_REACT = document.getElementById('reactOutput');
const OUT_SIZE = document.getElementById('sizeOutput');
const OUT_FOV = document.getElementById('fovOutput');

const gridOutput = document.getElementById('gridOutput');
const fpsOutput = document.getElementById('fpsOutput');
const comparisonOuput = document.getElementById('comparisonOutput');
const debugBox = document.getElementById('debug');

// let SLD_ALIGNInput = document.getElementById('alignInput');
// let SLD_SEPARATEInput = document.getElementById('separateInput');
// let SLD_COHESEInput = document.getElementById('coheseInput');
// let SLD_PERCEPTInput = document.getElementById('perceptInput');
// let SLD_AMOUNTInput = document.getElementById('amountInput');
// let SLD_REACTInput = document.getElementById('reactInput');
// let SLD_SIZEInput = document.getElementById('sizeInput');
//#endregion

//#region environment constants
const BACKGROUND_COLOR = 250;
const BOID_COLOR = [70,90,110,150,175];
//#endregion

//#endregion

function setup(){

    //#region Canvas setup
    myCanvas = createCanvas(windowWidth,windowHeight);
    myCanvas.parent('canvas-div');
    //#endregion

    //#region Flock setup
    let possibleColor = [];
    for(let boidColor of BOID_COLOR){
        possibleColor.push(color(boidColor));
    }
    Boid.setPossibleColor(possibleColor);
    flock.setAmount(SLD_AMOUNT.value);
    //#endregion

    //#region UI setup
    OUT_PERCEPT.value = SLD_PERCEPT.value;
    OUT_ALIGN.value = SLD_ALIGN.value;
    OUT_SEPARATE.value = SLD_SEPARATE.value;
    OUT_COHESE.value = SLD_COHESE.value;
    OUT_AMOUNT.value = SLD_AMOUNT.value;
    OUT_REACT.value = SLD_REACT.value;
    OUT_SIZE.value = SLD_SIZE.value;
    OUT_FOV.value = SLD_FOV.value * 2 + '°';
    //#endregion

    //#region Boid setup
    Boid.alignmentMult = SLD_ALIGN.value;
    Boid.separationMult = SLD_SEPARATE.value;
    Boid.cohesionMult = SLD_COHESE.value;
    Boid.max_accel_mag = SLD_REACT.value;
    Boid.setSize(SLD_SIZE.value);
    Boid.setPerception(SLD_PERCEPT.value);
    Boid.perceptionAngle = SLD_FOV.value;
    //#endregion

    //#region Debug setup
    if(flock.boid.length > 0){
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

    //#region Grid setup
    obGrid = new Grid(40);
    grid = new Grid((Boid.perception * 3));
    //#endregion

    // world.registerObstacle(new Obstacle(width/2, height/2, 40));
    // world.registerObstacle(new Obstacle(width/2+200, height/2+150, 40));
    // world.registerObstacle(new Obstacle(width/2-100, height/2-30, 40));
    // world.registerObstacle(new Obstacle(width/2-300, height/2, 40));
    // world.registerObstacle(new Obstacle(width/2+200, height/2-150, 40));

}

function draw(){
    fpsOutput.value = Math.floor(frameRate());
    let comparisons = 0;
    let gridComp = 0;
    background(BACKGROUND_COLOR);
    gridComp += grid.update(flock.boid);
    // gridComp += obGrid.update(world.obstacleList);

    //#region debug mumbo jumbo
    if(flock.boid.length > 0 && flock.boid[0].debug){
        grid.showdebug(flock.boid[0].getPerceptionBoundaries());
        // obGrid.showdebug(flock.boid[0].getBoundaries());
        flock.boid[0].showdebug();
    }
    
    if(mouseIsPressed){
        // world.registerObstacle(new Obstacle(mouseX, mouseY, 20));
        // flock.boid[0].followMouse();
        // flock.boid[1].setPosition(createVector(flock.boid[0].position.x,flock.boid[0].position.y+110));
        // flock.boid[2].setPosition(createVector(flock.boid[0].position.x,flock.boid[0].position.y-107));
        // flock.boid[3].setPosition(createVector(flock.boid[0].position.x+107,flock.boid[0].position.y));
        // flock.boid[4].setPosition(createVector(flock.boid[0].position.x-105,flock.boid[0].position.y));

        // flock.boid[5].setPosition(createVector(flock.boid[0].position.x+80,flock.boid[0].position.y+80));
        // flock.boid[6].setPosition(createVector(flock.boid[0].position.x-87,flock.boid[0].position.y+80));
        // flock.boid[7].setPosition(createVector(flock.boid[0].position.x+80,flock.boid[0].position.y-80));
        // flock.boid[8].setPosition(createVector(flock.boid[0].position.x-80,flock.boid[0].position.y-80));
    }
    
    if(keyIsPressed){
        flock.boid[0].lookAt(createVector(mouseX,mouseY));
    }
    //#endregion

    world.show();
    comparisons = flock.show(grid, obGrid);

    comparisonOutput.value = comparisons;
    gridOutput.value = gridComp;
}

//#region tab
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
//#endregion

//#region sliders
SLD_PERCEPT.oninput = function(){
    OUT_PERCEPT.value = SLD_PERCEPT.value;
    Boid.setPerception(SLD_PERCEPT.value);
    grid.reInitGrid((Boid.perception * 3));
}

SLD_ALIGN.oninput = function(){
    OUT_ALIGN.value = SLD_ALIGN.value;
    Boid.alignmentMult = SLD_ALIGN.value;
}

SLD_SEPARATE.oninput = function(){
    OUT_SEPARATE.value = SLD_SEPARATE.value;
    Boid.separationMult = SLD_SEPARATE.value;
}

SLD_COHESE.oninput = function(){
    OUT_COHESE.value = SLD_COHESE.value;
    Boid.cohesionMult = SLD_COHESE.value;
}

SLD_AMOUNT.oninput = function(){
    let value = SLD_AMOUNT.value;
    OUT_AMOUNT.value = value;

    flock.setAmount(value);
}

SLD_REACT.oninput = function(){
    OUT_REACT.value = SLD_REACT.value;
    Boid.max_accel_mag = SLD_REACT.value;
}

SLD_SIZE.oninput = function(){
    OUT_SIZE.value = SLD_SIZE.value;
    Boid.setSize(SLD_SIZE.value);
    grid.reInitGrid((Boid.perception * 3));
}

SLD_FOV.oninput = function(){
    OUT_FOV.value = SLD_FOV.value * 2 + '°';
    Boid.perceptionAngle = SLD_FOV.value;
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