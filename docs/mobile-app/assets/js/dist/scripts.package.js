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
    console.log('Function call: TVMaze_API.get');

    var request = this._request();
    var self = this;
    var response = false;

    if ( request !== false ) {

        this.lastRequest = query;

        var cache = this.getCache( query );

        // If the request has already been performed in the last 5 minutes, let's use the cache
        if ( cache !== false ) {
            console.log( 'Cache entry found. Returning cached response.', cache);
            return callback( self, cache );
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

            console.log( 'Event Listener: Request - TVMaze_API.get.Load' );

            // Transform the received JSON string into an object
            response = JSON.parse( request.responseText );

            self.setCache( query, response );

            this.lastResponse = response;

            callback( self, response );

        }, false);

        request.addEventListener( 'error', function() {

            console.log('Event Listener: Request - TVMaze_API.get.Error');

            // Transform the received JSON string into an object
            response = JSON.parse( request.responseText );

            this.lastResponse = response;

            callback( self, response );

        }, false);

    } else {

        console.log('Unable to retrieve XMLHttpRequest');

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
    this.view    = params.view;
    this.api     = params.api;
    this.shows   = [];

    var self = this;

    window.onload = function() {

        /**
         * Handle the search display when searching for shows by name
         */
        if ( document.getElementById('submit-search-shows') ) {

            document.getElementById('submit-search-shows').addEventListener('click', function( event ) {

                console.log('Event Listener Triggered: #submit-search-shows.click');

                self.shows = [];
                event.preventDefault();

                var searchValue = document.getElementById('input-search-shows').value;

                console.log('Search value: ' + searchValue);

                if ( searchValue !== '' ) {

                    self.getShowsBySearch( searchValue, function( shows ) {

                        showsHTML = '';

                        for ( s = 0; s < shows.length; s++ ) {
                            showsHTML += '<li class="show-item" data-id="' + shows[s].id + '" data-index="' + s + '">' + shows[s].title + '</li>';
                        }

                        self.shows = shows;

                        self.view.draw( 'view-shows', {
                            'shows' : showsHTML,
                            'search' : searchValue
                        } );

                    } );
                }
            });
        }

        /*
         * Listen for events on dynamic elements
         */
        document.addEventListener('click', function( event ) {

            // If a show item is clicked on, let's display more information about the show
            if ( event.srcElement.className === 'show-item' ) {

                show = self.getShowById( event.srcElement.getAttribute('data-id') );

                show.getSeasons( function() {

                    self.view.draw( 'view-show', show );

                });

            }

        });

        /*
         * Listen for back button
         */
        document.getElementById('navigation-previous').addEventListener('click', function( event ) {
            // Re-draw the last view
            self.view.drawPrevious();
        });

    };
};

/**
 *
 * @param searchValue
 * @param callback
 */
TVMaze_Controller.prototype.getShowsBySearch = function( searchValue, callback ) {

    this.api.get( 'search/shows?q=' + encodeURI( searchValue ), function( api, response ) {

        if ( response && response.length > 0 ) {

            var shows = [];

            for ( var s = 0; s < response.length; s++ ) {
                shows.push( new TVMaze_Model_Show( response[s].show ) );
            }

            callback( shows );

        } else {

            callback( [] );

        }
    } );

};

/**
 *
 * @param id
 * @returns {boolean}
 */
TVMaze_Controller.prototype.getShowById = function( id ) {

    if ( this.shows === null )
        return false;

    var show = this.getItemByNameValue( this.shows, 'id', id );

    return ( show ) ? show : false;

};

/**
 *
 * @param objects
 * @param fieldName
 * @param fieldValue
 * @returns {*}
 * @private
 */
TVMaze_Controller.prototype.getItemByNameValue = function( objects, fieldName, fieldValue ) {
    for ( var o = 0; o < objects.length; o++ ) {
        for (var key in objects[o]) {
            if (key === fieldName && objects[o][key] == fieldValue) {
                return objects[o];
            }
        }
    }
    return false;
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
    this.history = [];
    this.current = null;
};

TVMaze_View.prototype.drawPrevious = function()
{
    if ( this.current !== null && this.history.length > 0 ) {
        
        var loop = true;
        var lastView = null;

        while ( loop ) {
            // Retrieve the last entry in the history
            lastView = this.history.pop();
            // If it doesn't match the current view, then it must be the previous one
            if ( lastView.templateID !== this.current ) {
                this.draw( lastView.templateID, lastView.params );
                loop = false;
            }
        }
    }
};

TVMaze_View.prototype.draw = function( templateID, params )
{
    params   = ( params && typeof params === 'object' ) ? params : {};

    console.log('Function Call: TVMaze_View.draw', templateID, params );

    var html = this._template( templateID, params );

    document.getElementsByTagName('main')[0].innerHTML = html;

    // Set the name of the currently active template
    this.current = templateID;

    // Push a history entry so that we can navigate back if needed
    this.history.push( {
        'templateID' : templateID,
        'params' : params
    } );

};

/**
 *
 * @param templateID
 * @param params
 * @private
 */
TVMaze_View.prototype._template = function ( templateID, params ) {
    // Retrieve the HTML of the template either from cache, or from the DOM if it hasn't been set.
    var template = ( this.templates.hasOwnProperty(templateID) ) ? this.templates[templateID] : document.getElementById( 'template-' + templateID ).innerHTML;
    if (template) {

        var regex     = /\{\{\s([a-z.]+)\s\}\}/gim;
        var variables = [];

        while ( null !== ( match = regex.exec( template ) ) ) {
            variables.push( match[1] );
        }

        var replacementValue = null;

        console.log(variables);

        if ( variables && variables.length > 0 ) {
            for ( var v = 0; v < variables.length; v++ ) {
                /*jshint evil: true */
                eval( 'replacementValue = (typeof params.' + variables[v] + ' !== "undefined" ) ? params.' + variables[v] + ' : "";' );
                template = this._replaceAll( template, '{{ ' + variables[v] + ' }}', replacementValue );
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
var TVMaze_Model_Episode = function ( showId, seasonId, episode)
{
    this.id          = episode.id;
    this.showId      = showId;
    this.seasonId    = seasonId;
    this.number      = episode.number;
    this.title       = (episode.name !== '') ? episode.name : episode.number;
    this.images      = episode.image;
    this.premierDate = episode.airDate;
    this.length      = episode.runtime;
    this.description = epsidoe.summary;

    this.baseQuery = 'seasons/' + this.seasonId + '/episodes/' + this.id + '/';
};
/*****************************************************************************
 *
 * Model: Episode
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Model_Season = function ( showId, season )
{
    this.episodes    = false;
    this.id          = season.id;
    this.showId      = showId;
    this.number      = season.number;
    this.title       = (season.name !== '') ? season.name : season.number;
    this.premierDate = season.premierDate;
    this.endDate     = season.endDate;
    this.description = season.summary;

    this.baseQuery = 'shows/' + this.showId + '/seasons/' + this.id + '/';
};

/**
 *
 */
TVMaze_Model_Season.prototype.getEpisodes = function( callback ) {

    var self = this;

    if ( this.hasOwnProperty('episodes') && this.episodes !== false ) {
        callback( this.episodes );
        return;
    }

    if ( this.episodes === false ) {

        TVMaze_Controller_Instance.api.get( this.baseQuery + 'episodes', function( api, response ) {

            self.episodes = [];

            if ( response && response.length > 0 ) {

                for ( var s = 0; s < response.length; s++ ) {
                    self.seasons.push( new TVMaze_Model_Episode( self.showId, self.id, response[s] ) );
                }

            }

            callback( self.episodes );

        } );

    }

};
/*****************************************************************************
 *
 * Model: Show
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Model_Show = function ( show )
{
    TVMaze_Interface_Model_API.call( this );

    this.seasons     = false;
    this.id          = show.id;
    this.images      = show.image;
    this.title       = show.name;
    this.description = show.summary;
    this.status      = show.status;
    this.rating      = show.rating;
    this.premierDate = show.premiered;

    this.baseQuery = 'shows/' + this.id + '/';

};

/**
 *
 */
TVMaze_Model_Show.prototype.getSeasons = function( callback ) {

    var self = this;

    if ( this.hasOwnProperty('seasons') && this.seasons !== false ) {
        callback( this.seasons );
        return;
    }

    if ( this.seasons === false ) {

        TVMaze_Controller_Instance.api.get( this.baseQuery + 'seasons', function( api, response ) {

            self.seasons = [];

            if ( response && response.length > 0 ) {

                for ( var s = 0; s < response.length; s++ ) {
                    self.seasons.push( new TVMaze_Model_Season( self.id, response[s] ) );
                }

            }

            callback( self.seasons );

        } );

    }

};

/**
 *
 * @param id
 * @returns {boolean}
 */
TVMaze_Model_Show.prototype.getSeasonById = function( id ) {

    if ( !this.hasOwnProperty( 'seasons' ) || this.seasons.length === 0 )
        return false;

    var season = this.getItemByNameValue( this.seasons, 'id', id );

    return ( season ) ? season : false;

};
/*****************************************************************************
 *
 * Init TV Maze Application
 *
 *****************************************************************************/

var containerID     = 'tv-maze-container';

var TVMaze_Controller_Instance = new TVMaze_Controller( {
    'containerID' : containerID,
    'view'        : new TVMaze_View(),
    'api'         : new TVMaze_API()
} );

// Show the default view
TVMaze_Controller_Instance.view.draw( 'view-index' );