import Maze from './Maze.js';
// import Tile from './Tile.js';

//Initialize canvas from HTML to draw maze on
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

class MazeGenerator {
    constructor(maze) {
        this.maze = maze;
        this.currentTile = maze.getTile(this.getRandomInt(maze.getRows()), this.getRandomInt(maze.getCols()));
        this.currentTile.setExplored();
        this.currentTile.setCurrent();
        this.unexploredTiles = (maze.getCols() * maze.getRows()) - 3;
        this.stack = [this.currentTile];
    }

    step(){
        // console.log(this.currentTile);
        // console.log(this.maze);
        // console.log(this.getRandomInt(maze.getRows()));
        if(this.unexploredTiles > 0){
            let neighborOptions = this.neighbors(this.maze,this.currentTile);
            if(neighborOptions.length > 0){
                //pick random neighbor
                //block it or unblock it and add to stack
                //set to visited and decremend unexplored tiles
                let randomDirection = neighborOptions[this.getRandomInt(neighborOptions.length)];
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
                    if(this.stack.length > 0){
                        this.currentTile.removeCurrent();
                        this.currentTile = this.stack[this.stack.length-1]
                        this.currentTile.setCurrent();
                    } else {
                        this.currentTile.removeCurrent();
                        this.currentTile = this.findRandomTile(this.maze);
                        this.currentTile.setCurrent();
                        this.currentTile.setExplored();
                        this.unexploredTiles--;
                    }
                }
            } else if(this.stack.length > 0){
                 //go back up the stack one, set to current node, pop from stack
                 this.currentTile.removeCurrent();
                 this.currentTile = this.stack.pop();
                 this.currentTile.setCurrent();
               
            } else {
                //find random node and set to current
                //set to visited and decremenet unexplored tiles
                this.currentTile.removeCurrent();
                this.currentTile = this.findRandomTile(this.maze);
                this.currentTile.setCurrent();
                this.currentTile.setExplored();
                this.unexploredTiles--;
            }
            this.drawMaze(this.maze);
            return false;
        } else {
            console.log("Maze generation complete.");
            this.currentTile.removeCurrent();
            this.drawMaze(this.maze);
            return true;
        }
    }

    neighbors(maze, tile) {
        let neighbors = [];
        let row = tile.getRow();
        let col = tile.getCol();
    
        //check left neighbor
        if (col > 0 && !maze.getTile(row, col - 1).getExplore())
            neighbors.push([0, -1]);
        //check right neighbor
        if (col < maze.getCols() - 1 && !maze.getTile(row, col + 1).getExplore()) 
            neighbors.push([0, 1]);
        //check up neighbor
        if (row > 0 && !maze.getTile(row - 1, col).getExplore())
            neighbors.push([-1, 0]);
        //check down neighbor
        if (row < maze.getRows() - 1 && !maze.getTile(row + 1, col).getExplore()) 
            neighbors.push([1, 0]);
    
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
        //Extract attributes
        let tileSize = maze.getTileSize();
        let spacing = maze.getSpacing();
        let cols = maze.getCols();
        let rows = maze.getRows();
        //Setup canvas for custom maze
        canvas.setAttribute("width", (tileSize*spacing) * cols)
        canvas.setAttribute("height", (tileSize*spacing) * rows)
        //Iterate through Maze and draw each tile appropriate color
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                if(maze.getTile(i,j).start){
                    ctx.fillStyle = "green";
                } else if(maze.getTile(i,j).goal){
                    ctx.fillStyle = "red";
                }else if(maze.getTile(i,j).current){
                        ctx.fillStyle = "darkcyan";
                }else if(maze.getTile(i,j).explored){
                    if(maze.getTile(i,j).blocked){
                        ctx.fillStyle = "black";
                    } else{
                        ctx.fillStyle = "lightgrey";
                    }
                } else {
                    ctx.fillStyle = "grey";
                }
                ctx.fillRect((spacing*tileSize) * j, (spacing*tileSize) * i, tileSize, tileSize);
            }   
        }
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}


var maze = new Maze(10,10,30,1);
var generator = new MazeGenerator(maze);

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('generateStep').addEventListener('click', function() {
        generator.step();
    });

    document.getElementById('generateFull').addEventListener('click', function() {
        var intervalId = setInterval(function() {
            if(generator.step()) {
                clearInterval(intervalId);
            }
        }, 50); 
    });
});
