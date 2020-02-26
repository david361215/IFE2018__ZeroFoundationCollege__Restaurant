function Seat(id){
    this.id = id;
    this.state = false;  // false表示无人就座，删除座位时会用到，以及判断座位是否空闲会用到
    this.menu = [];
    this.cash = 0;
}

Seat.prototype.reset = function(){
    this.state = false;
    this.customer = null;
    this.menu = [];
    this.cash = 0;
}