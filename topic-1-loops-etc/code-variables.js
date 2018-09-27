/**
 *
 * @author Nick Routsong
 *
 * Variables - are used in order to store data of different types. In JavaScript, you do not have to define what
 * kind of data is going to be stored in the variable. This is considered to be loosely typed variable. The same is
 * also true in a different language, PHP. Variables support storing a variety of different data types. Including:
 *
 * = Array
 * - Boolean (true, false)
 * - (Null) this is an empty value
 * - Numbers (1, 20.5, -500) - Integers, Floats
 * - Object - can include other variables and functions (console, document, navigation, location | are a few built-in objects)
 * - Strings (this is a nice looking string)
 * - Undefined - this value is stored if the variable being referenced has not yet been created/defined
 *
 */

// As an Array
var  randomValue = [1, 2, 3, 4, 5];
console.log('randomValue as an Array: ', randomValue);

// As Boolean
randomValue = false;
console.log('randomValue as a Boolean: ', randomValue);

// As an Integer
randomValue = 0;
console.log('randomValue as a Integer: ', randomValue);

// As a Float
randomValue = 5.2;
console.log('randomValue as a Float: ', randomValue);

// As a String
randomValue = 'We want a string now!';
console.log('randomValue as a String: ', randomValue);

// As an Object
randomValue = {'description' : 'This should be an object instead.'};
randomValue.description = 'This is the description now. This is much better.';

console.log('randomValue as an Object: ', randomValue);


/**
 * Variables can be one of two scopes. Local or Global. Global variables are accessible outside of an object or function.
 * Local variables are defined inside of an object or function.
 */


/**
 * @type call_me_global {string}
 */
var call_me_global = 'Hello World';

function say_something()
{
    console.log('Value of Global Variable `call_me_global`: ' + call_me_global);

    var call_me_local = 'Hello Locale';

    console.log('Value of Local Variable `call_me_local`: ' + call_me_local);

    return call_me_local;

}

var output = say_something();


console.log('This isn\'t going to be pretty. I am going to try to output the type of a variable ' +
    'not defined in the current scope: ', typeof call_me_local );


