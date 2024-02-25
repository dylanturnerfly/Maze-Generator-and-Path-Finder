import Maze from './Maze.js';
// import Tile from './Tile.js';

//Initialize canvas from HTML to draw maze on
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");


function generateMaze(rows, cols, tileSize, spacing){
    const maze = new Maze(rows, cols, tileSize, spacing);
    let currentTile = maze.getTile(getRandomInt(rows), getRandomInt(cols));
    currentTile.setExplored();
    let unexploredTiles = (cols * rows) - 3;
    let stack = [currentTile];
    
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
                if(stack.length > 0){
                    currentTile = stack[stack.length-1]
                } else {
                    currentTile = findRandomTile(maze);
                    currentTile.setExplored();
                    unexploredTiles--;
                }
            }
        } else if(stack.length > 0){
             //go back up the stack one, set to current node, pop from stack
            currentTile = stack.pop();
           
        } else {
            //find random node and set to current
            //set to visited and decremenet unexplored tiles
            currentTile = findRandomTile(maze);
            currentTile.setExplored();
            unexploredTiles--;
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

function findRandomTile(maze){
    for(let i = 0; i < maze.getRows(); i++){
        for(let j = 0; j < maze.getCols(); j++){
            if(!maze.getTile(i,j).getExplore()){
                if(neighbors(maze,maze.getTile(i,j)).length === 0){
                    maze.getTile(i,j).setBlocked();
                    maze.getTile(i,j).setExplored();
                }
                return maze.getTile(i,j);
            }
        }
    }
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
            if(maze.getTile(i,j).start){
                ctx.fillStyle = "green";
            } else if(maze.getTile(i,j).goal){
                ctx.fillStyle = "red";
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

//Helper function to generate random integers
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

generateMaze(10,10,50,1);