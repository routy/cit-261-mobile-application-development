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

TVMaze_Model_Season.prototype.setId = function( id )
{
    this.id = id;
};

TVMaze_Model_Season.prototype.getEpisodes = function( )
{
    this.id = id;

    if ( this.episodes ) {
        return this.episodes;
    }

    var episodes  = this.get( this.baseQuery + this.id + '/episodes' );
    this.episodes = episodes;

    return episodes;
};