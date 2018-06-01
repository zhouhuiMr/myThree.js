(function(window){
    var monitorRoom = function(){
        modelObject.call(this,15,20,15);
        this.wallDepth = 0.5;
        this.wall = null;
        this.material = this.material = new THREE.MeshLambertMaterial({
            color : 0xCDBE70,
            side : THREE.DoubleSide,
            wireframe : true
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
            var distanceToFloor = 4;
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

            var monitorWallGeometry_2 = THREE.BufferGeometryUtils.mergeBufferGeometries([
                Wall_2_top,
                Wall_2_left,
                Wall_2_right,
                Wall_2_bottom
            ]);
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

            /**--------           监控室的屋顶 start            ---------**/
            
            /**--------           监控室的屋顶  end            ---------**/


            var wallGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([
                monitorWallGeometry_1,
                monitorWallGeometry_2,
                monitorWallGeometry_3,
                monitorWallGeometry_4
            ]);
            this.wall = new THREE.Mesh(wallGeometry,this.material);
            this.body.add(this.wall);
        }
    };
    window.monitorRoom = monitorRoom;

    var monitorLight = function(width,height,depth){
        modelObject.call(this,width,height,depth);
        this.light = null;
        this.intensity = 1;
        this.lightdistince = 15;
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
            this.light.position.set(0,2-this.lightdistince,0);
            this.body.add(this.light);
            this.body.add(lampshade);
        }
    };
    window.monitorLight = monitorLight;
})(window);