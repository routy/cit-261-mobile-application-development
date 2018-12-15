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