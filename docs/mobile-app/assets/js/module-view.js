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
};

TVMaze_View.prototype.draw = function( templateID, params )
{
    params   = ( params && typeof params === 'object' ) ? params : {};

    console.log('Function Call: TVMaze_View.draw', templateID, params );

    var html = this._template( templateID, params );

    document.getElementsByTagName('main')[0].innerHTML = html;
};

/**
 *
 * @param templateID
 * @param params
 * @private
 */
TVMaze_View.prototype._template = function (templateID, params) {
    // Retrieve the HTML of the template either from cache, or from the DOM if it hasn't been set.
    var template = ( this.templates.hasOwnProperty(templateID) ) ? this.templates[templateID] : document.getElementById( 'template-' + templateID ).innerHTML;
    if (template) {
        for (var param in params) {
            if (params.hasOwnProperty(param) && typeof params[param] !== 'undefined') {
                // console.log('Replacing {' + param + '} with value : ' + params[param] + ' from template.', template);
                template = this._replaceAll(template, '{{ ' + param + ' }}', params[param]);
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
