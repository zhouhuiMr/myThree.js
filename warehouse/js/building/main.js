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

    var stats = new Stats();
    document.body.appendChild( stats.dom );


    //渲染的方式
    var renderer = new THREE.WebGLRenderer({ antialias: false });
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
    var ambientLight = new THREE.AmbientLight( 0xffffff,0.2);
    scene.add(ambientLight);

    // var spotLight = new THREE.SpotLight( 0xffffff,1);
    // spotLight.position.set( 0, 70, 0 );
    //
    // spotLight.castShadow = true;
    //
    // spotLight.shadow.mapSize.width = 1024;
    // spotLight.shadow.mapSize.height = 1024;
    //
    // spotLight.shadow.camera.near = 500;
    // spotLight.shadow.camera.far = 1000;
    // spotLight.shadow.camera.fov = 30;
    // scene.add( spotLight );
    //
    // var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    // scene.add( spotLightHelper );
    var light = new THREE.DirectionalLight( 0xffffff, 1.5);
    scene.add( light );

    var  sky = new THREE.Sky();
    sky.scale.setScalar( 450);
    scene.add( sky );
    var uniforms = sky.material.uniforms;

    var sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 2000, 16, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.position.y = - 400;
    sunSphere.visible = true;
    scene.add( sunSphere );

    var theta = Math.PI * ( -0.1 - 0.5 );
    var phi = 2 * Math.PI * ( 0.25 - 0.5 );
    var distance = 400;

    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

    light.position.x = distance * Math.cos( phi );
    light.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    light.position.z = distance * Math.sin( phi ) * Math.cos( theta );


    uniforms.sunPosition.value.copy( sunSphere.position );



    /**----------------------------------------------------------**/
    /**                        辅助功能                          **/
    /**----------------------------------------------------------**/
    var axesHelper = new THREE.AxesHelper(wareHouseWidth);
    scene.add( axesHelper );

    var controls = null;
    if(false){
        camera.position.set( 0, -1, 0 );
        document.getElementById("blocker").style.display = "block";
        controls = new controller1(scene,camera);
    }else{
        camera.position.set( 10, 40, 0 );
        controls = new controller2(camera,renderer.domElement);
    }

    var warHouse = new THREE.Group();
    /**----------------------------------------------------------**/
    /**                          地面                             **/
    /**----------------------------------------------------------**/
    var wareFloor = new floor(wareHouseWidth,wareHouseHeight);
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

    /**----------------------------------------------------------**/
    /**                         屋顶的建造                       **/
    /**----------------------------------------------------------**/
    var myroof = new roof(wareHouseWidth,wareHouseWallHeight,wareHouseHeight);
    scene.add(myroof.build());

    /**----------------------------------------------------------**/
    /**                         货架的建造                       **/
    /**----------------------------------------------------------**/
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

    //添加松树
    // for(var i = 0;i<2; i++){
    //     for(var j=0;j<9;j++){
    //         var pine = new pinetree(5,30,0);
    //         pine.body.position.set(Math.pow(-1,i)*(wareHouseWidth / 2 + 12),0,wareHouseHeight / 2 - 10 * j);
    //         scene.add(pine.build());
    //     }
    // }
    //
    // for(var i=0;i<7;i++){
    //     var pine = new pinetree(5,30,0);
    //     pine.body.position.set(wareHouseWidth / 2 - 10 * i,0,wareHouseHeight / 2 + 12);
    //     scene.add(pine.build());
    // }

    // var light = new THREE.PointLight( 0xffffff, 3, 60);
    // light.position.set( 0, 30, 0 );
    // scene.add( light );
    //
    // var pointLightHelper = new THREE.PointLightHelper( light, 30);
    // scene.add( pointLightHelper );

    // var m_light = new monitorLight(0.1,0.05,0.1);
    // m_light.body.position.set(wareHouseWidth / 2 - 7.5,19, 7.5 - wareHouseHeight / 2);
    // scene.add(m_light.build());
    // var pointLightHelper = new THREE.PointLightHelper( m_light.light, 14);
    // scene.add(pointLightHelper);
    var monitor = new monitorRoom();
    monitor.body.position.set((wareHouseWidth - monitor.width) / 2 + 0.45,0 ,(monitor.width -wareHouseHeight) / 2);
    scene.add(monitor.build());

    // var pointLightHelper = new THREE.PointLightHelper(monitor.roofLight.light, monitor.roofLight.lightdistince);
    // scene.add(pointLightHelper);

    // var h = new holly(2);
    // scene.add(h.build());

    var animate = function () {
        requestAnimationFrame( animate );

        controls.move();

        renderer.render(scene, camera);
        stats.update();
    };
    animate();
};










