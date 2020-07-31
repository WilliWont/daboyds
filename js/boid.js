class Boid {
    static perception;
    static basePerception = 60;
    static perceptionAngle;
    static perceptionMult;

    static sizeMult;

    static alignmentMult;
    static cohesionMult;
    static separationMult;

    static baseWidth = 3;
    static baseLen = 10;
    static baseDep = -2.5;

    static width;
    static len;
    static dep;

    static possibleColor;
    static debugcolor;
    static detectionColor;
    static nonDetectionColor;

    static min_vel_mag = 7;
    static max_vel_mag = 15;
    static max_accel_mag;

    constructor(){
        this.debug = false;

        this.position = createVector(
            random(0,width),
            random(0,height)
        );

        this.velocity = p5.Vector.random2D();

        this.velocity.setMag(random(Boid.min_vel_mag ,Boid.max_vel_mag));

        this.acceleration = createVector();

        let boidColor = color(60);
        if(Boid.possibleColor != null && Boid.possibleColor.length > 0){
            boidColor = Boid.possibleColor[Math.floor(random(0,Boid.possibleColor.length))];
        }

        this.color = boidColor;
        this.fill = boidColor;

        // TODO: refactor
        Boid.debugcolor = color(240,0,0);
        Boid.detectionColor = color('#1dcd9f');
        Boid.nonDetectionColor = color(240,0,0);
    }

    update(){
        // moves the boid based on velocity and acceleration
        this.checkWall();
        this.accelerate();
        this.move();
    }

    //#region TODO: REMOVE LATER
    followMouse(){
        this.position = createVector(mouseX, mouseY);
    }

    followBoid(boid){
        this.position = createVector(boid.position.x-40,boid.position.y+70);
    }

    lookAt(thing){
        let toFollow = createVector(thing.x-this.position.x,thing.y-this.position.y);
        this.velocity = toFollow;
    }
    //#endregion
    
    //TODO: refactor
    flockTo(boids){
        let comparisons = 0;

        let desired = createVector();

        let cohesion = createVector();
        let alignment = createVector();
        let separation = createVector();

        let count = 0;

        let debugSize = Boid.width * 2;

        for(let other of boids){
            comparisons++;
            let d = dist(this.position.x, this.position.y, 
                        other.position.x, other.position.y);

            if(this.debug){
                push();
                strokeWeight(1);
                stroke(Boid.nonDetectionColor);
                noFill();
                square(other.position.x-debugSize/2, other.position.y-debugSize/2, debugSize);
                pop();
            }


            if(other != this && d < Boid.perception){

                if(this.debug){
                    push();
                    noFill();
                    strokeWeight(1);
                    stroke(color(240,240,0));
                    square(other.position.x-debugSize/2, other.position.y-debugSize/2, debugSize);
                    pop();
                }

                let inArc = false;
                
                let cone = Boid.perceptionAngle * (Math.PI/180);

                inArc = checkVectorInCone(this.position, this.velocity, other.position, cone, -cone);

                if(inArc){
                    if(this.debug){
                        // let size = Boid.width * 4;
                        // square(other.position.x-size, other.position.y-size, size);
                        push();
                        noFill();
                        strokeWeight(1);
                        stroke(Boid.detectionColor);
                        line(this.position.x, this.position.y, other.position.x, other.position.y);
                        square(other.position.x-debugSize/2, other.position.y-debugSize/2, debugSize);
                        pop();
                    }

                    let difference = createVector(this.position.x, this.position.y)
                                    .sub(other.position.x, other.position.y);
                    
                    if(d != 0)
                        difference.div((d*d));

                    // separation
                    separation.add(difference);

                    // alignment
                    alignment.add(other.velocity);

                    // cohesion
                    cohesion.add(other.position);

                    count++;
                } // exit if not in field of view
            } // exit if not in view radius

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

        this.acceleration.add(desired);

        return comparisons;
    }

    //TODO: refactor
    checkObstacle(obstacles){
        // TODO CONTINUE
        let comparison = 0;

        let lookahead = Boid.perception;

        let nVel = createVector(this.velocity.x, this.velocity.y).normalize();

        nVel.mult(lookahead);
        let ahead1 = createVector(this.position.x, this.position.y).add(nVel);

        nVel.mult(0.5);
        let ahead2 = createVector(this.position.x, this.position.y).add(nVel);

        let ahead3 = createVector(this.position.x, this.position.y);

        let avoidObstacle = null;

        // if(this.debug){
        //     push();
        //     strokeWeight(1);
        //     stroke(color(240,0,0));
        //     line(this.position.x, this.position.y, 
        //         ahead1.x, ahead1.y);
        //     stroke(color(0,240,0));
        //     line(this.position.x, this.position.y, 
        //         ahead2.x, ahead2.y);
        //     pop();
        // }

        // let hasD1 = false;
        let hasD2 = false;
        let ahead;
        let d;
        for(let obstacle of obstacles){
            comparison++;
            
            let size_threshold = obstacle.size*1.0 / 2;

            // if(this.debug){
            //     push();
            //     noFill();
            //     stroke(color(240,0,0));
            //     text(obstacle.size, 
            //          obstacle.position.x - obstacle.size / 2, 
            //          obstacle.position.y - obstacle.size / 2);
            //     strokeWeight(2);
            //     square(obstacle.position.x-obstacle.size / 2, 
            //            obstacle.position.y-obstacle.size / 2, 
            //            obstacle.size);
            //     circle(obstacle.position.x, obstacle.position.y, 10);
            //     pop();
            // }

            // let d1 = dist(ahead1.x, ahead1.y, obstacle.position.x, obstacle.position.y);
            let d1 = dist(obstacle.position.x, obstacle.position.y, ahead1.x, ahead1.y);
            let d2 = dist(ahead2.x, ahead2.y, obstacle.position.x, obstacle.position.y);
            let d3 = dist(ahead3.x, ahead3.y, obstacle.position.x, obstacle.position.y);

            if(d3 < size_threshold){
                d = d3;
                ahead = 3;
                avoidObstacle = obstacle;
                break;
            } else if (d2 < size_threshold){
                d = d2;
                ahead = 2;
                avoidObstacle = obstacle;
                hasD2 = true;
            } else if (d1 < size_threshold && !hasD2){
                d = d1;
                ahead = 1;
                avoidObstacle = obstacle;
            }
        }

        let avoidForce = createVector(0,0);

        if(avoidObstacle != null){

            let aheadVector;
            switch(ahead){
                case 1:
                    aheadVector = ahead1;
                    break;
                case 2:
                    aheadVector = ahead2;
                    break;
                case 3:
                    aheadVector = ahead3;
                    push();
                    noFill();
                    stroke(color(240,0,0));
                    circle(this.position.x, this.position.y,20);
                    pop();
                    break;
            }

            if(this.debug){
                push();
                text(ahead,10,10);
                text(d, 10,20);
                noFill();
                strokeWeight(4);
                stroke(Boid.detectionColor);
                square(avoidObstacle.position.x-avoidObstacle.size/2, 
                       avoidObstacle.position.y-avoidObstacle.size/2, 
                       avoidObstacle.size);
                line(aheadVector.x, aheadVector.y, avoidObstacle.position.x, avoidObstacle.position.y);
                pop();
            }
            avoidForce = aheadVector.sub(avoidObstacle.position);
            avoidForce.normalize().mult(Boid.max_accel_mag*4.0);
        }

        this.velocity.add(avoidForce);

        return comparison;
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
        // this.drawDetailedBoid();
        Boid.drawBoid();

        pop();
    }

    static drawBoid = function(){
        beginShape();
        vertex(0,0);
        vertex(Boid.dep, Boid.width);
        vertex(Boid.len, 0);
        vertex(Boid.dep, -Boid.width);
        endShape(CLOSE);
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
        // circle(this.position.x, this.position.y, Boid.perception * 2);

        // TODO: Optimize here
        translate(this.position.x, this.position.y);
        let angle = (acos(this.velocity.x * 1.0 / this.velocity.mag() * 1.0));
        angle = (this.velocity.y < 0) ? -angle : angle;
        rotate(angle);

        arc(0, 0, Boid.perception * 2,Boid.perception * 2, 
            -Boid.perceptionAngle*(Math.PI/180),Boid.perceptionAngle*(Math.PI/180), PIE);
        pop();
    }

    //#region movement
    accelerate(){
        this.velocity.add(this.acceleration);
        this.velocity.setMag(Boid.min_vel_mag);
        this.velocity.limit(Boid.max_vel_mag);
    }

    move(){
        this.position.add(this.velocity);
    }
    //#endregion

    checkWall(){
        this.position.x = (this.position.x > width) ? 0 
                        : (this.position.x < 0) ? width 
                        : this.position.x;

        this.position.y = (this.position.y > height)? 0 
                        : (this.position.y < 0) ? height 
                        : this.position.y;
    }

    //#region setters and getters
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

    setAcceleration(accel){
        this.acceleration = accel;
    }

    static setPossibleColor(possibleColor){
        Boid.possibleColor = possibleColor;
    }

    static setSize(size){
        Boid.sizeMult = size;
        Boid.width = Boid.baseWidth * Boid.sizeMult;
        Boid.dep = Boid.baseDep * Boid.sizeMult;
        Boid.len = Boid.baseLen * Boid.sizeMult;

        Boid.perception = Boid.basePerception * Boid.sizeMult * Boid.perceptionMult;
    }

    static setPerception(perception){
        Boid.perceptionMult = perception;
        Boid.perception = Boid.basePerception * Boid.sizeMult * Boid.perceptionMult;
    }

    getPerceptionBoundaries(){
        let boundaries = [
            createVector(this.position.x + Boid.perception, this.position.y + Boid.perception),
            createVector(this.position.x + Boid.perception, this.position.y - Boid.perception),
            createVector(this.position.x - Boid.perception, this.position.y - Boid.perception),
            createVector(this.position.x - Boid.perception, this.position.y + Boid.perception)
        ];

        return boundaries;
    }

    getBoundaries(){
        let boundaries = [
            createVector(this.position.x, this.position.y)
        ];

        return boundaries;
    }
    //#endregion
}