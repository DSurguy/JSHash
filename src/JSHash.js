function JSHash(Items, hashKey, hashFunction, byValue){
	this.Props.hashKey = hashKey;
	this.Props.hashFunction = hashFunction;
	this.Props.unhashed = [];
	//handle empty construction
	if( Items == undefined ){
		Items = [];
	}
	//If there's only one item, convert it to an array to save code.
	if( Items.constructor.name != "Array" ){
		Items = [Items];
	}
	//start storing items based on key, and clone them so we don't have reference issues
	for( var i=0; i<Items.length; i++ ){
		this.add(Items[i], byValue);
	}
};

//Store the members that would show up in hasOwnProperty
JSHash.prototype.Props = {
	//all items that were not able to be hashed
	unhashed: [],
	//this is used to retrieve values from objects being added by Item[hashKey]
	hashKey: undefined,
	//optional function used to hash the items
	hashFunction: undefined
}

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
*	
*	Chainable: No
*/
JSHash.prototype.get = function(key, flat, byValue){
	if( this[key] == undefined || !this.hasOwnProperty(key) ){
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

/*
*	Add a value to a specific key in the hash
*	The key will be run through the hash function if it is set.
*	-Optional 'byValue'
*		If true, clone the object before adding it to the hash
*	
*	Chainable: Yes
*/
JSHash.prototype.set = function(key, value, byValue){
	var index, cloneObj;
	//run the key through the hash function if we need to
	if( this.Props.hashFunction ){
		index = this.Props.hashFunction(key).toString();
	}
	else{
		index = key.toString();
	}
	//determine how we're storing the object
	if( byValue ){
		cloneObj = this.cloneItem(value);
	}
	else{
		cloneObj = value;
	}
	//now insert it into the hash
	if( this[index] ){
		this[index].push(cloneObj);
	}
	else{
		this[index] = [cloneObj];
	}
	//make it chainable
	return this;
}

/*
*	Add a value by automatically hashing it
*	-Optional 'byValue'
*		If true, clone the object before adding it to the hash
*	
*	Chainable: Yes
*/
JSHash.prototype.add = function(value, byValue){
	var index, cloneObj;
	//determine if we're adding by value or reference
	if( byValue ){
		cloneObj = this.cloneItem(value);
	}
	else{
		cloneObj = value;
	}

	//determine how we're hashing this item
	if( (this.hashKey == undefined || this.hashKey == false) && this.hashFunction ){
		//we're going to hash the entire object through some function
		index = this.hashFunction(cloneObj).toString();
		//now add it to the hash
		if( this[index] ){
			this[index].push(cloneObj);
		}
		else{
			this[index] = [cloneObj];
		}
	}
	if( cloneObj[this.Props.hashKey] == undefined ){
		//We can't hash this item because it doesn't have a value for the hashKey, so store it in the unhashables
		this.Props.unhashed.push(cloneObj);
	}
	else{
		//determine the index it's going into
		if( this.Props.hashFunction ){
			index = this.Props.hashFunction(cloneObj[this.Props.hashKey]).toString();
		}
		else{
			index = cloneObj[this.Props.hashKey].toString();
		}
		//now add it to the hash
		if( this[index] ){
			this[index].push(cloneObj);
		}
		else{
			this[index] = [cloneObj];
		}
	}
	//make it chainable
	return this;
}


/*
*	Set the current hashing function being used
*/
JSHash.prototype.setHashFunction = function(newFunc){
	if( typeof newFunc != "function" ){
		this.Props.hashFunction = undefined;
	}
	else{
		this.Props.hashFunction = newFunc;
	}
	//make it chainable
	return this;
}

/*
*	Set the current hashKey being used
*/
JSHash.prototype.setHashKey = function(newKey){
	this.Props.hashKey = newKey.toString();
	//make it chainable
	return this;
}

/*
*	Get a list of all keys in the hash
*	-Required: 'isString'
*		If true, the list will be returned as a string separated by commas
*		If false, the list will be returned as an array
*	-Optional 'sortFunc'
*		If this is passed as a function, it will be used to sort the returned object
*		If this is passed as true, the keys will be sorted by alpha
*/
JSHash.prototype.getKeys = function(isString, sortFunc){
	var keys = [];
	//get all keys out of the hash
	for( item in this ){
		if (this.hasOwnProperty(item) ){
			keys.push(item);
		}
	}
	//optionally sort them
	if( typeof sortFunc == "function" ){
		keys = keys.sort(sortFunc);
	}
	else if( sortFunc == true ){
		keys = keys.sort();
	}
	//return the keys
	if( isString ){
		return keys.join(",");
	}
	else{
		return keys;
	}
}

/*
*	Retrieve all objects in the hash as an array
*	-Optional 'flat'
*		If true, return the value at the last index of the array stored in each bucket
*	-Optional 'byValue'
*		If true, all objects are cloned before being returned
*		If false, all objects are returned by reference
*	-Optional 'sortFunc'
*		If this is passed as a function, it will be used to sort the returned array
*		If this is passed as true, the objects will be sorted by their hash
*/
JSHash.prototype.getValues = function(flat, byValue, sortFunc){
	var items = [], keys = [];
	if( sortFunc == true ){
		//get the keys, sort them then get all the items
		keys = this.getKeys(false, true);
	}
	else{
		keys = this.getKeys();
	}
	for( var i=0; i<keys.length; i++ ){
		//check if we need to return by value or reference
		if( byValue ){
			if( flat ){
				items.push(this.cloneItem(this[keys[i]][this[keys[i]].length-1]));
			}
			else{
				items.push(this.cloneItem(this[keys[i]]));
			}
		}
		else{
			if( flat ){
				items.push(this[keys[i]][this[keys[i]].length-1]);
			}
			else{
				items.push(this[keys[i]]);
			}
		}
	}
	//optionally sort the array
	if( typeof sortFunc == "function" ){
		items = items.sort(sortFunc);
	}

	return items;
}

module.exports = JSHash;