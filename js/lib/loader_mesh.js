class Loader_Mesh
{
    load(path_mesh)
    {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("GET", path_mesh);
            request.onreadystatechange = function () 
            {
                if(request.readyState == 4 && request.status == 200) 
                {
                    resolve(JSON.parse(request.responseText));
                }
            }
            request.send();
      });
    }
}