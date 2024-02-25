import MazeGenerator from './MazeGenerator.js';

//Initialize canvas from HTML to draw maze on
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

var generator = new MazeGenerator(10,10,30,1,canvas,ctx).getCompleteMaze()
console.log(generator);




//needs to return true if solved, false if impossible
//then simply loop through until solvedMazes == 50
//generate maze -> solve maze -> display it -> continue until 50 solves
function A_Star(maze){

}



//For testing maze generation step by step
var maze_to_test = new MazeGenerator(10,10,30,1,canvas,ctx);

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('generateStep').addEventListener('click', function() {
        maze_to_test.step();
    });

    document.getElementById('generateFull').addEventListener('click', function() {
        var intervalId = setInterval(function() {
            if(maze_to_test.step()) {
                clearInterval(intervalId);
            }
        }, 50); 
    });
});