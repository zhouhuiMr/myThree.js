(function(window){
    var monitorLight = function(width,height,depth){
        modelObject.call(this,width,height,depth);
        this.light = null;
        this.intensity = 3;
        this.lightdistince = 10;
        this.init();
    };
    monitorLight.prototype = {
        init : function(){
            //创建灯罩
            var lampshadeWidth = 8,
                lampshadeHeight = 4,
                lampshadeDepth = 20;
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
                opacity: 0.8,
                color: 0xdfdfdd,
                side : THREE.DoubleSide,
                wireframe : false
            });
            var lampshade = new THREE.Mesh(lampshadeGeometry,lampshadeMaterial);
            this.light = new THREE.PointLight( 0xffffff,this.intensity, this.lightdistince * 2);
            // this.light.position.set(0,-this.lightdistince,0);
            var pointLightHelper = new THREE.PointLightHelper( this.light, this.lightdistince);
            this.body.add(pointLightHelper);
            this.body.add(this.light);
            this.body.add(lampshade);
        }
    };
    window.monitorLight = monitorLight;
})(window);