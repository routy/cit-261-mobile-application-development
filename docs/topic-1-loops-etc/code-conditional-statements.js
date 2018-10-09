/**
 *
 * @author Nick Routsong
 *
 * Conditional Statements - are used to perform a function based on a value being either true or false
 *
 */

console.log('####### EXAMPLE: IF STATEMENTS #######');

if ( 10 > 5 ) {
    console.log('The statement 10 > 5 has been determined to be true.');
}

console.log('####### EXAMPLE: IF/ELSE STATEMENTS #######');

console.log('Single condition: 10 < 5');
if ( 10 < 5 ) {
    console.log('The statement 10 < 5 has been determined to be true.');
} else {
    console.log('The statement 10 < 5 has been determined to be false.');
}

/**
 * Multiple conditions in a single if statement are used when the action taken will be the same, regardless of which
 * condition may be true.
 */
console.log('Multiple conditions: 10 < 5 OR 10 < 8');
if ( 10 < 5 || 10 < 8 ) {
    console.log('The statement 10 < 5 OR 10 < 8 has been determined to be true.');
} else {
    console.log('The statement 10 < 5 OR 10 < 8  has been determined to be false.');
}

console.log('####### EXAMPLE: IF/ELSEIF STATEMENTS #######');

/**
 * If and ElseIf statements are useful when you need to take a different action, depending on the result of more than
 * one condition. Integer comparison such as included below is not a typical use case. You will typically be testing
 * one or more variables.
 */
console.log('Separate condition checks: 10 < 5 OR 10 < 8');
if ( 10 < 5 ) {
    console.log('The statement 10 < 5 has been determined to be true. Performing action a.');
} else if ( 10 < 8 ) {
    console.log('The statement 10 < 8 has been determined to be true. Performing action b.');
} else {
    console.log('The statement 10 < 5 and 10 < 8 have both been determined to be false. Performing action c.');
}

