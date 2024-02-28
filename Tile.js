class Tile {
    constructor(row, col, explored = false, blocked = false, parent = null, h_value = 0, g_value = 0) {
        this.row = row;
        this.col = col;
        this.explored = explored; //whether is is explored or not
        this.blocked = blocked; //whether it is blocked or not
        this.parent = parent; //pointer to parent tile
        this.h_value = null;  //estimated cost from tile to goal
        this.g_value = null; //path cost from start to tile
        this.f_value = null; //h + g, gives estimated cost of the cheapest solution til this tile
        this.start = false;
        this.goal = false;
        this.current = false;
        this.solution = false;
    }

    //Special Colors
    setStart(){
        this.start = true;
        this.goal = false;
        // this.explored = true;
    }

    setGoal(){
        if(this.start){
            return false;
        } else {
            this.goal = true;
            // this.explored = true;
            return true;
        }
    }

    forceGoal(){
        this.goal = true;
        this.start = false;
    }

    isGoal(){
        return this.goal;
    }

    setCurrent(){
        this.current = true;
    }

    removeCurrent(){
        this.current = false;
    }

    //Coordinates
    getRow(){
        return this.row;
    }

    getCol(){
        return this.col;
    }

    //Exploration 
    setExplored() {
        this.explored = true;
    }

    setUnexplored() {
        this.explored = false;
    }

    getExplore(){
        return this.explored;
    }

    //Block
    setBlocked() {
        this.blocked = true;
    }

    setUnblocked() {
        this.blocked = false;
    }

    getBlock(){
        return this.blocked;
    }

    //Parent
    getParent(){
        return this.parent;
    }

    setParent(parent){
        this.parent = parent;
    }

    //h value
    getValueH(){
        return this.h_value;
    }

    setValueH(h_value){
        this.h_value = h_value;
    }

    //g value
    getValueG(){
        return this.g_value;
    }

    setValueG(g_value){
        this.g_value = g_value;
    }

    //f value
    getValueF(){
        return this.f_value;
    }

    setValueF(){
        this.f_value = this.g_value + this.h_value;
    }

    setSolution(){
        this.solution = true;
    }

    removeSolution(){
        this.solution = false;
    }
}

export default Tile;