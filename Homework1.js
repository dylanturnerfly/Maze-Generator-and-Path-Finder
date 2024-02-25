import MazeGenerator from './MazeGenerator.js';
import MazeSolver from './MazeSolver.js';

let storedMazes = [];
let solvedMazes = [];

function generateMazes() {
    const container = document.getElementById('maze-container');
    container.innerHTML = ''; 
    storedMazes = [];
    solvedMazes = [];
    let attempts = 0;
    const mazeSize = 10; //size of maze
    const maxMazes = 50; //amount of mazes to create
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
            console.log(`Maze ${attempts + 1} is unsolvable, generating new maze.`);
        }
        attempts++;
    }
}



function solveAndDisplayMazes(type) {
    //clear previous content
    const container = document.getElementById('maze-container');
    container.innerHTML = ''; 
    solvedMazes = [];

    //solve mazes and store each solution.
    storedMazes.forEach((item, index) => {
        const canvasSolved = document.createElement('canvas');
        canvasSolved.width = 200;
        canvasSolved.height = 200;
        const ctxSolved = canvasSolved.getContext('2d');

        //solve the maze
        const mazeSolver = new MazeSolver(item.maze, canvasSolved, ctxSolved,type);
        mazeSolver.getCompleteSolution();

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
        mazeInfo.innerHTML = `<strong>Total Tiles Explored: ${mazeSolver.totalExplored}</strong>`;
        pairContainer.appendChild(mazeInfo);

        //add the pair container to the main container
        container.appendChild(pairContainer);
    });
}



//button to regenerate maze
document.getElementById('generateButton').addEventListener('click', generateMazes);

//solve with tiebreaking by choosing lower g value
document.getElementById('solveMaze1').addEventListener('click', function() {
    solveAndDisplayMazes(0);
});

//solve with tiebreaking by choosing higher g value
document.getElementById('solveMaze2').addEventListener('click', function() {
    solveAndDisplayMazes(1);
});

document.getElementById('solveMaze3').addEventListener('click', solveAndDisplayMazes);








//------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------//

                                //Generating a Single Maze

// //Initialize canvas from HTML to draw maze on
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById("solutionCanvas");
const ctx2 = canvas2.getContext("2d");


// For testing step by step
var maze_to_test = new MazeGenerator(10,10,30,1.1,canvas,ctx).getCompleteMaze();
console.log("Generated Maze: \n", maze_to_test);

var maze_to_solve = new MazeSolver(maze_to_test,canvas2,ctx2);
console.log("Solved Maze: \n", maze_to_solve);

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('generateStep').addEventListener('click', function() {
        console.log("Step Generation");
        maze_to_test.step();
    });

    document.getElementById('generateFull').addEventListener('click', function() {
        var intervalId = setInterval(function() {
            console.log("Complete Generation");
            if(maze_to_test.step()) {
                clearInterval(intervalId);
            }
        }, 50); 
    });

    document.getElementById('generateStep2').addEventListener('click', function() {
        console.log("Step Solve");
        maze_to_solve.step();
    });

    document.getElementById('generateFull2').addEventListener('click', function() {
        var intervalId = setInterval(function() {
            console.log("Complete Solve");
            if(maze_to_solve.step()) {
                clearInterval(intervalId);
            }
        }, 50); 
    });
});




// function generateAndSolveMazes() {
    //     const container = document.getElementById('maze-container');
    //     container.innerHTML = ''; // Clear previous mazes if any
    
    //     let solvedCount = 0;
    //     let attempts = 0; // Tracks the number of attempts
    
    //     // Define a safe number to prevent infinite loops
    //     const mazes = 50;
    //     const someSafeNumber = 1000; 
    
    //     while (solvedCount < mazes) {
    //         // Generate the maze
    //         const canvasGenerated = document.createElement('canvas');
    //         canvasGenerated.width = 200; // Set your desired width
    //         canvasGenerated.height = 200; // Set your desired height
    //         const ctxGenerated = canvasGenerated.getContext('2d');
    //         const mazeGenerator = new MazeGenerator(10, 10, 30, 1.1, canvasGenerated, ctxGenerated);
    //         const maze = mazeGenerator.getCompleteMaze();
    //         console.log(`Generated Maze Attempt: ${attempts + 1}`);
    
    //         // Solve the maze
    //         const canvasSolved = document.createElement('canvas');
    //         canvasSolved.width = 200; // Set your desired width
    //         canvasSolved.height = 200; // Set your desired height
    //         const ctxSolved = canvasSolved.getContext('2d');
    //         const mazeSolver = new MazeSolver(maze, canvasSolved, ctxSolved);
    //         const solvedMaze = mazeSolver.getCompleteSolution();
    
    //         if (solvedMaze !== -1) {
    //             solvedCount++;
    //             console.log(`Solved Maze ${solvedCount}: `, solvedMaze);
    
    //             // Create a container for the pair of canvases
    //             const pairContainer = document.createElement('div');
    //             pairContainer.classList.add('maze-pair');
    
    //             // Create a header for the maze number and status
    //             const mazeHeader = document.createElement('h1');
    //             mazeHeader.textContent = `Maze ${solvedCount} - Solved`;
    //             pairContainer.appendChild(mazeHeader);
    
    //             // Append both canvases to the pair container
    //             pairContainer.appendChild(canvasGenerated);
    //             pairContainer.appendChild(canvasSolved);
    
    //             // Append the pair container to the main container
    //             container.appendChild(pairContainer);
    //         } else {
    //             console.log(`Maze Attempt: ${attempts + 1} is unsolvable`);
    //         }
    //     }
    // }

    // Trigger the function with a button click
// document.getElementById('generateButton').addEventListener('click', generateAndSolveMazes);