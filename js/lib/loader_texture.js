class Loader_Texture
{
    load(path_image)
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
}