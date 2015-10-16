app.factory('Util', ['$window', function($window){
    
    var u = {};
    
    u.isImage = function(src){
        
        var image = new Image();
    
        image.onerror = function (){
            return false;
        };
        image.onload = function (){
            return true;
        };
        
        image.src = src;
    };
    
    u.setFocus = function (elementId){
        var element = $window.document.getElementById(elementId);
        if(element){
            element.focus();
        }
    };
    
    return u;
}]);