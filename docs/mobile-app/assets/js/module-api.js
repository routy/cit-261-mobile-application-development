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
    this.lastRequest  = false;
    this.lastResponse = false;
};

/**
 *
 * @param name
 * @param value
 */
TVMaze_API.prototype.setCache = function( name, value )
{
    value = JSON.stringify( value );
    this.cache[name] = value;

    localStorage.setItem( name, value );
};

/**
 *
 * Cache expires every 5 minutes
 *
 * @param name
 * @returns {*}
 */
TVMaze_API.prototype.getCache = function( name )
{
    var date = new Date();
    var timestamp = date.getTime();

    if ( this.cache.hasOwnProperty( name ) && this.cache[name].setAt < timestamp - 5 * 60) {

        return this.cache;

    } else if ( localStorage.getItem( name ) ) {

        var value = JSON.parse( localStorage.getItem( name ) );

        if ( value.setAt < timestamp - 5 * 60 ) {
            return value;
        }

    }

    return false;

};

/**
 * @todo Loop through the cache values in local storage and the local cache object and clear it
 */
TVMaze_API.prototype.removeExpiredCache = function()
{

};

/**
 *
 * @param query
 * @param callback
 * @returns {*}
 */
TVMaze_API.prototype.get = function( query, callback )
{
    var request = this._request();
    var self = this;
    var response = false;

    if ( request !== false ) {



        this.lastRequest = query;

        // If the request has already been performed in the last 5 minutes, let's use the cache
        if ( cache.hasOwnProperty( query ) && cache[query].setAt < timestamp - 5 * 60) {
            return cache[query].response;
        }

        request.request.open( 'GET', 'https://api.tvmaze.com/' + query, true );
        request.request.send();

        /*

        Below are the different event types that can be listened for:

        requestInstance.request.addEventListener("progress", function() {} );
        requestInstance.request.addEventListener("load", function() {});
        requestInstance.request.addEventListener("error", function() {});
        requestInstance.request.addEventListener("abort", function() {});

        // This last one will fire but not tell us if it was successful or not, it could be considered a 'Done' status.
        requestInstance.request.addEventListener("loadend", function() {});

        */

        request.request.addEventListener( 'load', function() {

            // Transform the received JSON string into an object
            response = JSON.parse( request.request.responseText );

            // Save the response into the cache
            self.cache[query] = {};
            self.cache[query].response = response;
            self.cache[query].setAt = response;

            this.lastResponse = response;

            callback( response );

        }, false);

        request.request.addEventListener( 'error', function() {

            // Transform the received JSON string into an object
            response = JSON.parse( request.request.responseText );

            this.lastResponse = response;

            callback( response );

        }, false);

    }

    callback( false );

    return false;

};

TVMaze_API.prototype._request = function()
{
    return (window.XMLHttpRequest) ? new XMLHttpRequest() : false;
};