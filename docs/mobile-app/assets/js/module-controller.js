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
