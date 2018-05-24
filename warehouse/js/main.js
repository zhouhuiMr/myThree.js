window.onload = function(){
    var SceneWidth = document.body.offsetWidth,
        SceneHeight = document.body.offsetHeight;

    /**----------------------------------------------------------**/
    /**                     仓库参数设置                         **/
    /**               按照1：5的比例，1米 = 5                    **/
    /**                 实际宽50m，长140m                       **/
    /**----------------------------------------------------------**/
    var wareHouseWidth = 60,  //仓库宽
        wareHouseHeight = 80, //仓库长
        wareHouseWallHeight = 30;      //仓库墙高

    var myfloor = null, //地面
        arr_wall = new Array(), //墙面的数组
        myroof = null; //屋顶

    var isUseShadow = false; // 是否使用阴影

    var scene = new THREE.Scene(); // 场景
    scene.background = new THREE.Color( 0x000000);

    var camera = new THREE.PerspectiveCamera(75, 1, 1, 200); //相机的设置
    camera.position.set( 0, -1, 0);


    //渲染的方式
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio);
    renderer.setSize(SceneWidth, SceneHeight);
    if(isUseShadow){
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
    }
    document.body.appendChild( renderer.domElement);

    /**----------------------------------------------------------**/
    /**                          灯光                             **/
    /**----------------------------------------------------------**/
    var ambientLight = new THREE.AmbientLight( 0xffffff,0.9);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight( 0xffffff,1);
    spotLight.position.set( 0, 700, 0 );

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 1000;
    spotLight.shadow.camera.fov = 30;
    scene.add( spotLight );
    //
    // var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    // scene.add( spotLightHelper );

    /**----------------------------------------------------------**/
    /**                        辅助功能                          **/
    /**----------------------------------------------------------**/
    var axesHelper = new THREE.AxesHelper(wareHouseWidth);
    scene.add( axesHelper );

    var controls = new controller(scene,camera);

    var warHouse = new THREE.Group();
    /**----------------------------------------------------------**/
    /**                          地面                             **/
    /**----------------------------------------------------------**/
    var wareFloor = new floor(wareHouseWidth*2,wareHouseHeight*2);
    scene.add(wareFloor.build());

    /**----------------------------------------------------------**/
    /**                         墙体的建造                       **/
    /**----------------------------------------------------------**/
    var wareWall = new wall(wareHouseWidth,wareHouseHeight,wareHouseWallHeight);
    scene.add(wareWall.build());

    var door = new wareDoor(25,20,0.5);
    door.body.position.set(0,0,0.1-wareHouseHeight/2);
    scene.add(door.build());

    var toTop = 6.5;
    for(var i=1;i<=4;i++){
        var pipe_1 = new ventpipe(5,3,0.4);
        var pipe_2 = new ventpipe(5,3,0.4);
        if(i <= 2){
            pipe_1.body.rotation.y = Math.PI / 2;
            pipe_1.body.position.set(wareHouseWidth / 2,wareHouseWallHeight - toTop,Math.pow(-1,i) * wareHouseHeight / 3);
            pipe_2.body.rotation.y = Math.PI / 2;
            pipe_2.body.position.set(wareHouseWidth / 2,wareHouseWallHeight - toTop,Math.pow(-1,i) * wareHouseHeight / 9);
        }else{
            pipe_1.body.rotation.y = -1 * Math.PI / 2;
            pipe_1.body.position.set(0.4 - 1 * wareHouseWidth / 2,wareHouseWallHeight - toTop,Math.pow(-1,i) * wareHouseHeight / 3);
            pipe_2.body.rotation.y = -1 * Math.PI / 2;
            pipe_2.body.position.set(0.4 - 1 *wareHouseWidth / 2,wareHouseWallHeight - toTop,Math.pow(-1,i) * wareHouseHeight / 9);
        }
        scene.add(pipe_1.build());
        scene.add(pipe_2.build());
    }
    var pipe_3 = new ventpipe(5,3,0.4);
    pipe_3.body.position.set(wareHouseWidth / 4,wareHouseWallHeight - toTop,wareHouseHeight / 2);
    scene.add(pipe_3.build());
    var pipe_4 = new ventpipe(5,3,0.4);
    pipe_4.body.position.set(-wareHouseWidth / 4,wareHouseWallHeight - toTop,wareHouseHeight / 2);
    scene.add(pipe_4.build());

    //创建货架
    var shelfWidth = 10,
        shelfHeight = 20,
        shelfDepth = 3;
    var toLREdge = shelfWidth / 2  + 3;
    var toFBEdge = shelfDepth / 2 + 10;
    var shelfDistence = 15;
    for(var i = 0 ; i < 3 ; i ++){
        var leftshelf1 = new shelf(shelfWidth,shelfHeight,shelfDepth);
        leftshelf1.body.position.set( wareHouseWidth / 2 - toLREdge,0,wareHouseHeight / 2 - toFBEdge - shelfDistence * i);
        scene.add(leftshelf1.body);
        var leftshelf2 = new shelf(shelfWidth,shelfHeight,shelfDepth);
        leftshelf2.body.position.set( wareHouseWidth / 2 - toLREdge - shelfWidth -1,0,wareHouseHeight / 2 - toFBEdge - shelfDistence * i);
        scene.add(leftshelf2.body);
        var rightshelf1 = new shelf(shelfWidth,shelfHeight,shelfDepth);
        rightshelf1.body.position.set(toLREdge - wareHouseWidth / 2 ,0,wareHouseHeight / 2 - toFBEdge - shelfDistence * i);
        scene.add(rightshelf1.body);
        var rightshelf2 = new shelf(shelfWidth,shelfHeight,shelfDepth);
        rightshelf2.body.position.set(toLREdge + shelfWidth + 1 - wareHouseWidth / 2 ,0,wareHouseHeight / 2 - toFBEdge - shelfDistence * i);
        scene.add(rightshelf2.body);
    }

    var tree = new pinetree(5,50,0);
    scene.add(tree.build());


    var animate = function () {
        requestAnimationFrame( animate );

        controls.move();

        renderer.render(scene, camera);
    };
    animate();
};









