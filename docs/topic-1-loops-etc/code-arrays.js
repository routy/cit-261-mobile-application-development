/**
 *
 * @author Nick Routsong
 *
 * Arrays - allow you to store multiple values, not necessarily of even the same type, inside of a single variable.
 *
 * They are indexed starting at 0 and increment based on how many items are contained within the array.
 *
 * There are special functions and parameters that are part of an array, because they are an Array object. For example,
 * you can request the length or total count of elements in the array by referencing the length property:
 *
 * `variable_name_here.length`
 *
 * Or you can loop through the values in an array by calling the forEach() function on the array:
 *
 * `variable_name_here.forEach( ... )`
 */

// Long hand defining an array
var array_long  = new Array(1, 'two', 3, 4, 5);
console.log('array_long has ' + array_long.length + ' items.');

// Short hand defining an array
var array_short =  [1, 'two', 3, 4, 'five', 6, 7, 8, 9, 'ten'];
console.log('array_short has ' + array_short.length + ' items.');

/**
 * It is best to define an array using the short hand approach as the long hand can have some unexpected results.
 * For example, if you were to define:
 */

var array_test = new Array(10, 20, 30);
console.log('You will see that the array has a length of 3: ' + array_test.length );

array_test = new Array(10);
console.log('By only defining one value, it interprets that as you wanting to create 10 empty elements: ' + array_test.length);

/**
 * Some languages, such as PHP, allow for an array to have a string as the index, rather than a number for the key.
 * An array as defined above, will have a numerical key / index. If you are to set a string index, it will no longer be
 * an array, but instead will turn into a standard JavaScript object.
 */

var array_now_an_object = [];

array_now_an_object['first_name'] = 'Nick';
array_now_an_object['last_name']  = 'Routsong';
array_now_an_object['email']      = 'routy@byui.edu';
array_now_an_object['class']      = 'CIT 261';

array_now_an_object.first_name = 'Nicholas';

console.log('`array_now_an_object` output: ', array_now_an_object);