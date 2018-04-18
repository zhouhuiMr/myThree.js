window.onload = function(){
    var SceneWidth = document.body.offsetWidth,
        SceneHeight = document.body.offsetHeight;

    var wareHouseWidth = 800,  //仓库长
        wareHouseHeight = 600, //仓库宽
        wallHeight = 100;      //仓库墙高

    var myfloor = null, //地面
        arr_wall = new Array(), //墙面的数组
        myroof = null; //屋顶

    var scene = new THREE.Scene(); // 场景
    scene.background = new THREE.Color( 0x000000);

    var camera = new THREE.PerspectiveCamera(75, SceneWidth / SceneHeight, 1, 1500); //相机的设置
    camera.position.set( 0, 10, 0);

    //渲染的方式
    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(SceneWidth, SceneHeight);
    document.body.appendChild( renderer.domElement);

    /**-----------------------------------------------------------**/
    /**                                                          **/
    /**                         地面                             **/
    /**                                                          **/
    /**----------------------------------------------------------**/
    myfloor = new floor(wareHouseWidth,wareHouseHeight);
    scene.add(myfloor.bulid());

    /**----------------------------------------------------------**/
    /**                                                          **/
    /**                     四面墙 前、后、左、右                **/
    /**                                                          **/
    /**----------------------------------------------------------**/
    var front_wall = new wall(wareHouseWidth,wallHeight);
    scene.add(front_wall.build());
    front_wall.wall.position.z = wareHouseHeight/2;
    front_wall.wall.position.y = front_wall.height/2;
    arr_wall.push(front_wall);

    var back_wall = new wall(wareHouseWidth,wallHeight);
    scene.add(back_wall.build());
    back_wall.wall.position.z = -wareHouseHeight/2;
    back_wall.wall.position.y = back_wall.height/2;
    arr_wall.push(back_wall);

    var left_wall = new wall(wareHouseHeight,wallHeight);
    scene.add(left_wall.build());
    left_wall.wall.position.x = -wareHouseWidth/2;
    left_wall.wall.position.y = left_wall.height/2;
    left_wall.wall.rotation.y = - Math.PI / 2;
    arr_wall.push(left_wall);

    var right_wall = new wall(wareHouseHeight,wallHeight);
    scene.add(right_wall.build());
    right_wall.wall.position.x = wareHouseWidth/2;
    right_wall.wall.position.y = right_wall.height/2;
    right_wall.wall.rotation.y = - Math.PI / 2;
    arr_wall.push(right_wall);

    /**-----------------------------------------------------------**/
    /**                                                          **/
    /**                         屋顶                             **/
    /**                                                          **/
    /**----------------------------------------------------------**/
    myroof = new roof(wareHouseWidth,wareHouseHeight,wallHeight);
    scene.add(myroof.build());

    var controls = new controller(scene,camera);

    var animate = function () {
        requestAnimationFrame( animate );

        controls.move();

        renderer.render(scene, camera);
    };
    animate();
};









