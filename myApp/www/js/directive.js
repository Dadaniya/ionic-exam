/**
 * Created by nizhiwang on 16/5/16.
 */
(function (window, document) {
  var app = angular.module("directive", []);
  app.directive("pExpander", ["$http", function ($http) {
    return {
      restrict: 'EA',
      templateUrl: "./templates/expander.html",
      // require: '^?pAccordion',
      replace: true,
      transclude: true,
      link: function (scope, element, attrs) {
        var title = attrs.expanderTitle;
        scope.msg = {}//showMe dirty检查是否是第一次
        scope.toggle = function () {
          scope.msg.showMe = !scope.msg.showMe;
          if (!scope.msg.dirty) {
            // $http.get("./" + attrs.expanderTitle + ".json", {cache: true}).success(
            //   function (data) {
            //     console.log(data);
            //     scope.items = data.data;
            //   }
            // ).error(function (err) {
            //   console.log(err);
            // })
            if (localStorage.getItem(title)) {
              scope.items = JSON.parse(localStorage.getItem(title));
            }
            else {
              $http(
                {
                  method: "GET",
                  url: "http://localhost:3000/subName/" + attrs.expanderTitle,
                  responseType: "json"
                }
              ).success(function (data, status, headers, config) {
                console.log(data.data);
                if (data.code == 'ok') {
                  console.log(data);
                  localStorage.setItem(title, JSON.stringify(data.data));
                  scope.items = data.data;


                }
              })
            }
            angular.forEach(scope.items, function (value, index) {
              var bool=JSON.parse(localStorage.getItem(value._id));
              if(bool){
                scope.items[index].done = bool.done||0;
                scope.items[index].score = bool.score||0;}
              else {

              scope.items[index].done = 0;
              scope.items[index].score = 0;
              }
            });

          }
        };
      }
    }
  }]);
  app.directive("timeLeft", function () {
    return {
      restrict: 'EA',
      templateUrl: "./templates/time.left.html",
      repalce: true,
      scope: {},
      link: function (scope, ele, attr) {
        var count = 50;
        var limit = ( parseInt(attr.limit, 10) || 10) * 60;//limit限时,单位分,转化为秒,默认10min
        var target = angular.element(ele).find("span");

        var timer = window.setInterval(function () {
          count++;
          clock = Math.floor((limit - count) / 60) + ':' + (limit - count) % 60;

          target[0].innerHTML = clock.replace(/(\d)\:(\d)$/, "0$1:0$2");
          if (count >= limit) {
            clearInterval(timer)
            scope.$emit('submitExam');//执行提交操作.

          }
        }, 1000);
        scope.$on('$destory', function () {
          clearInterval(timer);
        });
        scope.$on('examFinished', function (e) {
          e.preventDefault();
          // e.stopPropagation();
          clearInterval(timer);
        })
      },

    }
  })

})(window, document)
