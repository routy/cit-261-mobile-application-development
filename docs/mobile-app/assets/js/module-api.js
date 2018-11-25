/*****************************************************************************
 *
 * API
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_API = function ()
{
    this.cache = {};
    this.lastRequest = false;
};

TVMaze_API.prototype.get = function( query, callback )
{
    var request = this._request();

    if ( request !== false ) {

        requestInstance.request.open( 'GET', 'https://api.chucknorris.io/jokes/random', true );
        requestInstance.request.send();

        /*

        Below are the different event types that can be listened for:

        requestInstance.request.addEventListener("progress", function() {} );
        requestInstance.request.addEventListener("load", function() {});
        requestInstance.request.addEventListener("error", function() {});
        requestInstance.request.addEventListener("abort", function() {});

        // This last one will fire but not tell us if it was successful or not, it could be considered a 'Done' status.
        requestInstance.request.addEventListener("loadend", function() {});

        */

        requestInstance.request.addEventListener("load", function() {

            // Transform the received JSON string into an object
            response = JSON.parse( requestInstance.request.responseText );

            // Instantiate a new joke and set the response content as the values for it
            let joke = new Joke( response );

            // Add the new joke to the jokes array
            self.jokes.push(joke);

            // Display the joke that was just added
            self.setCurrentJoke(self.jokes.length-1);

        }, false);

    }

    callback( false );

    return false;

};

TVMaze_API.prototype._request = function()
{
    return (window.XMLHttpRequest) ? new XMLHttpRequest() : false;
};



const Request = function() {

    this.request = null;

    // Starting in IE7, we no longer have to use ActiveXObject, they all use XMLHttpRequest
    if (window.XMLHttpRequest) {
        this.request = new XMLHttpRequest();
    } else {
        this.request = false;
    }

};

/**
 *
 */
const Jokes = function() {

    this.jokes = [];
    this.currentJoke = 0;

};

/**
 *
 */
const Joke = function( values ) {

    this.category = (typeof values.category !== 'undefined') ? values.category : null;
    this.icon_url = (typeof values.icon_url !== 'undefined') ? values.icon_url : null;
    this.id       = (typeof values.id       !== 'undefined') ? values.id : null;
    this.url      = (typeof values.url      !== 'undefined') ? values.url : null;
    this.value    = (typeof values.value    !== 'undefined') ? values.value : null;

};

/**
 *
 */
Jokes.prototype.getJoke = function() {

    let self = this;
    let requestInstance  = new Request();

    requestInstance.request.open( 'GET', 'https://api.chucknorris.io/jokes/random', true );
    requestInstance.request.send();


    /*

    Below are the different event types that can be listened for:

    requestInstance.request.addEventListener("progress", function() {} );
    requestInstance.request.addEventListener("load", function() {});
    requestInstance.request.addEventListener("error", function() {});
    requestInstance.request.addEventListener("abort", function() {});

    // This last one will fire but not tell us if it was successful or not, it could be considered a 'Done' status.
    requestInstance.request.addEventListener("loadend", function() {});

    */

    requestInstance.request.addEventListener("load", function() {

        // Transform the received JSON string into an object
        response = JSON.parse( requestInstance.request.responseText );

        // Instantiate a new joke and set the response content as the values for it
        let joke = new Joke( response );

        // Add the new joke to the jokes array
        self.jokes.push(joke);

        // Display the joke that was just added
        self.setCurrentJoke(self.jokes.length-1);

    }, false);

};