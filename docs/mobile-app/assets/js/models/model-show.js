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

    this.baseQuery = 'shows/';
    this.seasons   = false;


    this.id          = show.id;
    this.images      = show.images;
    this.title       = show.name;
    this.description = show.summary;
    this.onAir       = (show.status === 'Running') ? true : false;

};

TVMaze_Model_Show.prototype.getSeasons = function() {

    if ( this.seasons === false ) {
    }

};