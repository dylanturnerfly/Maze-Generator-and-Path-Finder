import MazeGenerator from './MazeGenerator.js';
import MazeSolver from './MazeSolver.js';

////----------/////----------////-----------//////----------/////

////----------/////----------////-----------//////----------/////
                    //Generating 50 Mazes
////----------/////----------////-----------//////----------/////

let storedMazes = [];
let solvedMazes = [];

function generateMazes() {
    const container = document.getElementById('maze-container');
    container.innerHTML = ''; 
    storedMazes = [];
    solvedMazes = [];
    let attempts = 0;
    const mazeSize = 25; //size of maze
    const maxMazes =300; //amount of mazes to create
    const maxAttempts = 1000; //prevent infinite loop

    //loop until enouge solvable mazes are generated
    while (storedMazes.length < maxMazes && attempts < maxAttempts) {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        const mazeGenerator = new MazeGenerator(mazeSize, mazeSize, 30, 1.1, canvas, ctx);
        const maze = mazeGenerator.getCompleteMaze();
        
        //check if solvable
        const canvasSolved = document.createElement('canvas');
        canvasSolved.width = 200;
        canvasSolved.height = 200;
        const ctxSolved = canvasSolved.getContext('2d');
        const mazeSolver = new MazeSolver(maze, canvasSolved, ctxSolved);
        const solved = mazeSolver.getCompleteSolution();

        if (solved !== -1) {
            //store the maze and its canvas if solvable
            storedMazes.push({ maze: maze, canvas: canvas, ctx: ctx });
        } else {
            // console.log(`Maze ${attempts + 1} is unsolvable, generating new maze.`);
        }
        attempts++;
    }
}

function solveAndDisplayMazes(Gtype) {
    //clear previous content
    const container = document.getElementById('maze-container');
    container.innerHTML = ''; 
    solvedMazes = [];
    let totalTileExplored = 0;
    recalculateMaze();

    //solve mazes and store each solution.
    storedMazes.forEach((item, index) => {
        const canvasSolved = document.createElement('canvas');
        canvasSolved.width = 200;
        canvasSolved.height = 200;
        const ctxSolved = canvasSolved.getContext('2d');

        //solve the maze
        const mazeSolver = new MazeSolver(item.maze, canvasSolved, ctxSolved,Gtype);
        mazeSolver.getCompleteSolution();
        totalTileExplored += mazeSolver.totalExplored;
        console.log(mazeSolver.totalExplored);

        //store the solved maze
        solvedMazes.push({ index: index, canvas: canvasSolved, ctx: ctxSolved });

        //create a new pair container for each pair of mazes
        const pairContainer = document.createElement('div');
        pairContainer.classList.add('maze-pair');
        
        //create and add a header for each maze pair
        const mazeHeader = document.createElement('h2');
        mazeHeader.textContent = `Maze ${index + 1}`;
        pairContainer.appendChild(mazeHeader);

        //add the original and solved mazes to the pair container
        pairContainer.appendChild(item.canvas); //original
        pairContainer.appendChild(canvasSolved); // solved

        //display total tiles explored beneath each pair
        const mazeInfo = document.createElement('p');
        mazeInfo.innerHTML = `<h2>Total Tiles Explored: ${mazeSolver.totalExplored}</h2>`;
        pairContainer.appendChild(mazeInfo);

        //add the pair container to the main container
        container.appendChild(pairContainer);
    });
    console.log("Average Tiles Explored", Math.ceil(totalTileExplored / solvedMazes.length));
}


//removes all parents and resets h value in the stored mazes
function recalculateMaze() {
    console.log("\n---\n Recalculated H and Reset Parents!\n---\n")

    for (let i = 0; i < storedMazes.length; i++) {
        for (let j = 0; j < storedMazes[i].maze.getRows(); j++) {
            for (let k = 0; k < storedMazes[i].maze.getCols(); k++) {
                storedMazes[i].maze.getTile(j, k).removeSolution();
                storedMazes[i].maze.getTile(j, k).setParent(null);
                storedMazes[i].maze.getTile(j, k).setValueH(Math.abs(j - storedMazes[i].maze.getGoal().getRow()) + Math.abs(k - storedMazes[i].maze.getGoal().getCol()));
            }
        }
    }
}

//flips start and goal tile
function flipMazes(){
    console.log("\n---\n Flipped Maze! \n---\n")
    for (let i = 0; i < storedMazes.length; i++) {
        let prevGoal =  storedMazes[i].maze.getGoal();
        let prevStart =  storedMazes[i].maze.getStart();

        //set goal tile in maze to start tile
        //set start tile in maze to goal tile
        storedMazes[i].maze.setGoal(prevStart);
        storedMazes[i].maze.setStart(prevGoal);

        //set goal tile type to start 
        //set start tile type to goal
        prevGoal.setStart();
        prevStart.forceGoal();
    }
}

// function updateAverageTilesExplored() {
//     let totalExplored = 0;
//     solvedMazes.forEach(solvedMaze => {
//         totalExplored += solvedMaze.mazeSolver.getTotalExplored();
//     });
//     const averageExplored = totalExplored / solvedMazes.length;
//     document.getElementById('avgTiles').textContent = averageExplored.toFixed(2);
// }


//button to regenerate maze
document.getElementById('generateButton').addEventListener('click', generateMazes);

//button to flip start and goal tiles
document.getElementById('flipButton').addEventListener('click', flipMazes);

//solve with tiebreaking by choosing lower g value
document.getElementById('solveMaze1').addEventListener('click', function() {
    solveAndDisplayMazes(0);
});

//solve with tiebreaking by choosing higher g value
document.getElementById('solveMaze2').addEventListener('click', function() {
    solveAndDisplayMazes(1);
});

////----------/////----------////-----------//////----------/////
                    //50 Maze Display Above
////----------/////----------////-----------//////----------/////
                    //Maze Generator Below
////----------/////----------////-----------//////----------/////

document.addEventListener('DOMContentLoaded', (event) => {
    
    //INITIALIZE VALUES
    const canvas = document.getElementById("mazeCanvas"); 
    const ctx = canvas.getContext("2d");
    var maze_to_test = new MazeGenerator(25,25,30,1.1,canvas,ctx); //initialize the first maze
    maze_to_test.step();    //step once to display maze on screen
    let finished1 = false; //whether or not maze is finished generating
    let autoGenerate = false; //whether to auto generate maze
    let solved1 = false; //whether maze has been solved
    var maze_to_solve; //initialize maze to solve
    let adaptive = false; //whether to use adaptive algorithm or not
    let favorHigherG = false; //whether to tie break with higher or lower g value.

    //NEW MAZE
    document.getElementById('regenerateSingle').addEventListener('click', function() {
        console.log("Created New Maze");
        if(autoGenerate){
            maze_to_test = new MazeGenerator(25,25,30,1.1,canvas,ctx); //create new maze, auto generate it
            maze_to_test.getCompleteMaze();
            finished1 = true;
            maze_to_solve = new MazeSolver(maze_to_test.maze, canvas, ctx, favorHigherG, adaptive); //instantiate maze solver now that maze is generated
        } else{
            maze_to_test = new MazeGenerator(25,25,30,1.1,canvas,ctx); //create new maze
            maze_to_test.step(); //step once so it displays maze
            finished1 = false; //reset finished variable
        }   
        solved1 = false;
    });

    //SINGLE STEP
    document.getElementById('generateStep').addEventListener('click', function() {
        if(!finished1){ //dont continue if already finished
            if(maze_to_test.step()){ //maze returns true is finished
                finished1 = true;
            } else{
                console.log("Single Maze Generation Step");
            }
        } else {
            console.log("Already fully generated.");
        }
    });

    //FAST FORWARD
    document.getElementById('generateFull').addEventListener('click', function() {
        if(!finished1){ //dont continue if already finished
            console.log("Fast Fowarding");
            var intervalId = setInterval(function() {
                if(maze_to_test.step()) { //maze returns true is finished
                    clearInterval(intervalId); //exit loop
                    maze_to_test.getCompleteMaze() 
                    finished1 = true;
                    maze_to_solve = new MazeSolver(maze_to_test.maze, canvas, ctx, favorHigherG, adaptive); //instantiate maze solver now that maze is generated
                }
            }, 50); 
        } else {
            console.log("Already fully generated.");
        }
    });

    //INSTANT GENERATE
    document.getElementById('generateInstant').addEventListener('click', function() {
        if(!finished1){ //dont continue if already finished
            console.log("Skipped Generation");
            maze_to_test.getCompleteMaze()
            finished1 = true;
            maze_to_solve = new MazeSolver(maze_to_test.maze, canvas, ctx, favorHigherG, adaptive); //instantiate maze solver now that maze is generated
        } else {
            console.log("Already fully generated.");
        }
    });

    //AUTO GENERATE CHECKBOX
    var myCheckbox = document.getElementById('autoGenerateCheckbox');
    myCheckbox.addEventListener('change', function() {
        if(myCheckbox.checked) {
            console.log("Auto Generate ON")
            autoGenerate = true;
        } else {
            console.log("Auto Generate OFF")
            autoGenerate = false;
        }
    });

////----------/////----------////-----------//////----------/////
                    //Maze Generator Below
////----------/////----------////-----------//////----------/////
                    //Maze Solver Below
////----------/////----------////-----------//////----------/////

    //UNSOLVE
    document.getElementById('unsolve').addEventListener('click', function() {
        unSolve();
    });

    function unSolve(){
        if (finished1) { //check if maze_to_solve has been initialized
            console.log("Unsolving Maze.");
            for (let i = 0; i < maze_to_solve.maze.getRows(); i++) {
                for (let j = 0; j < maze_to_solve.maze.getCols(); j++) {
                    maze_to_solve.maze.getTile(i, j).removeSolution();
                    maze_to_solve.maze.getTile(i, j).setParent(null);
                    if(!adaptive){
                        maze_to_solve.maze.getTile(i, j).setValueH(Math.abs(i - maze_to_solve.maze.getGoal().getRow()) + Math.abs(j - maze_to_solve.maze.getGoal().getCol()));
                    }
                }
            }
            maze_to_solve.openList = [];
            maze_to_solve.openList.push(maze_to_solve.maze.getStart());
            maze_to_solve.closedList = []; 
            maze_to_solve.destinationFound = false; 
            maze_to_solve.totalExplored = 0; 
            solved1 = false;
            maze_to_solve.drawSolution();
        } else {
            console.log("Maze has not been generated.");
        }
    }
    
    //SWAP GOAL AND START
    document.getElementById('swapGoal').addEventListener('click', function() {
        if (finished1 && !solved1) { //check if maze_to_solve has been initialized
            console.log("Swap Goal");
            let prevGoal =  maze_to_solve.maze.getGoal();
            let prevStart =  maze_to_solve.maze.getStart();

            //set goal tile in maze to start tile
            //set start tile in maze to goal tile
            maze_to_solve.maze.setGoal(prevStart);
            maze_to_solve.maze.setStart(prevGoal);

            //set goal tile type to start 
            //set start tile type to goal
            prevGoal.setStart();
            prevStart.forceGoal();
            for (let i = 0; i < maze_to_solve.maze.getRows(); i++) {
                for (let j = 0; j < maze_to_solve.maze.getCols(); j++) {
                    maze_to_solve.maze.getTile(i, j).removeSolution();
                    maze_to_solve.maze.getTile(i, j).setParent(null);
                    maze_to_solve.maze.getTile(i, j).setValueH(Math.abs(i - maze_to_solve.maze.getGoal().getRow()) + Math.abs(j - maze_to_solve.maze.getGoal().getCol()));
                }
            }
            maze_to_solve = new MazeSolver(maze_to_test.maze, canvas, ctx, favorHigherG, adaptive); //instantiate maze solver now that maze is generated
            maze_to_solve.drawSolution();
        } else {
            if(!finished1){
                console.log("Maze has not been generated.");
            } else {
                console.log("Maze has already been solved.");
            }
        }
    });

    //SINGLE STEP
    document.getElementById('generateStep2').addEventListener('click', function() {
        if (finished1 && !solved1) { //check if maze_to_solve has been initialized
            console.log("Step Solve");
            if(maze_to_solve.step()){
                solved1 = true;
            }
        } else {
            if(!finished1){
                console.log("Maze has not been generated.");
            } else {
                console.log("Maze has already been solved.");
            }
        }
    });
    
    //FAST FORWARD
    document.getElementById('generateFull2').addEventListener('click', function() {
        if(adaptive){
            unSolve();
        }
        if (finished1 && !solved1) { //check if maze_to_solve has been initialized
            var intervalId = setInterval(function() {
                console.log("Complete Solve");
                if(maze_to_solve.step() || solved1) {
                    clearInterval(intervalId);
                    solved1 = true;
                }
            }, 50); 
        } else {
            if(!finished1){
                console.log("Maze has not been generated.");
            } else {
                console.log("Maze has already been solved.");
            }
        }
    });


    //INSTANT SOLVE
    document.getElementById('instantSolve').addEventListener('click', function() {
        if(adaptive){
            unSolve();
        }
        if (finished1 && !solved1) { //check if maze_to_solve has been initialized
            var intervalId = setInterval(function() {
                clearInterval(intervalId);
                maze_to_solve.getCompleteSolution();
                console.log("Instant Solve");   
                solved1 = true;
            }, 50); 
        } else {
            if(!finished1){
                console.log("Maze has not been generated.");
            } else {
                console.log("Maze has already been solved.");
            }
        }
    });

    //ADAPTIVE HEURISTIC CHECKBOX
    var adaptiveCheckbox = document.getElementById('adaptiveCheckbox');
    adaptiveCheckbox.addEventListener('change', function() {
        if(adaptiveCheckbox.checked) {
            console.log("Adaptive Search ON")
            adaptive = true;
        } else {
            console.log("Adaptive Search OFF")
            adaptive = false;
        }
    });

    //FAVORING G CHECKBOX
    var higherG = document.getElementById('higherG');
    higherG.addEventListener('change', function() {
        if(higherG.checked) {
            console.log("Favor Higher G Values")
            favorHigherG = true;
        } else {
            console.log("Favor Lower G Values")
            favorHigherG = false;
        }
    });
});

////----------/////----------////-----------//////----------/////

////----------/////----------////-----------//////----------/////

////----------/////----------////-----------//////----------/////