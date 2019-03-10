var welcomeScene = new THREE.Scene();
var aboutScene = new THREE.Scene();
var scenes = new Array(welcomeScene, aboutScene); 
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var renderer2 = new THREE.WebGLRenderer();
var cubeCount = 10;
var sphereCount = 45;
//width and height of window 
var width = window.innerWidth;
var height = window.innerHeight;
var spheres = new Array(sphereCount);
var lines = new Array(sphereCount);
var nestingCubes = new Array()
camera.position.x = 4;
camera.position.y = 3.5;
camera.position.z = 7.5;
camera.rotation.z = 180 * Math.PI / 180;
camera2.position.z = 3;

//set the size of our renderer and add it to the document
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
renderer.setClearColor (0x21252d, 1);

renderer2.setSize(window.innerWidth, window.innerHeight);
renderer2.shadowMapEnabled = true;
renderer2.setClearColor (0x21252d, 1);


window.onload = function(){
    var intro = document.getElementById("WelcomeRender");
    intro.appendChild(renderer.domElement);
    var about = document.getElementById("AboutRender");
    //about.appendChild(renderer2.domElement);
};


//window resize listener
window.addEventListener('resize', function()
{
    width = this.window.innerWidth;
    height = this.window.innerHeight;
    
    renderer.setSize(width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    renderer2.setSize(width, height);
    camera2.aspect = width/height;
    camera2.updateProjectionMatrix();
    
});

window.addEventListener('scroll', function(){
    
});

//About screen scene creation
function CreateAboutScene()
{
    var cube = CreateCube(1);
    cube.position.x = -1.5;
    cube.position.z = 0;
    cube.position.y = .5;
    aboutScene.add(cube);

     //create light and add it to scene
     var light = new THREE.PointLight( 0xffffff, 1, 100 );
     light.position.set( 5 , 4, 8 );
     aboutScene.add( light );
}

//Welcome screen scene creation
function CreateWelcomeScreen()
{
    //create spheres
    for(i = 0; i < spheres.length; i++)
    {
        spheres[i] = CreateSphere(.05);
        spheres[i].position.x = GetRandomBetween(8, 1);
        spheres[i].position.y = GetRandomBetween(5, 2);
        spheres[i].position.z = GetRandomBetween(8, 1);
        welcomeScene.add(spheres[i]);
    }

    //create connecting lines
    for(i = 0; i < lines.length; i++)
    {
        lines[i] = CreateLineBetween(spheres[i].position, new THREE.Vector3(spheres[i].position.x, -10, spheres[i].position.z));
    }

    //create light and add it to scene
    var light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set( 5 , 4, 8 );
    welcomeScene.add( light );
}
//sim logic
var update = function()
{
    //rotateSphere(sphere);
    
    spheres.forEach(element => {
        var point = new THREE.Vector3(4, 0, 4);
        var axis = new THREE.Vector3(0 , 1, 0);
        var theta = .001;
        var pointIsWorld = false;
        rotateAboutPoint(element, point, axis, theta, pointIsWorld);
    });

    for(i = 0; i < lines.length; i++)
    {
        lines[i].geometry.vertices[0].x = spheres[i].position.x;
        lines[i].geometry.vertices[0].y = spheres[i].position.y;
        lines[i].geometry.vertices[0].z = spheres[i].position.z;
        lines[i].geometry.vertices[1].x = spheres[i].position.x;
        lines[i].geometry.vertices[1].y = spheres[i].position.y - 10;
        lines[i].geometry.vertices[1].z = spheres[i].position.z;
        lines[i].geometry.verticesNeedUpdate = true;
    }           
};

// draw scenes
var render = function()
{   
    renderer.render(welcomeScene, camera);
    renderer2.render(aboutScene, camera2);   
};

//run game loop (update, render, repeat)
var GameLoop = function()
{
    //run every frame
    this.requestAnimationFrame(GameLoop);
    update();
    render();
};

//Rotate obj around a point
// obj - object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
	pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;
  
	if(pointIsWorld){
		obj.parent.localToWorld(obj.position); // compensate for world coordinate
	}
  
	obj.position.sub(point); // remove the offset
	obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
	obj.position.add(point); // re-add the offset
  
	if(pointIsWorld){
		obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
	}
  
	obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
//Create a line between the two points
//first: THREE.Vector3
//second: THREE.Vector3
function CreateLineBetween(first, second)
{
    var material = new THREE.LineBasicMaterial({color: 0x6c727c});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(first);
    geometry.vertices.push(second);
    var line = new THREE.Line(geometry, material);
    welcomeScene.add(line);
    return line;
}
//Create a sphere
//radius: number
function CreateSphere(radius)
{   var colorHex = GetRandomColor();
    var geometry = new THREE.SphereGeometry( radius, 16, 16 );
    var material = new THREE.MeshToonMaterial({color:colorHex});
    //var material = THREE.OutlineEffect(material);
    var sphere = new THREE.Mesh( geometry, material );
    return sphere;
}


function CreateCube(scale)
{
    var geometry = new THREE.BoxGeometry(scale, scale, scale);
    //create material, color or image texture
    var colorHex = GetRandomColor();
    var material = new THREE.MeshLambertMaterial({color: colorHex, wireframe: false});
    var cube = new THREE.Mesh(geometry, material);
    return cube;
}

function GetRandomBetween(max, min)
{
    return Math.random() * (max - min) + min;
}

function GetRandomColor()
{
    var blue = '4286f4';
    var lightblue = '42dff4';
    var salmon = 'f44162';


    blue = parseInt(blue, 16);
    lightblue = parseInt(lightblue, 16);
    salmon = parseInt(salmon, 16);

    var colors = [blue, lightblue, salmon];
    var index = Math.round(GetRandomBetween(colors.length - 1, 0));
    
    return colors[index];
}

CreateWelcomeScreen();
CreateAboutScene();
GameLoop();