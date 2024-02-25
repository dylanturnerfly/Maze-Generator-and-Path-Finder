class Tile {
    constructor(row, col, explored = false, blocked = false, parent = null, h_value = 0, g_value = 0) {
        this.row = row;
        this.col = col;
        this.explored = explored; //whether is is explored or not
        this.blocked = blocked; //whether it is blocked or not
        this.parent = parent; //pointer to parent tile
        this.h_value = h_value;  //estimated cost from tile to goal
        this.g_value = g_value; //path cost from start to tile
        this.f_value = this.h_value + this.g_value; //h + g, gives estimated cost of the cheapest solution til this tile
        this.start = false;
        this.goal = false;
    }

    //Goal
    setStart(){
        this.start = true;
    }

    setGoal(){
        if(this.start){
            return false;
        } else {
            this.goal = true;
            return true;
        }
        
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

    setValueF(f_value){
        this.f_value = f_value;
    }
}

export default Tile;