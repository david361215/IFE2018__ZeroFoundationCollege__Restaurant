// 服务员的acceptOrder方法内部，包含服务员对顾客的一次使用，但没有对顾客对象做任何改变
// 服务员的deliveryMenuToKitchen方法，内部包含对厨师对象cook_A的acceptOrder方法的一次调用
// 厨师做好菜后，不需要调用服务员的方法，因为这里默认服务员可以立即去上菜，所以可以在调用厨师做完菜的方法后，直接调用服务员上菜方法
// 服务员上菜，只是修改菜的状态，不和顾客产生联系
// 顾客吃菜，使之成为一个独立的动作，不让吃菜这个行为和服务员产生联系
// 顾客离店这个行为，紧跟着吃菜行为，一旦发现所有菜都已吃完，那么就离店
// 顾客离店，餐厅的现金会发生变化，而且餐厅要安排下一个顾客进店。也就是说，对于顾客离店这个动作发生时，餐厅必须有所行动，那么怎么联系顾客和餐厅的行为呢？
// 有两种选择，一个是在顾客离店函数中，调用餐厅的方法。
// 另一个是顾客离店，只负责修改某个全局属性，而餐厅本身不断观察这个全局属性是否改变，一旦改变，即触发自身有关顾客离店的行为
// 餐厅类
function Restaurant(cash){
    this.cash = cash;
    this.seats = [];
    this.waiters = [];
    this.cooks = [];
    this.customerQueue = [];
    this.menu = [];  // 厨房中待做菜的菜单
}
// 处理顾客到店后的三种选择：入座，排队，离开
Restaurant.prototype.handleCustomerArrive = function(customer){
    let vancantSeat = this.hasVacantSeat();
    if(vancantSeat){
        this.handleCustomerOrder(vancantSeat,customer);
    }else if(this.customerQueue.length <=5){
        this.makeCustomerQueueUp(customer);
    }else{
        return;
    }
}
// 判断是否有空位
Restaurant.prototype.hasVacantSeat = function(){
    let seats = this.seats;
    for(let i = 0; i < seats.length; i++){
        if(!seats[i].state){
            return seats[i];
        }
    }
    return false;
}
// 安排顾客进店入座，就餐
Restaurant.prototype.handleCustomerOrder = function(seat,customer){
    seat.state = true;   // 这一步是用于将来判断座位是否空闲
    this.makeCustomerImgNextToSeatImg(seat,customer);
    customer.showOrdering();   //  这里只是用一下顾客对象的name属性
    customer.seatId = seat.id;
    customer.restaurant = this;
    Event.create("restaurant1").listen(seat.id,customer);
    setTimeout(function(){
        customer.finishOrder(seat);  // 此时，座位对象的menu属性和cash属性获得属性值
    },3 * timeUnit)
    setTimeout(function(){
        Event.create("restaurant1").trigger("waiter","acceptOrder",seat);  //顾客进店后，第一次发布消息，通知服务员执行受理菜单的任务，并告诉服务员是哪个座位
    },2.5 * timeUnit);
}
// 将顾客图片添加到桌子图片旁边
// 此时的html是这样的：
/*
<div id="Harden" class=customer>
  <img src="image/customer.gif">
</div>
*/
Restaurant.prototype.makeCustomerImgNextToSeatImg = function(seat,customer){
    let seatImg = document.querySelector("#"+seat.id);
    let customerElement = document.createElement("div");
    customerElement.className = "customer";
    customerElement.id = customer.name;
    let customerImg = document.createElement("img");
    customerImg.src = "image/customer.gif";
    customerElement.appendChild(customerImg);
    seatImg.parentNode.appendChild(customerElement);
}
// 安排顾客排队
Restaurant.prototype.makeCustomerQueueUp = function(customer){
    this.customerQueue.push(customer);
    this.showCustomerQueue();
}
// 显示所有排队顾客的姓名
Restaurant.prototype.showCustomerQueue = function(){
    let customerQueue = document.querySelector("#customerQueue");
    customerQueue.innerHTML = "";
    for(let i = 0; i < this.customerQueue.length; i++){
        let li = document.createElement("li");
        li.innerHTML = this.customerQueue[i].name;
        customerQueue.appendChild(li);
    }
}
// 增加座位图片
Restaurant.prototype.addSeatImg = function(id){
    let seats = document.querySelector("#seats");
    let li = document.createElement("li");
    let img = new Image();
    img.className = "seat";
    img.id = id;
    img.src = "image/table.jpg";
    li.appendChild(img);
    seats.appendChild(li);
};
// 增加一个座位
Restaurant.prototype.addSeat = function(){
    let numberOfSeats = this.seats.length;
    let newId = "seat" + (numberOfSeats + 1);
    let seat = new Seat(newId);
    this.seats.push(seat);
    this.addSeatImg(newId);
};
// 减少一个座位，从餐厅座位数组中，删除最后一个座位对象。从界面上删除最后一个座位图片
Restaurant.prototype.reduceSeat = function(){
    if(this.seats[this.seats.length - 1] && !this.seats[this.seats.length - 1].state){
        let seat = this.seats.pop();
        let seatImgs = document.querySelector("#seats");
        seatImgs.removeChild(seatImgs.lastChild);
    }else{
        alert("最后一张桌子有人入座，不能删除");
    }
};
// 增加一个服务员。
// 创建一个服务员对象，保存进餐厅服务员数组。
// 使用发布订阅模式，订阅服务员。命名空间的名称是餐厅id，这里默认是restaurant1。
// 添加一个服务员图片。
Restaurant.prototype.addWaiter = function(){
    let numberOfWaiters = this.waiters.length;
    let newId = "waiter" + (numberOfWaiters + 1);
    let waiter = new Waiter(newId);
    this.waiters.push(waiter);
    waiter.restaurant = this;
    this.addWaiterImg(newId);
    Event.create("restaurant1").listen("waiter",waiter);  // 订阅服务员对象
}
// 增加服务员图片
Restaurant.prototype.addWaiterImg = function(id){
	console.log(id);
    let waiters = document.querySelector("#waiters");
    let img = new Image();
    img.className = "waiter";
    img.id = id;
    img.src = "image/waiter.jpg";
    waiters.appendChild(img);
};

// 减少一个服务员
Restaurant.prototype.reduceWaiter = function(){
    if(this.waiters[this.waiters.length - 1] && !this.waiters[this.waiters.length - 1].state){
        let waiter = this.waiters.pop();
        let waiterList = document.querySelector("#waiters");
        waiterList.removeChild(waiterList.lastChild);
        Event.create("restaurant1").remove("waiter",waiter);
    }else{
        alert("最后一位服务员正在忙碌，不能删除");
    }    
}

// 增加一位厨师
Restaurant.prototype.addCook = function(){
    let numberOfCooks = this.cooks.length;
    let newId = "cook" + (numberOfCooks + 1);
    let cook = new Cook(newId);
    this.cooks.push(cook);
    this.addCookImg(newId);
    cook.restaurant = this;
    Event.create("restaurant1").listen("cook",cook);  // 订阅厨师对象
};
// 增加厨师图片
Restaurant.prototype.addCookImg = function(id){
    let cooklistElement = document.querySelector(".cooklist");
    let cookElement = document.createElement("li");
    cookElement.id = id;
    let cookImg = document.createElement("img");
    cookImg.src = "image/cook.jpg";
    let restElement = document.createElement("p");
    restElement.className = "rest";
    restElement.innerHTML = "空闲中";
    cookElement.appendChild(cookImg);
    cookElement.appendChild(restElement);
    cooklistElement.appendChild(cookElement);
}
// 减少一位厨师，从餐厅厨师数组中，删除最后一个厨师对象。从界面上删除最后一个厨师图片
Restaurant.prototype.reduceCook = function(){
    if(this.cooks[this.cooks.length - 1] && !this.cooks[this.cooks.length - 1].state){
        let cook = this.cooks.pop();
        let cookList = document.querySelector("#cooklist");
        cookList.removeChild(cookList.lastChild);
        Event.create("restaurant1").remove("cook",cook);
    }else{
        alert("最后一位厨师正在忙碌，不能删除");
    }
};
// 厨房收到新菜单，处理新菜单
// 为了不影响发布做菜任务，将删除餐厅菜单数组中的菜品的过程。
Restaurant.prototype.handleMenu = function(menu,seatId){
    let newMenu = this.addSeatIdToCuisine(menu,seatId);
    this.adjustMenu(newMenu);  // 重新调整了餐厅的menu属性。
    this.showCookMenu();   // 依照餐厅的menu属性，显示待做菜列表。
    Event.create("restaurant1").removeOfflineStack("cook"); // 清除未完成的做菜任务
    let tashMenu = this.menu.concat();  // 厨师做一个菜，就要从菜单中删除一个菜，如果直接遍历this.menu，就会出错
    for(let i = 0; i < tashMenu.length; i++){
        Event.create("restaurant1").trigger("cook","cooking",tashMenu[i]);  // 依照当前餐厅的menu属性，再次发布所有做菜任务
    }
}
// 为了避免菜品对象之间互相干扰，厨房收到菜单时，新建菜品对象，并给菜品添加桌子编号属性，表示这是哪一桌点的菜
Restaurant.prototype.addSeatIdToCuisine = function(menu,seatId){
    let newMenu = [];
    for(var i = 0; i < menu.length; i++){
        let cuisine = menu[i];
        let newCuisine = new Cuisine(cuisine.name,cuisine.cost,cuisine.price,cuisine.time);
        newCuisine.seatId = seatId;
        newMenu.push(newCuisine);  
    }
    return newMenu;
}
// 将厨房新收到的菜单和已有菜单做合并，得到新的完整的菜单
// 实际做两件事，一，寻找重复的菜品，如果发现重复，那么只在已有菜品对象上添加桌子编号，二，剩下那些不重复的菜品，直接添加到已有菜单的后面
Restaurant.prototype.adjustMenu = function(menu){
    if(this.menu.length === 0){
        this.menu = menu.concat(); 
    }else if(this.menu.length > 0){
        for(let i = 0; i < this.menu.length; i++){
            for(let j = 0; j < menu.length; j++){
                if( this.menu[i].name === menu[j].name){
                    this.menu[i].seatId += "," + menu[j].seatId;
                    menu.splice(j,1);
                }
            }
        }
        this.menu = this.menu.concat(menu);
    }
}
// 显示厨师待做菜的菜单，唯一的菜单数据来源，就是餐厅的menu属性
Restaurant.prototype.showCookMenu = function(){
    let menuElement = document.querySelector("#cooks .menu ul");
    menuElement.innerHTML = "";  // 清空现有菜单
    for ( let i = 0; i < this.menu.length; i++ ){
        let li = document.createElement("li");
        li.innerHTML = this.menu[i].name;
        menuElement.appendChild(li);
    }
    if(this.menu.length === 0){
        menuElement.innerHTML = "无待做菜";
    }
}
// 显示餐厅的现金
Restaurant.prototype.showMoney = function(){
    let moneyElement = document.querySelector("#cash span");
    moneyElement.innerHTML = this.cash;
}        
// 餐厅受理顾客结账
Restaurant.prototype.checkOut = function(seatId){
    for(let i = 0; i < this.seats.length; i++){
        if(this.seats[i].id === seatId){
            this.cash += this.seats[i].cash;
            this.showMoney();
            this.seats[i].reset();
            this.checkCustomerQueue(this.seats[i]);
        }
    }
}
Restaurant.prototype.checkCustomerQueue = function(seat){
    if(this.customerQueue.length > 0){
        let customer = this.customerQueue.shift();
        this.showCustomerQueue();
        this.handleCustomerOrder(seat,customer);
    }
}