class Flock{
    constructor(){
        this.boid = [];
    }

    show(gridToCheck){
        let comparisons = 0;
        // let boidToCheck = gridToCheck.getNearbyObject(this.boid);
        for(let boid of this.boid){

            comparisons += boid.flockTo(gridToCheck.getNearbyObject(boid, boid.getRadius()));
    
                // comparisons += boid.flockTo(this.boid);

            boid.update();
            boid.show();
            // boid.showdebug();
        }
        return comparisons;
    }
    
    // update(){
    //     let boidToCheck = Array.from(this.boid);
    //     for(let boid of this.boid){
    //         boid.flockTo(boidToCheck);
    //         boid.update();
    //     }
    // }

    insertBoid(boidToAdd){
        this.boid.push(boidToAdd);

    }

    removeBoid(){
        this.boid.pop();
    }
}