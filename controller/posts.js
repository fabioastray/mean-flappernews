app.controller('posts', [
    '$scope', '$stateParams', 'post',
    function ($scope, $stateParams, post) {

        $scope.post = post.posts[$stateParams.id];

        $scope.addComment = function () {
            if ($scope.body === '') {
                return;
            }
            $scope.post.comments.push({
                body: $scope.body,
                author: 'user',
                upvotes: 0
            });
            $scope.body = '';
        };


    }]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('posts', {
                    url: '/posts/{id}',
                    templateUrl: 'html/posts.html',
                    controller: 'posts'
                });

        $urlRouterProvider.otherwise('home');
    }]);