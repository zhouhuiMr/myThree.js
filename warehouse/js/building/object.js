(function(widnow){
    /**----------------------------------------------------------**/
    /**  https://threejs.org/examples/#misc_controls_pointerlock **/
    /**----------------------------------------------------------**/
    var controller1 = function(scene,camera){
        this.scene = scene;
        this.camera = camera;
        this.controls = null;

        this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
        this.prevTime = performance.now();
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.moveForward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveBackward = false;
        this.canJump = false;

        this.controlsEnabled = false;

        this.init();
    };
    controller1.prototype = {
        init : function(){
            this.controls = new THREE.PointerLockControls( this.camera );
            this.scene.add( this.controls.getObject());

            this.keyboard();
            this.mouse();
        },
        move : function(){
            if(this.controlsEnabled){
                this.controls.enabled = true;
                var time = performance.now();
                var delta = ( time - this.prevTime ) / 1000;
                this.velocity.x -= this.velocity.x * 10.0 * delta;
                this.velocity.z -= this.velocity.z * 10.0 * delta;
                this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
                this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
                this.direction.x = Number( this.moveLeft ) - Number( this.moveRight );
                this.direction.normalize(); // this ensures consistent movements in all directions
                if ( this.moveForward || this.moveBackward ) {
                    this.velocity.z -= this.direction.z * 400.0 * delta;
                }
                if ( this.moveLeft || this.moveRight ) {
                    this.velocity.x -= this.direction.x * 400.0 * delta;
                }
                this.controls.getObject().translateX( this.velocity.x * delta );
                this.controls.getObject().translateY( this.velocity.y * delta );
                this.controls.getObject().translateZ( this.velocity.z * delta );
                if ( this.controls.getObject().position.y < 10 ) {
                    this.velocity.y = 0;
                    this.controls.getObject().position.y = 10;
                }
                this.prevTime = time;
            }
        },
        keyboard : function(){
            var obj = this;
            var onKeyDown = function ( event ) {
                switch ( event.keyCode ) {
                    case 38: // up
                    case 87: // w
                        obj.moveForward = true;
                        break;
                    case 37: // left
                    case 65: // a
                        obj.moveLeft = true;
                        break;
                    case 40: // down
                    case 83: // s
                        obj.moveBackward = true;
                        break;
                    case 39: // right
                    case 68: // d
                        obj.moveRight = true;
                        break;
                    case 32: // space
                        if ( obj.canJump === true ) obj.velocity.y += 350;
                        obj.canJump = false;
                        break;
                }
            };
            var onKeyUp = function ( event ) {
                switch( event.keyCode ) {
                    case 38: // up
                    case 87: // w
                        obj.moveForward = false;
                        break;
                    case 37: // left
                    case 65: // a
                        obj.moveLeft = false;
                        break;
                    case 40: // down
                    case 83: // s
                        obj.moveBackward = false;
                        break;
                    case 39: // right
                    case 68: // d
                        obj.moveRight = false;
                        break;
                }
            };
            document.addEventListener( 'keydown', onKeyDown, false );
            document.addEventListener( 'keyup', onKeyUp, false );
        },
        mouse:function(){
            var blocker = document.getElementById( 'blocker' ),
                instructions = document.getElementById( 'instructions' );
            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
            var element = document.body;

            var obj = this;

            var pointerlockchange = function ( event ) {
                if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
                    obj.controlsEnabled = true;
                    obj.controls.enabled = true;
                    blocker.style.display = 'none';
                } else {
                    obj.controls.enabled = false;
                    obj.controlsEnabled = false;
                    blocker.style.display = 'block';
                    instructions.style.display = '';
                }
            };

            instructions.addEventListener( 'click', function ( event ) {
                // Ask the browser to lock the pointer
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                element.requestPointerLock();
            }, false );

            document.addEventListener( 'pointerlockchange', pointerlockchange, false );
            document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
        }
    };
    window.controller1 = controller1;

    var controller2 = function(camera,dom){
        this.camera = camera;
        this.dom = dom;
        this.controls = null;
        this.init();
    };
    controller2.prototype = {
        init : function(){
            this.controls = new THREE.OrbitControls(this.camera,this.dom);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 1;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 20;
            this.controls.maxDistance = 80;
            this.controls.maxPolarAngle = Math.PI / 2;
            this.controls.keyPanSpeed = 15;
            this.controls.keys = {
                LEFT: 65, //left arrow
                UP: 87, // up arrow
                RIGHT: 68, // right arrow
                BOTTOM: 83 // down arrow
            }
        },
        move : function(){
            this.controls.update();
        }
    };
    window.controller2 = controller2;

    /**----------------------------------------------------------**/
    /**                        物体模型的父类                    **/
    /**----------------------------------------------------------**/
    var modelObject = function(width,height,depth){
        this.body = new THREE.Group();
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.material = null;
        this.build = function(){
            return this.body;
        }
    };
    window.modelObject = modelObject;
    /**----------------------------------------------------------**/
    /**                      矩形path 返回Path                   **/
    /**----------------------------------------------------------**/
    var rectanglePath = function(x,y,width,height){
        this.Path = new THREE.Path();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.build = function(){
            return this.Path;
        };
        this.init();
    };
    rectanglePath.prototype = {
        init : function(){
            var w = this.width / 2,
                h = this.height / 2;
            this.Path.moveTo(this.x-w,this.y-h);
            this.Path.lineTo(this.x+w,this.y-h);
            this.Path.lineTo(this.x+w,this.y+h);
            this.Path.lineTo(this.x-w,this.y+h);
            this.Path.lineTo(this.x-w,this.y-h);
        }
    };
    window.rectanglePath = rectanglePath;
    /**----------------------------------------------------------**/
    /**                         矩形的边框                       **/
    /**----------------------------------------------------------**/
    var rectangleFrameObject = function(width,height,framewidth){
        this.Shape = null;
        this.width = width;
        this.height = height;
        this.frameWidth = framewidth;
        this.build = function(){
            return this.Shape;
        };
        this.init();
    };
    rectangleFrameObject.prototype = {
        init : function(){
            this.Shape = new rectangleShape(this.width,this.height).build();
            var insideWidth = this.width - this.frameWidth * 2,
                insideHeight = this.height - this.frameWidth * 2,
                x = (this.width - insideWidth) / 2 - this.frameWidth,
                y = (this.height - insideHeight) / 2 - this.frameWidth;
            var path = new rectanglePath(x,y,insideWidth,insideHeight).build();
            this.Shape.holes.push(path);
        }
    };
    window.rectangleFrameObject = rectangleFrameObject;
    /**----------------------------------------------------------**/
    /**                      矩形shape 返回Shape                 **/
    /**----------------------------------------------------------**/
    var rectangleShape = function(width,height){
        this.Shape = new THREE.Shape();
        this.width = width;
        this.height = height;
        this.build = function(){
            return this.Shape;
        };
        this.init();
    };
    rectangleShape.prototype = {
        init : function(){
            var x = this.width / 2,
                y = this.height / 2;
            this.Shape.moveTo(-x,-y);
            this.Shape.lineTo(x,-y);
            this.Shape.lineTo(x,y);
            this.Shape.lineTo(-x,y);
            this.Shape.lineTo(-x,-y);
        }
    };
    widnow.rectangleShape = rectangleShape;

    var Glass = function(width,height,depth){
        modelObject.call(this,width,height,depth);
        this.GlassMaterial = null;
        this.init();
    };
    Glass.prototype = {
        init : function(){
            console.info(this.body);
            this.GlassMaterial = new THREE.MeshPhongMaterial( {
                color: 0xffffff,
                transparent:true,
                opacity: 0.5,
                side: THREE.FrontSide,
                shininess:30,
                wireframe:false
            });
            var glassGeomotry = new THREE.BoxBufferGeometry(this.width,this.height,this.depth,1,1);
            var glass = new THREE.Mesh(glassGeomotry,this.GlassMaterial);
            this.body.add(glass);
        }
    };
    window.Glass = Glass;

    /**----------------------------------------------------------**/
    /**                          创建地面                        **/
    /**----------------------------------------------------------**/
    var floor = function(width,height){
        modelObject.call(this,width,height,0);
        this.init();
    };
    floor.prototype = {
        init : function(){
            this.material = new THREE.MeshPhongMaterial({
                color : 0x656b72,
                side : THREE.FrontSide,
                wireframe : false
            });
            //仓库地面材质
            var wareFloorMaterial = new THREE.MeshPhongMaterial({
                color : 0x656b72,
                side : THREE.FrontSide,
                wireframe : false
            });
            //仓库外面的地面材质
            var outFloorMaterial = new THREE.MeshLambertMaterial({
                color : 0x656b72,
                side : THREE.FrontSide,
                wireframe : false
            });
            //监控室地面
            var monitorWidth = 15;

            //仓库的地面
            var floorWidth = this.width - monitorWidth + 0.3;
            var ware_1_FloorGeometry = new THREE.PlaneBufferGeometry(floorWidth,monitorWidth,3,1);
            ware_1_FloorGeometry.rotateX( - Math.PI / 2 );
            ware_1_FloorGeometry.translate(0.3-monitorWidth / 2,0,monitorWidth / 2 - this.height / 2 + 0.5);
            var ware_2_FloorGeometry = new THREE.PlaneBufferGeometry(this.width,this.height - monitorWidth + 0.1,4,5);
            ware_2_FloorGeometry.rotateX( - Math.PI / 2 );
            ware_2_FloorGeometry.translate(0,0,monitorWidth / 2 - 0.1);
            var wareFloorGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([
                ware_1_FloorGeometry,
                ware_2_FloorGeometry
            ]);
            var wareFloor = new THREE.Mesh(wareFloorGeometry,wareFloorMaterial);
            this.body.add(wareFloor);


            // var floorGeometry = new THREE.PlaneBufferGeometry(this.width,this.height);
            // floorGeometry.rotateX( - Math.PI / 2 );
            // var floor = new THREE.Mesh(floorGeometry, this.material);
            // floor.receiveShadow = true;
            // this.body.add(floor);
        }
    };
    widnow.floor = floor;

    /**----------------------------------------------------------**/
    /**                           四周的墙面                     **/
    /**                   param: 占地宽、长和墙高                **/
    /**----------------------------------------------------------**/
    var wall = function(sizeX,sizeY,wallHeight){
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.wallHeight = wallHeight;
        modelObject.call(this,0,0,0.5);
        this.extrudeSettings = {
            curveSegments : 1,
            steps: 1,
            amount: this.depth,
            bevelEnabled: false,
            bevelSegments: 1,
            bevelSize: 1,
            bevelThickness: 1
        };
        this.init();
    };
    wall.prototype = {
        init : function(){
            this.material = new THREE.MeshLambertMaterial({
                color : 0xCDBE70,
                side : THREE.DoubleSide,
                wireframe : false
            });

            //添加正门
            var mainDoorHeight = 20;

            //通风口
            var ventWidth = 5,
                ventHeight = 3,
                toTop = 5;

            //监控室的窗窗
            var monitorWidth = 15,
                monittorHeight = 20;

            /**--   正门的墙 start   --**/
            var wall_1_array = [],
                wall_1_leftWidth =   (this.sizeX - 25 ) / 2;
            // var wall_1_left = new THREE.BoxBufferGeometry(wall_1_leftWidth,this.wallHeight,this.depth,3,3);
            // wall_1_left.translate(this.sizeX / 2 - wall_1_leftWidth / 2 ,this.wallHeight / 2 ,0);
            // wall_1_array.push(wall_1_left);
            var wall_1_lefttop = new THREE.BoxBufferGeometry(wall_1_leftWidth,this.wallHeight - 20,this.depth,3,1);
            wall_1_lefttop.translate(this.sizeX / 2 - wall_1_leftWidth / 2 ,this.wallHeight / 2 + 10 ,0);
            wall_1_array.push(wall_1_lefttop);

            var wall_1_leftbottom = new THREE.BoxBufferGeometry(wall_1_leftWidth-15 + 0.5,20,this.depth,1,1);
            wall_1_leftbottom.translate(this.sizeX / 2 - 15 - (wall_1_leftWidth-15 -0.5) / 2,10 ,0);
            wall_1_array.push(wall_1_leftbottom);

            var wall_1_right = new THREE.BoxBufferGeometry(wall_1_leftWidth,this.wallHeight,this.depth,3,3);
            wall_1_right.translate(wall_1_leftWidth / 2 - this.sizeX / 2,this.wallHeight / 2 ,0);
            wall_1_array.push(wall_1_right);

            var wall_1_top = new THREE.BoxBufferGeometry(25,this.wallHeight - mainDoorHeight,this.depth,4,1);
            wall_1_top.translate(0,this.wallHeight / 2 + mainDoorHeight / 2,0);
            wall_1_array.push(wall_1_top);

            var wall_1_Geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(wall_1_array);
            wall_1_Geometry.translate(0,0,-this.sizeY / 2 + this.depth / 2);
            /**--   正门的墙 end   --**/

            /**--   正门对面的墙 Start   --**/
            var wall_2_array = [],
                wall_2_bottomHeight = this.wallHeight - (toTop + ventHeight / 2),
                wall_2_centerWidth1 = this.sizeX / 4 - ventWidth / 2,
                wall_2_centerWidth2 = this.sizeX - wall_2_centerWidth1 * 2 - ventWidth * 2,
                wall_2_topHeight = this.wallHeight - ventHeight - wall_2_bottomHeight;
            var wall_2_bottom = new THREE.BoxBufferGeometry(this.sizeX,wall_2_bottomHeight,this.depth,10,3,1);
            wall_2_array.push(wall_2_bottom);

            var wall_2_center1 =new THREE.BoxBufferGeometry(wall_2_centerWidth1,ventHeight,this.depth,2,1,1);
            wall_2_center1.translate(wall_2_centerWidth1 / 2 - this.sizeX / 2,wall_2_bottomHeight / 2 + ventHeight / 2,0);
            wall_2_array.push(wall_2_center1);

            var wall_2_center2 =new THREE.BoxBufferGeometry(wall_2_centerWidth1,ventHeight,this.depth,2,1,1);
            wall_2_center2.translate(this.sizeX / 2 - wall_2_centerWidth1 / 2,wall_2_bottomHeight / 2 + ventHeight / 2,0);
            wall_2_array.push(wall_2_center2);

            var wall_2_center3 =new THREE.BoxBufferGeometry(wall_2_centerWidth2,ventHeight,this.depth,3,1,1);
            wall_2_center3.translate(this.sizeX / 2 - wall_2_centerWidth2 / 2 - wall_2_centerWidth1 - ventWidth,wall_2_bottomHeight / 2 + ventHeight / 2,0);
            wall_2_array.push(wall_2_center3);

            var wall_2_top =new THREE.BoxBufferGeometry(this.sizeX,wall_2_topHeight,this.depth,10,1);
            wall_2_top.translate(0,wall_2_bottomHeight / 2 + ventHeight + wall_2_topHeight / 2,0);
            wall_2_array.push(wall_2_top);

            var wall_2_Geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(wall_2_array);
            wall_2_Geometry.translate(0,wall_2_bottomHeight / 2,this.sizeY / 2 + 0.2);
            /**--   正门对面的墙 end   --**/

            /**--   正门右边的墙 start   --**/
            var wall_3_array = [],
                wall_3_bottomHeight = this.wallHeight - (toTop + ventHeight / 2),
                wall_3_centerWidth1 = this.sizeY / 2 - this.sizeY / 3 - ventWidth / 2,
                wall_3_centerWidth2 = this.sizeY / 2 - this.sizeY / 9 - ventWidth / 2 - wall_3_centerWidth1 - ventWidth,
                wall_3_topHeight = this.wallHeight - ventHeight - wall_3_bottomHeight;
            var wall_3_bottom = new THREE.BoxBufferGeometry(this.sizeY,wall_3_bottomHeight,this.depth,10,3);
            wall_3_array.push(wall_3_bottom);

            for(var i = 0;i < 2;i++){
                var num = Math.pow(-1,i);
                var wall_3_center1 = new THREE.BoxBufferGeometry(wall_3_centerWidth1,ventHeight,this.depth,2,1);
                wall_3_center1.translate(num * (this.sizeY / 2 - wall_3_centerWidth1 / 2), wall_3_bottomHeight / 2 + ventHeight / 2,0);
                wall_3_array.push(wall_3_center1);

                var wall_3_center2 = new THREE.BoxBufferGeometry(wall_3_centerWidth2,ventHeight,this.depth,2,1);
                wall_3_center2.translate(num * (this.sizeY / 2 - wall_3_centerWidth1 - ventWidth - wall_3_centerWidth2 / 2 ),
                    wall_3_bottomHeight / 2 + ventHeight / 2,0);
                wall_3_array.push(wall_3_center2);
            }
            var wall_3_center3 = new THREE.BoxBufferGeometry(wall_3_centerWidth2,ventHeight,this.depth,2,1);
            wall_3_center3.translate(0, wall_3_bottomHeight / 2 + ventHeight / 2,0);
            wall_3_array.push(wall_3_center3);

            var wall_3_top = new THREE.BoxBufferGeometry(this.sizeY,wall_3_topHeight,this.depth,10,1);
            wall_3_top.translate(0, wall_3_bottomHeight / 2 + ventHeight + wall_3_topHeight / 2,0);
            wall_3_array.push(wall_3_top);

            var wall_3_Geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(wall_3_array);
            wall_3_Geometry.rotateY(Math.PI / 2);
            wall_3_Geometry.translate(0.2 -this.sizeX / 2 ,wall_3_bottomHeight / 2,0);
            /**--   正门右边的墙 end   --**/


            /**--   正门左边的墙 start   --**/
            var wall_4_array = [],
                wall_4_bottomWidth1 = this.sizeY - monitorWidth,
                wall_4_bottomHeight = this.wallHeight - (toTop + ventHeight / 2),
                wall_4_centerWidth1 = this.sizeY / 2 - this.sizeY / 3 - ventWidth / 2,
                wall_4_centerWidth2 = this.sizeY / 2 - this.sizeY / 9 - ventWidth / 2 - wall_4_centerWidth1 - ventWidth,
                wall_4_topHeight = this.wallHeight - ventHeight - wall_4_bottomHeight;

            var wall_4_bottomBack = new THREE.BoxBufferGeometry(wall_4_bottomWidth1,wall_3_bottomHeight,this.depth,10,3);
            wall_4_bottomBack.translate(-this.sizeY /2 + wall_4_bottomWidth1 / 2,0,0);
            wall_4_array.push(wall_4_bottomBack);

            for(var i = 0;i < 2;i++){
                var num = Math.pow(-1,i);
                var wall_4_center1 = new THREE.BoxBufferGeometry(wall_4_centerWidth1,ventHeight,this.depth,2,1);
                wall_4_center1.translate(num * (this.sizeY / 2 - wall_4_centerWidth1 / 2), wall_4_bottomHeight / 2 + ventHeight / 2,0);
                wall_4_array.push(wall_4_center1);

                var wall_4_center2 = new THREE.BoxBufferGeometry(wall_4_centerWidth2,ventHeight,this.depth,2,1);
                wall_4_center2.translate(num * (this.sizeY / 2 - wall_4_centerWidth1 - ventWidth - wall_4_centerWidth2 / 2 ),
                    wall_4_bottomHeight / 2 + ventHeight / 2,0);
                wall_4_array.push(wall_4_center2);
            }
            var wall_4_center3 = new THREE.BoxBufferGeometry(wall_4_centerWidth2,ventHeight,this.depth,1,1);
            wall_4_center3.translate(0, wall_4_bottomHeight / 2 + ventHeight / 2,0);
            wall_4_array.push(wall_4_center3);

            var wall_4_top = new THREE.BoxBufferGeometry(this.sizeY,wall_4_topHeight,this.depth,10,1);
            wall_4_top.translate(0, wall_4_bottomHeight / 2 + ventHeight + wall_4_topHeight / 2,0);
            wall_4_array.push(wall_4_top);

            var wall_4_frontcenter = new THREE.BoxBufferGeometry(monitorWidth,
                this.wallHeight - monittorHeight - ventHeight - wall_4_topHeight,
                this.depth,2,1);
            wall_4_frontcenter.translate(
                (this.sizeY - monitorWidth) / 2,
                monittorHeight / 2,0);
            wall_4_array.push(wall_4_frontcenter);


            var wall_4_Geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(wall_4_array);
            wall_4_Geometry.rotateY(Math.PI / 2);
            wall_4_Geometry.translate(this.sizeX / 2 + 0.2 ,wall_3_bottomHeight / 2,0);

            /**--   正门左边的墙 end   --**/

            //柱子
            var pillarWidth = 1,
                pillarHeight = 3;
            var pillar_1 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,2,1,5);
            pillar_1.translate(this.sizeX/2-pillarWidth/2,this.wallHeight/2,1-this.sizeY/2);
            var pillar_2 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,2,1,5);
            pillar_2.translate(pillarWidth/2-this.sizeX/2,this.wallHeight/2,1-this.sizeY/2);

            var pillar_3 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,2,1,5);
            pillar_3.translate(this.sizeX/2-pillarWidth/2,this.wallHeight/2,this.sizeY/2 - 1);
            var pillar_4 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,2,1,5);
            pillar_4.translate(pillarWidth/2-this.sizeX/2,this.wallHeight/2,this.sizeY/2 - 1);

            var pillar_5 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight,1,5);
            pillar_5.translate(pillarWidth/2-this.sizeX/2,this.wallHeight/2,this.sizeY/4);
            var pillar_6 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight,1,5);
            pillar_6.translate(pillarWidth/2-this.sizeX/2,this.wallHeight/2,0);
            var pillar_7 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight,1,5);
            pillar_7.translate(pillarWidth/2-this.sizeX/2,this.wallHeight/2,-this.sizeY/4);

            var pillar_8 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight,1,5);
            pillar_8.translate(this.sizeX/2-pillarWidth/2,this.wallHeight/2,this.sizeY/4);
            var pillar_9 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight,1,5);
            pillar_9.translate(this.sizeX/2-pillarWidth/2,this.wallHeight/2,0);
            var pillar_10 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight,1,5);
            pillar_10.translate(this.sizeX/2-pillarWidth/2,this.wallHeight/2,-this.sizeY/4);

            var wallGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([
                wall_1_Geometry,
                wall_2_Geometry,
                wall_3_Geometry,
                wall_4_Geometry,
                pillar_1,
                pillar_2,
                pillar_3,
                pillar_4,
                pillar_5,
                pillar_6,
                pillar_7,
                pillar_8,
                pillar_9,
                pillar_10
            ]);
            var wall = new THREE.Mesh(wallGeometry,this.material);

            this.body.add(wall);
        }
    };
    window.wall = wall;




    /**----------------------------------------------------------**/
    /**                        柱片的支撑                        **/
    /**----------------------------------------------------------**/
    var ColumnOfProp = function(height){
        this.body = new THREE.Group();
        this.height = height;

        this.build = function(){
            return this.body;
        };
        this.init();
    };
    ColumnOfProp.prototype = {
        init : function(){
            var ColumnWidth = 0.3,
                ColumnHeight = 0.2,
                ColumnDepth = 0.1;

            var propMaterial = new THREE.MeshPhongMaterial({
                color: 0x205488,
                side : THREE.FrontSide,
                wireframe : false});

            var propShape = new THREE.Shape();
            propShape.moveTo(0,0);
            propShape.lineTo(ColumnHeight,0);
            propShape.lineTo(ColumnHeight,this.height);
            propShape.lineTo(0,this.height);
            propShape.lineTo(0,0);


            var propExtrudeSettings = {
                steps: 1,
                amount: ColumnDepth,
                bevelEnabled: false,
                bevelThickness : 0,
                bevelSize: 0,
                bevelSegments: 0
            };

            var sideGeometry1 = new THREE.ExtrudeBufferGeometry(propShape, propExtrudeSettings);
            sideGeometry1.translate(0,0,ColumnWidth/2-ColumnDepth);

            var sideGeometry2 = new THREE.ExtrudeBufferGeometry(propShape, propExtrudeSettings);
            sideGeometry2.translate(0,0,-ColumnWidth/2);

            var mainGeometry = new THREE.BoxBufferGeometry(ColumnDepth,this.height,ColumnWidth,1,1,1);
            mainGeometry.translate(ColumnDepth/2,this.height/2,0);

            var pedestalGeometry = new THREE.BoxBufferGeometry(ColumnHeight+0.6,0.2,ColumnWidth+0.6);
            pedestalGeometry.translate(ColumnHeight/2,0,0);

            var propGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([mainGeometry,sideGeometry1,sideGeometry2,pedestalGeometry]);
            var prop = new THREE.Mesh(propGeometry, propMaterial);

            prop.castShadow = true;

            this.body.add(prop);
        }
    };

    /**----------------------------------------------------------**/
    /**                         货架柱片                         **/
    /**----------------------------------------------------------**/
    var Columns = function(width,height){
        this.body = new THREE.Group();
        this.width = width;
        this.height = height;

        this.build = function(){
            return this.body;
        };
        this.init();

    };
    Columns.prototype = {
        init : function(){
            var ColumnsMaterial = new THREE.MeshPhongMaterial({
                color: 0x205488,
                wireframe : false});

            var prop1 = new ColumnOfProp(this.height);
            prop1.body.position.set(-this.width/2,0,0);

            var prop2 = new ColumnOfProp(this.height);
            prop2.body.rotation.y = Math.PI;
            prop2.body.position.set(this.width/2,0,0);

            var beamGeometry = new THREE.BoxBufferGeometry(this.width,0.5,0.1);
            var beam1 = new THREE.Mesh(beamGeometry, ColumnsMaterial);
            beam1.position.set(0 , 2.5 ,0);
            beam1.castShadow = true;

            var beam2 = new THREE.Mesh(beamGeometry, ColumnsMaterial);
            beam2.position.set(0,this.height-2,0);
            beam2.castShadow = true;

            //斜着的横梁(3根)
            var W = this.width,
                H = (this.height-5)/3;
            var L = Math.sqrt(W*W+H*H);
            var ANGLE = Math.atan(H/W)+0.04;
            for(var i=0;i<3;i++){
                var obliqueBeamGeometry = new THREE.BoxBufferGeometry(L,0.2,0.1);
                var obliqueBeam = new THREE.Mesh(obliqueBeamGeometry, ColumnsMaterial);
                obliqueBeam.rotation.z = Math.pow(-1,i)*ANGLE;
                obliqueBeam.position.set(0,H*i+H/2+2.5,0);
                this.body.add(obliqueBeam);
            }
            this.body.add(prop1.build());
            this.body.add(prop2.build());
            this.body.add(beam1);
            this.body.add(beam2);
        }
    };

    /**----------------------------------------------------------**/
    /**                        货物架的横梁                      **/
    /**----------------------------------------------------------**/
    var beamOfShelf = function(width,height,depth){
        modelObject.call(this,width,height,depth);
        this.init();
    };
    beamOfShelf.prototype = {
        init : function(){
            var material = new THREE.MeshPhongMaterial({
                color: 0x205488,
                shininess:50,
                side: THREE.DoubleSide,
                wireframe : false
            });
            var h = 0.3;
            var planGeometry = new THREE.PlaneBufferGeometry( this.width, this.depth,1);
            planGeometry.rotateX(-1 * Math.PI / 2);
            var frontGeometry = new THREE.BoxBufferGeometry( this.width, h,0.1);
            frontGeometry.translate(0,h / 5,this.depth / 2);
            var behindGeometry = new THREE.BoxBufferGeometry( this.width, h,0.1);
            behindGeometry.translate(0,h / 5,-1 * this.depth / 2);
            var leftGeometry = new THREE.BoxBufferGeometry( this.depth + 0.1,h ,0.05);
            leftGeometry.rotateY(Math.PI / 2);
            leftGeometry.translate(this.width / 2,h / 5,0);
            var rightGeometry = new THREE.BoxBufferGeometry( this.depth + 0.1,h ,0.05);
            rightGeometry.rotateY(Math.PI / 2);
            rightGeometry.translate(-1 * this.width / 2,h / 5,0);

            var geometryArray = [
                planGeometry,
                frontGeometry,behindGeometry,
                leftGeometry,rightGeometry
            ];
            var count = 5;
            var distence = this.width / count;
            for(var i = 1;i < 5;i ++){
                var g = new THREE.BoxBufferGeometry( this.depth-0.1,0.1 ,0.05);
                g.rotateY(Math.PI / 2);
                g.translate((-1 * this.width / 2 + distence * i),-0.05,0);
                geometryArray.push(g);
            }
            var geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometryArray);
            this.body.add(new THREE.Mesh(geometry,material));
            // this.body.position.set(0,5,0);
            // this.body.rotation.x = Math.PI;
        }
    };
    window.beamOfShelf = beamOfShelf;

    /**----------------------------------------------------------**/
    /**                        货物架对象                        **/
    /**                     由横梁和柱片组成                     **/
    /**----------------------------------------------------------**/
    var shelf = function(width,height,depth){
        this.body = new THREE.Group();
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.CrossBeams = new THREE.Group(); //横梁
        this.Columns = new THREE.Group();//柱片

        this.init();
    };
    shelf.prototype = {
        init : function(){
            //柱片
            var column1 = new Columns(this.depth,this.height);
            column1.body.rotation.y = Math.PI/2;
            column1.body.position.set(this.width/2,0,0);
            var column2 = new Columns(this.depth,this.height);
            column2.body.rotation.y = Math.PI/2;
            column2.body.position.set(-this.width/2,0,0);
            this.Columns.add(column1.build());
            this.Columns.add(column2.build());

            //底部支撑横梁材质
            var ColumnsMaterial = new THREE.MeshPhongMaterial({
                color: 0x205488,
                shininess:100,
                wireframe : false
            });
            //螺丝的材质
            var ScrewMaterial = new THREE.MeshLambertMaterial({
                color: 0xFFFFFF,
                side : THREE.DoubleSide,
                wireframe : false
            });

            //底部支撑横梁
            var bottomBeamGeometry = new THREE.BoxBufferGeometry(this.width+0.6,0.5,0.1);
            //底部固定的螺丝
            var bottomScrewGeometry = new THREE.CircleGeometry(0.1,6);

            var bottomBeam1 = new THREE.Mesh(bottomBeamGeometry, ColumnsMaterial);
            bottomBeam1.position.set(0 , 2.5 , this.depth/2);
            this.Columns.add(bottomBeam1);
            var bottomBeam2 = new THREE.Mesh(bottomBeamGeometry, ColumnsMaterial);
            bottomBeam2.position.set(0, 2.5 , -this.depth/2);
            this.Columns.add(bottomBeam2);

            var bottomScrew1 = new THREE.Mesh(bottomScrewGeometry, ScrewMaterial);
            bottomScrew1.position.set(this.width/2,2.6,-this.depth/2-0.2);
            var bottomScrew2 = new THREE.Mesh(bottomScrewGeometry, ScrewMaterial);
            bottomScrew2.position.set(-this.width/2,2.6,-this.depth/2-0.2);
            var bottomScrew3 = new THREE.Mesh(bottomScrewGeometry, ScrewMaterial);
            bottomScrew3.position.set(this.width/2,2.6,this.depth/2+0.2);
            var bottomScrew4 = new THREE.Mesh(bottomScrewGeometry, ScrewMaterial);
            bottomScrew4.position.set(-this.width/2,2.6,this.depth/2+0.2);

            this.Columns.add(bottomScrew1);
            this.Columns.add(bottomScrew2);
            this.Columns.add(bottomScrew3);
            this.Columns.add(bottomScrew4);

            for(var i = 0; i<4;i++){
                var beamPlan = new beamOfShelf(this.width,0,this.depth);
                beamPlan.body.position.set(0,i*5+2.5,0);
                this.body.add(beamPlan.build());
            }
            this.body.add(this.CrossBeams);
            this.body.add(this.Columns);
            this.body.castShadow = true;
        },
        build : function(){
            return this.body;
        }
    };
    window.shelf = shelf;

    /**----------------------------------------------------------**/
    /**                       通风管道对象                       **/
    /**----------------------------------------------------------**/
    var ventpipe = function(width,height,depth){
        modelObject.call(this,width,height,depth);
        this.init();
    };
    ventpipe.prototype = {
        init : function(){
            var ventpipeFrameShape = new rectangleFrameObject(this.width,this.height,0.2).build();
            var ventpipeFrameExtrudeSettings = {
                steps: 1,
                amount: this.depth,
                bevelEnabled: false,
                bevelSegments: 1,
                bevelSize: 0.1,
                bevelThickness: 0.1
            };
            var ventpipeFrameGeometry = new THREE.ExtrudeBufferGeometry(ventpipeFrameShape,ventpipeFrameExtrudeSettings);
            ventpipeFrameGeometry.translate(0,this.height/2,0);
            var ventpipeFrameMaterial = new THREE.MeshPhongMaterial({
                color: 0xdedede,
                side : THREE.FrontSide,
                wireframe:false
            });
            //边框
            var ventpipeFrame = new THREE.Mesh(ventpipeFrameGeometry,ventpipeFrameMaterial);

            //通风管道叶片
            var vaneCount = 6;
            var height = this.height / vaneCount;//计算高度
            var vaneGeometry = new THREE.PlaneBufferGeometry(this.width,height - 0.1);
            vaneGeometry.translate(0,height/2,0);
            vaneGeometry.rotateX(Math.PI/10);
            var vaneMaterial = new THREE.MeshPhongMaterial({
                color: 0xdedede,
                side : THREE.DoubleSide,
                wireframe:false
            });
            var vaneGroup = new THREE.Group();
            for(var i=0;i<vaneCount;i++){
                var vane = new THREE.Mesh(vaneGeometry,vaneMaterial);
                vane.position.set(0,i*height,0);
                vaneGroup.add(vane);
            }
            this.body.add(ventpipeFrame);
            this.body.add(vaneGroup);
        }
    };
    widnow.ventpipe = ventpipe;

    /**----------------------------------------------------------**/
    /**                        仓库的大门                        **/
    /**----------------------------------------------------------**/
    var wareDoor = function(width,height,depth){
        modelObject.call(this,width,height,depth);
        this.doorFrame = null;
        this.leftDoor = new THREE.Group();
        this.rightDoor = new THREE.Group();
        this.init();
    };
    wareDoor.prototype = {
        init : function(){
            //门框
            var doorFrameShape = new rectangleFrameObject(this.width,this.height,0.4).build();
            var doorFrameExtrudeSettings = {
                steps: 1,
                amount: this.depth,
                bevelEnabled: false,
                bevelSegments: 1,
                bevelSize: 0.1,
                bevelThickness: 0.1
            };
            var doorFrameGeometry = new THREE.ExtrudeBufferGeometry(doorFrameShape,doorFrameExtrudeSettings);
            var doorFrameMaterial = new THREE.MeshPhongMaterial({
                color: 0x98999a,
                side : THREE.FrontSide,
                wireframe:false
            });
            this.doorFrame = new THREE.Mesh(doorFrameGeometry,doorFrameMaterial);
            this.doorFrame.position.set(0,this.height/2,-0.1);
            this.body.add(this.doorFrame);
            //门的外形
            var doorShape = new rectangleFrameObject(this.width/2-0.4,this.height-0.5,0.1).build();
            var doorExtrudeSettings = {
                steps: 1,
                amount: 0.1,
                bevelEnabled: true,
                bevelSegments: 1,
                bevelSize: 0.2,
                bevelThickness: 0.1
            };
            var doorGeometry = new THREE.ExtrudeBufferGeometry(doorShape,doorExtrudeSettings);
            doorGeometry.translate(0,this.height/2,0.1);
            var doorMaterial = new THREE.MeshPhongMaterial({
                color: 0xb5b5b5,
                side : THREE.FrontSide,
                wireframe:false
            });

            //警告线(黄色)
            var warningMaterial = new THREE.MeshBasicMaterial({
                color: 0xe6d700,
                side : THREE.DoubleSide,
                wireframe:false
            });
            var warningGeometry = new THREE.PlaneBufferGeometry(this.width/2-0.5,1.5);
            warningGeometry.translate(0,8,0.1);
            var warning1 = new THREE.Mesh(warningGeometry,warningMaterial);
            var warning2 = new THREE.Mesh(warningGeometry,warningMaterial);

            var door1 = new THREE.Mesh(doorGeometry,doorMaterial);
            var door1_glass = new Glass(this.width/2-0.3,this.height-0.5,0.1).build();
            door1_glass.position.set(0,this.height/2,0.2);
            this.leftDoor.add(door1);
            this.leftDoor.add(door1_glass);
            this.leftDoor.add(warning1);
            this.leftDoor.position.set(this.width/4-0.2,0,0);

            var door2 = new THREE.Mesh(doorGeometry,doorMaterial);
            var door2_glass = new Glass(this.width/2-0.3,this.height-0.5,0.1).build();
            door2_glass.position.set(0,this.height/2,0.2);
            this.rightDoor.add(door2);
            this.rightDoor.add(door2_glass);
            this.rightDoor.add(warning2);
            this.rightDoor.position.set(0.3-this.width/4,0,0);

            this.body.add(this.leftDoor);
            this.body.add(this.rightDoor);
        },
        open : function(){

        },
        close : function(){

        }
    };
    window.wareDoor  = wareDoor;

    /**----------------------------------------------------------**/
    /**                           松树                           **/
    /**----------------------------------------------------------**/
    var pinetree = function(width,height,depth){
        modelObject.call(this,width,height,depth);
        this.plies = 5;
        this.radialSegments = 6;//分段数
        this.init();
    };
    pinetree.prototype = {
        init : function(){
            var leafMaterial = new THREE.MeshLambertMaterial({
                color : 0x3c6b2e,
                side : THREE.FrontSide,
                flatShading : true,
                wireframe:false
            });

            var pliesHeight = this.height / this.plies,//每层的高度
                 pliesWidth = this.width / this.plies;//每层的宽度
            var leafGeometryArray = [];
            for(var i=0;i<this.plies;i++){
                var pliesBottomWidth = this.width - i * pliesWidth,
                    pliesTopWidth = this.width - (i + 1) * pliesWidth;
                var bevel = 0.3;
                if(pliesTopWidth < bevel){
                    pliesTopWidth = bevel + 0.1;
                }
                var pliesGeometry = new THREE.CylinderBufferGeometry(
                    pliesTopWidth - bevel,pliesBottomWidth,pliesHeight + 0.1,
                    this.radialSegments,1,true,0,6.3
                );
                pliesGeometry.translate(0,pliesHeight * i,0);
                leafGeometryArray.push(pliesGeometry);
            }
            var bottomPliesGeometry = new THREE.CylinderBufferGeometry(
                this.width - 0.3 ,this.width - 2, 2,
                this.radialSegments,1,false,0,6.3
            );
            bottomPliesGeometry.translate(0,2 - pliesHeight,0);
            leafGeometryArray.push(bottomPliesGeometry);

            var leafGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(leafGeometryArray);
            leafGeometry.translate(0,pliesHeight / 2 + 5,0);
            var leaf = new THREE.Mesh(leafGeometry,leafMaterial);
            leaf.castShadow = true;

            //树干
            var trunkMaterial = new THREE.MeshLambertMaterial({
                color : 0x392514,
                side : THREE.FrontSide,
                wireframe:false
            });
            var trunkGeometry = new THREE.CylinderBufferGeometry(
                1,1.5,5,6,1,false,0,6.3
            );
            trunkGeometry.translate(0,0.5,0);
            var trunk = new THREE.Mesh(trunkGeometry,trunkMaterial);
            this.body.add(leaf);
            this.body.add(trunk);
        }
    };
    window.pinetree = pinetree;

    var holly = function(width){
        modelObject.call(this,width,0,0);
        this.init()
    };
    holly.prototype = {
        init : function(){
            var hollyMaterial = new THREE.MeshLambertMaterial({
                color : 0x315d22,
                side : THREE.DoubleSide,
                wireframe:false
            });
            var hollyGeomotry = new THREE.DodecahedronGeometry(this.width,0);
            hollyGeomotry.translate(0,this.width ,0);
            var holly = new THREE.Mesh(hollyGeomotry,hollyMaterial);
            this.body.add(holly);
        }
    };
    window.holly = holly;

    /**----------------------------------------------------------**/
    /**                             花盆                         **/
    /**----------------------------------------------------------**/
    var flowerpot = function(width,height){
        modelObject.call(this,width,height,0);
        this.edges = 6;
        this.init();
    };
    flowerpot.prototype = {
        init : function(){
            var lowerpotMaterial = new THREE.MeshLambertMaterial({
                color : 0x392514,
                side : THREE.FrontSide,
                wireframe:false
            });
        }
    };
    window.flowerpot = flowerpot;
})(window);