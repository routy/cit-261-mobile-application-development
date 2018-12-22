/*****************************************************************************
 *
 * View
 *
 * @constructor
 *
 *****************************************************************************/
var TVMaze_View = function( params )
{
    this.templates = {};
    this.history = [];
    this.current = null;
};

TVMaze_View.prototype.drawPrevious = function()
{
    if ( this.current !== null && this.history.length > 0 ) {

        var loop = true;
        var lastView = null;

        while ( loop ) {
            // Retrieve the last entry in the history
            lastView = this.history.pop();
            // If it doesn't match the current view, then it must be the previous one
            if ( lastView.templateID !== this.current ) {
                this.draw( lastView.templateID, lastView.params );
                loop = false;
            }
        }
    }
};

TVMaze_View.prototype.draw = function( templateID, params )
{
    params   = ( params && typeof params === 'object' ) ? params : {};

    console.log('Function Call: TVMaze_View.draw', templateID, params );

    try {

        var html = this._template( templateID, params );

        document.getElementsByTagName('main')[0].innerHTML = html;

        // Set the name of the currently active template
        this.current = templateID;

        // Push a history entry so that we can navigate back if needed
        this.history.push( {
            'templateID' : templateID,
            'params' : params
        } );

        if ( this.history.length > 1 ) {
            document.getElementById('navigation-previous').style.display = 'inline-block';
        } else {
            document.getElementById('navigation-previous').style.display = 'none';
        }

        window.scrollTo(0, 0);

    } catch( error ) {

        // Show that an error happened
        console.log( error );
        return;
    }

};

/**
 *
 * @param templateID
 * @param params
 * @private
 */
TVMaze_View.prototype._template = function ( templateID, params ) {
    // Retrieve the HTML of the template either from cache, or from the DOM if it hasn't been set.
    var template = ( this.templates.hasOwnProperty(templateID) ) ? this.templates[templateID] : document.getElementById( 'template-' + templateID ).innerHTML;
    if (template) {

        var regex     = /\{\{\s([a-z.]+)\s\}\}/gim;
        var variables = [];

        while ( null !== ( match = regex.exec( template ) ) ) {
            variables.push( match[1] );
        }

        var replacementValue = null;

        console.log(variables);

        if ( variables && variables.length > 0 ) {
            for ( var v = 0; v < variables.length; v++ ) {
                /*jshint evil: true */
                eval( 'replacementValue = (typeof params.' + variables[v] + ' !== "undefined" ) ? params.' + variables[v] + ' : "";' );
                template = this._replaceAll( template, '{{ ' + variables[v] + ' }}', replacementValue );
            }
        }

    }
    // If there is a placeholder set within the template that didn't get replaced, we want to replace it with an empty string
    return this._replaceAll(template, '{{.*}}', '', false);
};

/**
 *
 * @param string
 * @private
 */
TVMaze_View.prototype._escapeRegExp = function (string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

/**
 *
 * @param string
 * @param find
 * @param replace
 * @param escape
 * @private
 */
TVMaze_View.prototype._replaceAll = function (string, find, replace, escape) {
    if (replace === null) {
        replace = '';
    }
    if (typeof escape !== 'undefined' && escape !== false) {
        find = this._escapeRegExp(find);
    }
    if (typeof string !== 'undefined' && string !== '') {
        return string.replace(new RegExp(find, 'g'), replace);
    }
    return false;
};

/**
 *
 * @param status
 */
TVMaze_View.prototype.loading = function( status ) {
    console.log('Function Call: Loading', status);
    document.getElementById('loading').className = ( status === true ) ? 'visible' : 'hidden';
};

/**
 *
 * @param status
 */
TVMaze_View.prototype.error = function( status ) {
    console.log('Function Call: Error', status);
    document.getElementById('loading').style.display = ( status === true ) ? 'block' : 'none';
    if ( status === true ) {
        document.getElementById('loading-content').className = 'error';
    } else {
        document.getElementById('loading-content').className = '';
    }
};