// 时间单位，单位是毫秒
let timeUnit = 1000;
// 返回一定范围内的随机整数
function random(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}
// 返回若干个不重复的随机数
function getSomeDifferentRandomNumber(number,min,max){
    let arr = [];
    for(let i = 0; i < number; i++){
        let randomNumber = random(min,max);
        if (arr.indexOf(randomNumber) === -1){
            arr.push(randomNumber);
        }else{
            i--;
        }
    }
    return arr;
}
// 返回若干个随机数
function getSomeRandomNumber(number,min,max){
    let arr = [],
        randomNumber;
    for(let i = 0; i < number; i++){
        randomNumber = random(min,max);
        arr.push(randomNumber);
    }
    return arr;
}

// 显示当前排队的所有顾客的名字
function showCustomerQueue(customer){
    for ( let i = 0; i < Customer.arr.length; i++ ){
        if ( customer.name == Customer.arr[i] ){
            let customerQueueElement = document.querySelector("#customerQueue ul");
            customerQueueElement.innerHTML = "";
            for (let j = i + 1; j < Customer.arr.length; j++ ){
                li = document.createElement("li");
                li.innerHTML = Customer.arr[j];
                customerQueueElement.appendChild(li);
            }
        }
    }
}
// 倒计时显示时间
function countdown (element,time) {
    element.innerHTML = time;
    time--;
    if ( time > 0 ){
        setTimeout(function(){
            countdown(element,time);
        },1*timeUnit);
    }
}
