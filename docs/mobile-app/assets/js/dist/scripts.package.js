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
/*****************************************************************************
 *
 * Controller
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Controller = function( params )
{
    this.view = params.view;
    this.api  = params.api;

    var self = this;

    window.onload = function() {

        /**
         * Handle the search display when searching for shows by name
         */
        if ( document.getElementById('submit-search-shows') ) {

            document.getElementById('submit-search-shows').addEventListener('click', function( event ) {

                event.preventDefault();

                var searchValue = document.getElementById('input-search-shows').value;
                if ( searchValue !== '' ) {
                    self.api.get( 'search/shows?q=' + encodeURI( searchValue ), function( api, response ) {

                        if ( response && response.length > 0 ) {

                            var shows = [];

                            for ( var s = 0; response.length; s++ ) {

                                shows.push( new TVMaze_Model_Show( response[s].show ) );

                            }
                        }

                        self.view.draw( 'view-shows', {'shows' : shows} );

                    } );
                }
            });
        }

    };

};

/*****************************************************************************
 *
 * View
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_View = function( params )
{
    this.templates = {};
};

TVMaze_View.prototype.draw = function( templateID, params )
{
    console.log('Function Call: TVMaze_View.draw', templateID, params);

    params   = ( params && typeof params === 'object' ) ? params : {};

    var html = this._template( templateID, params );

    document.getElementsByTagName('main')[0].innerHTML = html;
};

/**
 *
 * @param templateID
 * @param params
 * @private
 */
TVMaze_View.prototype._template = function (templateID, params) {
    // Retrieve the HTML of the template either from cache, or from the DOM if it hasn't been set.
    var template = ( this.templates.hasOwnProperty(templateID) ) ? this.templates[templateID] : document.getElementById( 'template-' + templateID ).innerHTML;
    if (template) {
        for (var param in params) {
            if (params.hasOwnProperty(param) && typeof params[param] !== 'undefined') {
                // console.log('Replacing {' + param + '} with value : ' + params[param] + ' from template.', template);
                template = this._replaceAll(template, '{{ ' + param + ' }}', params[param]);
            }
        }
    }
    // If there is a placeholder set within the template that didn't get replaced, we want to replace it with an empty string
    return this._replaceAll(template, '{{.*}}', '', false);
};

/**
 *
 * @param string
 * @private
 */
TVMaze_View.prototype._escapeRegExp = function (string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

/**
 *
 * @param string
 * @param find
 * @param replace
 * @param escape
 * @private
 */
TVMaze_View.prototype._replaceAll = function (string, find, replace, escape) {
    if (replace === null) {
        replace = '';
    }
    if (typeof escape !== 'undefined' && escape !== false) {
        find = this._escapeRegExp(find);
    }
    if (typeof string !== 'undefined' && string !== '') {
        return string.replace(new RegExp(find, 'g'), replace);
    }
    return false;
};

/*****************************************************************************
 *
 * Interface Model: API
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Interface_Model_API = function ()
{
    this.baseQuery = null;
};

TVMaze_Interface_Model_API.prototype.get = function( query, callback )
{
    query = this.baseQuery + query;

    return new TVMaze_API().get( query, callback );
};
/*****************************************************************************
 *
 * Model: Episode
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Model_Episode = function ()
{
    TVMaze_Interface_Model_API.call( this );

    this.baseQuery = 'episodes/';
};


/*****************************************************************************
 *
 * Model: Episode
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Model_Season = function ( id )
{
    TVMaze_Interface_Model_API.call( this );

    this.baseQuery = 'seasons/';
    this.id  = id;
    this.episodes  = [];

};

TVMaze_Model_Season.prototype.getId = function( )
{
    return this.id;
};

TVMaze_Model_Season.prototype.setId = function( id )
{
    this.id = id;

    return this;
};

TVMaze_Model_Season.prototype.getEpisodes = function( )
{
    this.id = id;

    if ( this.episodes ) {
        return this.episodes;
    }

    var episodes  = this.get( this.baseQuery + this.id + '/episodes' );

    if ( episodes && episodes.length > 0 ) {

        for ( var e = 0; e < episodes.length; e++ ) {

            this.episodes.push( new TVMaze_Model_Episode( episodes[e] ) );

        }

    }

    return this.episodes;
};
/*****************************************************************************
 *
 * Model: Show
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Model_Show = function ()
{
    TVMaze_Interface_Model_API.call( this );

    this.baseQuery = 'shows/';
    this.seasons   = [];

};
/*****************************************************************************
 *
 * Init TV Maze Application
 *
 *****************************************************************************/

var containerID     = 'tv-maze-container';

var TVMaze_Controller = new TVMaze_Controller( {
    'containerID' : containerID,
    'view'        : new TVMaze_View(),
    'api'         : new TVMaze_API()
} );

// Show the default view
TVMaze_Controller.view.draw( 'view-index' );