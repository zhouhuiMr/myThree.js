(function(widnow){
    /**----------------------------------------------------------**/
    /**                                                          **/
    /**  https://threejs.org/examples/#misc_controls_pointerlock **/
    /**                                                          **/
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
    /**                      带有边框物体的父类                  **/
    /**----------------------------------------------------------**/
    var objectFrame = function(width,height){
        this.body = new THREE.Group();
        this.width = width;
        this.height = height;
        this.thickness = 1;
        this.FrameWidth = 1;
        /**
         * leftWidth   左侧边框的宽度
         * topWidth    顶部边框的宽度
         * rightWidth  右侧边框的宽度
         * bottomWidth 底部边框的宽度
         * color       边框的颜色
         * */
        this.frame = function(leftWidth,topWidth,rightWidth,bottomWidth,color){
            var Shap = new THREE.Shape();
            Shap.moveTo(0,0);
            Shap.lineTo(this.width,0);
            Shap.lineTo(this.width,this.height);
            Shap.lineTo(0,this.height);
            Shap.lineTo(0,0);

            var Path = new THREE.Path();
            Path.moveTo(leftWidth,bottomWidth);
            Path.lineTo(this.width-rightWidth,bottomWidth);
            Path.lineTo(this.width-rightWidth,this.height-topWidth);
            Path.lineTo(leftWidth,this.height-topWidth);
            Path.lineTo(leftWidth,bottomWidth);
            Shap.holes.push(Path);

            var extrudeSettings = {
                amount: 1,
                bevelEnabled: true,
                bevelSegments: 1,
                steps: 1,
                bevelSize: 0,
                bevelThickness: this.thickness};

            var Geometry = new THREE.ExtrudeGeometry(Shap,extrudeSettings);
            var Material = new THREE.MeshBasicMaterial( { color: color ,side: THREE.DoubleSide,wireframe:false});
            var Frame = new THREE.Mesh(Geometry, Material);
            return Frame;
        };
        this.build = function(){
            return this.body;
        };
    };
    objectFrame.prototype = {
        init : function(){},
    };

    /**----------------------------------------------------------**/
    /**                         创建地板对象                     **/
    /**----------------------------------------------------------**/
    var floor = function(width,height){
        this.floor = null;
        this.width = width;
        this.height = height;
    };
    floor.prototype = {
        bulid : function(){
            var floorGeometry = new THREE.PlaneGeometry( this.width, this.height, 100, 100 );
            floorGeometry.rotateX( - Math.PI / 2 );
            var floorMaterial = new THREE.MeshBasicMaterial( {color: 0x4682B4, side: THREE.DoubleSide});
            // var textureLoader = new THREE.TextureLoader();
            // textureLoader.load( "resources/floor.jpg", function( map ) {
            //     map.wrapS = THREE.RepeatWrapping;
            //     map.wrapT = THREE.RepeatWrapping;
            //     map.anisotropy = 20;
            //     map.repeat.set(32, 32);
            //     floorMaterial.map = map;
            //     floorMaterial.needsUpdate = true;
            // } );
            this.floor = new THREE.Mesh( floorGeometry, floorMaterial );
            return this.floor;
        }
    };
    window.floor = floor;

    /**----------------------------------------------------------**/
    /**                                                          **/
    /**                         创建墙面对象                     **/
    /**                 通过2d图形挤压形成墙体                   **/
    /**----------------------------------------------------------**/
    var wall = function(width,height){
        this.wall = new THREE.Group();
        this.width = width;
        this.height = height;
        this.thickness = 1;
        this.additional = null;
    };
    wall.prototype = {
        build : function(){
            var rectangle = new THREE.Shape();
            rectangle.moveTo(0,0);
            rectangle.lineTo(this.width,0);
            rectangle.lineTo(this.width,this.height);
            rectangle.lineTo(0,this.height);
            rectangle.lineTo(0,0);

            if(this.additional != null){
                this.additional(rectangle);
            }

            var extrudeSettings = { amount: 1, bevelEnabled: true, bevelSegments: 1, steps: 10, bevelSize: 1, bevelThickness: this.thickness};
            var geometry = new THREE.ExtrudeGeometry(rectangle,extrudeSettings);
            var material = new THREE.MeshBasicMaterial({
                color: 0xBDB76B ,
                side: THREE.DoubleSide,
                roughness: 2,
                metalness: 1,
                flatShading: true,
                wireframe:false});
            var mesh = new THREE.Mesh(geometry, material);
            this.wall.add(mesh);

            return this.wall;
        }
    };
    window.wall = wall;

    /**----------------------------------------------------------**/
    /**                                                          **/
    /**                         屋顶对象                     **/
    /**                                                          **/
    /**----------------------------------------------------------**/
    var roof = function(width,height,top){
        this.roof = null;
        this.width = width;
        this.height = height;
        this.top = top;

        this.init();
    };
    roof.prototype = {
        init : function(){

        },
        build : function(){
            var triangle = new THREE.Shape();
            triangle.moveTo(-(this.width/2+5),0+this.top);
            triangle.lineTo(0,25+this.top);
            triangle.lineTo(this.width/2+5,0+this.top);
            triangle.lineTo(this.width/2+10,0+this.top);
            triangle.lineTo(0,25+this.top+5);
            triangle.lineTo(-(this.width/2+10),0+this.top);

            var extrudeSettings = { amount: 1, bevelEnabled: true, bevelSegments: 1, steps: 10, bevelSize: 2, bevelThickness: 310 };
            var geometry = new THREE.ExtrudeGeometry(triangle,extrudeSettings);
            var material = new THREE.MeshBasicMaterial( { color: 0xdddedf ,side: THREE.DoubleSide,wireframe:false});
            this.roof  = new THREE.Mesh( geometry, material);
            // this.roof.scale.set(1,1,310)
            return this.roof;
        }
    };
    window.roof = roof;

    /**----------------------------------------------------------**/
    /**                                                          **/
    /**                         在墙面形成窗体                   **/
    /**                                                          **/
    /**----------------------------------------------------------**/
    var frame = function(width,height,x,y){
        this.win = frame;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    };
    frame.prototype = {
        build : function(shape){
            this.frame = new THREE.Path();
            this.frame.moveTo(this.x,this.y);
            this.frame.lineTo(this.x + this.width,this.y);
            this.frame.lineTo(this.x + this.width,this.y+this.height);
            this.frame.lineTo(this.x,this.y+this.height);
            this.frame.lineTo(this.x,this.y);
            shape.holes.push(this.frame);
            return this.frame;
        }
    };
    window.frame = frame;

    /**----------------------------------------------------------**/
    /**                           窗户对象                       **/
    /**                  继承自objectFrame对象                   **/
    /**----------------------------------------------------------**/
    var mywindow = function(width,height){
        objectFrame.call(this,width,height);
        this.removableGlassBody = null;
        this.init()
    };
    mywindow.prototype = {
        init : function(){
            this.body.add(this.frame(2,2,2,2,0xE4E4E4));

            //固定的玻璃\
            var glassWidth = (this.width-this.FrameWidth*2)/2,
                glassHeight = this.height-this.FrameWidth*2;
            var GlassMaterial = new THREE.MeshBasicMaterial( {
                color: 0xffffff,
                transparent:true,
                opacity: 0.5,
                side: THREE.DoubleSide,
                wireframe:false});

            var fixedGlassGeometry = new THREE.BoxBufferGeometry(glassWidth,glassHeight,0.5);
            var fixedGlass = new THREE.Mesh( fixedGlassGeometry, GlassMaterial);
            fixedGlass.position.set(glassWidth/2,glassHeight/2,-0.5);
            //可移动的玻璃
            this.removableGlassBody = new THREE.Group();
            var removableGlassGeometry = new THREE.BoxBufferGeometry(glassWidth,glassHeight,1);
            var removableGlass = new THREE.Mesh( removableGlassGeometry, GlassMaterial);
            removableGlass.position.set(0,0,0);
            this.removableGlassBody.add(removableGlass);
            //把手
            var winHandleGeometry = new THREE.BoxBufferGeometry(1,3,1);
            var winHandleMaterial = new THREE.MeshBasicMaterial( { color: 0xE4E4E4,transparent:true, opacity: 1,side: THREE.DoubleSide,wireframe:false});
            var winHandle = new THREE.Mesh( winHandleGeometry, winHandleMaterial);
            winHandle.position.set(glassWidth/2-3,0,1);
            this.removableGlassBody.add(winHandle);
            //移动范围1.5倍的玻璃的宽度到0.5倍玻璃的宽度
            this.removableGlassBody.position.set(glassWidth*3/2,glassHeight/2,0.5);

            this.body.add(fixedGlass);
            this.body.add(this.removableGlassBody);
        },
        open : function(){

        },
        close : function(){

        }
    };
    window.mywindow = mywindow;

    /**----------------------------------------------------------**/
    /**                        自动门对象                        **/
    /**                   继承自objectFrame对象                  **/
    /**----------------------------------------------------------**/
    var door = function(width,height){
        objectFrame.call(this,width,height);
        this.GlassDoor1 = null;
        this.GlassDoor2 = null;
        this.isOpening = false;
        this.isClosing = false;
        this.isOpened = false;
        this.isClosed = true;
        this.doorSpeed = 0.5;
        this.init();
    };
    door.prototype = {
        init : function(){
            this.body.add(this.frame(1,5,1,0.1,0xE4E4E4));

            this.GlassDoor1 = new glassDoor(this.width/2-0.5,this.height-1);
            this.GlassDoor1.body.position.set(0.5,0.5,0);
            this.body.add(this.GlassDoor1.body);

            this.GlassDoor2 = new glassDoor(this.width/2-0.5,this.height-1);
            this.GlassDoor2.body.position.set(this.width/2-0.5,0.5,0);
            this.body.add(this.GlassDoor2.body);
        },
        open : function(){
            if(this.GlassDoor1 != null && this.GlassDoor2 != null){
                if(!this.isOpened){
                    if(this.GlassDoor1.body.position.x > -this.width/2 && this.GlassDoor2.body.position.x < this.width){
                        this.isOpening = true;
                        this.isClosed = false;
                        this.GlassDoor1.body.position.x -= this.doorSpeed;
                        this.GlassDoor2.body.position.x += this.doorSpeed;
                    }else{
                        this.isOpened = true;
                        this.isOpening = false;
                    }
                }
            }
        },
        close : function(){
            if(this.GlassDoor1 != null && this.GlassDoor2 != null){
                if(!this.isClosed){
                    if(this.GlassDoor1.body.position.x < 0.5 && this.GlassDoor2.body.position.x > (this.width/2-0.5)){
                        this.isClosing = true;
                        this.isOpened = false;
                        this.GlassDoor1.body.position.x += this.doorSpeed;
                        this.GlassDoor2.body.position.x -= this.doorSpeed;
                    }else{
                        this.isClosed = true;
                        this.isClosing = false;
                    }
                }
            }
        }
    };
    window.door = door;

    /**----------------------------------------------------------**/
    /**                        玻璃门对象                        **/
    /**                   继承自objectFrame对象                  **/
    /**----------------------------------------------------------**/
    var glassDoor = function(width,height){
        objectFrame.call(this,width,height);
        this.thickness = 0.4;
        this.init();
    };
    glassDoor.prototype = {
        init : function(){
            this.body.add(this.frame(1,1,1,1,0xFFFFFF));

            //玻璃
            var GlassMaterial = new THREE.MeshBasicMaterial( {
                color: 0xffffff,
                transparent:true,
                opacity: 0.5,
                side: THREE.DoubleSide,
                wireframe:false});
            var GlassGeometry = new THREE.BoxBufferGeometry(this.width,this.height,0.5);
            var Glass = new THREE.Mesh(GlassGeometry, GlassMaterial);
            Glass.position.set(this.width/2,this.height/2,0);

            //警示
            var cautionMaterial = new THREE.MeshBasicMaterial( {
                color: 0xedfe16,
                transparent:true,
                opacity: 1,
                side: THREE.DoubleSide,
                wireframe:false,depthTest:true});
            var cautionGeometry = new THREE.BoxBufferGeometry(this.width-3,5,1);
            var caution = new THREE.Mesh(cautionGeometry, cautionMaterial);
            caution.position.set(this.width/2,30,-0.2);

            this.body.add(Glass);
            this.body.add(caution);
        }
    };
    window.glassDoor = glassDoor;

    /**----------------------------------------------------------**/
    /**                       通风管道对象                       **/
    /**                   继承自objectFrame对象                  **/
    /**----------------------------------------------------------**/
    var airDuct = function(width,height){
        objectFrame.call(this,width,height);
        this.FrameWidth = 1;
        this.init();
    };
    airDuct.prototype = {
        init : function(){
            var airDuctShape = new THREE.Shape();
            airDuctShape.moveTo(0,0);
            airDuctShape.lineTo(this.width,0);
            airDuctShape.lineTo(this.width,this.height);
            airDuctShape.lineTo(0,this.height);
            airDuctShape.lineTo(0,0);

            var frame = new THREE.Path();
            frame.moveTo(this.FrameWidth,this.FrameWidth);
            frame.lineTo(this.width-this.FrameWidth,this.FrameWidth);
            frame.lineTo(this.width-this.FrameWidth,this.height-this.FrameWidth);
            frame.lineTo(this.FrameWidth,this.height-this.FrameWidth);
            frame.lineTo(this.FrameWidth,this.FrameWidth);
            airDuctShape.holes.push(frame);

            var extrudeSettings = {
                amount: 1,
                bevelEnabled: true,
                bevelSegments: 1,
                steps: 1,
                bevelSize: 0,
                bevelThickness: this.thickness};

            var airDuctFrameGeometry = new THREE.ExtrudeGeometry(airDuctShape,extrudeSettings);
            var airDuctFrameMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF ,side: THREE.DoubleSide,wireframe:false});
            var airDuct = new THREE.Mesh(airDuctFrameGeometry, airDuctFrameMaterial);

            this.body.add(airDuct)

        }
    };
    window.airDuct = airDuct;
})(window);