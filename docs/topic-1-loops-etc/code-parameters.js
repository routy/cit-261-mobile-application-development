/**
 *
 * @author Nick Routsong
 *
 * Parameters - are variables/values that are being passed into a function. Inside that function, the parameters can
 * then be used to provide different output from the function.
 *
 */

/**
 * Global Scope Variable
 * @type number_1 {number}
 */
var number_1 = 5;

/**
 * Global Scope Variable
 * @type number_2 {number}
 */
var number_2 = 3;

/**
 * Global Scope Variable
 * @type total {Number}
 */
var total = add( number_1, number_2 );

console.log('Passing the variables number_1:'+number_1+' and number_2:'+number_2+' to the function add( number_1, number_2) as parameters.');
console.log('Output: ' + total);

/**
 *
 * This function will add two numbers together that are being passed as parameters to the add() function.
 * Notice that the parameter names do not have to match the variable names that are being passed into the function.
 *
 * @param input_1
 * @param input_2
 * @returns {Number}
 */
function add( input_1, input_2 ) {

    /**
     * The parameters input_1 and input_2 are considered local variables as they are defined inside of the function.
     * Because number_1, number_2 and total are defined outside the scope of the function, they COULD be manipulated
     * directly rather that using the parameters that were passed. For example:
     *
     * return parseFloat( number_1 + number_2);
     *
     * Would provide the same response as when we are using the code below.
     */

    return parseFloat( input_1 + input_2 );
}

