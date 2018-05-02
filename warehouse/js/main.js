window.onload = function(){
    var SceneWidth = document.body.offsetWidth,
        SceneHeight = document.body.offsetHeight;

    var wareHouseWidth = 600,  //仓库长
        wareHouseHeight = 400, //仓库宽
        wallHeight = 100;      //仓库墙高

    var myfloor = null, //地面
        arr_wall = new Array(), //墙面的数组
        myroof = null; //屋顶

    var isUseShadow = false; // 是否使用阴影

    var scene = new THREE.Scene(); // 场景
    scene.background = new THREE.Color( 0x000000);

    var camera = new THREE.PerspectiveCamera(75, SceneWidth / SceneHeight, 1, 1500); //相机的设置
    camera.position.set( 0, 20, 0);


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

    var spotLight = new THREE.SpotLight( 0xffffff,0.9);
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


    var warHouse = new THREE.Group();
    /**----------------------------------------------------------**/
    /**                          地面                             **/
    /**----------------------------------------------------------**/
    myfloor = new floor(wareHouseWidth*2,wareHouseHeight*2);
    warHouse.add(myfloor.bulid());

    /**----------------------------------------------------------**/
    /**                     四面墙 前、后、左、右                    **/
    /**----------------------------------------------------------**/
    var wall_1 = new wall(wareHouseWidth,wallHeight);
    wall_1.additional = function(rectangle){
        new frame(200,100,wareHouseWidth/2,0).build(rectangle);
        new frame(120,60,100,20).build(rectangle);
    };
    warHouse.add(wall_1.build());
    wall_1.wall.position.set(-wareHouseWidth/2,0,-wareHouseHeight/2);
    arr_wall.push(wall_1);

    var wall_2 = new wall(wareHouseWidth,wallHeight);
    wall_2.additional = function(rectangle){
        new frame(60,20,wareHouseWidth/3,75).build(rectangle);
        new frame(60,20,2*wareHouseWidth/3,75).build(rectangle);
    };
    warHouse.add(wall_2.build());
    wall_2.wall.position.set(-wareHouseWidth/2,0,wareHouseHeight/2);
    arr_wall.push(wall_2);

    var wall_3 = new wall(wareHouseHeight,wallHeight);
    wall_3.additional = function(rectangle){
        new frame(60,20,wareHouseHeight/2-30,75).build(rectangle);
    };
    warHouse.add(wall_3.build());
    wall_3.wall.rotation.y = Math.PI/2;
    wall_3.wall.position.set(wareHouseWidth/2,0,wareHouseHeight/2);
    arr_wall.push(wall_3);

    var wall_4 = new wall(wareHouseHeight,wallHeight);
    warHouse.additional = function(rectangle){
        new frame(60,20,wareHouseHeight/2-30,75).build(rectangle);
    };
    warHouse.add(wall_4.build());
    wall_4.wall.rotation.y = Math.PI/2;
    wall_4.wall.position.set(-wareHouseWidth/2,0,wareHouseHeight/2);
    arr_wall.push(wall_4);
    scene.add(warHouse);

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

    /**----------------------------------------------------------**/
    /**                             通风口                       **/
    /**----------------------------------------------------------**/
    var airDuct_1 = new airDuct(60,20);
    airDuct_1.body.position.set(wareHouseWidth/6,75,wareHouseHeight/2);
    scene.add(airDuct_1.build());

    var airDuct_2 = new airDuct(60,20);
    airDuct_2.body.position.set(-wareHouseWidth/6,75,wareHouseHeight/2);
    scene.add(airDuct_2.build());

    var airDuct_3 = new airDuct(60,20);
    airDuct_3.body.position.set(wareHouseWidth/2,75,30);
    airDuct_3.body.rotation.y = Math.PI/2;
    scene.add(airDuct_3.build());

    var airDuct_4 = new airDuct(60,20);
    airDuct_4.body.position.set(-wareHouseWidth/2,75,30);
    airDuct_4.body.rotation.y = Math.PI/2;
    scene.add(airDuct_4.build());

    /**----------------------------------------------------------**/
    /**                           柱子                            **/
    /**----------------------------------------------------------**/
    var pillarWidth = 10,
        pillarHeight = 10;
    var pillar_1 = new pillar(pillarWidth,wallHeight,pillarHeight);
    pillar_1.body.position.set(wareHouseWidth/2-pillarWidth/2,wallHeight/2,-wareHouseHeight/2+pillarHeight/2);
    scene.add(pillar_1.build());

    var pillar_2 = new pillar(pillarWidth,wallHeight,pillarHeight);
    pillar_2.body.position.set(-wareHouseWidth/2+pillarWidth/2,wallHeight/2,-wareHouseHeight/2+pillarHeight/2);
    scene.add(pillar_2.build());

    var pillar_3 = new pillar(pillarWidth,wallHeight,pillarHeight);
    pillar_3.body.position.set(-wareHouseWidth/2+pillarWidth/2,wallHeight/2,wareHouseHeight/2-pillarHeight/2);
    scene.add(pillar_3.build());

    var pillar_4 = new pillar(pillarWidth,wallHeight,pillarHeight);
    pillar_4.body.position.set(wareHouseWidth/2-pillarWidth/2,wallHeight/2,wareHouseHeight/2-pillarHeight/2);
    scene.add(pillar_4.build());

    /**----------------------------------------------------------**/
    /**                           货架                            **/
    /**----------------------------------------------------------**/

    var myshelf = new shelf(90,70,15);
    myshelf.body.position.set(0,0,0);
    scene.add(myshelf.build());

    /**----------------------------------------------------------**/
    /**                           屋顶                            **/
    /**----------------------------------------------------------**/
    // myroof = new roof(wareHouseWidth,wareHouseHeight,wallHeight);
    // scene.add(myroof.build());

    var axesHelper = new THREE.AxesHelper(wareHouseWidth);
    scene.add( axesHelper );

    var controls = new controller(scene,camera);

    var animate = function () {
        requestAnimationFrame( animate );

        controls.move();

        renderer.render(scene, camera);
    };
    animate();
};









