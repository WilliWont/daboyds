class Grid{

    constructor(radius){

        // this.objectRadius = radius;
        this.cellSize = radius * 2;
        // this.cellSize *= 2;
        this.cellList = [];

        this.setCellColor();
        this.initGrid();
    }

    setCellColor(){
        GridCell.occupiedColor = color(255,100,100);
        GridCell.emptyColor = (color(220,220,250));
    }

    initGrid(){
        let gridX = Math.ceil(width / this.cellSize);
        let gridY = Math.ceil(height / this.cellSize);

        let curX = 0;
        let curY = 0;

        for(let j = 0; j < gridY; j++){
            for(let i = 0; i < gridX; i++){
                this.cellList.push(new GridCell(curX, curY, size));
                curX += this.cellSize;
            }
            curY += this.cellSize;
            curX = 0;
        }
        console.log('grid init \n cell: ' + this.cellSize);
    }

    reInitGrid(radius){
        this.cellSize = radius * 2;
        // this.cellSize *= 2;
        this.cellList = [];
        this.initGrid();
        console.log('grid reinit \n r: ' + radius);
    }

    setCellSize(radius){
        this.cellSize = radius * 2;
        this.cellSize *= 2;
        this.initGrid();
    }

    clearGrid(){
        for(let cell of this.cellList)
            cell.clearCell();
    }

    getNearbyObject(GameObject, radius){
        let nearbyObjects = [];
        let cell_Id = this.getCellsForObject(GameObject, radius);
        for(let id of cell_Id){
            let cellObjectList = this.cellList[id].objectList;
            for(let object of cellObjectList){
                if(!nearbyObjects.includes(object)){
                    nearbyObjects.push(object);
                }
            }
            // nearbyObjects.push(...this.cellList[id].objectList);
        }

        return nearbyObjects;
    }

    registerObjectList(GameObjectList){
        let comparison = 0;
        for(let object of GameObjectList){
            comparison++;
            let cell_Id = this.getCellsForObject(object, 0, false);

            for(let id of cell_Id){
                comparison++;
                this.cellList[id].registerGameObject(object);
            }
        }
        return comparison;
    }

    getCellsForObject(GameObject, radius){
        let occupiedCell = [];

        let position = GameObject.position;

        let min = createVector(position.x - radius, position.y - radius);
        let max = createVector(position.x + radius, position.y + radius);

        let w = width / this.cellSize;

        this.addCell(min, w, occupiedCell);
        this.addCell(createVector(max.x, min.y), w, occupiedCell);
        this.addCell(createVector(max.x, max.y), w, occupiedCell);
        this.addCell(createVector(min.x, max.y), w, occupiedCell);

        // console.log('object: ' + GameObject.position + ' r: ' + radius + " cells: " + occupiedCell);

        return occupiedCell;
    }

    addCell(position, w, listToAdd){
        let id = (Math.floor(position.x / this.cellSize)) 
               + (Math.floor(position.y / this.cellSize) * w);

        if(!listToAdd.includes(id)){
            id = Math.round(id);

            if(id >= 0 && id < this.cellList.length)
                listToAdd.push(id);
        }
    }

    update(GameObjectList){
        let comparison = 0;
        this.clearGrid();
        comparison = this.registerObjectList(GameObjectList);
        return comparison;
    }

    showdebug(GameObject, radius){

        let id = 0;
        for(let cell of this.cellList){
            cell.showEmpty(id,this.cellSize);
            id++;
        }

        // TODO: the code for showing occupied cells
        // is working inconsistently, perhaps a bugfix later

        // let cell_Id = this.getCellsForObject(GameObject, radius);
        // for(let oc of cell_Id){
        //     let cell = this.cellList[oc];
        //     cell.showOccupied(oc,this.cellSize);
        // }
    }
}

class GridCell{
    static occupiedColor;
    static emptyColor;

    constructor(x,y,size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.objectList = [];
    }

    registerGameObject(GameObject){
        if(!this.objectList.includes(GameObject))
            this.objectList.push(GameObject);
    }

    clearCell(){
        this.objectList.splice(0,this.objectList.length);
    }

    showOccupied(id,size){
        push();
        stroke(GridCell.occupiedColor);
        fill(GridCell.occupiedColor);
        text(id, this.x, this.y+10);
        noFill();
        strokeWeight(2);
        square(this.x,this.y,size);
        pop();
    }

    showEmpty(id,size){
        push();
        fill(GridCell.emptyColor);
        text(id, this.x, this.y+10);
        stroke(GridCell.emptyColor);
        noFill();
        square(this.x,this.y,size);
        pop();
    }
}