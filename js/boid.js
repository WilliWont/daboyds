class Boid {
    static perception;
    static basePerception;
    static perceptionMult;

    static sizeMult;

    static alignmentMult;
    static cohesionMult;
    static separationMult;

    static baseWidth;
    static baseLen;
    static baseDep;

    static width;
    static len;
    static dep;
    
    static debugcolor;
    static detectionColor;

    static min_vel_mag;
    static max_vel_mag;
    static max_accel_mag;

    static possibleColor;

    static radius;

    constructor(){
        this.debug = false;

        this.position = createVector(
            random(0,width),
            random(0,height)
        );

        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(7 ,10));
        Boid.min_vel_mag = 7;
        Boid.max_vel_mag = 15;

        // this.velocity.setMag(random(1 ,2));
        // Boid.min_vel_mag = 1;
        // Boid.max_vel_mag = 3;

        this.acceleration = createVector();

        Boid.possibleColor = [color(100),color(120),color(150),color(175)];
        let index = Math.floor(random(0,Boid.possibleColor.length));
        
        this.color = Boid.possibleColor[index];
        this.fill = Boid.possibleColor[index];

        Boid.debugcolor = color(240,0,0);
        Boid.detectionColor = color('#1dcd9f');

        Boid.baseWidth = 3;
        Boid.baseLen = 10;
        Boid.baseDep = -2.5;

        Boid.basePerception = 35;
    }

    update(){
        // moves the boid based on velocity and acceleration
        this.checkWall();
        this.accelerate();
        this.move();
    }
    
    flockTo(boids){
        let comparisons = 0;

        let desired = createVector();

        let cohesion = createVector();
        let alignment = createVector();
        let separation = createVector();

        let count = 0;

        for(let other of boids){
            comparisons++;
            let d = dist(this.position.x, this.position.y, 
                        other.position.x, other.position.y);

            if(this.debug){
                push();
                noFill();
                strokeWeight(2);
                stroke(Boid.detectionColor);
                let size = Boid.width * 4;
                square(other.position.x-size, other.position.y-size, size);
                pop();
            }


            if(other != this && d < Boid.perception * Boid.perceptionMult){
                    if(this.debug){
                        line(this.position.x, this.position.y, other.position.x, other.position.y);
                    }

                    let difference = createVector(this.position.x, this.position.y)
                                    .sub(other.position.x, other.position.y);
                    
                    if(d != 0)
                        difference.div((d));

                    // separation
                    separation.add(difference);

                    // alignment
                    alignment.add(other.velocity);

                    // cohesion
                    cohesion.add(other.position);

                    count++;
            }

        }

        // // steer algo: desired - current = target
        if(count > 0){
            cohesion.div(count);
            cohesion.sub(this.position);
            alignment.div(count);
            separation.div(count);
            
            let max_accel = Boid.max_accel_mag * 1.0;

            cohesion.setMag(Boid.max_vel_mag);
            cohesion.sub(this.velocity);
            cohesion.limit(max_accel);

            alignment.setMag(Boid.max_vel_mag);
            alignment.sub(this.velocity);
            alignment.limit(max_accel);

            separation.setMag(Boid.max_vel_mag);
            separation.sub(this.velocity);
            separation.limit(max_accel);
        }

        desired.add(cohesion.x * Boid.cohesionMult, cohesion.y * Boid.cohesionMult);
        desired.add(separation.x * Boid.separationMult, separation.y * Boid.separationMult);
        desired.add(alignment.x * Boid.alignmentMult, alignment.y * Boid.alignmentMult);

        this.acceleration.set(0,0);
        this.acceleration.add(desired);

        return comparisons;
    }

    show(){
        push();

        fill(this.fill);
        stroke(this.color);
        // strokeWeight(0);
        translate(this.position.x, this.position.y);

        let angle = (acos(this.velocity.x * 1.0 / this.velocity.mag() * 1.0));
        angle = (this.velocity.y < 0) ? -angle : angle;
        rotate(angle);

        // this.drawBasicBoid();
        this.drawDetailedBoid();

        pop();
    }

    drawDetailedBoid(){
        beginShape();
        vertex(0,0);
        vertex(Boid.dep, Boid.width);
        vertex(Boid.len, 0);
        vertex(Boid.dep, -Boid.width);
        endShape(CLOSE);
    }

    drawBasicBoid(){
        triangle(0, Boid.width, 
                 0, -Boid.width, 
                 Boid.len, 0);
    }

    showdebug(){
        push();
        stroke(Boid.debugcolor);
        strokeWeight(1);
        line(
            this.position.x,
            this.position.y,
            (this.position.x+this.velocity.x*10),
            (this.position.y+this.velocity.y*10)
            );
        noFill();
        circle(this.position.x, this.position.y, Boid.perception * 2);
        pop();
    }

    accelerate(){
        this.velocity.add(this.acceleration);
        this.velocity.setMag(Boid.min_vel_mag);
        this.velocity.limit(Boid.max_vel_mag);
    }

    move(){
        this.position.add(this.velocity);
    }

    checkWall(){
        this.position.x = (this.position.x > width) ? 0 
                        : (this.position.x < 0) ? width 
                        : this.position.x;

        this.position.y = (this.position.y > height)? 0 
                        : (this.position.y < 0) ? height 
                        : this.position.y;

        // if(this.position.x + Boid.perception * Boid.perceptionMult >= width){
        //     console.log('wall');
        //     this.acceleration.add(-Boid.max_accel_mag, 0);
        // }
    }

    setColor(color){
        this.color = color;
    }

    setFill(color){
        this.fill = color;
    }

    setDebug(debug){
        this.debug = debug;
    }

    setPosition(position){
        this.position = position;
    }

    setVelocity(velocity){
        this.velocity = velocity;
    }

    getRadius(){
        return Boid.radius;
    }

    static setSize(size){
        Boid.sizeMult = size;
        Boid.width = Boid.baseWidth * Boid.sizeMult;
        Boid.dep = Boid.baseDep * Boid.sizeMult;
        Boid.len = Boid.baseLen * Boid.sizeMult;

        Boid.perception = Boid.basePerception * Boid.sizeMult * Boid.perceptionMult;
        Boid.radius = Boid.perception;
    }

    static setPerception(perception){
        Boid.perceptionMult = perception;
        Boid.perception = Boid.basePerception * Boid.sizeMult * Boid.perceptionMult;
        Boid.radius = Boid.perception;
    }
}