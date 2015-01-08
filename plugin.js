/**
 * Plugin Test-895765 Controller
 */
plugin.controller('test895765Cntl', ['$scope', 'znData', 'znConfirm', 'znMessage', '$q', '$routeParams', function ($scope, znData, znConfirm, znMessage, $q, $routeParams) {
    
	$scope.taskForm = {};
    $scope.todos = [];
    
	$scope.refresh = function() {
	    $scope.loading = true;
	    
    	$q.all([
    		znData('Tasks').query({
    		        status: 'open|in-progress|completed'
    		    },
    			function success(response) {
    				$scope.todos = response.map(task2Todo);
    			},
    			function error(response) {
    				console.log('Error loading todoForm!');
    			}
    		)
    	]).then(function () {
    		$scope.loading = false;
    	});
	};

    $scope.addTodo = function() {
        $scope.loading = true;
        
        znData('Tasks').save({
            'workspace.id': $routeParams.workspace_id,
            task: $scope.todoForm.text
        }).then(function(response) {
            znMessage("Todo added", "saved");
            
            $scope.refresh();
        });
        
        $scope.todoForm = {};
    };
    
    $scope.updateTodo = function(todo) {
        $scope.loading = true;
        
        znData('Tasks').save({
            'workspace.id': $routeParams.workspace_id,
            id: todo.id,
            status: !todo.completed ? 'completed' : 'open'
        }).then(function() {
            znMessage("Todo updated", "saved");
            
            $scope.refresh();
        });
    };
    
    $scope.removeTodo = function(todo) {
        znConfirm("Are you sure you want to delete this todo?", function() {
            $scope.loading = true;
            
            znData('Tasks').delete({
                id: todo.id
            }).then(function() {
                znMessage("Todo removed");
                
                $scope.refresh();
            });        
        })
    };
    
    $scope.refresh();
    
    function task2Todo(task) {
        return {
	        completed: task.status === 'completed',
	        text: task.task,
	        id: task.id
    	};
    }
}])

/**
 * Plugin Registration
 */
.register('test895765', {
    route: '/test895765',
    controller: 'test895765Cntl',
    template: 'test895765-main',
    title: 'Test-895765 Plugin',
    pageTitle: false,
    type: 'fullPage',
    topNav: true,
    order: 300,
    icon: 'icon-puzzle'
});
