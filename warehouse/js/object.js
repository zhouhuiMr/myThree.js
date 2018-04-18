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

    var floor = function(width,height){
        this.floor = null;
        this.width = width;
        this.height = height;
    };
    floor.prototype = {
        bulid : function(){
            var floorGeometry = new THREE.PlaneGeometry( this.width, this.height, 100, 100 );
            floorGeometry.rotateX( - Math.PI / 2 );
            var floorMaterial = new THREE.MeshBasicMaterial( {color: 0x999999, side: THREE.DoubleSide});
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load( "resources/floor.jpg", function( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 20;
                map.repeat.set(32, 32);
                floorMaterial.map = map;
                floorMaterial.needsUpdate = true;
            } );
            this.floor = new THREE.Mesh( floorGeometry, floorMaterial );
            return this.floor;
        }
    };
    window.floor = floor;

    var wall = function(width,height){
        this.wall = null;
        this.width = width;
        this.height = height;
    };
    wall.prototype = {
        build : function(){
            var geometry = new THREE.PlaneGeometry( this.width, this.height, 10,10);
            var material = new THREE.MeshBasicMaterial( {color: 0x999999, side: THREE.DoubleSide} );
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load( "resources/brick_diffuse.jpg", function( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 20;
                map.repeat.set(8, 0.5);
                material.map = map;
                material.needsUpdate = true;
            } );
            // textureLoader.load( "resources/brick_bump.jpg", function( map ) {
            //     map.wrapS = THREE.RepeatWrapping;
            //     map.wrapT = THREE.RepeatWrapping;
            //     map.anisotropy = 20;
            //     map.repeat.set(8, 0.5);
            //     material.map = map;
            //     material.needsUpdate = true;
            // } );
            this.wall = new THREE.Mesh( geometry, material );
            // this.wall.receiveShadow = true;
            return this.wall;
        }
    };
    window.wall = wall;

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

            var extrudeSettings = { amount: 1, bevelEnabled: true, bevelSegments: 1, steps: 10, bevelSize: 2, bevelThickness: 310 }
            var geometry = new THREE.ExtrudeGeometry(triangle,extrudeSettings);
            var material = new THREE.MeshBasicMaterial( { color: 0xffffff ,side: THREE.DoubleSide,wireframe:false})
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load( "resources/roof.jpg", function( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 20;
                map.repeat.set(0.3, 0.03);
                material.map = map;
                material.needsUpdate = true;
            } );
            this.roof  = new THREE.Mesh( geometry, material);
            // this.roof.scale.set(1,1,310)
            return this.roof;
        }
    };
    window.roof = roof;
})(window);