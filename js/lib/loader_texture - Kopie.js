function Texture_Loader()
{
	var that = this;
	that.m_loaded_textures = [];
	that.m_waiting_objects = [];
    this.m_path_root = "data/textures/";

	this.load_texture = function(passed_texture, texture_type, object)
        {

        var path = this.m_path_root + passed_texture;
        // texture is already loaded
        if(that.m_loaded_textures[path])
        {
                
            if(texture_type == "color")
            {
                  object.m_texture = that.m_loaded_textures[path];
            }
            else if(texture_type == "normal")
            {
                  object.m_normal_texture = that.m_loaded_textures[path];
            }
            else if(texture_type == "font")
            {
                  object.m_font_texture = that.m_loaded_textures[path];
            }
            return;
        }
        // texture is already in process
        if(that.m_waiting_objects[path])
        {
        	that.m_waiting_objects[path].push({object: object, texture_type: texture_type});
        	return;	
        }

        that.m_waiting_objects[path] = [{object: object, texture_type: texture_type}];

        var image = new Image();
        image.src = path;
        image.onload = function()
        {
        	var texture = gl.createTexture();
        	gl.bindTexture(gl.TEXTURE_2D, texture);
            if(texture_type != 'font')
            {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
            } else if(texture_type == 'font') {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
            }
            gl.bindTexture(gl.TEXTURE_2D, null);

	        for(var i = 0; i < that.m_waiting_objects[path].length; i++)
	        {
                var waiting_object = that.m_waiting_objects[path][i];
                if(waiting_object.texture_type == "color")
                {
                      waiting_object.object.m_texture = texture;
                }
                else if(waiting_object.texture_type == "normal")
                {
                      waiting_object.object.m_normal_texture = texture;
                }
                else if(waiting_object.texture_type == "font")
                {
                      waiting_object.object.m_font_texture = texture;
                }

	        }

        	// var texture =  new Texture(image);
        	that.m_loaded_textures[path] = texture;
        	// object = texture;
        	console.log("texture " + path + " loaded");
        };
	}
}