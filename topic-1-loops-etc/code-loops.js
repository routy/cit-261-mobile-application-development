
/**
 *
 * Loops - There are different kinds of loops that can be used.
 *
 */

// For loops

console.log('####### EXAMPLE: FOR LOOPS #######');

var total   = 10;
console.log( 'I can count to ' + total + '! Watch this: ');

for ( i = 1; i <= total; i++ ) {
    console.log( i + ' ' );
}

// While loops

console.log('####### EXAMPLE: WHILE LOOPS #######');

var processing = true;
var count      = 0;
var limit      = 5;

while ( processing === true ) {
    console.log( 'Count is currently set as: ' + count );
    if ( count > limit ) {
        console.log( 'Processing has completed. Count has surpassed the limit of ' + limit  + '. Setting processing to false and ending while loop.' );
        processing = false;
    }
    count++;
}

// Do, While loops
// This type of loop is useful if you need to ensure that the block of code is run at least once as the while condition is checked after the first iteration

console.log('####### EXAMPLE: DO/WHILE LOOPS #######');

do {

    console.log('I have to say this at least once... and that is all the chance I will get because the processing variable is set to false.');

} while ( processing === true  );


// For/In Loops


