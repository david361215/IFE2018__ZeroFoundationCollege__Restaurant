let Event = (function(){
	var _listen,
	    _trigger,
	    _create,
	    _shift = Array.prototype.shift,
	    _unshift = Array.prototype.unshift,
	    _slice = Array.prototype.slice,
	    namespaceCache = {},

	    _listen = function(cache,key,obj){
	    	if(!cache[key]){
	    		cache[key] = [];
	    	}
	    	cache[key].push(obj);
	    };
	    _trigger = function(){
	    	let cache = _shift.call(arguments),
	    	    key = _shift.call(arguments),
	    	    nameofFunction = _shift.call(arguments),
	    	    args = arguments,
	    	    stack = cache[key];

	    	if( !stack || !stack.length ){
	    		return;
	    	}
	    	let obj = stack.shift();
	    	obj[nameofFunction].apply(obj,args);
	    };
	    _remove = function(cache,key,obj){
	    	if(cache[key]){
	    		if(obj){
	    			for(let i = 0; i < cache[key].length; i++){
	    				if(cache[key][i] === obj){
	    					cache[key].splice(i,1);
	    				}
	    			}
	    		}else{
	    			cache[key] = [];
	    		}
	    	}
	    };
	    _create = function(namespace){
	    	var namespace = namespace || "default",
	    	    cache = {},
	    	    ret = {
	    	    	listen : function(key,obj){
	    	    		_listen(cache,key,obj);
	    	    		if(!cache[key].offlineStack || (cache[key].offlineStack && !cache[key].offlineStack.length)){
	    	    			return;
	    	    		}else if(cache[key].offlineStack && cache[key].offlineStack.length){
	    	    			let fn = cache[key].offlineStack.shift();
	    	    			return fn();
	    	    		}
	    	    	},
	    	    	trigger : function(){ // 第一个参数是数组名，第二个参数是对象方法名，剩余参数是传给这个对象方法的参数
	    	    		let fn,
	    	    		    args,
	    	    		    _self = this;

	    	    		_unshift.call(arguments,cache);
	    	    		args = arguments;
	    	    		fn = function(){
	    	    			return _trigger.apply(_self,args);
	    	    		}

	    	    		if(!cache[args[1]]){
	    	    			cache[args[1]] = [];
	    	    			cache[args[1]].offlineStack = [];
	    	    			return cache[args[1]].offlineStack.push(fn);
	    	    		}else if(cache[args[1]] && !cache[args[1]].length){
	    	    			if(!cache[args[1]].offlineStack){
	    	    				cache[args[1]].offlineStack = [];
	    	    				return cache[args[1]].offlineStack.push(fn);
	    	    			}else{
	    	    				return cache[args[1]].offlineStack.push(fn);
	    	    			}
	    	    		}else if(cache[args[1]] && cache[args[1]].length){
	    	    			return fn();
	    	    		}
	    	    	},
	    	    	remove : function(key,obj){
	    	    		_remove(cache,key,obj);
	    	    	},
	    	    	removeOfflineStack : function(key){  // 清空离线栈
	    	    		if(!cache[key].offlineStack || (cache[key].offlineStack && !cache[key].offlineStack.length)){
	    	    			return;
	    	    		}else if(cache[key].offlineStack && cache[key].offlineStack.length){
	    	    			cache[key].offlineStack = [];
	    	    			return; 
	    	    		}	    	    		
	    	    	}
	    	    }
	    	return namespaceCache[namespace]? namespaceCache[namespace]: namespaceCache[namespace] = ret;
	    }
	    return{
	    	create:_create,
	    	listen:function(key,obj){
	    		let event = this.create();
	    		event.listen(key,obj);
	    	},
	    	trigger:function(){
	    		let event = this.create();
	    		event.trigger.apply(this,arguments);
	    	},
	    	remove:function(key,obj){
	    		let event = this.create();
	    		event.remove(key,obj);
	    	},
	    	removeOfflineStack: function(key){
	    		let event = this.create();
	    		event.removeOfflineStack(key);
	    	}
	    }
})()