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