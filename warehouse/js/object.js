(function(widnow){
    /**----------------------------------------------------------**/
    /**  https://threejs.org/examples/#misc_controls_pointerlock **/
    /**----------------------------------------------------------**/
    var controller = function(scene,camera){
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
    controller.prototype = {
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
    window.controller = controller;

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
                side : THREE.DoubleSide,
                wireframe : false
            });
            var floorGeometry = new THREE.PlaneBufferGeometry(this.width,this.height);
            floorGeometry.rotateX( - Math.PI / 2 );
            var floor = new THREE.Mesh(floorGeometry, this.material);
            floor.receiveShadow = true;
            this.body.add(floor);
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
            steps: 1,
            amount: this.depth,
            bevelEnabled: false,
            bevelSegments: 1,
            bevelSize: 0,
            bevelThickness: 1
        };
        this.init();
    };
    wall.prototype = {
        init : function(){
            this.material = this.material = new THREE.MeshLambertMaterial({
                color : 0xCDBE70,
                side : THREE.DoubleSide,
                wireframe : false
            });
            //仓库四周的墙
            var Shape_1 = new rectangleShape(this.sizeX,this.wallHeight).build(),
                Shape_2 = new rectangleShape(this.sizeX,this.wallHeight).build(),
                Shape_3 = new rectangleShape(this.sizeY,this.wallHeight).build(),
                Shape_4 = new rectangleShape(this.sizeY,this.wallHeight).build();
            //添加正门
            var mainDoorHeight = 60;
            var mainDoorFrame =  new rectanglePath(0,(mainDoorHeight-this.wallHeight+0.2)/2,100,mainDoorHeight);
            Shape_1.holes.push(mainDoorFrame.build());

            //通风口
            var ventWidth = 5,
                ventHeight = 3;
            var vent_1 = new rectanglePath(this.sizeY/3,this.wallHeight/2-10,ventWidth,ventHeight);
            Shape_3.holes.push(vent_1.build());
            var vent_2 = new rectanglePath(this.sizeY/9,this.wallHeight/2-10,ventWidth,ventHeight);
            Shape_3.holes.push(vent_2.build());
            var vent_3 = new rectanglePath(-this.sizeY/9,this.wallHeight/2-10,ventWidth,ventHeight);
            Shape_3.holes.push(vent_3.build());
            var vent_4 = new rectanglePath(-this.sizeY/3,this.wallHeight/2-10,ventWidth,ventHeight);
            Shape_3.holes.push(vent_4.build());

            var vent_5 = new rectanglePath(this.sizeY/3,this.wallHeight/2-10,ventWidth,ventHeight);
            Shape_4.holes.push(vent_5.build());
            var vent_6 = new rectanglePath(this.sizeY/9,this.wallHeight/2-10,ventWidth,ventHeight);
            Shape_4.holes.push(vent_6.build());
            var vent_7 = new rectanglePath(-this.sizeY/9,this.wallHeight/2-10,ventWidth,ventHeight);
            Shape_4.holes.push(vent_7.build());
            var vent_8 = new rectanglePath(-this.sizeY/3,this.wallHeight/2-10,ventWidth,ventHeight);
            Shape_4.holes.push(vent_8.build());

            var vent_9 = new rectanglePath(this.sizeX/4,this.wallHeight/2-10,ventWidth,ventHeight);
            Shape_2.holes.push(vent_9.build());
            var vent_10 = new rectanglePath(-this.sizeX/4,this.wallHeight/2-10,ventWidth,ventHeight);
            Shape_2.holes.push(vent_10.build());

            //监控室的窗窗
            var monitorWindowWidth = 11,
                monitorWindowheight = 9;
            var monitorWindow= new rectanglePath(this.sizeY/2-25,10-this.wallHeight/2,monitorWindowWidth,monitorWindowheight);
            Shape_4.holes.push(monitorWindow.build());
            //监控室的窗台
            var monitorWindowSill = new THREE.BoxBufferGeometry(1,1,monitorWindowWidth);
            monitorWindowSill.translate(
                this.sizeX/2,
                5,
                25-this.sizeY/2
            );

            var wallGeometry_1 = new THREE.ExtrudeBufferGeometry(Shape_1,this.extrudeSettings);
            wallGeometry_1.translate(0,this.wallHeight/2,-this.sizeY/2);

            var wallGeometry_2 = new THREE.ExtrudeBufferGeometry(Shape_2,this.extrudeSettings);
            wallGeometry_2.translate(0,this.wallHeight/2,this.sizeY/2);

            var wallGeometry_3 = new THREE.ExtrudeBufferGeometry(Shape_3,this.extrudeSettings);
            wallGeometry_3.rotateY(Math.PI/2);
            wallGeometry_3.translate(-this.sizeX/2,this.wallHeight/2,0);

            var wallGeometry_4 = new THREE.ExtrudeBufferGeometry(Shape_4,this.extrudeSettings);
            wallGeometry_4.rotateY(Math.PI/2);
            wallGeometry_4.translate(this.sizeX/2,this.wallHeight/2,0);

            //监控室的墙
            var monitorRoomSize = 50,
                monitorRoomHeight = 30;
            var monitorWallShape_1 = new rectangleShape(monitorRoomSize,monitorRoomHeight).build(),
                monitorWallShape_2 = new rectangleShape(monitorRoomSize,monitorRoomHeight).build();
            //监控室的门
            var monitorDoorHeight = 12,
                monitorDoorwidth = 4
            var monitorDoor = new rectanglePath(5-monitorRoomSize/2,(monitorDoorHeight-monitorRoomHeight+0.2)/2,monitorDoorwidth,monitorDoorHeight);
            monitorWallShape_1.holes.push(monitorDoor.build());
            //大窗户
            var bigGlassWinth = 25,
                bigGlassHeight = 10;
            var bigGlassWindowFrame = new rectanglePath(0,10-monitorRoomHeight/2,bigGlassWinth,bigGlassHeight);
            monitorWallShape_2.holes.push(bigGlassWindowFrame.build());
            //大窗户窗台
            var bigGlassWindowSill = new THREE.BoxBufferGeometry(2,1,25);
            bigGlassWindowSill.translate(
                this.sizeX/2-monitorRoomSize,
                4.5,
                (monitorRoomSize-this.sizeY)/2
            );

            var monitorWallGeometry_1 = new THREE.ExtrudeBufferGeometry(monitorWallShape_1,this.extrudeSettings);
            monitorWallGeometry_1.translate(
                (this.sizeX-monitorRoomSize)/2,
                monitorRoomHeight/2,
                monitorRoomSize-this.sizeY/2
            );
            var monitorWallGeometry_2 = new THREE.ExtrudeBufferGeometry(monitorWallShape_2,this.extrudeSettings);
            monitorWallGeometry_2.rotateY(Math.PI/2);
            monitorWallGeometry_2.translate(
                this.sizeX/2-monitorRoomSize,
                monitorRoomHeight/2,
                (monitorRoomSize-this.sizeY)/2
            );
            //监控室的屋顶
            var monitorRoofGeometry = new THREE.PlaneBufferGeometry(monitorRoomSize,monitorRoomSize);
            monitorRoofGeometry.rotateX(Math.PI/2);
            monitorRoofGeometry.translate(
                (this.sizeX-monitorRoomSize)/2,
                monitorRoomHeight,
                (monitorRoomSize-this.sizeY)/2
            );

            //柱子
            var pillarWidth = 2,
                pillarHeight = 5;
            var pillar_1 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,2);
            pillar_1.translate(this.sizeX/2-pillarWidth/2,this.wallHeight/2,1-this.sizeY/2);
            var pillar_2 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,2);
            pillar_2.translate(pillarWidth/2-this.sizeX/2,this.wallHeight/2,1-this.sizeY/2);

            var pillar_3 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,2);
            pillar_3.translate(this.sizeX/2-pillarWidth/2,this.wallHeight/2,this.sizeY/2 - 1);
            var pillar_4 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,2);
            pillar_4.translate(pillarWidth/2-this.sizeX/2,this.wallHeight/2,this.sizeY/2 - 1);

            var pillar_5 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight);
            pillar_5.translate(pillarWidth/2-this.sizeX/2,this.wallHeight/2,this.sizeY/4);
            var pillar_6 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight);
            pillar_6.translate(pillarWidth/2-this.sizeX/2,this.wallHeight/2,0);
            var pillar_7 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight);
            pillar_7.translate(pillarWidth/2-this.sizeX/2,this.wallHeight/2,-this.sizeY/4);

            var pillar_8 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight);
            pillar_8.translate(this.sizeX/2-pillarWidth/2,this.wallHeight/2,this.sizeY/4);
            var pillar_9 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight);
            pillar_9.translate(this.sizeX/2-pillarWidth/2,this.wallHeight/2,0);
            var pillar_10 = new THREE.BoxBufferGeometry(pillarWidth,this.wallHeight,pillarHeight);
            pillar_10.translate(this.sizeX/2-pillarWidth/2,this.wallHeight/2,-this.sizeY/4);

            var wallGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([
                wallGeometry_1,
                wallGeometry_2,
                wallGeometry_3,
                wallGeometry_4,
                monitorWallGeometry_1,
                monitorWallGeometry_2,
                monitorRoofGeometry,
                pillar_1,
                pillar_2,
                pillar_3,
                pillar_4,
                pillar_5,
                pillar_6,
                pillar_7,
                pillar_8,
                pillar_9,
                pillar_10,
                monitorWindowSill,
                bigGlassWindowSill
            ]);
            var wall = new THREE.Mesh(wallGeometry,this.material);
            wall.castShadow = true;

            //监控室的大玻璃窗
            var glassWindow = new bigGlassWindow(bigGlassWinth,bigGlassHeight).build();
            glassWindow.position.set(
                this.sizeX/2-monitorRoomSize+0.2,
                10,
                (monitorRoomSize-this.sizeY)/2
            );

            //普通的窗户
            var sashedWindow = new twoSashedWindow(monitorWindowWidth,monitorWindowheight).build();
            sashedWindow.rotation.y = Math.PI / 2;
            sashedWindow.position.set(
                this.sizeX/2 - 0.1,
                10,
                25-this.sizeY/2
            );

            //监控室的门
            var door = new oneSashedDoor(monitorDoorwidth,monitorDoorHeight,this.depth).build();
            door.position.set(
                this.sizeX/2 - monitorRoomSize +5 - monitorDoorwidth / 2,
                monitorDoorHeight / 2 + 0.1,
                monitorRoomSize-this.sizeY / 2
            );
            // door.rotation.y = Math.PI / 2;

            this.body.add(wall);
            this.body.add(glassWindow);
            this.body.add(sashedWindow);
            this.body.add(door);
        }
    };
    window.wall = wall;

    /**----------------------------------------------------------**/
    /**                      监控室的大玻璃窗                    **/
    /**----------------------------------------------------------**/
    var bigGlassWindow = function(width,height){
        modelObject.call(this,width,height,0.3);
        this.init();
    };
    bigGlassWindow.prototype = {
        init : function(){
            this.material = new THREE.MeshPhongMaterial( {
                color: 0xffffff,
                transparent:true,
                opacity: 0.5,
                side: THREE.DoubleSide,
                wireframe:false});
            var glassWindowGeometry = new THREE.BoxBufferGeometry(this.width,this.height,this.depth);
            var glassWindow = new THREE.Mesh(glassWindowGeometry,this.material);
            glassWindow.rotation.y = Math.PI/2;
            glassWindow.castShadow = true;
            this.body.add(glassWindow);
        }
    };
    /**----------------------------------------------------------**/
    /**                      可双向拉动的窗户                    **/
    /**----------------------------------------------------------**/
    var twoSashedWindow = function(width,height){
        modelObject.call(this,width,height,0.6);
        this.leftWindow = new THREE.Group();
        this.rightWindow = new THREE.Group();
        this.windowFrameMaterial = null;//窗框的材质
        this.windowGlassMaterial = null;//玻璃的材质
        this.frameWidth = 0.2;//边框的宽度
        this.extrudeSettings = {
            steps: 1,
            amount: this.depth,
            bevelEnabled: false,
            bevelSegments: 1,
            bevelSize: 0,
            bevelThickness: 1
        };
        this.init();
    };
    twoSashedWindow.prototype = {
        init : function(){
            this.windowFrameMaterial = new THREE.MeshLambertMaterial({
                color: 0xE4E4E4,
                side : THREE.DoubleSide,
                wireframe:false
            });
            this.windowGlassMaterial = new THREE.MeshPhongMaterial( {
                color: 0xffffff,
                transparent:true,
                opacity: 0.5,
                side: THREE.DoubleSide,
                wireframe:false});
            //窗的大体框架
            var windowFrameShape = new rectangleShape(this.width,this.height).build();
            var topPathWidth = (this.width - 3 * this.frameWidth) / 2,
                topPathHeight = 1,
                x1 = (this.width-topPathWidth)/2 - this.frameWidth,
                x2 = (topPathWidth-this.width)/2 + this.frameWidth,
                y = (this.height-topPathHeight)/2 - this.frameWidth;
            var mainPathWidth = this.width - this.frameWidth * 2,
                mainPathHeight = this.height - this.frameWidth * 3 - topPathHeight,
                mainx = (this.width-mainPathWidth) / 2 - this.frameWidth,
                mainy = (mainPathHeight - this.height) / 2 + this.frameWidth;
            var topLeftPath = new rectanglePath(x1,y,topPathWidth,topPathHeight).build();
            var topRightPath = new rectanglePath(x2,y,topPathWidth,topPathHeight).build();
            windowFrameShape.holes.push(topLeftPath);
            windowFrameShape.holes.push(topRightPath);

            var mainPath = new rectanglePath(mainx,mainy,mainPathWidth,mainPathHeight).build();
            windowFrameShape.holes.push(mainPath);

            var windowFrameGeometry =  new THREE.ExtrudeBufferGeometry(windowFrameShape, this.extrudeSettings);
            var windowFrame = new THREE.Mesh(windowFrameGeometry,this.windowFrameMaterial);
            windowFrame.castShadow = true;

            //顶部的玻璃
            var topGlassGeometry = new THREE.BoxBufferGeometry(topPathWidth,topPathHeight,0.2);
            var topLeftGlass = new THREE.Mesh(topGlassGeometry,this.windowGlassMaterial);
            topLeftGlass.position.set(x1,y,0.3);
            var topRightGlass = new THREE.Mesh(topGlassGeometry,this.windowGlassMaterial);
            topRightGlass.position.set(x2,y,0.3);
            //可拉动的玻璃
            var mainWindowWidth = mainPathWidth / 2,
                mainWindowHeight = mainPathHeight,
                mainWindowX1 = (mainPathWidth - mainWindowWidth) / 2,
                mainWindowX2 = (mainWindowWidth - mainPathWidth) / 2;
            var mainWindowExtrudeSettings = {
                steps: 1,
                amount: 0.3,
                bevelEnabled: false,
                bevelSegments: 1,
                bevelSize: 1,
                bevelThickness: 1
            };
            var mainWindowFrame = new rectangleFrameObject(mainWindowWidth,mainWindowHeight,this.frameWidth).build();
            var mainWindowGeometry = new THREE.ExtrudeBufferGeometry(mainWindowFrame,mainWindowExtrudeSettings);
            var mainLeftWindow = new THREE.Mesh(mainWindowGeometry,this.windowFrameMaterial);
            mainLeftWindow.castShadow = true;
            this.leftWindow.add(mainLeftWindow);
            var mainRightWindow = new THREE.Mesh(mainWindowGeometry,this.windowFrameMaterial);
            mainRightWindow.castShadow = true;
            this.rightWindow.add(mainRightWindow);

            var mainGlassGeomety = new THREE.BoxBufferGeometry(mainWindowWidth,mainWindowHeight,0.1);

            var mainLeftGlass = new THREE.Mesh(mainGlassGeomety,this.windowGlassMaterial);
            mainLeftGlass.position.set(0,0,0.1);
            this.leftWindow.add(mainLeftGlass);
            this.leftWindow.position.set(mainWindowX1 - 1,mainy,0);

            var mainRightGlass = new THREE.Mesh(mainGlassGeomety,this.windowGlassMaterial);
            mainRightGlass.position.set(0,0,0.1);
            this.rightWindow.add(mainRightGlass);
            this.rightWindow.position.set(mainWindowX2 + 0.5,mainy,0.3);

            this.body.add(windowFrame);
            this.body.add(topLeftGlass);
            this.body.add(topRightGlass);
            this.body.add(this.leftWindow);
            this.body.add(this.rightWindow);
        },
        open : function(){

        },
        close : function(){

        }
    };
    window.twoSashedWindow = twoSashedWindow;

    /**----------------------------------------------------------**/
    /**                             单扇门                       **/
    /**----------------------------------------------------------**/
    var oneSashedDoor = function(width,height,depth){
        modelObject.call(this,width,height,depth);
        this.doorFrameMaterial = null;
        this.doorGlassMaterial = null;
        this.frameWidth = 0.3;
        this.extrudeSettings = {
            steps: 1,
            amount: this.depth,
            bevelEnabled: false,
            bevelSegments: 1,
            bevelSize: 0,
            bevelThickness: 1
        };
        this.init();
    };
    oneSashedDoor.prototype = {
        init : function(){
            this.doorFrameMaterial = new THREE.MeshLambertMaterial({
                color: 0xE4E4E4,
                side : THREE.DoubleSide,
                wireframe:false
            });
            this.doorGlassMaterial = new THREE.MeshPhongMaterial( {
                color: 0xffffff,
                transparent:true,
                opacity: 0.5,
                side: THREE.DoubleSide,
                wireframe:false});
            this.doorHadleMaterial = new THREE.MeshPhongMaterial({
                color: 0x63696e,
                side : THREE.DoubleSide,
                wireframe:false
            });
            var doorFrameShape = new rectangleFrameObject(this.width,this.height,this.frameWidth).build();
            var doorFrameGeometry = new THREE.ExtrudeBufferGeometry(doorFrameShape,this.extrudeSettings);

            var insideWidth = this.width - this.frameWidth * 2,
                insideHeight = this.height - this.frameWidth * 2;
            var doorBottomWidth = insideWidth,
                doorBottomHeight = insideHeight / 2;
            var doorBottomGeometry = new THREE.PlaneBufferGeometry(doorBottomWidth,doorBottomHeight);
            doorBottomGeometry.translate(0,(doorBottomHeight - this.height) / 2 ,this.depth/2);

            var doorCenterGeometry = new THREE.BoxBufferGeometry(doorBottomWidth,1,this.depth/2);
            doorCenterGeometry.translate(0,0 ,this.depth/2);

            //门把手
            var handleGeometry = new THREE.CylinderBufferGeometry(0.2,0.2,0.2,6,1,false,0,2 * Math.PI);
            handleGeometry.rotateX(Math.PI / 2);
            var insideHadle = new THREE.Mesh(handleGeometry,this.doorHadleMaterial);
            insideHadle.castShadow = true;
            insideHadle.position.set(this.width / 2 + doorBottomWidth / 2 - 0.2,0,0);
            var outsideHadle = new THREE.Mesh(handleGeometry,this.doorHadleMaterial);
            outsideHadle.castShadow = true;
            outsideHadle.position.set(this.width / 2 + doorBottomWidth / 2 - 0.2,0,this.depth);

            var doorGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([
                doorFrameGeometry,
                doorCenterGeometry,
                doorBottomGeometry
            ]);
            var door = new THREE.Mesh(doorGeometry,this.doorFrameMaterial);
            door.castShadow = true;

            var doorGlassGeometry = new THREE.BoxBufferGeometry(doorBottomWidth,doorBottomHeight,this.depth/4);
            var doorGlass = new THREE.Mesh(doorGlassGeometry,this.doorGlassMaterial);
            doorGlass.position.set(this.width / 2 ,(this.height - doorBottomHeight) / 2,this.depth/2);

            door.position.set(this.width / 2,0,0);
            this.body.add(door);
            this.body.add(doorGlass);
            this.body.add(insideHadle);
            this.body.add(outsideHadle);
        },
        open : function(){

        },
        close : function(){

        }
    };
    window.oneSashedDoor = oneSashedDoor;

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
            var ColumnWidth = 1,
                ColumnHeight = 0.5,
                ColumnDepth = 0.1;

            var propMaterial = new THREE.MeshLambertMaterial({
                color: 0x205488,
                side : THREE.DoubleSide,
                wireframe : false});

            var propShape = new THREE.Shape();
            propShape.moveTo(0,0);
            propShape.lineTo(ColumnHeight,0);
            propShape.lineTo(ColumnHeight,this.height);
            propShape.lineTo(0,this.height);
            propShape.lineTo(0,0);

            // var holeR = 0.2,
            //     holeY = 3.5;
            // while(holeY < (this.height-4)){
            //     var holePath = new THREE.Path();
            //     holePath.moveTo( 0, 0 );
            //     holePath.absarc( 0.5,holeY, holeR, 0, Math.PI*2, true);
            //     propShape.holes.push( holePath );
            //     holeY += 1;
            // }

            var propExtrudeSettings = {
                steps: 1,
                amount: ColumnDepth,
                bevelEnabled: true,
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

            var pedestalGeometry = new THREE.BoxBufferGeometry(ColumnHeight+0.6,0.2,ColumnWidth+0.6,1,1,1);
            pedestalGeometry.translate(ColumnHeight/2,0,0);

            var propGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([mainGeometry,sideGeometry1,sideGeometry2,pedestalGeometry]);
            var prop = new THREE.Mesh(propGeometry, propMaterial);

            prop.castShadow = true;

            this.body.add(prop);
        }
    };

    /**----------------------------------------------------------**/
    /**                            柱片                          **/
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
            var ColumnsMaterial = new THREE.MeshLambertMaterial({
                color: 0x205488,
                wireframe : false});

            var prop1 = new ColumnOfProp(this.height);
            prop1.body.position.set(-this.width/2,0,0);

            var prop2 = new ColumnOfProp(this.height);
            prop2.body.rotation.y = Math.PI;
            prop2.body.position.set(this.width/2,0,0);

            var beamGeometry = new THREE.BoxBufferGeometry(this.width,0.5,0.5);
            var beam1 = new THREE.Mesh(beamGeometry, ColumnsMaterial);
            beam1.position.set(0,3,0);
            beam1.castShadow = true;

            var beam2 = new THREE.Mesh(beamGeometry, ColumnsMaterial);
            beam2.position.set(0,this.height-3,0);
            beam2.castShadow = true;

            //斜着的横梁(3根)
            var W = this.width,
                H = (this.height-10)/3;
            var L = Math.sqrt(W*W+H*H);
            var ANGLE = Math.atan(H/W)+0.02;
            for(var i=0;i<3;i++){
                var obliqueBeamGeometry = new THREE.BoxBufferGeometry(L,0.2,0.5,1,1,1);
                var obliqueBeam = new THREE.Mesh(obliqueBeamGeometry, ColumnsMaterial);
                obliqueBeam.rotation.z = Math.pow(-1,i)*ANGLE;
                obliqueBeam.position.set(0,H*i+H/2+4,0);
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
    var beamOfShelf = function(width){
        this.body = new THREE.Group();
        this.width = width;
        this.build = function(){
            return this.body;
        };
        this.init();
    };
    beamOfShelf.prototype = {
        init : function(){

        }
    };

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
            var ColumnsMaterial = new THREE.MeshLambertMaterial({
                color: 0x205488,
                wireframe : false
            });
            //螺丝的材质
            var ScrewMaterial = new THREE.MeshLambertMaterial({
                color: 0xFFFFFF,
                side : THREE.DoubleSide,
                wireframe : false
            });

            //底部支撑横梁
            var bottomBeamGeometry = new THREE.BoxBufferGeometry(this.width+1.6,2,0.3);
            //底部固定的螺丝
            var bottomScrewGeometry = new THREE.CircleGeometry(0.3,6);

            var bottomBeam1 = new THREE.Mesh(bottomBeamGeometry, ColumnsMaterial);
            bottomBeam1.position.set(0,3,this.depth/2);
            this.Columns.add(bottomBeam1);
            var bottomBeam2 = new THREE.Mesh(bottomBeamGeometry, ColumnsMaterial);
            bottomBeam2.position.set(0,3,-this.depth/2);
            this.Columns.add(bottomBeam2);

            var bottomScrew1 = new THREE.Mesh(bottomScrewGeometry, ScrewMaterial);
            bottomScrew1.position.set(this.width/2-0.3,3,-this.depth/2-0.2);
            var bottomScrew2 = new THREE.Mesh(bottomScrewGeometry, ScrewMaterial);
            bottomScrew2.position.set(-this.width/2+0.3,3,-this.depth/2-0.2);
            var bottomScrew3 = new THREE.Mesh(bottomScrewGeometry, ScrewMaterial);
            bottomScrew3.position.set(this.width/2-0.3,3,this.depth/2+0.2);
            var bottomScrew4 = new THREE.Mesh(bottomScrewGeometry, ScrewMaterial);
            bottomScrew4.position.set(-this.width/2+0.3,3,this.depth/2+0.2);

            this.Columns.add(bottomScrew1);
            this.Columns.add(bottomScrew2);
            this.Columns.add(bottomScrew3);
            this.Columns.add(bottomScrew4);


            this.body.add(this.CrossBeams);
            this.body.add(this.Columns);
        },
        build : function(){
            return this.body;
        }
    };
    window.shelf = shelf;

    /**----------------------------------------------------------**/
    /**                       通风管道对象                       **/
    /**----------------------------------------------------------**/
    var ventpipe = function(widht,height,depth){
        modelObject.call(this,width,height,depth);
        this.init();
    };
    ventpipe.prototype = {
        init : function(){

        }
    };
    widnow.ventpipe = ventpipe;

    /**----------------------------------------------------------**/
    /**                        仓库的大门                        **/
    /**----------------------------------------------------------**/
    var wareDoor = function(width,height,depth){
        modelObject.call(this,width,height,depth);
        this.extrudeSettings = {
            steps: 1,
            amount: this.width,
            bevelEnabled: true,
            bevelSegments: 1,
            bevelSize: 0.1,
            bevelThickness: 0.1
        };
        this.init();
    };
    wareDoor.prototype = {
        init : function(){
            var extrudeWidth = 0.3;
            var wareDoorShape = new THREE.Shape();
            wareDoorShape.moveTo(0,0);
            wareDoorShape.lineTo(this.depth/2,0);
            wareDoorShape.lineTo(this.depth/2,this.height);
            wareDoorShape.lineTo(-this.depth/2-extrudeWidth,this.height-1);
            wareDoorShape.lineTo(-this.depth/2-extrudeWidth,this.height-3);
            wareDoorShape.lineTo(-this.depth/2,this.height-3.5);
            wareDoorShape.lineTo(-this.depth/2,5);
            wareDoorShape.lineTo(-this.depth/2-extrudeWidth,3);
            wareDoorShape.lineTo(-this.depth/2-extrudeWidth,1);
            wareDoorShape.lineTo(-this.depth/2,0.5);
            wareDoorShape.lineTo(-this.depth/2,0);
            wareDoorShape.lineTo(0,0);
            var doorGeometry = new THREE.ExtrudeBufferGeometry( wareDoorShape, this.extrudeSettings );
            var doorMaterial = new THREE.MeshLambertMaterial({
                color: 0x205488,
                wireframe : false
            });
            var DoorMesh = new THREE.Mesh(doorGeometry,doorMaterial);
            this.body.add(DoorMesh);
        }
    };
    window.wareDoor  = wareDoor;
})(window);