/*****************************************************************************
 *
 * Controller
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Controller = function( params )
{
    this.view  = params.view;
    this.api   = params.api;
    this.shows = [];

    this.currentShowId    = null;
    this.currentSeasonId  = null;
    this.currentEpisodeId = null;

    var self = this;

    window.onload = function() {

        /**
         * Handle the search display when searching for shows by name
         */
        if ( document.getElementById('submit-search-shows') ) {

            document.getElementById('submit-search-shows').addEventListener('click', function( event ) {

                console.log('Event Listener Triggered: #submit-search-shows.click');

                event.preventDefault();

                var searchValue = document.getElementById('input-search-shows').value;

                console.log('Search value: ' + searchValue);

                if ( searchValue !== '' ) {

                    this.getShowsBySearch( searchValue, function( shows ) {

                        showsHTML = '';

                        for ( s = 0; s < shows.length; s++ ) {
                            showsHTML += '<li class="show-item" data-id="' + shows[s].id + '" data-index="' + s + '">' + shows[s].title + '</li>';
                        }

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

                self.view.draw( 'view-show', {
                    'title' : show.title,
                    'image' : show.image,
                    'description' : show.description,
                    'onAir' : ( show.onAir ) ? 'Yes' : 'No'
                } );
            }

        });

    };
};

/**
 *
 * @param searchValue
 * @param callback
 */
TVMaze_Controller.prototype.getShowsBySearch = function( searchValue, callback) {

    self.api.get( 'search/show?q=' + encodeURI( searchValue ), function( api, response ) {

        if ( response && response.length > 0 ) {

            var shows = [];
            var s = 0;

            for ( s = 0; s < response.length; s++ ) {
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
 * @returns {boolean}
 */
TVMaze_Controller.prototype.getSeasons = function() {

    var show = this.getShowById( this.currentShowId );

    if ( show && show.hasOwnProperty('seasons') ) {
        return show.seasons;
    }

    return false;

};

/**
 * 
 * @param show
 * @param id
 * @returns {boolean}
 */
TVMaze_Controller.prototype.getSeasonById = function( show, id ) {

    if ( show === null || !show.hasOwnProperty( 'seasons' ) || show.seasons.length === 0 )
        return false;

    var season = this.getItemByNameValue( this.show.seasons, 'id', id );

    return ( season ) ? season : false;

};

/**
 *
 * @returns {*}
 */
TVMaze_Controller.prototype.getEpisodes = function() {

    var show   = this.getShowById( this.currentShowId );

    if ( !show || show.hasOwnProperty( 'seasons' ) || show.seasons.length === 0 )
        return false;

    var season = this.getSeasonById( show, this.currentSeasonId );

    if ( season && season.hasOwnProperty( 'episodes' ) ) {
        return season.episodes;
    }

    return false;

};

/**
 *
 * @param season
 * @param id
 * @returns {boolean}
 */
TVMaze_Controller.prototype.getEpisodeById = function( season, id ) {

    if ( show === null || !show.hasOwnProperty( 'seasons' ) || show.seasons.length === 0 )
        return false;

    var episode = this.getItemByNameValue( season.episodes, 'id', id );

    return ( episode ) ? episode : false;

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
    var results = jQuery.grep(objects, function(obj){ return obj[fieldName] === fieldValue; });
    if ( results.length > 0 ) {
        return results[0];
    }
    return false;
};
