/*****************************************************************************
 *
 * Controller
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_Controller = function( params )
{

    this.view = params.view;
    this.api  = params.api;

    window.onload( function() {

    });

    document.getElementById('button-search').onclick( function() {

        var searchValue = document.getElementById('input-search').value;

        if ( searchValue !== '' ) {

            this.api.get( '' );

        }


    });

};
