app.controller('posts', [
    '$scope', '$stateParams', 'postObj', 'post',
    function ($scope, $stateParams, postObj, Post) {

        $scope.post = postObj;

        $scope.addComment = function () {
            if ($scope.body === '') { return; }
            Post.addComment(postObj._id, {
                body: $scope.body,
                author: 'user'
            }).success(function(comment){
                $scope.post.comments.push(comment);
                clearFields();
            })
        };
        
        $scope.incrementUpvoteComment = function (comment) {
            Post.upvoteComment(postObj, comment);
        };
        
        function clearFields(){
            $scope.body = '';
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