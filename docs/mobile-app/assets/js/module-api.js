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
    var date = new Date();
    var timestamp = date.getTime();

    this.cache[name] = {
        'response' : value,
        'setAt'    : timestamp
    };

    localStorage.setItem( name, JSON.stringify( this.cache[name] ) );
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

        return this.cache[name].response;

    } else if ( localStorage.getItem( name ) ) {

        var cache = JSON.parse( localStorage.getItem( name ) );

        if ( cache.setAt < timestamp - 5 * 60 ) {
            return cache.response;
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

        var cache = this.getCache( query );

        // If the request has already been performed in the last 5 minutes, let's use the cache
        if ( cache !== false ) {
            return cache.response;
        }

        request.open( 'GET', 'https://api.tvmaze.com/' + query, true );
        request.send();

        /*

        Below are the different event types that can be listened for:

        requestInstance.request.addEventListener("progress", function() {} );
        requestInstance.request.addEventListener("load", function() {});
        requestInstance.request.addEventListener("error", function() {});
        requestInstance.request.addEventListener("abort", function() {});

        // This last one will fire but not tell us if it was successful or not, it could be considered a 'Done' status.
        requestInstance.request.addEventListener("loadend", function() {});

        */

        request.addEventListener( 'load', function() {

            console.log('Event Listener: Request - Load');

            // Transform the received JSON string into an object
            response = JSON.parse( request.responseText );

            self.setCache( query, response );

            this.lastResponse = response;

            callback( self, response );

        }, false);

        request.addEventListener( 'error', function() {

            console.log('Event Listener: Request - Error');

            // Transform the received JSON string into an object
            response = JSON.parse( request.responseText );

            this.lastResponse = response;

            callback( self, response );

        }, false);

    } else {

        return false;

    }

    return this;

};

TVMaze_API.prototype._request = function()
{
    return (window.XMLHttpRequest) ? new XMLHttpRequest() : false;
};