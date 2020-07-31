class World{
    constructor(){
        this.obstacleList = [];
    }

    registerObstacle(obstacle){
        let allowed = true;
        for(let ob of this.obstacleList){
            let d = dist(ob.position.x, ob.position.y, obstacle.position.x, obstacle.position.y);
            if(d < obstacle.size*3/4){
                allowed = false;
                break;
            }
        }
        if(allowed)
            this.obstacleList.push(obstacle);
    }

    show(){
        for(let obstacle of this.obstacleList){
            obstacle.show();
        }
    }
}

class Obstacle{

    constructor(x,y,size){
        this.position = createVector(x,y);
        this.size = size;
    }

    show(){
        push();
        fill(color(100));
        stroke(color(100));
        circle(this.position.x, this.position.y, this.size * 2);
        pop();
    }

    getPosition(){
        return this.position;
    }

    getBoundaries(){
        let boundaries = [
            createVector(this.position.x + this.size, this.position.y + this.size),
            createVector(this.position.x + this.size, this.position.y - this.size),
            createVector(this.position.x - this.size, this.position.y - this.size),
            createVector(this.position.x - this.size, this.position.y + this.size)
        ];

        return boundaries;
    }
}