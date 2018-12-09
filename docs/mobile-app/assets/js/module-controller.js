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
