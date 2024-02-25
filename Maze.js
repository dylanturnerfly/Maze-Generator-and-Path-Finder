import Tile from './Tile.js';

class Maze {
    constructor(rows, cols, tileSize, spacing) {
       this.rows = rows;
       this.cols = cols;
       this.tileSize = tileSize;
       this.spacing = spacing;
       this.maze = [];

       for(let i = 0; i < rows; i++){
            this.maze[i] = []; 
            for(let j = 0; j < cols; j++){
                this.maze[i][j] = new Tile(i,j,false, false, null, 0, 0);
            }
        }    
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

    getTile(i,j){
        return this.maze[i][j];
    }
}

export default Maze;