function JSHash(Items, hashKey, hashFunction, byValue){
	//Store all items that were not able to be hashed by the passed key
	this.unhashed = [];
	//Store the hashKey passed to constructor
	this.hashKey = hashKey;
	//store the optional function used to hash the items
	this.hashFunction = hashFunction;

	//If there's only one item, convert it to an array to save code.
	if( Items.constructor.name != "Array" ){
		Items = [Items];
	}
	//start storing items based on key, and clone them so we don't have reference issues
	for( var i=0; i<Items.length; i++ ){
		var cloneObj;
		//clone the object
		cloneObj = this.cloneItem(Items[i]);

		//find out where this item is going
		var index = this.hashKey.toString();
		//see if we need to run a hash function
		if( this.hashFunction ){
			//run the key through the hash function and convert it to a string
			index = this.hashFunction(this.hashKey).toString();
		}

		if( cloneObj[index] == undefined ){
			//We can't hash this item, so store it in the unhashables
			this.unhashed.push(cloneObj);
		}
		else if( this[cloneObj[index]] ){
			this[Items[index]].push(cloneObj);
		}
		else{
			this[cloneObj[index]] = [cloneObj];
		}
	}
};

/*
*	Utility function to clone an item by value instead of reference
*/
JSHash.prototype.cloneItem = function (item) {
	//preserve the classname of the item being cloned
	var newObj = new item.constructor;
	//copy the values
	for( var key in item ){
		if( item.hasOwnProperty(key) ){
			newObj[key] = item[key];
		}
	}
	//spit out the clone
	return newObj;
}

/*
*	Retrieve the value stored at 'key' in the hash.
*	-Optional 'flat'
*		If true, return the value at the last index of the array stored in 'key'
*	-Optional 'byValue'
*		If true, return the value by cloning it instead of returning a reference
*/
JSHash.prototype._get = function(key, flat, byValue){
	if( key == undefined || this[key] == undefined || !this.hasOwnProperty(key) ){
		//there's no objects at this key
		return undefined;
	}

	if( byValue ){
		if( flat ){
			//we are returning the flat item by value
			return this.cloneItem(this[key][this[key].length-1]);
		}
		else{
			//we are returning the full array by value
			var returnArr = [];
			for( var i=0; i<this[key].length; i++ ){
				returnArr.push(this.cloneItem(this[key][i]));
			}
			return returnArr;
		}
	}
	else{
		if( flat ){
			//we are returning the flat item by reference
			return this[key][this[key].length-1];
		}
		else{
			//we are returning the full array by reference
			return this[key];
		}
	}
}