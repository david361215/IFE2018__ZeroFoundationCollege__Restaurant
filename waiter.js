// 服务员类
function Waiter(id){
    this.id = id;     // 既是对象的id，也是服务员图片的id
    this.restaurant = null;  // 标明服务员属于哪个餐厅，服务员将菜品数组交给厨房，需要调用餐厅的handleMenu方法，因此需要保存餐厅对象
    this.state = false;  // false表示休息中，这个属性在删除服务员对象时会用到。默认删除数组中最后一个服务员，需要这个服务员处于空闲状态，因此需要一个状态属性
    this.orderMenu = [];
    this.orderSeatId = "";
    this.serveCuisine = null;
}
// 服务员受理点菜，执行一个动画，去顾客旁边。
// 0.5秒后，服务员来到顾客边，自身的orderMenu属性和orderSeatId属性获得属性值。开启下一个动画，去厨房。
// 又过0.5秒，顾客来到厨房边，将菜单和桌子编号告知厨房。清空自身这两个属性，重新订阅这个服务员。
// 没有对seat对象做任何改动。
// 对于waiter对象，最终仅仅是将它重新订阅。
Waiter.prototype.acceptOrder = function(seat){
    let waiterImg = document.querySelector("#" + this.id);
    waiterImg.style.animation = "toCustomer 0.5s linear forwards";
    let waiter = this;
    waiter.state = true;
    setTimeout(function(){
        waiter.orderMenu = seat.menu.concat();
        waiter.orderSeatId = seat.id;
        waiterImg.style.animation = "toCook 0.5s linear forwards";
    },0.5 * timeUnit);
    setTimeout(function(){
        waiter.restaurant.handleMenu(waiter.orderMenu,waiter.orderSeatId);   // 这里调用餐厅对象的方法
        waiter.orderMenu = []
        waiter.orderSeatId = "";
        Event.create("restaurant1").listen("waiter",waiter);
        waiter.state = false;
    },1 * timeUnit)
}
// 服务员上菜全过程
Waiter.prototype.theWholeProcessOfServeingFood = function(cuisine){
    let waiterImg = document.querySelector("#" + this.id);
    waiterImg.style.animation = "toCustomer 0.5s linear forwards";
    let waiter = this;
    waiter.state = true;
    waiter.serveCuisine = cuisine;
    setTimeout(function(){
        waiterImg.style.animation = "toCook 0.5s linear forwards";
        waiter.theKeyProcessOfServeingFood(waiter.serveCuisine);
        waiter.serveCuisine = null;
    },0.5 * timeUnit);
    setTimeout(function(){
        Event.create("restaurant1").listen("waiter",waiter);
        waiter.state = false;
    },1 * timeUnit)    
}
// 服务员上菜核心过程：通知顾客吃菜
Waiter.prototype.theKeyProcessOfServeingFood = function(cuisine){
    let seatIdArray = cuisine.seatId.split(",");
    for(let i = 0; i < seatIdArray.length; i++){
        Event.create("restaurant1").trigger(seatIdArray[i],"eatOneDish",cuisine);
        showCuisineServed(seatIdArray[i],cuisine);
    }
}

// 显示该菜已上
showCuisineServed = function(seatId,cuisine){
    let seatElement = document.querySelector("#"+seatId);
    let customerElement = seatElement.nextSibling;
    let menuELement = customerElement.querySelector(".menu ul");
    for(let i = 0; i < menuELement.children.length; i++){
        if(menuELement.children[i].firstChild.innerHTML === cuisine.name){
            menuELement.children[i].lastChild.innerHTML = "（已上）";
        }
    }
}