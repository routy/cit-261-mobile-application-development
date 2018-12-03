/*****************************************************************************
 *
 * Interface Model: API
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Interface_Model_API = function ()
{
    this.baseQuery = null;
};

TVMaze_Interface_Model_API.prototype.get = function( query, callback )
{
    query = this.baseQuery + query;

    return new TVMaze_API().get( query, callback );
};