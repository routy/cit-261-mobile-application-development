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

                        if (shows.length > 0) {
                            showsHTML += '<ul id="shows-list">';
                            for (s = 0; s < shows.length; s++) {
                                showsHTML += '<li class="show-item" data-id="' + shows[s].id + '" data-index="' + s + '">';
                                showsHTML += '<div class="flex-grid-gutter">';
                                    showsHTML += '<div class="col col-1-4">';
                                    showsHTML += '<span class="show-item-img" ';
                                    if ( shows[s].images && typeof shows[s].images.medium !== 'undefined' ) {
                                        showsHTML += 'style="background-image: url(' + shows[s].images.medium + ');"';
                                    } else {
                                        showsHTML += 'style="background-image: url(assets/img/show-image-unavailable-medium.jpg);"';
                                    }
                                    showsHTML += '></span>';
                                    showsHTML += '</div>';
                                    showsHTML += '<div class="col col-3-4">';
                                        if ( shows[s].genre && typeof shows[s].genre !== 'undefined' ) {
                                            showsHTML += '<span class="show-item-genre">' + shows[s].genre + '</span>';
                                        }
                                        showsHTML += '<span class="show-item-title">' + shows[s].title + '</span>';
                                        if ( shows[s].network && typeof shows[s].network.name !== 'undefined' ) {
                                            showsHTML += '<span class="show-item-network">' + shows[s].network.name + ' (' + shows[s].network.country.code + ')' + '</span>';
                                        }
                                    showsHTML += '</div>';
                                showsHTML += '</div>';
                                showsHTML += '</li>';
                            }
                            showsHTML += '</ul>';
                            self.shows = shows;
                        } else {
                            showsHTML = '<p>No matching shows were found.</p>';
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

            if ( event.srcElement.className === 'show-item' ) {
                showItem = event.srcElement;
            } else {
                showItem = event.srcElement.closest('.show-item');
            }

            if ( showItem ) {

                show = self.getShowById( showItem.getAttribute('data-id') );

                if ( show ) {
                    show.getSeasons(function () {
                        self.view.draw('view-show', show);
                    });
                }
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
