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
    var wall_1 = new wall(wareHouseWidth,wallHeight);
    scene.add(wall_1.build());
    wall_1.wall.position.set(-wareHouseWidth/2,0,-wareHouseHeight/2);
    arr_wall.push(wall_1);

    var wall_2 = new wall(wareHouseWidth,wallHeight);
    scene.add(wall_2.build());
    wall_2.wall.position.set(-wareHouseWidth/2,0,wareHouseHeight/2);
    arr_wall.push(wall_2);

    var wall_3 = new wall(wareHouseHeight,wallHeight);
    scene.add(wall_3.build());
    wall_3.wall.rotation.y = Math.PI/2;
    wall_3.wall.position.set(wareHouseWidth/2,0,wareHouseHeight/2);
    arr_wall.push(wall_3);

    var wall_4 = new wall(wareHouseHeight,wallHeight);
    scene.add(wall_4.build());
    wall_4.wall.rotation.y = Math.PI/2;
    wall_4.wall.position.set(-wareHouseWidth/2,0,wareHouseHeight/2);
    arr_wall.push(wall_4);


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









