import Maze from './Maze.js';

class MazeGenerator {
    constructor(rows,cols,tileSize,spacing,canvas,ctx){
        this.maze = new Maze(rows,cols,tileSize,spacing);
        this.currentTile = this.maze.getTile(this.getRandomInt(rows), this.getRandomInt(cols));
        this.currentTile.setExplored();
        this.currentTile.setCurrent();
        this.unexploredTiles = (this.maze.getCols() * this.maze.getRows()) - 1;
        this.stack = [this.currentTile];
        this.complete = false;
        this.canvas = canvas;
        this.ctx = ctx;
        this.prevDirection = [0,0];
        this.randomprob = 5;
    }

    step(){
        if(this.unexploredTiles > 0){
            let neighborOptions = this.neighbors(this.maze,this.currentTile);
            if(neighborOptions.length > 0){
                //pick random neighbor
                //block it or unblock it and add to stack
                //set to visited and decremend unexplored tiles
                let randomDirection = neighborOptions[this.getRandomInt(neighborOptions.length)];
                this.prevDirection = randomDirection;
                let newRow = this.currentTile.getRow() + parseInt(randomDirection[0]);
                let newCol = this.currentTile.getCol() + parseInt(randomDirection[1]);
                this.currentTile.removeCurrent()
                this.currentTile = this.maze.getTile(newRow, newCol);
                this.currentTile.setCurrent();
                this.currentTile.setExplored();
                this.unexploredTiles--;
                if(this.getRandomInt(10) < 7){
                    this.currentTile.setUnblocked();
                    this.stack.push(this.currentTile);
                } else {
                    this.currentTile.setBlocked();
                    //i honestly forget why this code was here, i think it was related
                    //to removing tiles with all blockes spaces around it. Commenting it out
                    //fixes the error though so leaving this for now. 

                    // if(this.stack.length > 0){
                    //     this.currentTile.removeCurrent();
                    //     this.currentTile = this.stack[this.stack.length-1]
                    //     //this.currentTile.setCurrent();
                    // } else {
                    //     this.currentTile.removeCurrent();
                    //     console.log("1: ", this.currentTile);
                    //     this.currentTile = this.findRandomTile(this.maze);
                    //     console.log("2: ",this.currentTile);
                    //     // this.currentTile.setCurrent();
                    //     this.currentTile.setExplored();
                    //     this.unexploredTiles--;
                    // }
                }
            } else if(this.stack.length > 0){
                 //go back up the stack one, set to current node, pop from stack
                 this.currentTile.removeCurrent();
                 this.currentTile = this.stack.pop();
                 console.log("4: ",this.currentTile);

                 //this.currentTile.setCurrent();
               
            } else {
                //find random node and set to current
                //set to visited and decremenet unexplored tiles
                this.currentTile.removeCurrent();
                this.currentTile = this.findRandomTile(this.maze);
                this.currentTile.setCurrent();
                this.currentTile.setExplored();
                console.log("3: ",this.currentTile);
                this.unexploredTiles--;
            }
            this.drawMaze(this.maze);
            console.log(this.currentTile);
            return false;
        } else {
            console.log("Maze generation complete.");
            this.maze.getGoal().setUnblocked();
            this.maze.getStart().setUnblocked();
            this.currentTile.removeCurrent();
            this.drawMaze(this.maze);
            this.complete = true;
            return true;
        }
    }

    neighbors(maze, tile) {
        let neighbors = [];
        let row = tile.getRow();
        let col = tile.getCol();
    
        //check left neighbor
        if (col > 0 && !maze.getTile(row, col - 1).getExplore()){
            neighbors.push([0, -1]);
            if (this.arraysAreEqual([0,-1], this.prevDirection)) {[0,-1]
                for(let i = 0; i < this.randomprob; i++)
                    neighbors.push([0, -1]);
            }
        }
        //check right neighbor
        if (col < maze.getCols() - 1 && !maze.getTile(row, col + 1).getExplore()) {
            neighbors.push([0, 1]);
            if (this.arraysAreEqual([0,1], this.prevDirection)) {
                for(let i = 0; i < this.randomprob; i++)
                    neighbors.push([0, 1]);
            }
        }
        //check up neighbor
        if (row > 0 && !maze.getTile(row - 1, col).getExplore()){
            neighbors.push([-1, 0]);
            if (this.arraysAreEqual([-1,0], this.prevDirection)) {
                for(let i = 0; i < this.randomprob; i++)
                    neighbors.push([-1, 0]);
            }
        }
        //check down neighbor
        if (row < maze.getRows() - 1 && !maze.getTile(row + 1, col).getExplore()) {
            neighbors.push([1, 0]);
            if (this.arraysAreEqual([1,0], this.prevDirection)) {
                for(let i = 0; i < this.randomprob; i++)
                    neighbors.push([1,0]);
            }
        }
    
        return neighbors;
    }

    findRandomTile(maze){
        for(let i = 0; i < maze.getRows(); i++){
            for(let j = 0; j < maze.getCols(); j++){
                if(!maze.getTile(i,j).getExplore()){
                    if(this.neighbors(maze,maze.getTile(i,j)).length === 0){
                        maze.getTile(i,j).setBlocked();
                        maze.getTile(i,j).setExplored();
                    }
                    return maze.getTile(i,j);
                }
            }
        }
    }

    drawMaze(maze){
        //extract attributes
        let tileSize = maze.getTileSize();
        let spacing = maze.getSpacing();
        let cols = maze.getCols();
        let rows = maze.getRows();
        //setup canvas for custom maze
        this.canvas.setAttribute("width", (tileSize*spacing) * cols)
        this.canvas.setAttribute("height", (tileSize*spacing) * rows)
        //iterate through Maze and draw each tile appropriate color
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                if(maze.getTile(i,j).start){
                    this.ctx.fillStyle = "green";
                } else if(maze.getTile(i,j).goal){
                    this.ctx.fillStyle = "red";
                }else if(maze.getTile(i,j).current){
                    this.ctx.fillStyle = "darkcyan";
                }else if(maze.getTile(i,j).explored){
                    if(maze.getTile(i,j).blocked){
                        this.ctx.fillStyle = "black";
                    } else{
                        this.ctx.fillStyle = "lightgrey";
                    }
                } else {
                    this.ctx.fillStyle = "grey";
                }
                this.ctx.fillRect((spacing*tileSize) * j, (spacing*tileSize) * i, tileSize, tileSize);
            }   
        }
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    arraysAreEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false; 
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false; 
        }
        return true;
    }

    getCompleteMaze(){
        while(!this.complete){
            this.step();
        }
        return this.maze;
    }
}

export default MazeGenerator;