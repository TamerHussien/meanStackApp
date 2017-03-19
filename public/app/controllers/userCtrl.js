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