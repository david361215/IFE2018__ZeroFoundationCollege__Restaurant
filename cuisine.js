// 菜品类
function Cuisine(name,cost,price,time){
    this.name = name;
    this.cost = cost;
    this.price = price;
    this.time = time;
}
// 具体菜品数组
Cuisine.arr = [];
// 给菜品数组添加菜式
Cuisine.arr.push(new Cuisine("酸菜鱼",30,45,5));
Cuisine.arr.push(new Cuisine("辣椒炒肉",10,15,4));
Cuisine.arr.push(new Cuisine("凉拌秋葵",20,30,4));
Cuisine.arr.push(new Cuisine("回锅肉",20,30,3));
Cuisine.arr.push(new Cuisine("梅菜扣肉",30,45,3));
Cuisine.arr.push(new Cuisine("手撕包菜",10,15,3));
Cuisine.arr.push(new Cuisine("盐水菜心",10,15,3));
Cuisine.arr.push(new Cuisine("耗油生菜",10,15,4));
Cuisine.arr.push(new Cuisine("宫保鸡丁",30,45,4));
Cuisine.arr.push(new Cuisine("麻婆豆腐",10,15,3));
Cuisine.arr.push(new Cuisine("北京烤鸭",100,130,6));
Cuisine.arr.push(new Cuisine("炸酱面",5,7,3));
Cuisine.arr.push(new Cuisine("猪肉韭菜水饺",20,30,3));
Cuisine.arr.push(new Cuisine("米饭",3,5,2));
Cuisine.arr.push(new Cuisine("小面",10,15,2));
Cuisine.arr.push(new Cuisine("东坡肉",30,40,4));
Cuisine.arr.push(new Cuisine("白切鸡",60,80,4));
Cuisine.arr.push(new Cuisine("酸辣土豆丝",15,20,3));
Cuisine.arr.push(new Cuisine("啤酒鸭",60,80,8));
Cuisine.arr.push(new Cuisine("深井烧鹅",80,100,4));
Cuisine.arr.push(new Cuisine("五香牛肉",50,70,4));
Cuisine.arr.push(new Cuisine("叉烧",40,50,4));
Cuisine.arr.push(new Cuisine("炭烧猪颈肉",50,65,4));
Cuisine.arr.push(new Cuisine("黑椒鸡柳",40,50,3));
Cuisine.arr.push(new Cuisine("咖喱鸡",50,60,5));