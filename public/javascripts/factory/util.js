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
    
    u.isEmail = function (email) {
        if (!email) {
            return false;
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    
    return u;
}]);