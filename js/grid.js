class Grid{

    constructor(size){
        this.cellSize = (size);

        this.cellList = [];

        this.setCellColor();
        this.initGrid();
    }

    setCellColor(){
        GridCell.occupiedColor = color(255,100,100);
        GridCell.emptyColor = color(220,220,250);
        GridCell.nonEmptyColor = color(210,210,0);
    }

    initGrid(){

        this.cellList = [];

        let gridX = Math.ceil(width / this.cellSize);
        let gridY = Math.ceil(height / this.cellSize);

        let curX = 0;
        let curY = 0;

        for(let j = 0; j < gridY; j++){
            for(let i = 0; i < gridX; i++){
                this.cellList.push(new GridCell(curX, curY, this.cellSize));
                curX += this.cellSize;
            }
            curY += this.cellSize;
            curX = 0;
        }
        console.log('grid init \n cell: ' + this.cellSize);
    }

    reInitGrid(size){
        this.setCellSize(size);
        this.initGrid();
    }

    setCellSize(size){
        this.cellSize = size;
        this.initGrid();
    }

    clearGrid(){
        for(let cell of this.cellList)
            cell.clearCell();
    }

    getNearbyObject(boundaries){
        let nearbyObjects = [];
        let cell_Id = this.getCellsForObject(boundaries);
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
            let cell_Id = this.getCellsForObject(object.getBoundaries());
            comparison += cell_Id.length;
            for(let id of cell_Id){
                comparison++;
                this.cellList[id].registerGameObject(object);
            }
        }
        return comparison;
    }

    getCellsForObject(boundaries){
        let occupiedCell = [];

        let w = Math.ceil(width / this.cellSize);

        for(let boundary of boundaries){
            this.addCell(boundary, w, occupiedCell);
        }

        return occupiedCell;
    }

    addCell(position, w, listToAdd){
        let id = (Math.floor(position.x / this.cellSize)) 
               + (Math.floor(position.y / this.cellSize) * w);

        if(!listToAdd.includes(id) && id >= 0 && id < this.cellList.length){
                listToAdd.push(id);
        }
    }

    update(GameObjectList){
        let comparison = 0;
        this.clearGrid();
        comparison = this.registerObjectList(GameObjectList);
        return comparison;
    }

    //#region show methods
    showdebug(boundaries){

        this.showEmptyCells();

        this.showNonEmptyCells();

        this.showOccupiedCells(boundaries);

    }

    showEmptyCells(){
        let id = 0;
        for(let cell of this.cellList){
            cell.showEmpty(id);
            id++;
        }
    }

    showNonEmptyCells(){
        let id = 0;
        for(let cell of this.cellList){
            if(cell.objectList.length > 0){
                cell.showNonEmpty(id);
            }
            id++;
        }
    }

    showOccupiedCells(boundaries){
        if(boundaries != null){
            let cell_Id = this.getCellsForObject(boundaries);
            for(let oc of cell_Id){
                let cell = this.cellList[oc];
                cell.showOccupied(oc);
            }
        }
    }
    //#endregion
}

class GridCell{
    static occupiedColor;
    static nonEmptyColor;
    static emptyColor;

    constructor(x,y,size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.objectList = [];
    }

    registerGameObject(GameObject){
        // if(!this.objectList.includes(GameObject))
        this.objectList.push(GameObject);
    }

    clearCell(){
        this.objectList.splice(0,this.objectList.length);
    }

    //#region show methods
    showOccupied(id){
        push();
        stroke(GridCell.occupiedColor);
        fill(GridCell.occupiedColor);
        text(id, this.x, this.y+10);
        noFill();
        strokeWeight(2);
        square(this.x,this.y, this.size);
        pop();
    }

    showEmpty(id){
        push();
        fill(GridCell.emptyColor);
        text(id, this.x, this.y+10);
        stroke(GridCell.emptyColor);
        noFill();
        square(this.x,this.y,this.size);
        pop();
    }

    showNonEmpty(id){
        push();
        fill(GridCell.nonEmptyColor);
        text(id, this.x, this.y+10);
        stroke(GridCell.nonEmptyColor);
        noFill();
        square(this.x,this.y,this.size);
        pop();
    }
    //#endregion
}