class AdaptiveMazeSolver{
    constructor(maze, canvas, ctx, Gtype = 0, goalSwap = 0){
        this.maze = maze;
        this.openList = []; //set of nodes to be evaluated
        this.openList.push(this.maze.getStart()); 
        this.closedList = []; //set of nodes already evaluated
        this.destinationFound = false;
        this.currentTile = null;
        this.canvas = canvas;
        this.ctx = ctx;
        this.solution = [];
        this.Gtype = Gtype;
        this.totalExplored = 0;
        this.goalSwap = goalSwap;
    }

   
    step(){
        if(!this.destinationFound){
            if(this.openList.length == 0){
                console.log("No possible solution");
                this.destinationFound = true;
                return -1;
            } 
            //set current tile to lowest f_cost and move to openlist
            // console.log("Open List:", this.openList);
            this.currentTile = this.lowestCostF(this.openList); 
            this.currentTile.setValueF();
            // console.log("Current Tile:", this.currentTile);
            this.closedList.push(this.openList.shift()); 
            //did we find the goal?
            if(this.currentTile.isGoal()){
                console.log("Path has been found");
                this.destinationFound = true;
                this.finalizePath();
                // console.log(this.closedList);
                this.totalExplored = Math.floor(this.closedList.length / 2);
                this.adaptive();
                return this.maze;
            } else {
                this.closedList.push(this.currentTile);
            }

            //calculate neighbor values
            let currentRow = this.currentTile.getRow();
            let currentCol = this.currentTile.getCol();
            let directions = [//relative positions of the adjacent tiles
                { row: -1, col: 0 }, //above
                { row: 1, col: 0 },  //below
                { row: 0, col: -1 }, //left
                { row: 0, col: 1 }   //right
            ];
            for (let i = 0; i < directions.length; i++) { //loop through each neighbor position
                let dir = directions[i];
                let neighborTile = this.maze.getTile(currentRow + dir.row, currentCol + dir.col);
                //console.log("Neighbor Tile", neighborTile);

                //check if the neighbor tile is traversable and not in the closed list
                if (neighborTile && !neighborTile.getBlock() && !this.closedList.includes(neighborTile)) {
                    //check if a new path to the neighbor is shorter or the neighbor is not in the open list
                    if (neighborTile.getValueG() < this.currentTile.getValueG() || !this.openList.includes(neighborTile)) {
                        neighborTile.setValueG(this.currentTile.getValueG() + 1); //update g value since shorter path was found
                        neighborTile.setValueF(); //recalculate f value, assuming setValueF calculates based on new g value and heuristic
                        neighborTile.setParent(this.currentTile); //set the current tile as the parent of the neighbor
                    }
                    
                    //if the neighbor is not in the open list, add it to the open list
                    if (!this.openList.includes(neighborTile)) {
                        this.openList.push(neighborTile);
                    }
                }
            }
            this.drawSolution();
        }
    }

    adaptive(){
        let current = this.currentTile; //should be the goal tile
        let realCost = 0;
        // console.log(current, "start current tile ");
        while (current !== null) { //keep going until you reach the start
            realCost++;
            current.setValueH(realCost); //update its h value
            current = current.getParent(); //move to the parent tile
            // console.log(current, "parent");
        }
    }

    lowestCostF(openList) {
        //sort the openList by f_value primarily, then by g_value
        openList.sort((a, b) => {
            if (a.getValueF() === b.getValueF()) {
                if(this.Gtype == 0){
                    //sort g_value in descending order to favor paths closer to the goal
                    return b.getValueG() - a.getValueG();
                } else {
                   //sort g_value in descending order to favor paths farther from the goal
                    return a.getValueG() - b.getValueG();
                }
            }
            //primary sorting by f_value in ascending order
            return a.getValueF() - b.getValueF();
        });
    
        return openList[0];
    }
    


    drawSolution(maze){
        //extract attributes
        let tileSize = this.maze.getTileSize();
        let spacing = this.maze.getSpacing();
        let cols = this.maze.getCols();
        let rows = this.maze.getRows();
        //setup canvas for custom maze
        this.canvas.setAttribute("width", (tileSize*spacing) * cols)
        this.canvas.setAttribute("height", (tileSize*spacing) * rows)
        //iterate through maze and draw each tile appropriate color
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                if(this.maze.getTile(i,j).start){
                    this.ctx.fillStyle = "green";
                } else if(this.maze.getTile(i,j).goal){
                    this.ctx.fillStyle = "red";
                } else if(this.maze.getTile(i,j).solution){
                    this.ctx.fillStyle = "gold";
                } else if(this.openList.includes(this.maze.getTile(i,j))){
                    this.ctx.fillStyle = "lightgreen";
                } else if(this.maze.getTile(i,j).blocked){
                    this.ctx.fillStyle = "black";
                } else if(this.closedList.includes(this.maze.getTile(i,j))){
                    this.ctx.fillStyle = "lightblue";
                } else {
                    this.ctx.fillStyle = "lightgrey";
                }
                this.ctx.fillRect((spacing*tileSize) * j, (spacing*tileSize) * i, tileSize, tileSize);
            }   
        }
    }

    getCompleteSolution(){
        while(!this.destinationFound){
            if(this.step() === -1){
                return -1;
            }
        }
        return this.maze;
    }

    finalizePath() {
        let current = this.currentTile; //start from the goal
        // console.log(current, "start current tile ");
        while (current !== null) { //keep going until you reach the start
            current.setSolution(); //mark the tile as part of the solution
            current = current.getParent(); //move to the parent tile
            // console.log(current, "parent");
        }
        this.drawSolution();
    }

    getTotalExplored(){
        return this.totalExplored;
    }
}

export default AdaptiveMazeSolver;