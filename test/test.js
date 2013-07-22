var assert = require("assert");
var JSHash = require("../src/JSHash.js");

/*
*	SUITE
*	
*	This suite tests the various configurations for construction of a 
*	new JSHash. It does not test get or add functions, but expects them 
*	to be called at appropriate times.
*/
suite("JSHash Construction", function(){
	var myHash;

	suite("No Args", function(){
		
		setup(function(){
			myHash = new JSHash();
		});
		
		test("Check hashKey", function(){
			//make sure the hash key is not defined
			assert.equal(myHash.Props.hashKey,undefined);
		});
		test("Check hashFunction", function(){
			//make sure the hash function is not defined
			assert.equal(myHash.Props.hashFunction, undefined);
		});
		test("Check unhashed", function(){
			//make sure that our unhashed array is empty and exists
			assert.equal(myHash.Props.unhashed.length, 0);
		});
	});

	suite("Only Items", function(){

		setup(function(){
			var tempItems = [{
				code: "0001",
				itemNum: 0,
				rand: 67
			}, {
				code: "0002",
				itemNum: 1,
				rand: 74321
			}, {
				code: "0003",
				itemNum: 2,
				rand: 346
			}, ];
			myHash = new JSHash(tempItems);
		});

		test("Check hashKey", function(){
			//make sure the hash key is not defined
			assert.equal(myHash.Props.hashKey,undefined);
		});
		test("Check hashFunction", function(){
			//make sure the hash function is not defined
			assert.equal(myHash.Props.hashFunction, undefined);
		});
		test("unhashed count", function(){
			//we should have 3 items in the unhashed array
			assert.equal(myHash.Props.unhashed.length, 3);
		});

	});

	suite("Items with hash key", function(){
		
	});
});

suite("Get", function(){

});