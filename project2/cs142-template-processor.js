"use strict";

function Cs142TemplateProcessor(template) {
    this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function(dictionary) {
    var str = this.template;
    var matchResult = str.match(/{{(.*?)}}/g);
    for(var i = 0; i < matchResult.length; i++) {
        var result = matchResult[i];
        var key = result.slice(2, result.length-2);
        if(key in dictionary) {
            str = str.replace(result, dictionary[key]);
        } else {
            str = str.replace(result, "");
        }
    }
    return str;
};
