export let handle_gl = undefined;

export function init(canvas)
{
	if(handle_gl == undefined)
	{
		handle_gl = WebGLUtils.setupWebGL(canvas);
		
	}
}