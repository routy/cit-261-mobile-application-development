/*****************************************************************************
 *
 * Init TV Maze Application
 *
 *****************************************************************************/

var containerID     = 'tv-maze-container';

var TV_Maze = new TV_Maze_Controller( {
    'questionnaire'         : FMCE_Questionnaire_Params,
    'containerID'           : containerID,
    'formID'                : formId,
    'progressBarHandler'    : new FMCE_ProgressBar( progressBarID ),
    'statusMessageHandler'  : new FMCE_StatusMessage( statusMessageID ),
    'modalHandler'          : new FMCE_Modal( modalID )
} );