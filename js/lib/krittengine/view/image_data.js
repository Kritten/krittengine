import { load_image } from '../controller/utils.js';

export default class Image_Data
{
	constructor(path)
	{
		this.m_is_loaded = false
		this.path = path
		this.image = undefined
		this.waiting_materials = []
	 	load_image(path).then(
	        function(image)
	        {
	        	this.image = image
	            this.finished_loading() 
	        }.bind(this)
        )
	}

    is_loaded()
    {
        return this.m_is_loaded
    }

    finished_loading()
    {
    	for (var i = 0; i < this.waiting_materials.length; i++) {
    		const func = this.waiting_materials[i]
    		func(this)
    	}
        this.m_is_loaded = true
    }
}