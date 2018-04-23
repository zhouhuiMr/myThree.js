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
    myfloor = new floor(wareHouseWidth*2,wareHouseHeight*2);
    scene.add(myfloor.bulid());

    /**----------------------------------------------------------**/
    /**                                                          **/
    /**                     四面墙 前、后、左、右                **/
    /**                                                          **/
    /**----------------------------------------------------------**/
    var wall_1 = new wall(wareHouseWidth,wallHeight);
    wall_1.additional = function(rectangle){
        new frame(200,100,wareHouseWidth/2,0).build(rectangle);
        new frame(120,60,100,20).build(rectangle);
    };
    scene.add(wall_1.build());
    wall_1.wall.position.set(-wareHouseWidth/2,0,-wareHouseHeight/2);
    arr_wall.push(wall_1);

    var wall_2 = new wall(wareHouseWidth,wallHeight);
    wall_2.additional = function(rectangle){
        new frame(60,20,600,75).build(rectangle);
        new frame(60,20,120,75).build(rectangle);
    };
    scene.add(wall_2.build());
    wall_2.wall.position.set(-wareHouseWidth/2,0,wareHouseHeight/2);
    arr_wall.push(wall_2);

    var wall_3 = new wall(wareHouseHeight,wallHeight);
    wall_3.additional = function(rectangle){
        new frame(60,20,wareHouseHeight/2-30,75).build(rectangle);
    };
    scene.add(wall_3.build());
    wall_3.wall.rotation.y = Math.PI/2;
    wall_3.wall.position.set(wareHouseWidth/2,0,wareHouseHeight/2);
    arr_wall.push(wall_3);

    var wall_4 = new wall(wareHouseHeight,wallHeight);
    wall_4.additional = function(rectangle){
        new frame(60,20,wareHouseHeight/2-30,75).build(rectangle);
    };
    scene.add(wall_4.build());
    wall_4.wall.rotation.y = Math.PI/2;
    wall_4.wall.position.set(-wareHouseWidth/2,0,wareHouseHeight/2);
    arr_wall.push(wall_4);

    // var light = new THREE.PointLight( 0xffffff, 1 );
    // camera.add( light );

    /**----------------------------------------------------------**/
    /**                         可拉动的窗户                     **/
    /**----------------------------------------------------------**/
    var wareHouseWindow = new mywindow(120,60);
    wareHouseWindow.body.position.set((-wareHouseWidth/2+100),20,-wareHouseHeight/2);
    scene.add(wareHouseWindow.build());

    /**----------------------------------------------------------**/
    /**                             自动门                       **/
    /**----------------------------------------------------------**/
    var wareHouseDoor = new door(200,100);
    wareHouseDoor.body.position.set(0,0,-wareHouseHeight/2);
    scene.add(wareHouseDoor.build());




    /**-----------------------------------------------------------**/
    /**                                                          **/
    /**                         屋顶                             **/
    /**                                                          **/
    /**----------------------------------------------------------**/
    // myroof = new roof(wareHouseWidth,wareHouseHeight,wallHeight);
        // scene.add(myroof.build());

    var controls = new controller(scene,camera);

    var animate = function () {
        requestAnimationFrame( animate );

        controls.move();

        renderer.render(scene, camera);
    };
    animate();
};









