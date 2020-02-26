// 顾客类
function Customer(name){
    this.name = name;
    this.seatId = "";
    this.restaurant = null;
    this.cuisineNumber = 0;
    this.havingEatedCuisineNumber = 0;
}
// 可供选择的顾客名字
Customer.arr = ["Sunny","Rachel","Harden","Paul","Emma",
                "Mary","Allen","Olivia","Natasha","Kevin",
                "Rose","Kelly","Jeanne","James","Edith",
                "Sophia","Charles","Ashley","William","Hale",
                "Steve","David","Richard","Daniel","Matthew",
                "Mark","Andrew","Jean","Vera","John"];

// 默认10个时间单位内，生成5个顾客对象
function getSomeCustomer(restaurant){
    let time = getSomeRandomNumber(5,0,11);
    let indexOfCustomerName = getSomeDifferentRandomNumber(5,0,30);
    for(let i = 0; i < 5; i++){
        let name = Customer.arr[indexOfCustomerName[i]];
        setTimeout(function(){
            let customer = new Customer(name);
            restaurant.handleCustomerArrive(customer);
        },time[i]*timeUnit)
    }
}
// 显示顾客正在选菜，需要顾客对象的name
// 此时的html说这样的：<p class="ordering"><span class="customer">Harden</span>入座，正在点菜，还剩<span class="time"></span>个时间单位点好</p>
Customer.prototype.showOrdering = function(){
    let customerElement = document.querySelector("#" + this.name);
    let orderingElement = document.createElement("p");
    orderingElement.className = "ordering";
    customerElement.appendChild(orderingElement);
    let customerNameElement = document.createElement("span");
    customerNameElement.innerHTML = this.name;
    orderingElement.appendChild(customerNameElement);
    orderingElement.innerHTML += "入座，正在选菜，还剩";
    let timeElement = document.createElement("span");
    timeElement.className = "time";
    orderingElement.appendChild(timeElement);
    orderingElement.innerHTML += "个时间单位选好";
    let timeElement2 = document.querySelector("#"+ this.name + " " + ".ordering .time")
    countdown(timeElement2,3);
}
// 顾客点菜，随机从菜单中选择若干个菜，这里简化为一瞬间的动作，即瞬间点好菜。将菜单保存在座位对象中。
// 点菜的同时，计算好这些菜一共多少钱，将金额保存在座位对象中
Customer.prototype.finishOrder = function(seat){
    let cuisineNumber = random(2,4);
    let randomCuisine;
    for (let i = 0; i < cuisineNumber; i++){
        randomCuisine = Cuisine.arr[random(0,25)];
        if ( seat.menu.indexOf(randomCuisine) == -1 ){
            seat.menu.push(randomCuisine);
        } else {
            i--;
        }
    }
    this.cuisineNumber = seat.menu.length;
    this.calculatePriceOfAllCuisine(seat);
    this.showMenu(seat);
}
// 顾客点菜完毕后，显示菜单，菜名和菜的状态（还未上）
// 此时的html是这样的：
/*
<p>Harden此时的菜单：</p>
<ul>
  <li><span>宫保鸡丁</span><span>（还未上）</span></li>
</ul>
*/
Customer.prototype.showMenu = function(seat){
    let customerElement = document.querySelector("#"+this.name);
    customerElement.removeChild(document.querySelector("#"+this.name + " " + ".ordering"));
    let customerNameElement = document.createElement("p");
    customerNameElement.innerHTML = this.name + "此时的菜单：";
    let menuElement = document.createElement("ul");
    for( let i = 0; i < seat.menu.length; i++ ){
        let li = document.createElement("li");
        let cuisineNameElement = document.createElement("span");
        cuisineNameElement.innerHTML = seat.menu[i].name;
        li.appendChild(cuisineNameElement);
        let cuisineStateElement = document.createElement("span");
        cuisineStateElement.innerHTML = "（还未上）";
        li.appendChild(cuisineStateElement);
        menuElement.appendChild(li);
    }
    let menuContainingELement = document.createElement("div");
    menuContainingELement.className = "menu";
    menuContainingELement.appendChild(customerNameElement);
    menuContainingELement.appendChild(menuElement);
    customerElement.appendChild(menuContainingELement);
}
// 计算菜品总价格，保存到座位对象上
Customer.prototype.calculatePriceOfAllCuisine = function(seat){
    let price = 0;
    for(let i = 0; i < seat.menu.length; i++){
        price += seat.menu[i].price;
    }
    seat.cash = price;
}
// 吃一个菜
Customer.prototype.eatOneDish = function(cuisine){
    this.havingEatedCuisineNumber++;
    this.showEating(cuisine);
    let customer = this;
    setTimeout(function(){
        if(customer.havingEatedCuisineNumber === customer.cuisineNumber){
            customer.checkOut();
        }else{
            Event.create("restaurant1").listen(customer.seatId,customer);
        }
    },3 * timeUnit);
}

// 显示顾客正在吃菜，还要多久吃完。
// 吃之前的html是这样的：<span>酸菜鱼</span><span>（已上）</span>
// 吃的过程中的html是这样的：<span>正在吃</span><span>酸菜鱼</span><span>，还差</span><span>2</span><span>个时间单位吃完</span>
// 吃完后的html是这样的：<span>酸菜鱼</span><span>（已吃完）</span>
Customer.prototype.showEating = function(cuisine){
    let menuListELement = document.querySelectorAll("#" + this.name + " " + ".menu ul li");
    for(let i = 0; i < menuListELement.length; i++){
        if(cuisine.name === menuListELement[i].firstChild.innerHTML){
            let li = menuListELement[i];
            let span = document.createElement("span");
            span.innerHTML = "正在吃";
            li.insertBefore(span,li.firstChild);
            for( let k = 0; k < 2; k++){
                li.appendChild(document.createElement("span"));
            }
            li.children[2].innerHTML = "，还差";
            li.children[4].innerHTML = "个时间单位吃完";
            countdown(li.children[3],3); 
            setTimeout(function(){
                for ( let i = 0; i < 2; i++ ){
                    li.removeChild(li.lastChild);
                }
                li.removeChild(li.firstChild);
                li.lastChild.innerHTML = "(已吃完)";
            },3 * timeUnit);               
        }
    }
}
// 结账，离座，让下一位顾客进来
Customer.prototype.checkOut = function(){
    this.deleteCustomerImg();
    this.restaurant.checkOut(this.seatId);
}

Customer.prototype.deleteCustomerImg = function(){
    let customerElement = document.querySelector("#" + this.name);
    customerElement.parentNode.removeChild(customerElement);

}