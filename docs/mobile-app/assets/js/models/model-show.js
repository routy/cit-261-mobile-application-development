/*****************************************************************************
 *
 * Model: Show
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Model_Show = function ()
{
    TVMaze_Interface_Model_API.call( this );

    this.baseQuery = 'shows/';
    this.seasons   = [];

};