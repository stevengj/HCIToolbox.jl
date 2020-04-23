var documenterSearchIndex = {"docs":
[{"location":"api/#API/Reference-1","page":"API/Reference","title":"API/Reference","text":"","category":"section"},{"location":"api/#","page":"API/Reference","title":"API/Reference","text":"For now, here is a dump of all documented functions and types.","category":"page"},{"location":"api/#Index-1","page":"API/Reference","title":"Index","text":"","category":"section"},{"location":"api/#","page":"API/Reference","title":"API/Reference","text":"","category":"page"},{"location":"api/#API/Reference-2","page":"API/Reference","title":"API/Reference","text":"","category":"section"},{"location":"api/#","page":"API/Reference","title":"API/Reference","text":"Modules = [HCIToolbox]","category":"page"},{"location":"api/#HCIToolbox.collapse!-Union{Tuple{T}, Tuple{AbstractArray{T,3},AbstractArray{T,1} where T}} where T","page":"API/Reference","title":"HCIToolbox.collapse!","text":"collapse!(cube, angles; method=median, deweight=true)\n\nAn in-place version of the derotating collapse. The only difference is in this version the cube will be derotated in-place.\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.collapse-Union{Tuple{AbstractArray{T,3}}, Tuple{T}} where T","page":"API/Reference","title":"HCIToolbox.collapse","text":"collapse(cube; method=median, fill=0)\ncollapse(cube, angles; method=median, deweight=true, fill=0)\n\nCombine all the frames of a cube using method. If angles are provided, will use derotate before combining.\n\nIf deweight is true, the method of Bottom et al. 2017 will be used in which the combined image will be the derotated weighted sum of the frames weighted by the temporal variance. fill will be passed to derotate.\n\nReferences\n\nBottom et al. 2017 \"Noise-weighted Angular Differential Imaging\"\n\nExamples\n\njulia> X = ones(2, 3, 3);\n\njulia> collapse(X)\n3×3 Array{Float64,2}:\n 1.0  1.0  1.0\n 1.0  1.0  1.0\n 1.0  1.0  1.0\n\njulia> collapse(X, [0, 90])\n3×3 Array{Float64,2}:\n 0.5  1.0  0.5\n 1.0  1.0  1.0\n 0.5  1.0  0.5\n\njulia> collapse(X, [0, 90], fill=NaN)\n3×3 Array{Float64,2}:\n NaN    1.0  NaN\n   1.0  1.0    1.0\n NaN    1.0  NaN\n\n\nSee Also\n\ncollapse!\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.derotate!-Union{Tuple{T}, Tuple{AbstractArray{T,3},AbstractArray{T,1} where T}} where T","page":"API/Reference","title":"HCIToolbox.derotate!","text":"derotate!(cube, angles; fill=0)\n\nIn-place version of derotate which modifies cube.\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.derotate-Union{Tuple{T}, Tuple{AbstractArray{T,3},AbstractArray{T,1} where T}} where T","page":"API/Reference","title":"HCIToolbox.derotate","text":"derotate(cube, angles; fill=0)\n\nRotates an array using the given angles in degrees.\n\nThis will rotate frame i counter-clockwise. Any values outside the original axes will be replaced with fill. If the given angles are true parallactic angles, the resultant cube will have each frame aligned with top pointing North.\n\nExamples\n\njulia> X = zeros(1, 3, 3); X[1, 1, 2] = 1;\n\njulia> X[1, :, :]\n3×3 Array{Float64,2}:\n 0.0  1.0  0.0\n 0.0  0.0  0.0\n 0.0  0.0  0.0\n\njulia> derotate(X, [90])[1, :, :]\n3×3 Array{Float64,2}:\n 0.0       0.0          0.0\n 0.999974  0.0          0.0\n 0.0       8.71942e-15  0.0\n\nSee Also\n\nderotate!\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.inject_image!-Union{Tuple{T}, Tuple{AbstractArray{T,2},AbstractArray{T,2} where T}} where T","page":"API/Reference","title":"HCIToolbox.inject_image!","text":"inject_image!(frame, img; x, y, A=1)\ninject_image!(frame, img; r, theta, A=1)\n\nIn-place version of inject_image which modifies frame.\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.inject_image!-Union{Tuple{T}, Tuple{AbstractArray{T,3},AbstractArray{T,2} where T}} where T","page":"API/Reference","title":"HCIToolbox.inject_image!","text":"inject_image!(cube, img, [angles]; x, y, A=1)\ninject_image!(cube, img, [angles]; r, theta, A=1)\n\nIn-place version of inject_image which modifies cube.\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.inject_image-Tuple{AbstractArray{T,2} where T,AbstractArray{T,2} where T}","page":"API/Reference","title":"HCIToolbox.inject_image","text":"inject_image(frame, img; x, y, A=1)\ninject_image(frame, img; r, theta, A=1)\n\nInjects A * img into frame at the position relative to the center of frame given by the keyword arguments. If necessary, img will be bilinearly interpolated onto the new indices. When used for injecting a PSF, it is imperative the PSF is already centered and, preferrably, odd-sized. \n\nCoordinate System\n\nThe positions are decided in this way:\n\nx, y - Parsed as distance from the bottom-left corner of the image. Pixel convention is that (1, 1) is the center of the bottom-left pixel increasing right and up. \nr, theta - Parsed as polar coordinates from the center of the image. theta is a position angle.\n\nnote: Note\nDue to the integral nature of array indices, frames or images with even-sized axes will have their center rounded to the nearest integer. This may cause unexpected results for small frames and images.\n\nExamples\n\njulia> inject_image(zeros(5, 5), ones(1, 1), A=2, x=2, y=1) # image coordinates\n5×5 Array{Float64,2}:\n 0.0  2.0  0.0  0.0  0.0\n 0.0  0.0  0.0  0.0  0.0\n 0.0  0.0  0.0  0.0  0.0\n 0.0  0.0  0.0  0.0  0.0\n 0.0  0.0  0.0  0.0  0.0\n\njulia> inject_image(zeros(5, 5), ones(3, 3), r=1.5, theta=90) # polar coords\n5×5 Array{Float64,2}:\n 0.0  0.0  0.0  0.0  0.0\n 0.0  0.0  0.0  0.0  0.0\n 0.0  0.0  0.0  0.0  0.0\n 0.0  0.0  1.0  1.0  0.0\n 0.0  0.0  1.0  1.0  0.0\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.inject_image-Union{Tuple{T}, Tuple{AbstractArray{T,3},Any}} where T","page":"API/Reference","title":"HCIToolbox.inject_image","text":"inject_image(cube, img, [angles]; x, y, A=1)\ninject_image(cube, img, [angles]; r, theta, A=1)\n\nInjects A * img into each frame of cube at the position given by the keyword arguments. If angles are provided, the position in the keyword arguments will correspond to the img position on the first frame of the cube, with each subsequent repositioned img being rotated by -angles in degrees. This is useful for fake companion injection.\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.mask_annulus!-Tuple{AbstractArray{T,2} where T,Any,Any}","page":"API/Reference","title":"HCIToolbox.mask_annulus!","text":"mask_annulus!(::AbstractMatrix, npix_in, npix_out; fill=NaN)\n\nIn-place version of mask_annulus\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.mask_annulus-Tuple{AbstractArray{T,2} where T,Any,Any}","page":"API/Reference","title":"HCIToolbox.mask_annulus","text":"mask_annulus(::AbstractMatrix, npix_in, npix_out; fill=0)\n\nMask an annular region of an image with inner-radius npix_in, outer-radius npix_out with value fill. Note that the input type must be compatible with the fill value's type.\n\nSee Also\n\nmask_annulus!\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.mask_circle!-Tuple{AbstractArray{T,2} where T,Any}","page":"API/Reference","title":"HCIToolbox.mask_circle!","text":"mask_circle!(::AbstractMatrix, npix; fill=0)\nmask_circle!(::AbstractArray, npix; fill=0)\n\nIn-place version of mask_circle\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.mask_circle-Tuple{AbstractArray{T,2} where T,Any}","page":"API/Reference","title":"HCIToolbox.mask_circle","text":"mask_circle(::AbstractMatrix, npix; fill=0)\nmask_circle(::AbstractArray, npix; fill=0)\n\nMask the inner-circle of an image with radius npix with value fill. Note that the input type must be compatible with the fill value's type. If the input is a cube it will mask each frame individually.\n\nSee Also\n\nmask_circle!\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.normalize_par_angles!-Tuple{Any}","page":"API/Reference","title":"HCIToolbox.normalize_par_angles!","text":"normalize_par_angles!(angles)\n\nIn-place version of normalize_par_angles\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.normalize_par_angles-Tuple{Any}","page":"API/Reference","title":"HCIToolbox.normalize_par_angles","text":"normalize_par_angles(angles)\n\nEnsures parallactic angle list (in degrees) is positive monotonic with no jumps greater than 180°.\n\nExamples\n\njulia> normalize_par_angles([-10, 20, 190])\n3-element Array{Int64,1}:\n 350\n  20\n 190\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.shift_frame!-Union{Tuple{T}, Tuple{AbstractArray{T,3},Number,Number}} where T","page":"API/Reference","title":"HCIToolbox.shift_frame!","text":"shift_frame!(cube, dx, dy; fill=0)\nshift_frame!(cube, dpos; fill=0)\n\nIn-place version of shift_frame which modifies cube.\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.shift_frame-Union{Tuple{T}, Tuple{AbstractArray{T,2},Any,Any}} where T","page":"API/Reference","title":"HCIToolbox.shift_frame","text":"shift_frame(frame, dx, dy; fill=0)\nshift_frame(frame, dpos; fill=0)\n\nShifts frame by dx and dy with bilinear interpolation. If necessary, empty indices will be filled with fill.\n\nExamples\n\njulia> shift_frame([0 0 0; 0 1 0; 0 0 0], 1, -1)\n3×3 Array{Float64,2}:\n 0.0  0.0  1.0\n 0.0  0.0  0.0\n 0.0  0.0  0.0\n\njulia> shift_frame(ans, (-1, 1), fill=NaN)\n3×3 Array{Float64,2}:\n NaN    NaN    NaN\n   0.0    1.0  NaN\n   0.0    0.0  NaN\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.shift_frame-Union{Tuple{T}, Tuple{AbstractArray{T,3},Any,Any}} where T","page":"API/Reference","title":"HCIToolbox.shift_frame","text":"shift_frame(cube, dx, dy; fill=0)\nshift_frame(cube, dpos; fill=0)\n\nShift each frame of cube by dx and dy, which can be integers or vectors. The change in position can be given as a tuple, which can also be put into a vector to use across the cube. If a frame is shifted outside its axes, the empty indices will be filled with fill.\n\nSee Also\n\nshift_frame!\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.tocube-Tuple{AbstractArray{T,2} where T}","page":"API/Reference","title":"HCIToolbox.tocube","text":"tocube(matrix)\n\nGiven a matrix of size (n, z), returns a cube of size (n, x, x) where x=√z.\n\nWill throw an error if z is not a perfect square.\n\nExamples\n\njulia> X = ones(3, 4)\n3×4 Array{Float64,2}:\n 1.0  1.0  1.0  1.0\n 1.0  1.0  1.0  1.0\n 1.0  1.0  1.0  1.0\n\njulia> tocube(X)\n3×2×2 Array{Float64,3}:\n[:, :, 1] =\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n\n[:, :, 2] =\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n\nSee Also\n\ntomatrix\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.tomatrix-Union{Tuple{AbstractArray{T,3}}, Tuple{T}} where T","page":"API/Reference","title":"HCIToolbox.tomatrix","text":"tomatrix(cube)\n\nGiven a cube of size (n, x, y) returns a matrix with size (n, x * y) where each row is a flattened image from the cube.\n\nExamples\n\njulia> X = ones(3, 2, 2);\n\njulia> tomatrix(X)\n3×4 Array{Float64,2}:\n 1.0  1.0  1.0  1.0\n 1.0  1.0  1.0  1.0\n 1.0  1.0  1.0  1.0\n\nSee Also\n\ntocube\n\n\n\n\n\n","category":"method"},{"location":"api/#HCIToolbox.get_annulus_segments-NTuple{4,Any}","page":"API/Reference","title":"HCIToolbox.get_annulus_segments","text":"get_annulus_segments(data, inner_radius, width, [nsegments]; theta_init=0, scale_factor=1, mode=:index)\n\nReturns indices or values in segments of a centered annulus.\n\nModes\n\n:mask - returns a positive boolean mask for indexing\n:value - returns the data values indexed with the boolean mask\n:apply - returns the input data weighted by the boolean mask\n\n\n\n\n\n","category":"method"},{"location":"#","page":"Home","title":"Home","text":"CurrentModule = HCIToolbox","category":"page"},{"location":"#HCIToolbox.jl-1","page":"Home","title":"HCIToolbox.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"(Image: GitHub) (Image: Build Status) (Image: Coverage) (Image: License)","category":"page"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"From Julia enter Pkg mode","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia>]\n\n(1.3) pkg> add HCIToolbox","category":"page"},{"location":"#License-1","page":"Home","title":"License","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"This work is distributed under the MIT \"expat\" license. See LICENSE for more information.","category":"page"}]
}
