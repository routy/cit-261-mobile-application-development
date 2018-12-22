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
    this.premierDate = (show.premiered) ? new Date( show.premiered ) : null;
    this.genre       = (show.genres && show.genres.length > 0) ? show.genres[0] : null;
    this.network     = show.network;

    if ( this.premierDate !== null ) {
        this.premierDate = this.premierDate.getMonth() + '/' + this.premierDate.getFullYear();
    }

    if ( this.images === null ) {
        this.images = { 'original' : null, 'medium' : null };
    }

    this.hasRating      = (typeof show.rating.average !== 'undefined' && show.rating.average !== null)  ? 1 : 0;
    this.hasDescription = (typeof show.summary !== 'undefined') ? 1 : 0;
    this.hasImage       = (this.images.original !== null) ? 1 : 0;

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