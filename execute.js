let restaurant = new Restaurant(0);

(function(){
	let addSeat = document.querySelector("#addSeat");
	addSeat.addEventListener("click",function(){
		restaurant.addSeat();
	})
})();
(function(){
	let reduceSeat = document.querySelector("#reduceSeat");
	reduceSeat.addEventListener("click",function(){
		restaurant.reduceSeat();
	})
})();

(function(){
    let addWaiter = document.querySelector("#addWaiter");
    addWaiter.addEventListener("click",function(){
        restaurant.addWaiter();
    })
})();
(function(){
    let reduceWaiter = document.querySelector("#reduceWaiter");
    reduceWaiter.addEventListener("click",function(){
        restaurant.reduceWaiter();
    })
})();

(function(){
    let addCook = document.querySelector("#addCook");
    addCook.addEventListener("click",function(){
        restaurant.addCook();
    })
})();
(function(){
    let reduceCook = document.querySelector("#reduceCook");
    reduceCook.addEventListener("click",function(){
        restaurant.reduceCook();
    })
})();

setTimeout(function(){
    getSomeCustomer(restaurant);
},5000)
