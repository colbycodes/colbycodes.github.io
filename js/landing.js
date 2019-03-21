var welcomeScene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 2), 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });
var sphereCount = 45;
var spheres = new Array(sphereCount);
var sphereDirection = 1;
var lines = new Array(3);
var blockGroups = new Array(6);
var cubeGroup = new THREE.Group();

//width and height of window 
var width = window.innerWidth;
var height = window.innerHeight * 2;

//set the size of our renderer and add it to the document
renderer.setSize(window.innerWidth, window.innerHeight * 2);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.setClearColor (0x21252d, 1);

//cameras starting position
camera.position.y = -29;
camera.position.z = 55;
camera.position.x = 3.5;
//camera.lookAt(7, 0, 7);
//generate a 3x3 block of lots with .5 padding between
var blockSize = 6;
var blockPadding = .5;

//build blocks and group them together
for(i = 0; i < blockGroups.length; i++)
{
    blockGroups[i] = new THREE.Group();
    GenBlock(blockSize,blockSize,blockPadding, blockGroups[i]);

    var floorSize = (((blockSize - 1) * (1.5) + 1));
    var floor = CreateFloor(floorSize);
    floor.position.set(floorSize/2 - .5, 1, floorSize/2 - .5);
    floor.castShadow = true;
    floor.recieveShadow = true;
    blockGroups[i].add(floor);
    //welcomeScene.add(blockGroups[i]);
}

var side =  blockGroups[1].position;
blockGroups[1].rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 * (Math.PI/180));
blockGroups[1].position.set(side.x, side.y - (floorSize - 1.5), side.z + .5);
side = blockGroups[2].position;
blockGroups[2].rotateOnAxis(new THREE.Vector3(0, 0, 1), 90 * (Math.PI/180));
blockGroups[2].position.set(side.x + .5, side.y - (floorSize - 1.5), side.z);
side = blockGroups[3].position;
blockGroups[3].rotateOnAxis(new THREE.Vector3(1, 0, 0), 90 * (Math.PI/180));
blockGroups[3].position.set(side.x, side.y + .5, side.z + (floorSize - 1.5));
side = blockGroups[4].position;
blockGroups[4].rotateOnAxis(new THREE.Vector3(0, 0, 1), -90 * (Math.PI/180));
blockGroups[4].position.set(side.x + (floorSize - 1.5), side.y + .5, side.z);
side = blockGroups[5].position;
blockGroups[5].rotateOnAxis(new THREE.Vector3(0, 0, 1), 180 * (Math.PI/180));
blockGroups[5].position.set(side.x + (floorSize - 1.5) + .5, side.y - (floorSize - 1.5) + .5, side.z);

blockGroups.forEach(element => {
    cubeGroup.add(element);
});

welcomeScene.add(cubeGroup);

//create light and add it to scene
var light = new THREE.DirectionalLight( 0xffffff, 4 );
light.position.set( 50, 25, 50 );
light.castShadow = true;
light.shadowDarkness = 8;
light.shadowCameraVisible = true;
welcomeScene.add( light );

var middleSphere = CreateSphere(1.5);
middleSphere.position.set(3.25, -31.5, 0);
welcomeScene.add( middleSphere );
var rightSphere = CreateSphere(.5);
rightSphere.position.set(3.25, -31.5, 0);
welcomeScene.add( rightSphere );
var leftSphere = CreateSphere(.5);
leftSphere.position.set(3.25, -31.5, 0);
welcomeScene.add( leftSphere );
var leftPos = new THREE.Vector2(leftSphere.position.x, leftSphere.position.y);
var rightPos = new THREE.Vector2(rightSphere.position.x, rightSphere.position.y);
lines[0] = CreateLineBetween(leftSphere.position, rightSphere.position);
welcomeScene.add(lines[0]);



function GenerateSineWave(points)
{
    var sinePoints = new Array(points);
    for(i = 0; i < sinePoints.length; i++)
    {
        var x, y;
        x = i;
        y = Math.sin(x);
        sinePoints[i] = new THREE.Vector3(x, y, 0);
    }
    return sinePoints;
}

function CreateFloor(size)
{
    var geometry = new THREE.PlaneGeometry( size, size, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x21252d} );
    var plane = new THREE.Mesh( geometry, material );
    plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 * (Math.PI / 180));
    //welcomeScene.add( plane );
    return plane;
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
//radius: size of sphere (number)
function CreateSphere(radius)
{   
    var colorHex = GetRandomColor();
    var geometry = new THREE.SphereGeometry( radius, 16, 16 );
    var material = new THREE.MeshBasicMaterial({color:0x42f4e8});
    //var material = THREE.OutlineEffect(material);
    var sphere = new THREE.Mesh( geometry, material );
    return sphere;
}

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

//Generate a random block of lots containing a building (cube)
function GenBlock(bWidth, bHeight, padding, group)
{
    var genBlock = new Array(bWidth);
    var scale = 1;
    for(x = 0; x < genBlock.length; x++)
    {
        genBlock[x] = new Array(bHeight);
        for(y = 0; y < genBlock[0].length; y++)
        {
            //Add building to lot
            var cube = CreateCube(scale, new THREE.Vector3(x+(x*padding), 1, y+(y*padding)));
            genBlock[x][y] = cube;
            group.add(genBlock[x][y]);
            //welcomeScene.add(cube);
        }
    }
    return genBlock;
}

//NOTE: max inclusive, min exclusive
function GetRandomBetween(max, min)
{
    return Math.random() * (max - min) + min;
}

//Create a random cube to be placed in lot
function CreateCube(scale, pos)
{
    //the height of the cube
    var width = GetRandomBetween(1, .5);
    var height = GetRandomBetween(4, 1);
    var depth = GetRandomBetween(1, .5);
    var geometry = new THREE.BoxGeometry(width, height, depth);
    geometry.translate(0, height/2, 0);
    //create material, color or image texture
    var colorHex = GetRandomColor();
    var material = new THREE.MeshLambertMaterial({color: colorHex, wireframe: false});
    var cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.recieveShadow = true;
    cube.position.x = pos.x;
    cube.position.y = pos.y;
    cube.position.z = pos.z;
    
    return cube;
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

//Returns the inner most lot (rounded) 
function ObjectsCenter()
{
    var lot = block[Math.round(block.length/2)][Math.round(block.length/2)];
    return lot.position;
}

//After window is loaded
window.onload = function(){
    var intro = document.getElementById("WelcomeRender");
    intro.appendChild(renderer.domElement);
    GameLoop();
};
//window resize listener
window.addEventListener('resize', function()
{
    width = this.window.innerWidth;
    height = this.window.innerHeight;
    
    //set the size of our renderer and add it to the document
    renderer.setSize(window.innerWidth, window.innerHeight * 2);
    camera.aspect = width/(height*2);
    camera.updateProjectionMatrix();
    
    //sphere.position.set(-width / 30, sphere.position.y, sphere.position.z);
});

//sim logic
var update = function()
{
    //rotate light around most centered lot
    var point = new THREE.Vector3(3.5, -3.5, 3.5);
    var axis = new THREE.Vector3(0 , 1, 1);
    var theta = .003;
    var pointIsWorld = false;

    //sphere.position.set(light.position.x, light.position.y, light.position.z);
    rotateAboutPoint(cubeGroup, point, axis, theta, pointIsWorld);
    
    
    //animate project section spheres
    if(rightSphere.position.x > 10+7)
    {
        sphereDirection = -sphereDirection;
    }
    if(rightSphere.position.x < 3.25)
    {
        sphereDirection = -sphereDirection;
        rightSphere.material.color.setHex(GetRandomColor());
        leftSphere.material.color.setHex(GetRandomColor());
    }
    rightSphere.position.set(rightSphere.position.x + (.05 * sphereDirection), rightSphere.position.y, rightSphere.position.z);
    leftSphere.position.set(leftSphere.position.x + (.05 * -sphereDirection), leftSphere.position.y, leftSphere.position.z);

    lines[0].geometry.vertices[0].x = leftSphere.position.x;
    lines[0].geometry.vertices[1].x = rightSphere.position.x;
    lines[0].geometry.verticesNeedUpdate = true;

};

// draw scenes
var render = function()
{   
    renderer.render(welcomeScene, camera);
};

//run game loop (update, render, repeat)
var GameLoop = function()
{
    //run every frame
    this.requestAnimationFrame(GameLoop);
    update();
    render();
};
