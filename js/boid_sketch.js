let flock = new Flock();

let alignSlider = document.getElementById('align');
let separateSlider = document.getElementById('separate');
let coheseSlider = document.getElementById('cohese');
let perceptSlider = document.getElementById('percept');
let amountSlider = document.getElementById('amount');


function setup(){
    var myCanvas = createCanvas(windowWidth*(3/4),windowHeight*(3/4));
    myCanvas.parent('canvas-div');

    for(let i = 0; i < amountSlider.value; i++){
        flock.insertBoid(new Boid());
    }

    flock.boid[0].setColor(color(255,0,0));
    flock.boid[0].setFill(color(255,0,0));
    flock.boid[0].setDebug(true);
    flock.boid[0].setPosition(createVector(width/2, height/2));
    flock.boid[0].setVelocity(createVector(10,0));
}

function draw(){
    background(247);
    // flock.update();
    flock.boid[0].showdebug();
    flock.show();
}

perceptSlider.oninput = function(){
    Boid.perceptionMult = perceptSlider.value;
}

alignSlider.oninput = function(){
    Boid.alignmentMult = alignSlider.value;
}

separateSlider.oninput = function(){
    Boid.separationMult = separateSlider.value;
}

coheseSlider.oninput = function(){
    Boid.cohesionMult = coheseSlider.value;
}

amountSlider.oninput = function(){
    let value = amountSlider.value;
    console.log('val: ' + value);
    while(flock.boid.length > value){
        flock.removeBoid();
        console.log('remove');
    }
    while(flock.boid.length < value){
        console.log('new');
        flock.insertBoid(new Boid());
    }
}