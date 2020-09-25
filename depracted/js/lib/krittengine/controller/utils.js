export let mouse_input = {offset: vec2.create(), moved: false};
export let key_input = {active_keys: [], pressed_keys: []};
export let time_info = {elapsed_time: 0.0, delta_time: 0.0, time_ratio: 0.0, last_frame: performance.now()};

export function load_text(path_mesh)
{
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open("GET", path_mesh);
        request.onreadystatechange = function () 
        {
            if(request.readyState == 4 && request.status == 200) 
            {
                resolve(request.responseText);
            }
        }
        request.send();
    });
}

export function load_image(path_image)
{
    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.src = path_image;
        image.onload = function(){
            resolve(image)
        }
        image.onerror = function(){
            reject(image)
        }
    });
}