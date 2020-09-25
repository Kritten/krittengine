function getShader(path, type, gl) 
{
    var shader;
    var shaderScript;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			shaderScript = xmlhttp.responseText;
		}
	}
	xmlhttp.open("GET", path, false);
	xmlhttp.send();
	if (type == "vertex") 
	{
        shader = gl.createShader(gl.VERTEX_SHADER);
    } 
    else if (type == "fragment") 
    {
    	shader = gl.createShader(gl.FRAGMENT_SHADER);
    } 
    else 
    {
        return null;
    }

    gl.shaderSource(shader, shaderScript);
    gl.compileShader(shader);
    // console.log(gl.getShaderInfoLog(shader));

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
	{
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
	return shader;
}