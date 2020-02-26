function Cook(id){
    this.id = id;
    this.state = false;  // false表示休息中，这个属性在删除厨师对象时会用到。理由和服务员对象一样。
    this.restaurant = null;  // 需要使用餐厅对象的方法和属性。
}
// 厨师烹饪全流程
Cook.prototype.cooking = function(cuisine){
    this.state = true;
    var cuisine = this.deleteCuisineInCookMenu(cuisine);
    this.restaurant.showCookMenu();
    this.showCookingState(cuisine);
    let cook = this;
    setTimeout(function(){
        cook.showFinishCookingState();
        cook.state = false;
        Event.create("restaurant1").listen("cook",cook);
        Event.create("restaurant1").trigger("waiter","theWholeProcessOfServeingFood",cuisine);
    },cuisine.time * timeUnit);
}
// 从餐厅菜单数组中，删除厨师此次做的菜，以便重新显示待做菜的菜单
Cook.prototype.deleteCuisineInCookMenu = function(cuisine){
    for(let i = 0; i < this.restaurant.menu.length; i++){
        if(cuisine.name === this.restaurant.menu[i].name){
            let deleteCuisine = this.restaurant.menu.splice(i,1);
            return deleteCuisine[0];
        }
    }
}
// 在界面上显示厨师的状态
Cook.prototype.showCookingState = function(cuisine){
    let cookElement = document.querySelector("#" + this.id);
    let cookRestElement = cookElement.querySelector(".rest");
    cookRestElement.style.display = "none";
    this.showCookingCuisine(cuisine);
}
// 显示厨师在做什么菜，还需多久做好
/* 以下是这次新增的html元素：
<div class="busy">
    <p class="doing">正在做：<span></span></p>
    <p class="time">还差<span></span>个时间单位做完</p>
</div> */
Cook.prototype.showCookingCuisine = function(cuisine){
    let cookingElement = document.createElement("div");
    cookingElement.className = "busy";
    let cuisineNameElement = document.createElement("p");
    cuisineNameElement.className = "doing";
    cuisineNameElement.innerHTML = "正在做" + cuisine.name;
    cookingElement.appendChild(cuisineNameElement);

    let cuisineTimeElement = document.createElement("p");
    cuisineTimeElement.className = "time";
    cuisineTimeElement.innerHTML = "还差";
    let countdownElement = document.createElement("span");
    cuisineTimeElement.appendChild(countdownElement);
    cuisineTimeElement.innerHTML += "个时间单位做完";
    cookingElement.appendChild(cuisineTimeElement);

    let cookElement = document.querySelector("#"+this.id);
    cookElement.appendChild(cookingElement);
    let countdownElement2 = document.querySelector("#" + this.id + " " + ".time span");
    countdown(countdownElement2,cuisine.time);    
}
// 显示厨师做完菜的状态，即显示厨师空闲
Cook.prototype.showFinishCookingState = function(){
    let cookElement = document.querySelector("#" + this.id);
    let cookRestElement = cookElement.querySelector(".rest");
    cookRestElement.style.display = "block";
    cookElement.removeChild(cookElement.lastChild);
}