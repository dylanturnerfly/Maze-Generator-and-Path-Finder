import Tile from './Tile.js';

class Maze {
    constructor(rows, cols, tileSize, spacing) {
        this.rows = rows;
        this.cols = cols;
        this.tileSize = tileSize;
        this.spacing = spacing;
        this.maze = [];
    
        //initialize empty tiles
        for(let i = 0; i < rows; i++){
            this.maze[i] = []; 
            for(let j = 0; j < cols; j++){
                this.maze[i][j] = new Tile(i,j,false, false, null, 0, 0);
            }
        }    

        //now that the maze is initialized, set start and goal
        this.start = this.getTile(getRandomInt(rows), getRandomInt(cols));
        let goalRow, goalCol;
        do {
            goalRow = getRandomInt(rows);
            goalCol = getRandomInt(cols);
        } while (goalRow === this.start.row && goalCol === this.start.col);
        
        this.goal = this.getTile(goalRow, goalCol);
        this.start.setStart();
        this.goal.setGoal();


        //initialize h_values
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                // Calculate Manhattan distance from each tile to the goal
                this.maze[i][j].h_value = Math.abs(i - goalRow) + Math.abs(j - goalCol);
            }
        }
        //initialize start g_value
        this.start.setValueG(0);
    }

    getCols() {
        return this.cols;
    }

    getRows() {
        return this.rows;
    }

    getTileSize() {
        return this.tileSize;
    }

    getSpacing() {
        return this.spacing;
    }

    getTile(i,j) {
        //check if i is within the bounds of the rows and j is within the bounds of the columns
        if (i >= 0 && i < this.rows && j >= 0 && j < this.cols) {
            return this.maze[i][j];
        } else {
            return null;
        }
    }

    getStart(){
        return this.start;
   }

    getGoal(){
        return this.goal;
    }
}

//helper function to generate random integers
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default Maze;