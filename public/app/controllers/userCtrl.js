angular.module('userControllers', ['userServices'])


.controller('regCtrl', function($http, $location, $timeout, User){
   
    var app = this;
    
    this.regUser = function(regData){
        
        app.errorMsg = false;
        
        app.loading = true;
                
       User.create(app.regData).then(function(data){
          
            app.show = data.data.success;
            
            if (data.data.success){
                
                app.loading = false;
                
                app.successMsg = data.data.message  + '.... Redirecting to HomePage';
                
                $timeout(function(){
                    
                    $location.path('/');
                }, 2000);
                
            } else {
                
                app.loading = false;
                
                app.errorMsg = data.data.message;
            }
        });
    };
})

.controller('facebookCtrl', function($routeParams, Auth, $location, $window){
    
    var app = this;
    
    if ($window.location.pathname == '/facebookerror') {
        
    app.errorMsg = 'Facebook account email cannot found in our database';

    } else {
        
       
    Auth.facebook($routeParams.token);
    
    $location.path('/'); 
    }
    
    
});