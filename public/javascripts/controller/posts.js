app.controller('posts', [
    '$scope', 'auth', 'postObj', 'post', 'alertify',
    function ($scope, auth, postObj, Post, alertify) {

        $scope.post = postObj;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addComment = function () {
            if (!$scope.body || $scope.body === '' ||
                !$scope.author || $scope.author === '') { return; }
        
            Post.addComment(postObj._id, {
                body: $scope.body,
                author: $scope.author
            }).success(function(comment){
                $scope.post.comments.push(comment);
                alertify.success('Done creating this comment');
                clearFields();
            });
        };
        
        $scope.incrementUpvoteComment = function (comment) {
            if(auth.isLoggedIn()){
                Post.upvoteComment(postObj, comment).success(function (response){
                    if(response.error){
                        alertify.error(response.message);
                    }
                });
            }else{
                alertify.error('Log in first to upvote');
            }
        };
        
        $scope.incrementDownvoteComment = function (comment) {
            if(auth.isLoggedIn()){
                Post.downvoteComment(postObj, comment).success(function (response){
                    if(response.error){
                        alertify.error(response.message);
                    }
                });
            }else{
                alertify.error('Log in first to downvote');
            }
        };
        
        function clearFields(){
            $scope.author = '';
            $scope.body = '';
            $scope.addCommentClick = false;
        }

    }]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('posts', {
                    url: '/posts/{id}',
                    templateUrl: '/public/html/posts.html',
                    controller: 'posts',
                    resolve: {
                        postObj: ['$stateParams', 'post', function($stateParams, Post){
                            return Post.get($stateParams.id);
                        }]
                    }
                });

        $urlRouterProvider.otherwise('home');
    }]);