/**
 * Created by nizhiwang on 16/5/16.
 */
(function (window, document) {
  var service = angular.module("service", []);
  service.factory("jsCache",function(){
    var caches=[];
      return {
        get:function(target,callback){
          if(caches[target]){return caches[target];}
          else $http.get(target,function(data){
            caches[target]=data;
            callback&callback(data);
          })
        }
      }
  });
  service.factory('Storage', function() {
    return {
      set: function(key, data) {
        return window.localStorage.setItem(key, window.JSON.stringify(data));
      },
      get: function(key) {

        return window.JSON.parse(window.localStorage.getItem(key));
      },
      remove: function(key) {
        return window.localStorage.removeItem(key);
      }
    };
  })


})(window, document)
