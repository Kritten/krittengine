function handleKeyDown(event)
{
	key_input.active_keys[event.keyCode] = true;
}

function handleKeyUp(event)
{
	key_input.pressed_keys[event.keyCode] = true;
	key_input.active_keys[event.keyCode] = false;
}

function init_light()
{
	var light = new THREE.PointLight(0xFFFFFF);
	light.position.x = 15;
	light.position.y = 15;
	light.position.z = 15;

	return light;
}

function init_camera()
{
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	camera.position.z = 5;
	camera.position.y = 2;
	camera.lookAt(new THREE.Vector3( 0.0,0.0,0.0 ));

	return camera;
}

function loadObject()
{
	var loader = new THREE.OBJLoader();
	loader.load('data/obj/couch.obj', function ( object ) {
		glob_object = object.children[0];
		// console.log(object.children[0]);
		glob_object.position.y = 0;
		glob_object.material = glob_btf_material;
		calc_tangents(glob_object);
		glob_scene.add( glob_object );

		var new_matrix = glob_camera.matrixWorldInverse.multiply(glob_object.matrixWorld);
		new_matrix.getInverse(new_matrix);
		new_matrix.transpose();
		glob_btf_material.uniforms.normal_matrix.value = new_matrix;
		// console.log(glob_object.geometry.attributes)
		console.log(glob_object)

	});
}

// equivalent: initProgram
function initBTFMaterial(vert_shader, frag_shader)
{var material = new THREE.ShaderMaterial({
        uniforms:  THREE.UniformsUtils.merge([
            {
                normal_matrix: {value: glob_normal_matrix},

                texArray: {value: [ [null]]},
                texArraySize: {type: "i", value: 10},
                
                phiInterval: {type: "t", value: null},
                phiIntervalLength: {type: "f", value: 6.0},

                phiIntervalCount: {type: "t", value:  null},
                phiIntervalCountLength: {type: "f", value:  7},

                color: {type: 'f', value: 0.50},
                light_position: {value: glob_light.position},
            }]),

        vertexShader: vert_shader,
        fragmentShader: frag_shader,
    });

	var data = [360.0, 60.0, 30.0, 20.0, 18.0, 15.0];
	var tmp = new THREE.DataTexture( Float32Array.from(data), data.length, 1, THREE.AlphaFormat, THREE.FloatType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter, 1);
	tmp.needsUpdate = true;
	material.uniforms.phiInterval.value = tmp;

	data = [0.0, 1.0, 7.0, 19.0, 37.0, 57.0, 81.0];
	var tmp1 = new THREE.DataTexture( Float32Array.from(data), data.length, 1, THREE.AlphaFormat, THREE.FloatType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter, 1);
	tmp1.needsUpdate = true;
	material.uniforms.phiIntervalCount.value = tmp1;
		console.log("assa");
	load_textures(material);
    return material;
}

function load_textures(material)
{
	var texturePath = 'data/textures/';
	var textureListFile = 'list.txt';

    var XHRloader = new THREE.XHRLoader();
    XHRloader.load(texturePath+textureListFile, function(list) {
    	splitted_list = list.split('\n');
    	if(splitted_list[splitted_list.length-1] == '') splitted_list.pop();

    	// TODO: only webgl2
    	var gl = renderer.getContext();
    	// console.log(gl.getParameter(gl.MAX_TEXTURE_SIZE))
    	///////////////////////////

    	var arraySize = Math.ceil(splitted_list.length / 2048.0);
    	console.log(arraySize);
    	glob_textures.length = arraySize;


    	// for (var i = 0; i < splitted_list.length; i++) {
    	// 	splitted_list[i];
    	// }
    })
	

    var loader = new THREE.TextureLoader();
	// loader.load(texturePath + '256x256/ubo_pulli/tv000_pv000/00000 tl010 pl000 tv000 pv000.jpg', function ( texture ) {
	loader.load(texturePath + 'tex1.jpg', function ( texture ) {
		material.uniforms.texArray.value = [texture];

		loader.load('data/textures/tex1.jpg', function ( texture ) {
	        material.uniforms.texArray.value.push(texture);
		});
	});
	console.log(material.uniforms)
}

function calc_tangents(object)
{
	var pos = object.geometry.getAttribute('position').array;
	var texCoord = object.geometry.getAttribute('uv').array;
	var array_tex_coord = [];

	for (var i = 0; i < texCoord.length; i += 2) 
	{
		array_tex_coord.push(new THREE.Vector2(texCoord[i], texCoord[i+1]));
	}

	var tangent_buffer = new ArrayBuffer(pos.length*4);
	var tangent = new Float32Array(tangent_buffer);
	var bitangent_buffer = new ArrayBuffer(pos.length*4);
	var bitangent = new Float32Array(bitangent_buffer);
	
	for (var i = 0; i < pos.length; i += 9) 
	{
		var dPos1 = new THREE.Vector3(pos[i+3], pos[i+4], pos[i+5]).sub(new THREE.Vector3(pos[i], pos[i+1], pos[i+2]));
		var dPos2 = new THREE.Vector3(pos[i+6], pos[i+7], pos[i+8]).sub(new THREE.Vector3(pos[i], pos[i+1], pos[i+2]));

		var dUV1 = array_tex_coord[i/9+1].sub(array_tex_coord[i/9]);
		var dUV2 = array_tex_coord[i/9+2].sub(array_tex_coord[i/9]);

		var temp = 1.0 / (dUV1.x * dUV2.y - dUV1.y * dUV2.x);
		var tan = (dPos1.multiplyScalar(dUV2.y).sub(dPos2.multiplyScalar(dUV1.y))).multiplyScalar(temp);
		var bitan = (dPos2.multiplyScalar(dUV1.x).sub(dPos1.multiplyScalar(dUV2.x))).multiplyScalar(temp);
		tangent[i+0] = tan.x;
		tangent[i+1] = tan.y;
		tangent[i+2] = tan.z;

		tangent[i+3] = tan.x;
		tangent[i+4] = tan.y;
		tangent[i+5] = tan.z;

		tangent[i+6] = tan.x;
		tangent[i+7] = tan.y;
		tangent[i+8] = tan.z;


		bitangent[i+0] = bitan.x;
		bitangent[i+1] = bitan.y;
		bitangent[i+2] = bitan.z;

		bitangent[i+3] = bitan.x;
		bitangent[i+4] = bitan.y;
		bitangent[i+5] = bitan.z;

		bitangent[i+6] = bitan.x;
		bitangent[i+7] = bitan.y;
		bitangent[i+8] = bitan.z;
	}

	var tangent_attribute = new THREE.BufferAttribute(tangent, 3);
	object.geometry.addAttribute('tangent', tangent_attribute);

	var bitangent_attribute = new THREE.BufferAttribute(bitangent, 3);
	object.geometry.addAttribute('bitangent', bitangent_attribute);
}