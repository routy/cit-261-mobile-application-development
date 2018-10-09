/**
 *
 * @author Nick Routsong
 *
 * Functions - are used to ensure that code is kept organized and within a desired scope. Functions support the
 * concept of DRY (Don't Repeat Yourself) coding. Functions also allow for utilizing global or local variables.
 *
 * Global and local variables can be used in a function.
 *
 * Functions can be defined globally or inside of an object. JavaScript comes with built-in functions that are able to
 * be used out of the box without you having to create them. For example, alert() is a way of displaying an on-screen
 * dialog box type message to a user.  document.write() is another function, defined inside of the document object, that
 * can be used to output content to the screen. console.log() is another function, also defined inside of a built-in
 * object that will write out content to the developer console in the web browser. This is shown below in the code
 * sample.
 *
 */

function example_function( item_count ) {

    // Here we would perform a series of actions on the variable being passed to us and generally return a response
    item_count++;

    return item_count;
}

var item_total = 0;

console.log('Initial item total: ' + item_total);

item_total = example_function( item_total );

console.log( 'After calling example_function - Item total: ' + item_total );

item_total = example_function( item_total );

console.log( 'After calling example_function again - Item total: ' + item_total );