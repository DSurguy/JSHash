## JSHash 
A powerful and flexible hash object for use in javascript projects

#### What is this thing?
JSHash serves to solve an issue that javascript seems to have, and that's a lack of a native hash object. Sure, you can make an associative array easy enough, and then you can make it a 2D associative array to get buckets, but you're doing it all by hand, time after time. 

JSHash is easily re-useable and really flexible. You can change hashing functions, hash keys, sorting and more on the fly. Many of its methods tend to be chainable to make your code a little more readable.


#### Cool! How do I use it?
JSHash is easy enough to get started with. First let's create some dummy data.
`
var dummy = [{
  code: "0001",
  name: "Some Data",
  someValue: 12
}, {
  code: "0002",
  name: "That Other Data",
  someValue: 7
}, {
  code: "0003",
  name: "Last Data",
  someValue: 11
}];
`

Now, create a JSHash from this array of objects. We're going to hash them by code, with no hash function.
`
var myHash = new jsHash(dummy, "code");
`
