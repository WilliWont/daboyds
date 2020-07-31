class Flock{
    constructor(){
        this.boid = [];
    }

    //TODO: refactor
    show(gridToCheck, obGridToCheck){
        let comparisons = 0;
        for(let boid of this.boid){

            boid.setAcceleration(createVector(0,0));

            comparisons += boid.flockTo(gridToCheck.getNearbyObject(boid.getPerceptionBoundaries()));
            // comparisons += boid.checkObstacle(obGridToCheck.getNearbyObject(boid.getPerceptionBoundaries()));
            
            boid.update();
            boid.show();
        }
        return comparisons;
    }

    setAmount(amount){
        while(flock.boid.length > amount){
            this.removeBoid();
        }
        while(flock.boid.length < amount){
            this.insertBoid(new Boid());
        }
    }

    insertBoid(boidToAdd){
        this.boid.push(boidToAdd);
    }

    removeBoid(){
        this.boid.pop();
    }
}