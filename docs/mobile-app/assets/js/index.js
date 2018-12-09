/*****************************************************************************
 *
 * Init TV Maze Application
 *
 *****************************************************************************/

var containerID     = 'tv-maze-container';

var TVMaze_Controller = new TVMaze_Controller( {
    'containerID' : containerID,
    'view'        : new TVMaze_View(),
    'api'         : new TVMaze_API()
} );

// Show the default view
TVMaze_Controller.view.draw( 'view-index' );