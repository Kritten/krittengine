import json
import os
from operator import sub, truediv, add
import sys

path = sys.argv[1]
# print(path)
# path = '..\data\objects\object\\'

def process_data(obj):
    vertices = get_vertices(obj['vertices'])
    avgx = sum(tup[0] for tup in vertices)/float(len(vertices))
    avgy = sum(tup[1] for tup in vertices)/float(len(vertices))
    avgz = sum(tup[2] for tup in vertices)/float(len(vertices))

    minx = min(tup[0] for tup in vertices)
    miny = min(tup[1] for tup in vertices)
    minz = min(tup[2] for tup in vertices)

    maxx = max(tup[0] for tup in vertices)
    maxy = max(tup[1] for tup in vertices)
    maxz = max(tup[2] for tup in vertices)

    aabb = {}
    aabb['centroid'] = (avgx, avgy, avgz)
    aabb['min'] = (minx, miny, minz)
    aabb['max'] = (maxx, maxy, maxz)

    widths = list(map(sub, aabb['max'], aabb['min']))
    aabb['halfwidths'] = list(map(truediv, widths, (2.0, 2.0, 2.0)))
    aabb['center'] = list(map(add, aabb['halfwidths'], aabb['min']))
    aabb = calc_aabb_vertices(aabb, aabb['min'], aabb['max'])

    # obj['aabb'] = aabb

    dict_indices, obj['triangles'] = create_indices_and_triangles(obj)
    obj['indices'] = restructure_indices(obj, dict_indices)
    obj['vertices'] = restructure_vertices(obj, dict_indices)
    obj['texture_coords'] = restructure_texture_coords(obj, dict_indices)
    obj['normals'] = restructure_normals(obj, dict_indices)
    obj['tangents'], obj['bitangents'] = calc_tangents(obj, dict_indices)

    return obj

def calc_tangents(obj, dict_indices):
    # print(obj['indices'])
    # print(len(obj['indices']))
    # print(len(obj['vertices']))
    tangents1 = [[0, 0, 0] for i in range(0, int(len(obj['vertices'])/3))]
    # print(len(tangents1))
    tangents2 = [[0, 0, 0] for i in range(0, int(len(obj['vertices'])/3))]
    bitangents = []
    for i in range(0, len(obj['triangles'])):
        triangle = obj['triangles'][i]
        # print(triangle)
        # vert1 = [obj['vertices'][triangle[0]['vertex']], obj['vertices'][triangle[0]['vertex']+1], obj['vertices'][triangle[0]['vertex']+2]]
        # vert2 = [obj['vertices'][triangle[1]['vertex']], obj['vertices'][triangle[1]['vertex']+1], obj['vertices'][triangle[1]['vertex']+2]]
        # vert3 = [obj['vertices'][triangle[2]['vertex']], obj['vertices'][triangle[2]['vertex']+1], obj['vertices'][triangle[2]['vertex']+2]]
        vert1 = [obj['vertices'][triangle[0] * 3], obj['vertices'][triangle[0] * 3+1], obj['vertices'][triangle[0] * 3+2]]
        vert2 = [obj['vertices'][triangle[1] * 3], obj['vertices'][triangle[1] * 3+1], obj['vertices'][triangle[1] * 3+2]]
        vert3 = [obj['vertices'][triangle[2] * 3], obj['vertices'][triangle[2] * 3+1], obj['vertices'][triangle[2] * 3+2]]
        # print(vert1)
        # print(vert2)
        # print(vert3)
        hor = [i - j for i, j in zip(vert2, vert1)]
        vert = [i - j for i, j in zip(vert3, vert1)]
        # print(hor)
        # print(vert)
        # print()

        tex1 = [obj['texture_coords'][triangle[0] * 2], obj['texture_coords'][triangle[0] * 2+1]]
        tex2 = [obj['texture_coords'][triangle[1] * 2], obj['texture_coords'][triangle[1] * 2+1]]
        tex3 = [obj['texture_coords'][triangle[2] * 2], obj['texture_coords'][triangle[2] * 2+1]]

        s = [i - j for i, j in zip(tex2, tex1)]
        t = [i - j for i, j in zip(tex3, tex1)]

        divisor = 1.0 / (s[0] * t[1] - s[1] * t[0])

        foo = [i * t[1] for i in hor]
        bar = [i * s[1] for i in vert]
        sDir = [i - j for i, j in zip(foo, bar)]
        # sDir = [t[1] * hor[0] - t[0] * vert[0], t[1] * hor[1] - t[0] * vert[1], t[1] * hor[2] - t[0] * vert[2]]
        sDir = [i * divisor for i in sDir]

        foo = [i * s[0] for i in vert]
        bar = [i * t[0] for i in hor]
        tDir = [i - j for i, j in zip(foo, bar)]
        # tDir = [s[0] * vert[0] - s[1] * hor[0], s[0] * vert[1] - s[1] * hor[1], s[0] * vert[2] - s[1] * hor[2]]
        tDir = [i * divisor for i in tDir]

        tangents1[triangle[0]] = [i + j for i, j in zip(tangents1[triangle[0]], sDir)]
        tangents1[triangle[1]] = [i + j for i, j in zip(tangents1[triangle[1]], sDir)]
        tangents1[triangle[2]] = [i + j for i, j in zip(tangents1[triangle[2]], sDir)]
        tangents2[triangle[0]] = [i + j for i, j in zip(tangents2[triangle[0]], tDir)]
        tangents2[triangle[1]] = [i + j for i, j in zip(tangents2[triangle[1]], tDir)]
        tangents2[triangle[2]] = [i + j for i, j in zip(tangents2[triangle[2]], tDir)]

        # print(obj['vertices'])
        # print(triangle[0])
        # print(vert1)
        # print(triangle[1])
        # print(vert2)
        # print(triangle[2])
        # print(vert3)
        # break;
        # 
    # print(len(tangents1))
    # print(tangents1)
    # print()
    # print(tangents2)

    tangents = []
    bitangents = []
    for index, tmp_tangent in enumerate(tangents1):
        normal = [obj['normals'][index*3+0], obj['normals'][index*3+1], obj['normals'][index*3+2]]
        foo = sum(i * j for i, j in zip(normal, tmp_tangent))
        bar = [i * foo for i in normal]
        tangent = [i - j for i, j in zip(tmp_tangent, bar)]
        # print(foo)
        tangent = [float(i)/sum(tangent) for i in tangent]
        # print(tmp_tangent)
        # print(tangent)
        # print(sum(i * j for i, j in cross(tmp_tangent, tangent)))
        if sum(i * j for i, j in zip(cross(normal, tmp_tangent), tangents2[index])) < 0.0:
            tangent = [-i for i in tangent]


        tangents.append(tangent[0])
        tangents.append(tangent[1])
        tangents.append(tangent[2])

        bitangent = cross(normal, tangent);

        bitangents.append(bitangent[0])
        bitangents.append(bitangent[1])
        bitangents.append(bitangent[2])

    # print(bitangents)
    # print(obj['tangents'])
    return tangents, bitangents

def cross(a, b):
    c = [a[1]*b[2] - a[2]*b[1],
         a[2]*b[0] - a[0]*b[2],
         a[0]*b[1] - a[1]*b[0]]

    return c
def create_indices_and_triangles(obj):
    dict_indices = {}
    triangles = []
    for i in range(0, len(obj['faces']), 10):
        dict_indices[obj['faces'][i+1]] = {'vertex':obj['faces'][i+1], 'uv':obj['faces'][i+4], 'normal':obj['faces'][i+7]}
        dict_indices[obj['faces'][i+2]] = {'vertex':obj['faces'][i+2], 'uv':obj['faces'][i+5], 'normal':obj['faces'][i+8]}
        dict_indices[obj['faces'][i+3]] = {'vertex':obj['faces'][i+3], 'uv':obj['faces'][i+6], 'normal':obj['faces'][i+9]}

        triangles.append((obj['faces'][i+1], obj['faces'][i+2], obj['faces'][i+3]))
        # triangles.append((dict_indices[obj['faces'][i+1]], dict_indices[obj['faces'][i+2]], dict_indices[obj['faces'][i+3]]))

    return dict_indices, triangles

def restructure_vertices(obj, dict_indices):
    vertices = []
    for index, value in dict_indices.items():
        vertices.append(obj['vertices'][value['vertex'] * 3 + 0])
        vertices.append(obj['vertices'][value['vertex'] * 3 + 1])
        vertices.append(obj['vertices'][value['vertex'] * 3 + 2])
    return vertices

def restructure_texture_coords(obj, dict_indices):
    texture_coords = []
    for index, value in dict_indices.items():
        texture_coords.append(obj['uvs'][0][value['uv'] * 2 + 0])
        texture_coords.append(obj['uvs'][0][value['uv'] * 2 + 1])
    return texture_coords

def restructure_indices(obj, dict_indices):
    indices = []
    
    for i in range(0, len(obj['faces']), 10):
        indices.append(obj['faces'][i + 1])
        indices.append(obj['faces'][i + 2])
        indices.append(obj['faces'][i + 3])     
    return indices

def restructure_normals(obj, dict_indices):
    normals = []

    for index, value in dict_indices.items():
        normals.append(obj['normals'][value['normal'] * 3 + 0])
        normals.append(obj['normals'][value['normal'] * 3 + 1])
        normals.append(obj['normals'][value['normal'] * 3 + 2])
    return normals

def get_vertices(vert):
    vertices = []
    for x in range(0, len(vert), 3):
        vertices.append((vert[x], vert[x+1], vert[x+2]))
    return vertices

def calc_aabb_vertices(aabb, vert_min, vert_max):
    vertices = []
    
    vertices.append(vert_min[0])
    vertices.append(vert_min[1])
    vertices.append(vert_min[2])
    
    vertices.append(vert_max[0])
    vertices.append(vert_min[1])
    vertices.append(vert_min[2])
    
    vertices.append(vert_max[0])
    vertices.append(vert_max[1])
    vertices.append(vert_min[2])
    
    vertices.append(vert_min[0])
    vertices.append(vert_max[1])
    vertices.append(vert_min[2])
    
    vertices.append(vert_min[0])
    vertices.append(vert_min[1])
    vertices.append(vert_max[2])
    
    vertices.append(vert_max[0])
    vertices.append(vert_min[1])
    vertices.append(vert_max[2])
    
    vertices.append(vert_max[0])
    vertices.append(vert_max[1])
    vertices.append(vert_max[2])

    vertices.append(vert_min[0])
    vertices.append(vert_max[1])
    vertices.append(vert_max[2])

    index = [
        0, 1, 2, 3,  4, 5, 6, 7,
        0, 4, 1, 5, 2, 6, 3, 7
    ]

    aabb['vertices'] = vertices 
    aabb['faces'] = index 
    return aabb

def main():
    list_dir = os.listdir(path)
    for entry in list_dir:
        path_file = path+entry
        if os.path.isfile(path_file):
            if entry.endswith(".json"):
                # if entry == 'cube.json':
                    print(entry)
                    with open(path_file) as f:
                        obj = json.loads(f.read())
                        obj = process_data(obj)
                        # print(obj['aabb'])
                        # print(json.dumps(obj['aabb'], indent=2))

                        open(path+entry[:-5]+'.kobjson', 'w').write(json.dumps(obj))
main()