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