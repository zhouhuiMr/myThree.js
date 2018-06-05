(function(window){
    var monitorRoom = function(){
        modelObject.call(this,15,20,15);
        this.wallDepth = 0.5;
        this.wallGeometry = null;
        this.wall = null;
        this.roofGeometry = null;
        this.roof = null;
        this.floorGeometry = null;
        this.floor = null;
        this.sashedWindow = null;
        this.door = null;
        this.roofLight = null;
        this.wallMaterial = new THREE.MeshLambertMaterial({
            color : 0xCDBE70,
            side : THREE.FrontSide,
            wireframe : false
        });
        this.roofMaterial = new THREE.MeshLambertMaterial({
            color : 0xCDBE70,
            side : THREE.FrontSide,
            wireframe : false
        });
        this.floorMaterial = new THREE.MeshPhongMaterial({
            color : 0x78562b,
            side : THREE.FrontSide,
            wireframe : false
        });

        this.init();
    };
    monitorRoom.prototype = {
        init : function(){
            //监控室的门
            var monitorDoorHeight = 12,
                monitorDoorwidth = 4;
            //大窗户
            var bigGlassWinth = 10,
                bigGlassHeight = 6;
            //监控室的窗窗
            var monitorWindowWidth = 7,
                monitorWindowheight = 9;
            //距离地面的高度
            var distanceToFloor = 4;

            /**--------           监控室有门的墙  start            ---------**/
            var Wall_1_top = new THREE.BoxBufferGeometry(this.width,this.height - monitorDoorHeight ,this.wallDepth,5,3);
            Wall_1_top.translate(0,(this.height - monitorDoorHeight) / 2 + monitorDoorHeight,this.width / 2);

            var Wall_1_left = new THREE.BoxBufferGeometry(this.width / 2 - 5,monitorDoorHeight ,this.wallDepth,1,3);
            Wall_1_left.translate( -this.width / 4 - 5 / 2 ,monitorDoorHeight / 2,this.width / 2);

            var Wall_1_right = new THREE.BoxBufferGeometry(this.width / 2 + 5 - monitorDoorwidth,monitorDoorHeight ,this.wallDepth,3,3);
            Wall_1_right.translate(this.width / 4 - 1 / 2 ,monitorDoorHeight / 2,this.width / 2);
            var monitorWallGeometry_1 = THREE.BufferGeometryUtils.mergeBufferGeometries([
                Wall_1_top,
                Wall_1_left,
                Wall_1_right
            ]);
            monitorWallGeometry_1.translate(0,0,-0.25);
            /**--------           监控室有门的墙  end           ---------**/

            /**--------           监控室有大玻璃的墙  start            ---------**/
            var Wall_2_top = new THREE.BoxBufferGeometry(this.width,this.height - bigGlassHeight - distanceToFloor,this.wallDepth,5,2);
            Wall_2_top.rotateY(-Math.PI / 2);
            Wall_2_top.translate(-this.width / 2,(this.height + bigGlassHeight + distanceToFloor) / 2 ,0);

            var Wall_2_left= new THREE.BoxBufferGeometry((this.width - bigGlassWinth) / 2,bigGlassHeight + distanceToFloor,this.wallDepth,1,2);
            Wall_2_left.rotateY(-Math.PI / 2);
            Wall_2_left.translate(-this.width / 2,(bigGlassHeight + distanceToFloor) / 2 ,(-this.width -bigGlassWinth )/ 4);

            var Wall_2_right= new THREE.BoxBufferGeometry((this.width - bigGlassWinth) / 2,bigGlassHeight + distanceToFloor,this.wallDepth,1,2);
            Wall_2_right.rotateY(-Math.PI / 2);
            Wall_2_right.translate(-this.width / 2,(bigGlassHeight + distanceToFloor) / 2 ,(this.width +bigGlassWinth )/ 4);

            var Wall_2_bottom= new THREE.BoxBufferGeometry(bigGlassWinth,distanceToFloor,this.wallDepth,3,1);
            Wall_2_bottom.rotateY(-Math.PI / 2);
            Wall_2_bottom.translate(-this.width / 2,distanceToFloor / 2 ,0);

            var Wall_2_sill = new THREE.BoxBufferGeometry(2,0.2,bigGlassWinth,1,1,3);
            Wall_2_sill.translate(-this.width / 2 - 0.3,distanceToFloor - 0.1,0);

            var monitorWallGeometry_2 = THREE.BufferGeometryUtils.mergeBufferGeometries([
                Wall_2_top,
                Wall_2_left,
                Wall_2_right,
                Wall_2_bottom,
                Wall_2_sill
            ]);
            monitorWallGeometry_2.translate(0.25,0,0);
            /**--------           监控室有大玻璃的墙  end            ---------**/


            var monitorWallGeometry_3 = new THREE.BoxBufferGeometry(this.width,this.height,this.wallDepth,5,6);
            monitorWallGeometry_3.translate(0,this.height / 2,-this.width / 2);
            monitorWallGeometry_3.translate(0,0,0.25);


            /**--------           监控室有玻璃的墙  start            ---------**/
            var Wall_4_top = new THREE.BoxBufferGeometry(this.width,this.height - monitorWindowheight - distanceToFloor,this.wallDepth,5,2);
            Wall_4_top.rotateY(-Math.PI / 2);
            Wall_4_top.translate(this.width / 2,(this.height + monitorWindowheight + distanceToFloor) / 2 ,0);

            var Wall_4_left = new THREE.BoxBufferGeometry((this.width - monitorWindowWidth ) / 2,monitorWindowheight + distanceToFloor,this.wallDepth,2,3);
            Wall_4_left.rotateY(-Math.PI / 2);
            Wall_4_left.translate(this.width / 2,(monitorWindowheight + distanceToFloor) / 2, (this.width + monitorWindowWidth) / 4);

            var Wall_4_right = new THREE.BoxBufferGeometry((this.width - monitorWindowWidth ) / 2,monitorWindowheight + distanceToFloor,this.wallDepth,2,3);
            Wall_4_right.rotateY(-Math.PI / 2);
            Wall_4_right.translate(this.width / 2,(monitorWindowheight + distanceToFloor) / 2, -(this.width + monitorWindowWidth) / 4);

            var Wall_4_bottom = new THREE.BoxBufferGeometry(monitorWindowWidth,distanceToFloor,this.wallDepth,3,1);
            Wall_4_bottom.rotateY(-Math.PI / 2);
            Wall_4_bottom.translate(this.width / 2,distanceToFloor/ 2, 0);

            var monitorWallGeometry_4 = THREE.BufferGeometryUtils.mergeBufferGeometries([
                Wall_4_top,
                Wall_4_left,
                Wall_4_right,
                Wall_4_bottom
            ]);
            monitorWallGeometry_4.translate(-0.25,0,0);
            /**--------           监控室有玻璃的墙  end            ---------**/

            this.wallGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([
                monitorWallGeometry_1,
                monitorWallGeometry_2,
                monitorWallGeometry_3,
                monitorWallGeometry_4
            ]);
            this.wall = new THREE.Mesh(this.wallGeometry,this.wallMaterial);
            this.wall.castShadow = true;
            // this.wall.receiveShadow = true;

            /**--------           监控室的屋顶 start            ---------**/
            this.roofGeometry = new THREE.BoxBufferGeometry(this.width+0.2,this.depth,0.4, 5,5);
            this.roofGeometry.rotateX(Math.PI / 2);
            this.roofGeometry.translate(0,this.height-0.2,0);
            this.roof = new THREE.Mesh(this.roofGeometry,this.roofMaterial);
            // this.wall.receiveShadow = true;
            /**--------           监控室的屋顶  end            ---------**/

            /**--------           监控室的地面 start            ---------**/
            this.floorGeometry = new THREE.PlaneBufferGeometry(this.width,this.depth,5,5);
            this.floorGeometry.rotateX( - Math.PI / 2 );
            this.floor = new THREE.Mesh(this.floorGeometry,this.floorMaterial);
            // this.floor.receiveShadow = true;
            /**--------           监控室的地面 end            ---------**/

            /**--------           监控室的大玻璃 start            ---------**/
            var glassWindow = new bigGlassWindow(bigGlassWinth+0.5,bigGlassHeight+0.5).build();
            glassWindow.position.set(0.2-this.width / 2, distanceToFloor + bigGlassHeight / 2, 0);
            this.body.add(glassWindow);
            /**--------           监控室的大玻璃 end            ---------**/

            /**--------           监控室普通的窗户 start            ---------**/
            this.sashedWindow = new twoSashedWindow(monitorWindowWidth,monitorWindowheight);
            this.sashedWindow.body.rotation.y = Math.PI / 2;
            this.sashedWindow.body.position.set(this.width / 2 - 0.6,distanceToFloor + monitorWindowheight / 2,0);
            this.body.add(this.sashedWindow.build());
            /**--------           监控室普通的窗户 start            ---------**/

            /**--------           监控室的门 start            ---------**/
            this.door = new oneSashedDoor(monitorDoorwidth,monitorDoorHeight,0.5);
            this.door.body.position.set(-5 ,monitorDoorHeight / 2 ,this.depth / 2 - 0.5);
            this.body.add(this.door.build());
            /**--------           监控室的门 end           ---------**/

            /**--------           监控室屋顶的灯 start            ---------**/
            this.roofLight = new monitorLight(0.1,0.05,0.1);
            this.roofLight.body.position.set(0,this.height - 0.4,0);
            this.body.add(this.roofLight.build());
            /**--------           监控室屋顶的灯 end            ---------**/


            this.body.add(this.wall);
            this.body.add(this.roof);
            this.body.add(this.floor);
        }
    };
    window.monitorRoom = monitorRoom;

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
                side: THREE.FrontSide,
                wireframe:false});
            var glassWindowGeometry = new THREE.BoxBufferGeometry(this.width,this.height,this.depth,3,2,1);
            var glassWindow = new THREE.Mesh(glassWindowGeometry,this.material);
            glassWindow.rotation.y = Math.PI/2;
            // glassWindow.castShadow = true;
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
                side : THREE.FrontSide,
                wireframe:false
            });
            this.windowGlassMaterial = new THREE.MeshPhongMaterial( {
                color: 0xffffff,
                transparent:true,
                opacity: 0.5,
                side: THREE.FrontSide,
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
            // windowFrame.castShadow = true;

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
            // mainLeftWindow.castShadow = true;
            this.leftWindow.add(mainLeftWindow);
            var mainRightWindow = new THREE.Mesh(mainWindowGeometry,this.windowFrameMaterial);
            // mainRightWindow.castShadow = true;
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
                side: THREE.FrontSide,
                wireframe:false});
            this.doorHadleMaterial = new THREE.MeshPhongMaterial({
                color: 0x63696e,
                side : THREE.FrontSide,
                wireframe:false
            });
            var doorFrameShape = new rectangleFrameObject(this.width,this.height,this.frameWidth).build();
            var doorFrameGeometry = new THREE.ExtrudeBufferGeometry(doorFrameShape,this.extrudeSettings);

            var insideWidth = this.width - this.frameWidth * 2,
                insideHeight = this.height - this.frameWidth * 2;
            var doorBottomWidth = insideWidth,
                doorBottomHeight = insideHeight / 2;
            var doorBottomGeometry = new THREE.BoxBufferGeometry(doorBottomWidth,doorBottomHeight,0.02,2,2,1);
            doorBottomGeometry.translate(0,(doorBottomHeight - this.height) / 2 ,this.depth/2);

            var doorCenterGeometry = new THREE.BoxBufferGeometry(doorBottomWidth,1,this.depth/2);
            doorCenterGeometry.translate(0,0 ,this.depth/2);

            //门把手
            var handleGeometry = new THREE.CylinderBufferGeometry(0.2,0.2,0.2,6,1,false,0,2 * Math.PI);
            handleGeometry.rotateX(Math.PI / 2);
            var insideHadle = new THREE.Mesh(handleGeometry,this.doorHadleMaterial);
            // insideHadle.castShadow = true;
            insideHadle.position.set(this.width / 2 + doorBottomWidth / 2 - 0.2,0,0);
            var outsideHadle = new THREE.Mesh(handleGeometry,this.doorHadleMaterial);
            // outsideHadle.castShadow = true;
            outsideHadle.position.set(this.width / 2 + doorBottomWidth / 2 - 0.2,0,this.depth);

            var doorGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([
                doorFrameGeometry,
                doorCenterGeometry,
                doorBottomGeometry
            ]);
            var door = new THREE.Mesh(doorGeometry,this.doorFrameMaterial);
            // door.castShadow = true;

            var doorGlassGeometry = new THREE.BoxBufferGeometry(doorBottomWidth,doorBottomHeight,this.depth/4,2,2,1);
            var doorGlass = new THREE.Mesh(doorGlassGeometry,this.doorGlassMaterial);
            doorGlass.position.set(this.width / 2 ,(this.height - doorBottomHeight) / 2,this.depth/2);

            door.position.set(this.width / 2,0,0);
            this.body.add(door);
            this.body.add(doorGlass);
            this.body.add(insideHadle);
            this.body.add(outsideHadle);
            // this.body.castShadow = true;
        },
        open : function(){

        },
        close : function(){

        }
    };
    window.oneSashedDoor = oneSashedDoor;

    /**----------------------------------------------------------**/
    /**                         监控室的灯                       **/
    /**----------------------------------------------------------**/
    var monitorLight = function(width,height,depth){
        modelObject.call(this,width,height,depth);
        this.light = null;
        this.intensity = 2;
        this.lightdistince = 12;
        this.init();
    };
    monitorLight.prototype = {
        init : function(){
            //创建灯罩
            var lampshadeWidth = 8,
                lampshadeHeight = 4,
                lampshadeDepth = 15;
            var lampshadeShape = new THREE.Shape();
            lampshadeShape.moveTo(lampshadeWidth / 2, lampshadeHeight / 2);
            lampshadeShape.lineTo(lampshadeWidth / 2, -lampshadeHeight / 2);
            lampshadeShape.lineTo(-lampshadeWidth / 2, -lampshadeHeight / 2);
            lampshadeShape.lineTo(-lampshadeWidth / 2, lampshadeHeight / 2);
            lampshadeShape.lineTo(lampshadeWidth / 2, lampshadeHeight / 2);
            var lampshadeExtrudeSettings = {
                steps: 1,
                amount: lampshadeDepth,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 1,
                bevelSegments: 1
            };
            var lampshadeGeometry = new THREE.ExtrudeBufferGeometry( lampshadeShape, lampshadeExtrudeSettings );
            lampshadeGeometry.scale(this.width,this.height,this.depth);
            lampshadeGeometry.translate(0,0,-lampshadeDepth * this.depth / 2);
            var lampshadeMaterial = new THREE.MeshLambertMaterial({
                transparent:true,
                opacity: 0.9,
                color: 0xdfdfdd,
                side : THREE.DoubleSide,
                emissive : 0xffffff,
                wireframe : false
            });
            var lampshade = new THREE.Mesh(lampshadeGeometry,lampshadeMaterial);
            this.light = new THREE.PointLight( 0xffffff,this.intensity, this.lightdistince);
            this.light.position.set(-2.5,-9,0);
            this.body.add(this.light);
            this.body.add(lampshade);
        }
    };
    window.monitorLight = monitorLight;
})(window);