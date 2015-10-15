app.controller('profile', [
    '$scope', 'Auth', 'User', 'userPromise', 'alertify',
    function ($scope, Auth, User, userPromise, alertify) {

        $scope.user = userPromise;
        $scope.flow = undefined;
        $scope.isLoggedIn = Auth.isLoggedIn;
        
        $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
            
            if(!isValidFileExtension(flowFile.relativePath)){
                event.preventDefault();
            }
            else if(!isValidFileSize(flowFile.size)){
                event.preventDefault();
            }else{
                $scope.flow = flowFile;
            }
        });
        
        $scope.editProfile = function(){
            
            var fr = new FileReader();
            fr.onloadend = function(e){
                $scope.user.profilePhoto = {
                    data: e.target.result,
                    extension: getFileExtension($scope.flow.relativePath),
                    identifier: $scope.flow.uniqueIdentifier
                };
                User.edit($scope.user).success(function (data){
                    alertify.success('Profile updated');
                });
            };
            fr.readAsDataURL($scope.flow.file);
        };
        
        function isValidFileExtension(fileName){
            
            var allowedExtensions = ['png', 'gif', 'jpg', 'jpeg'],
        
            fileExtension = getFileExtension(fileName);
            
            if(allowedExtensions.indexOf(fileExtension.toLowerCase()) === -1){
                alertify.error('This image extension is not allowed, only ' + allowedExtensions.join(', '));
                return false;
            }else{
                return true;
            }
        }
        
        function getFileExtension(fileName){
            var fileExtension = fileName.split('.');
            return fileExtension[fileExtension.length - 1];
        }
        
        function isValidFileSize(fileSize){
            
            var fileSizeInKbs = fileSize / 1024;
            if(fileSizeInKbs > 1024){
                alertify.error('This image size is not allowed, maximum is 1024 Kb');
                return false;
            }else{
                return true;
            }
        }
        
    }]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('profile', {
                    url: '/profile',
                    templateUrl: '/public/html/profile.html',
                    controller: 'profile',
                    resolve: {
                        userPromise: ['User', function(User){
                            return User.getCurrent();
                        }]
                    }
                });

        $urlRouterProvider.otherwise('home');
    }]);