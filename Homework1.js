import Maze from './Maze.js';
// import Tile from './Tile.js';

//Initialize canvas from HTML to draw maze on
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");


//will create a new maze object which is initially all blocked, and then use
//DFS backtracking algorithm to generate maze

function generateMaze(rows, cols, tileSize, spacing){
    const maze = new Maze(rows, cols, tileSize, spacing);
    let currentTile = maze.getTile(getRandomInt(rows), getRandomInt(cols));
    currentTile.setExplored();
    let unexploredTiles = (cols * rows) - 1;
    let stack = [];

    while(unexploredTiles > 0){
        let neighborOptions = neighbors(maze,currentTile);
        if(neighborOptions.length > 0){
            //pick random neighbor
            //block it or unblock it and add to stack
            //set to visited and decremend unexplored tiles
            let randomDirection = neighborOptions[getRandomInt(neighborOptions.length)];
            let newRow = currentTile.getRow() + parseInt(randomDirection[0]);
            let newCol = currentTile.getCol() + parseInt(randomDirection[1]);
            currentTile = maze.getTile(newRow, newCol);
            currentTile.setExplored();
            unexploredTiles--;
            if(getRandomInt(10) < 7){
                currentTile.setUnblocked();
                stack.push(currentTile);
            } else {
                currentTile.setBlocked();
            }
        } else if(stack.length > 0){
             //go back up the stack one, set to current node, pop from stack
            currentTile = stack.pop();
           
        } else {
            //find random node and set to current
            //set to visited and decremenet unexplored tiles
            outerloop: for(let i = 0; i < rows; i++){
                for(let j = 0; j < cols; j++){
                    if(!maze.getTile(i,j).getExplore()){
                        currentTile = maze.getTile(i,j);
                        currentTile.setExplored();
                        unexploredTiles--;
                        console.log("new tile", unexploredTiles);
                        break outerloop;
                    }
                }
            }
        }
        drawMaze(maze);

        //pick random neighbor and set to current tile
            //block it or unblock it and add to stack
        //if no neighbore and stack is not empty
            //current tile is set to first on stack, and pop from stack
        // else find a random unvisited tile
            //set to current node
    }
    return maze;
}

function neighbors(maze, tile) {
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


//Display Maze
//  Grey = unexplored (think fog)
//  Black = blocked
//  White = unblocked
function drawMaze(maze){
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
            if(maze.getTile(i,j).explored){
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

//Helper function to generate random integers
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


//Testing
// const maze = generateMaze(10,10,30,1.1);
// drawMaze(maze);
// let tile = maze.getTile(4,8);
// tile.setExplored();
// tile = maze.getTile(5,8);
// tile.setExplored();
// drawMaze(maze);

generateMaze(10,10,30,1.1);