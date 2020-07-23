class Flock{
    constructor(){
        this.boid = [];
    }

    show(){
        let boidToCheck = Array.from(this.boid);
        for(let boid of this.boid){
            boid.show();
            boid.flockTo(boidToCheck);
            boid.update();
            // boid.showdebug();
        }
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
        console.log('new boid');
    }

    removeBoid(){
        this.boid.pop();
    }
}