/*
 *openDb
 */
var myDB = {
  name: 'exam',
  db: null,
  version: 1
};

function openDB(dbName, table, cb) {
  var request = window.indexedDB.open(dbName, 2);

  request.onsuccess = function (event) {

    var db = event.target.result;
    // indexedDB.deleteDatabase('exam');
    // return;
    var t = db.transaction([table], 'readwrite');
    var store = t.objectStore(table);
    cb(store);
  };

  request.onupgradeneeded = function (event) {
    var db = event.target.result;

    if (!db.objectStoreNames.contains(table)) {

      var store =db.createObjectStore(table, {autoIncrement: true});
      store.createIndex(table, table, {unique: false});   //要求表名和下面字段一致

    }

  };
}

angular.module('starter.controllers', [])
  .controller('MyCtrl', function ($rootScope) {

  })

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http, $rootScope, $ionicPopup) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    // 注册和登陆表单数据
    $scope.loginData = {};
    $scope.signData = {};
    //其实应该用cookie
    $scope.user = window.localStorage.getItem('user');
    $scope.$on('userChanged', function (e) {
      e.stopPropagation();
      $scope.user = window.localStorage.getItem('user');

      $scope.user = window.localStorage.getItem('user');
    });

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope,
      amimation: "slide-in-left",
    }).then(function (modal) {
      $scope.modal = modal;

    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };
    $scope.logout = function () {

      var confirmPopup = $ionicPopup.confirm({
        title: 'LogOut',
        template: 'Are you Sure?'
      });
          confirmPopup.then(function (res) {
        if (res) {
          $scope.user = null;
          localStorage.removeItem('user');
        } else {
        }
      });
    }
    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      $http({
        method: "POST",
        url: "http://localhost:3000/user/login",
        data: $scope.loginData,
        responseType: "json"
      }).success(function (data, status, headers, config) {
        if (data.code == 'ok') {


          window.localStorage.setItem('user', $scope.loginData.name);//后期改成cookie
          $scope.$emit('userChanged');
          $timeout(function () {
            $scope.closeLogin();
          }, 1000);
        }
      }).error(function (data) {
      });
      $rootScope.num = localStorage.getItem('num') || 10;
      $rootScope.offset = localStorage.getItem('offset') || 0;

    };


    $ionicModal.fromTemplateUrl('templates/sign.html', {
      scope: $scope,
      amimation: 'slide-in-up',
    }).then(function (modal) {
      $scope.signModal = modal;
    });
    $scope.sign = function () {
      $scope.closeLogin();
      $scope.signModal.show();
    };
    $scope.closeSign = function () {
      $scope.signModal.hide();
    };
    $scope.doSign = function () {
      $http({
        method: "POST",
        url: "http://localhost:3000/user/sign",
        data: $scope.signData,
        responseType: "json"
      }).success(function (data, status, headers, config) {
        if (data.code == 'ok') {
          $scope.signData.info = 'success';
          // $rootScope.$emit('sign',$scope.loginData.name);
          // console.log($rootScope.user);
        }
        else {
          $scope.signData.info = data.reason || 'failed';
        }
      }).error(function (data) {
        $scope.signData.info = 'failed';
      });
      // $timeout(function () {
      //   $scope.closeSign();
      // }, 1000);
    };

  })

  .controller('ExamCtrl', function ($scope, $ionicHistory, $ionicLoading, $timeout, $stateParams, $http) {
    var num = $stateParams.num || 10;
    var offset = $stateParams.offset || 0;
    var category = $stateParams.category;
    $scope.myanswer = {};
    $ionicLoading.show({
      template: "生成试卷.....",
    });
    $http(
      {
        method: "GET",
        url: "http://localhost:3000/question/" + offset + "/" + num + "/" + category,
        responseType: "json"
      }
    ).success(function (data, status, headers, config) {
      if (data.code == 'ok') {
        $scope.questions = data.data;
        for (var i = 0; i < $scope.questions.length; i++) {
          $scope.questions[i].answer = $scope.questions[i].answer.map(function (value, index) {
            if ($scope.questions[i].type == 'checkbox') {
              $scope.myanswer[$scope.questions[i]._id] = new Set();
            }
            return {num: String.fromCharCode(65 + index), text: value}
          })
        }
        ;
        $timeout(function () {
          $ionicLoading.hide();
        }, 1000);

      }
    })


    /*
     *own是set,且是0,1,2,3...
     * standard为'ABC'的字符串,计算得分
     *set compare,中是部分得0.5,全部1 否则0
     */
    function setCompare(own, standard) {
      var values1 = own,
        values2 = standard;
      var len1 = values1.size, len2 = values2.length;
      if (len1 == len2) {
        for (value of values1) {
          debugger;
          if (values2.indexOf(String.fromCharCode(value + 65)) < 0) {
            return 0;
          }

        }
        return 1;

      }
      else if (len1 < len2 && len1 > 0) {
        for (value of values1) {
          if (values2.indexOf(String.fromCharCode(value + 65)) == -1) {
            return 0;
          }

        }
        return 0.5
      }

      return 0;
    }

    /*
     *交卷
     */
    // var spinner= $ionicModal.fromTemplate('<div style="disptop:50%;left:50%;"><ion-spinner></ion-spinner></div>',{
    //
    //   amimation:'slide-in-up',
    // });\
    $scope.showAnswer = false;
    $scope.submitExam = function () {
      $scope.$broadcast('examFinished');
      $ionicLoading.show({
        template: "计算结果中.....",
      }).then(function () {
        var sum = 0;//考试得分
        angular.forEach($scope.questions, function (value, index) {
          if (value.type == 'radio') {

            $scope.questions[index].score = value.rightA == String.fromCharCode(65 + $scope.myanswer[value._id]) ? 1 : 0;

          }
          else {
            $scope.questions[index].score = setCompare($scope.myanswer[value._id], value.rightA);

          }
          sum += $scope.questions[index].score;
        });
        $scope.slider.slideTo($scope.questions.length);
        openDB(myDB.name, 'question', function (store) {
          angular.forEach($scope.questions, function (value) {
            store.add(value);

          })
        });

        var key = $scope.questions[0].category;
        var len = $scope.questions.length;
        var old = JSON.parse(localStorage.getItem(key)) || {};
        localStorage.setItem(key, JSON.stringify({
          done: parseInt(old.done || 0) + len,
          score: parseInt(old.score || 0) + sum,
        }));
      });


      $timeout(function () {
        $scope.showAnswer = true;
        $ionicLoading.hide().then();
      }, 1000);
      //
    };

    $scope.workChecked = function (key, index) {
      if (event.target.checked) {
        $scope.myanswer[key].add(index);
      }
      else {
        $scope.myanswer[key].delete(index);
      }
    }


    $scope.$on('submitExam', function (e) {
      e.stopPropagation();
      $scope.submitExam();
    })
    $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
      // data.slider is the instance of Swiper
      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
      // note: the indexes are 0-based
      $scope.activeIndex = data.activeIndex;
      $scope.previousIndex = data.previousIndex;
    });
    $scope.options = {    //更改ionSlides中link scope.pager=false 不显示
      loop: false,
      effect: 'fade',
      speed: 500,
    };
  })
  .controller('HomeCtrl', function ($scope, $http,$state,$ionicPopup) {
    /*
     *判断试题是否足够生成试卷
     */
    $scope.exam = function (all, done, num, id) {
      num = num || 5;//默认5题目
      if (all - done < num) {
       $ionicPopup.alert({
          title: '抱歉!',
          template: '余下试题不足以生成试卷'
        }).then(function (res) {});
      }
      else {
        $state.go('exam', {offset: done, num: num, category: id})
      }
    }
    if (localStorage.getItem('category')) {
      $scope.articleList = JSON.parse(localStorage.getItem('category'));
    }
    else {
      $http(
        {
          method: "GET",
          url: "http://localhost:3000/category",
          responseType: "json"
        }
      ).success(function (data, status, headers, config) {
        if (data.code == 'ok') {
          localStorage.setItem('category', JSON.stringify(data.data));
          $scope.articleList = data.data;
        }
      })
    }

  })
  .controller('SubscriptCtrl', function ($scope, $ionicHistory, $ionicLoading, $timeout, $stateParams, $http) {
    $scope.questions = [];
    openDB(myDB.name, 'question', function (store) {
      var cursor = store.openCursor();
      cursor.onsuccess = function (e) {
        var data = e.target.result;
        if (data) {
          $scope.questions.push(data.value);


          data.continue();
        }
      }
    })

    $scope.options = {    //更改ionSlides中link scope.pager=false 不显示
      loop: false,
      effect: 'fade',
      speed: 500,
    };
    $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
      // data.slider is the instance of Swiper
      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
      // note: the indexes are 0-based
      $scope.activeIndex = data.activeIndex;
      $scope.previousIndex = data.previousIndex;
    });


  });




