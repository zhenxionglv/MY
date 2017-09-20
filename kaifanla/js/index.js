/**
 * Created by bjwsl-001 on 2017/4/13.
 */
var app = angular.module('kaifanla', ['ionic']);
//配置路由
app.config(function($stateProvider,$urlRouterProvider){
    $stateProvider
        .state('commen', {
            templateUrl: 'tpl/commen.html',
            url: '/commen',
            controller: 'commenCtrl'
        })
        .state('start', {
            templateUrl: 'tpl/start.html',
            url: '/start'
        })
        .state('commen.newmain',{
            templateUrl: 'tpl/newmain.html',
            url: '/newmain',
            controller: 'newmainCtrl'
        })
        .state('commen.main', {
            templateUrl: 'tpl/main.html',
            url: '/main',
            controller: 'mainCtrl'
        })
        .state('commen.detail', {
            templateUrl: 'tpl/detail.html',
            url: '/detail/:id',
            controller: 'detailCtrl'
        })
        .state('commen.order', {
            templateUrl: 'tpl/order.html',
            url: '/order/:cartDetail',
            controller: 'orderCtrl'
        })
        .state('commen.myorder', {
            templateUrl: 'tpl/myorder.html',
            url: '/myorder',
            controller: 'myorderCtrl'
        })
        .state('commen.cart', {
            templateUrl: 'tpl/cart.html',
            url: '/cart',
            controller: 'cartCtrl'
        })
        .state('login', {
            templateUrl: 'tpl/login.html',
            url: '/login',
            controller: 'loginCtrl'
        })
        .state('regist',{
            templateUrl:'tpl/regist.html',
            url:'regist'
        })
    $urlRouterProvider.otherwise('/start');//重定向

});
app.controller('myCtrl',['$scope','$ionicModal','$state','$customHttp','$ionicSideMenuDelegate','$interval',function($scope,$ionicModal,$state,$customHttp,$ionicSideMenuDelegate,$interval){
        //跳转方法,要发送数据，需要添加argument参数
        $scope.jump=function(state,argument){
            $state.go(state,argument);
        }

    $scope.num=9;

    //footer下menu按钮方法
    $scope.menu=function(){
        $ionicSideMenuDelegate.toggleLeft();

    }

    //创建‘关于我们’弹窗
    $ionicModal.fromTemplateUrl('tpl/aboutUsModal.html',{
        scope:$scope//把$scope传进$ionicModal中
    })
    .then(function(modal){
        $scope.modal1=modal
    })
    //创建‘退出’弹窗
    $ionicModal.fromTemplateUrl('tpl/exitModal.html',{
        scope:$scope//把$scope传进$ionicModal中
    })
        .then(function(modal){
            $scope.modal2=modal
        })

    //调用自定义‘关于我们’弹窗
    $scope.aboutUsModal=function(){
        $ionicSideMenuDelegate.toggleLeft();
        $scope.modal1.show();
    }
    //关闭自定义弹窗方法
    $scope.closeAboutUsModal=function(){
        $scope.modal1.hide();
    }
    //调用弹窗exit
    $scope.exitModal=function(){
        $ionicSideMenuDelegate.toggleLeft();
        $scope.modal2.show();
    }
    //退出弹窗中的退出登录按钮
    $scope.closeExitModal=function(a){
        $scope.modal2.hide();
        if(a){
            $scope.jump('start');
            localStorage.removeItem('userid');
            localStorage.removeItem('phone')
            $scope.cartNum.cartTotalNum=0;
        }
    }

    //进入app获取用户的id和购物车信息
    $scope.cartNum={cartTotalNum:0};
    $scope.updateCart=function(){
        if(localStorage.getItem('userid')){
            $customHttp.get('data/php/cart_select.php?uid='+localStorage.getItem('userid'),function(data){
                angular.forEach(data.data,function(v,k){
                    $scope.cartNum.cartTotalNum+= parseFloat(v.dishCount);
                })
            })
        }else{
            $scope.cartNum.cartTotalNum=0;
        }
    }
    $scope.updateCart();

    //首页计时器
    $scope.count=5;
    var timer3=$interval(function(){
        if($scope.count<=0){
            $scope.jump('commen.newmain');
            $interval.cancel(timer3);
        }else{
            $scope.count--;
        }
    },1000);
    //如果点击计时圈，则直接进入主页，并清除定时器
    $scope.leaveStart=function(){
        $scope.jump('commen.newmain');
        $interval.cancel(timer3)
    }

}])

//commenCtr
app.controller('commenCtrl',['$scope','$customHttp',function($scope,$customHttp){
    
    $scope.dishList=[];//用于存放获取数据
    $scope.hasMore=true;
    // $scope.canSearchMore=false;
    //初始化方法
   $scope.init=function(){
       $customHttp.get('data/php/dish_getbypage.php',function(data){
           $scope.dishList=data;
       });

       //go back方法
       $scope.goBack=function(){
           //$ionicHistory.goBack();//it can not work;
           //window.history.back();//it works;
           window.history.go(-1);//it works;
           //$ionicHistory.backView().back();it can not work;
       }
   }

    //监听kw的变化，与ng有些变化，kw放在对象inputTxt中
    $scope.inputTxt={kw:''};
    $scope.$watch('inputTxt.kw',function(){
        if($scope.inputTxt.kw){
            $scope.canSearchMore=false;
            $customHttp.get('data/php/dish_getbykw.php?kw='+$scope.inputTxt.kw,function(data){
                $scope.dishList=data;
            })
        }else{
            $scope.canSearchMore=true;
            $scope.init();
        }
    })


}])

//很多地方都用到的，可以封装成服务，注入服务去使用
app.service('$customHttp',['$http','$ionicLoading',function($http,$ionicLoading){
    this.get=function(url,handleSucc){
        $ionicLoading.show({
            template:'loading...',
            duration:500
        });
        $http
            .get(url)
            .success(function(data){
               $ionicLoading.hide();
                handleSucc(data);//处理返回data的方法
            })
    }
}]);

//newmain 控制器
app.controller('newmainCtrl',['$scope',function($scope){
    //定义图片轮播数组
    $scope.banList=[
        {src:'gongbaojiding.png',title:'图片1',href:''},
        {src:'menfan.jpg',title:'图片2',href:''},
        {src:'qiezi.jpg',title:'图片3',href:''},
        {src:'kelejichi.png',title:'图片4',href:''},
    ];

    $scope.init();

    //加载更多
       $scope.loadMore=function() {
            var url = 'data/php/dish_getbypage.php?start=' + $scope.dishList.length;
             $customHttp.get(url, function (data) {
                if (data.length < 5) {
                    $scope.hasMore = false;
                } else {
                    $scope.hasMore = true;
                }
                $scope.dishList = $scope.dishList.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete')
        })
    };
}])

//主页面控制器
app.controller('mainCtrl',['$scope','$customHttp',function($scope,$customHttp){
//     $scope.dishList=[];//用于存放获取数据
//     $scope.hasMore=true;
//     $scope.canSearchMore=false;
//     //初始化方法
//    function init(){
//        $customHttp.get('data/php/dish_getbypage.php',function(data){
//            $scope.dishList=data;
//        });
//    }
//     init();
    // //封装加载更多方法 判断canSearchMore的值决定请求的url
    // $scope.loadMore=function() {
    //     if($scope.canSearchMore==true) {
    //         var url = 'data/php/dish_getbypage.php?start=' + $scope.dishList.length;
    //     }else{
    //         var url='data/php/dish_getbykw.php?kw='+$scope.inputTxt.kw+'&start='+$scope.dishList.length;
    //     }
    //     $customHttp.get(url, function (data) {
    //         if (data.length < 5) {
    //             $scope.hasMore = false;
    //         } else {
    //             $scope.hasMore = true;
    //         }
    //         $scope.dishList = $scope.dishList.concat(data);
    //         $scope.$broadcast('scroll.infiniteScrollComplete')
    //     })
    // };

    //监听kw的变化，与ng有些变化，kw放在对象inputTxt中
    $scope.inputTxt={kw:''};
    $scope.$watch('inputTxt.kw',function(){
        if($scope.inputTxt.kw){
            $scope.canSearchMore=false;
            $customHttp.get('data/php/dish_getbykw.php?kw='+$scope.inputTxt.kw,function(data){
                $scope.dishList=data;
            })
        }else{
            $scope.canSearchMore=true;
            $scope.init();
        }
    })

}])

//detail页面控制器
app.controller('detailCtrl',['$scope','$stateParams','$customHttp','$ionicPopup',function($scope,$stateParams,$customHttp,$ionicPopup){
    $customHttp.get('data/php/dish_getbyid.php?id='+$stateParams.id,function(data){
        $scope.dish=data[0];
    })
    //发送uid给购物车页面方法,先判断用户是否登录
    $scope.addToCart=function(){
       if(localStorage.getItem('userid')){//存在用户则可以加入购物车
           $customHttp.get('data/php/cart_update.php?uid='+localStorage.getItem('userid')+'&did='+$scope.dish.did+'&count=-1',function(data){
               //console.log(data)
               if(data.msg=='succ'){
                   $scope.cartNum.cartTotalNum++;
                   $ionicPopup.alert({
                       template:'添加成功!'
                   })
               }
           })
       }else{
           $ionicPopup.alert({
               template:'您还没登录，请先登录'
           })
               .then(function(){
                   $scope.jump('login')
               })
       }
    }
}]);

//order页面控制器
app.controller('orderCtrl',['$scope','$stateParams','$customHttp','$httpParamSerializerJQLike','$interval',function($scope,$stateParams,$customHttp,$httpParamSerializerJQLike,$interval){
    var totalPrice=0;

    //解码json格式数据再遍历拿数据，计算价格
    angular.forEach(angular.fromJson($stateParams.cartDetail),function(value,key){
        totalPrice+=value.price*value.dishCount;
    })

    $scope.order={userid:localStorage.getItem('userid'),cartDetail:$stateParams.cartDetail,
    totalPrice:totalPrice};

    //id存于localStorage中
    $scope.submitOrder=function(){
        var result=$httpParamSerializerJQLike($scope.order);
        //console.log(result)
        $customHttp.get('data/php/order_add.php?'+result,function(data){
            console.log(data)
            if(data.length>0){//如果返回的数据不为空
                if(data[0].msg=='succ'){//如果返回的是成功的数据
                    $scope.msgSucc='恭喜您，下单成功。订单编号为：'+data[0].oid;
                    $scope.cartNum.cartTotalNum=0;//下单成功则清空购物车
                    //2秒后跳转到个人主页
                    $scope.second=2;
                    $interval(function(){
                        $scope.second--;
                        if($scope.second==0)
                            $scope.jump('commen.myorder')
                    },1000)
                    localStorage.setItem('phone',$scope.order.phone)
                }
                else{
                    $scope.msgErr='下单失败！'
                }
            }
        })
    }
}]);

//myorder页面控制器
app.controller('myorderCtrl',['$scope','$customHttp','$interval',function($scope,$customHttp,$interval){
    //console.log(phone);
    var userid=localStorage.getItem('userid');
    $scope.hasUser=true;
    $scope.seconds=3;
    if(userid==null){//如果用户没登录
        $scope.hasUser=false;
        var timer2=$interval(function(){
            $scope.seconds--;
            if($scope.seconds==0){
                $interval.cancel(timer2);
                $scope.jump('login');
            }
        },1000);

    }else{
        $scope.hasUser=true;
        $customHttp.get('data/php/order_getbyuserid.php?userid='+userid,function(data){
            //console.log(data)
            $scope.orderList=data.data;
        });
    }

}]);

//购物车控制器
app.controller('cartCtrl',['$scope','$customHttp','$ionicPopup',function($scope,$customHttp,$ionicPopup){
    $customHttp.get('data/php/cart_select.php?uid='+localStorage.getItem('userid'),function(data){
        $scope.cartList=data.data;//由于返回的是对象，对象的data里面存着我们的数据数组
        $scope.$emit('carList',$scope.cartList);
        //进入购物车时，将服务器返回的所有数据的数量累加
        //赋值给cartTotalNum
        $scope.cartTotalNum=function(){
            $scope.cartNum.cartTotalNum=0;
            angular.forEach($scope.cartList,function(value,key){
                $scope.cartNum.cartTotalNum+=parseFloat(value.dishCount);
            })
        }
        $scope.cartTotalNum();
    })

    //总计函数
    $scope.sumAll=function(){
        var sum=0;
        angular.forEach($scope.cartList,function(value,key){
            sum+=value.price*value.dishCount;
        })
        return  sum;
    }

    //编辑按钮
    $scope.editTxt='编辑';
    $scope.editEnable=false;
    $scope.edit=function(){
        $scope.editEnable=!$scope.editEnable;
        if($scope.editEnable){
            $scope.editTxt='完成';
        }else{
            $scope.editTxt='编辑';
        }
    }

    //删除按钮
    $scope.cartDelete=function(index){
        $ionicPopup.confirm({
            template:'确定删除该商品？'
        }).then(function(returnMsg){
            if(returnMsg){
                //console.log($scope.cartList)
                $customHttp.get('data/php/cart_update.php?uid='+localStorage.getItem('userid')+'&did='+$scope.cartList[index].did+'&count=-2',function(data){//服务器请求成功才删除页面中的
                    console.log(data);
                    $scope.cartNum.cartTotalNum-=parseFloat($scope.cartList[index].dishCount);
                    $scope.cartList.splice(index,1);
                })
            }
        })
    }

    //添加方法
    $scope.add=function(index){
        $scope.cartList[index].dishCount++;
        $customHttp.get('data/php/cart_update.php?uid=1&did='+$scope.cartList[index].did+'&count='+$scope.cartList[index].dishCount,function(data){
            $scope.cartTotalNum();
        })
    }
    //减少方法
    $scope.minus=function(index){
        $scope.cartList[index].dishCount--;
        if($scope.cartList[index].dishCount<1){
            return $scope.cartList[index].dishCount=1;
        }else{//否则添加到数据库中
            $customHttp.get('data/php/cart_update.php?uid=1&did='+$scope.cartList[index].did+'&count='+$scope.cartList[index].dishCount,function(data){
                $scope.cartTotalNum();
            })
        }
    }

    //跳转到order页面方法
    $scope.jumpToOrder=function(){
        //将购物车返回的数据转换成json格式数据发送给order页面
        var result=angular.toJson($scope.cartList)
        $scope.jump('commen.order',{cartDetail:result})
    }
}])

//登录控制器
app.controller('loginCtrl',['$scope','$ionicHistory','$customHttp','$ionicPopup',function($scope,$ionicHistory,$customHttp,$ionicPopup){
    if(localStorage.getItem('userid')){
        $scope.showLogin=false;
    }else{
        $scope.showLogin=true;
    }
    $scope.cancelLogin=function(){//cancel login
        $scope.jump('commen.main');
    }

    //login verify
    $scope.inputTxt={};//先给其定义一个空对象，必须
    $scope.loginSubmit=function(){
        //判断用户名或者密码是否为空
        if($scope.inputTxt.userName=='' || $scope.inputTxt.userPwd==undefined || $scope.inputTxt.userPwd=='' || $scope.inputTxt.userPwd==undefined){
            $ionicPopup.alert({
                template:'用户名或密码不能为空'
            })
            return;
        }else{
            $customHttp.get('data/php/login.php?userName='+$scope.inputTxt.userName+'&userPwd='+$scope.inputTxt.userPwd,function(data){
                console.log(data)
                if(data.code){
                    $scope.errMsg=data.msg;
                    $ionicPopup.alert({
                        template:$scope.errMsg
                    })
                }else{
                    localStorage.setItem('userid',data[0].userid);
                    console.log(data[0].userid)
                    $scope.jump('commen.myorder');
                    $scope.updateCart();
                }
            })
        }
    }
}])
