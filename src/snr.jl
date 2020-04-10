using ImageTransformations: center
using Photometry
using Distributions
using Statistics
using ImageFiltering
using StatsBase: mad

"""
    snrmap(data, fwhm)

Parallel implementation of signal-to-noise ratio (SNR, S/N) applied to each pixel in the input image.

Uses [`snr`](@ref) (small samples penalty) in resolution elements of size `fwhm` across the whole image.

!!! tip
    This code is automatically multi-threaded, so be sure to set `JULIA_NUM_THREADS` before loading your runtime to take advantage of it!
"""
function snrmap(data::AbstractMatrix{T}, fwhm; snr_func=snr) where T
    out = fill!(similar(data), zero(T))
    width = minimum(size(data)) / 2 - 1.5 * fwhm

    data = _prepmatrix(Val(snr_func), data, fwhm)

    mask = get_annulus_segments(data, fwhm/2 + 2, width, mode=:mask)
    coords = findall(!iszero, mask)

    Threads.@threads for coord in coords
        @inbounds out[coord] = snr_func(data, coord, fwhm)
    end
    
    return out
end

_prepmatrix(::Val{snr}, data, fwhm) = data
function _prepmatrix(::Val{snr_approx}, data, fwhm)
    kern = mask(CircularAperture(0, 0, fwhm/2))
    kern ./= sum(kern) # normalize area to 1
    return imfilter(data, kern, border=Fill())
end

"""
    snr(data, position, fwhm)

Calculate the signal to noise ratio (SNR, S/N) for a test point at `position` in a residual frame.

Uses the method of Mawet et al. 2014 which includes penalties for small sample statistics. These are encoded by using a student's t-test for calculating the SNR.

!!! note
    SNR is not equivalent to significance.
"""
function snr(data::AbstractMatrix, position, fwhm)
    x, y = position
    cy, cx = center(data)
    separation = sqrt((x - cx)^2 + (y - cy)^2)
    @assert separation > fwhm / 2 + 1 "`position` is too close to the frame center"

    θ = 2asin(fwhm / 2 / separation)
    N = floor(Int, 2π / θ)

    sint, cost = sincos(θ)
    xs = similar(data, N)
    ys = similar(data, N)

    # initial points
    rx = x - cx
    ry = y - cy

    @inbounds for idx in eachindex(xs)
        xs[idx] = rx + cx
        ys[idx] = ry + cy
        rx, ry = cost * rx + sint * ry, cost * ry - sint * rx
    end

    r = fwhm / 2

    apertures = CircularAperture.(xs, ys, r)
    fluxes = aperture_photometry(apertures, data, method=:exact).aperture_sum
    other_elements = @view fluxes[2:end]
    bkg_σ = std(other_elements) # ddof = 1 by default
    return (fluxes[1] - mean(other_elements)) / (bkg_σ * sqrt(1 + 1/(N - 1)))
end

snr(data::AbstractMatrix, idx::CartesianIndex, fwhm) = snr(data, (idx.I[2], idx.I[1]), fwhm)

"""
    snr_approx(data, position, fwhm)


Data is assumed to have been filtered using a top-hat kernel already
"""
function snr_approx(data::AbstractMatrix, position, fwhm)
    x, y = position
    cy, cx = center(data)
    separation = sqrt((x - cx)^2 + (y - cy)^2)
    
    aper_ind = circle_index((y, x), fwhm/2)
    ann_ind = annulus_index(floor.(Int, (cy, cx)), floor(Int, separation))

    arr = deepcopy(data)
    arr[aper_ind] .= mad(arr[ann_ind], normalize=false)
    N = 2π * separation / fwhm - 1
    noise = std(arr[ann_ind], corrected=false) * sqrt(1 + 1/N)
    signal = data[y, x] - mean(arr[ann_ind])
    return signal / noise
end

snr_to_sig(snr, separation, fwhm) = @. quantile(Normal(), cdf(TDist(2π * separation / fwhm.- 2), snr))
sig_to_snr(sig, separation, fwhm) = @. quantile(TDist(2π * separation / fwhm.- 2), cdf(Normal(), sig))


function circle_index(center, r)
    upper_left = @. ceil(Int, center - r)
    lower_right = @. floor(Int, center + r)
    shape = @. lower_right - upper_left
    shift_center = @. center - upper_left
    rows = Base.OneTo(shape[1]) .- shift_center[1]
    cols = Base.OneTo(shape[2]) .- shift_center[2]
    dist = @. (rows / r)^2 + (cols' / r)^2
    idxs = findall(v -> v < 1, dist)
    return [idx + CartesianIndex(upper_left...) for idx in idxs]
end

# uses Bresenham method
function annulus_index(center, r)
    d = 3 - 2r
    
    row, col = r, 0
    rows = Int[]
    cols = Int[]
    while row ≥ col
        push!(rows, row, -row, row, -row, col, -col, col, -col)
        push!(cols, col, col, -col, -col, row, row, -row, -row)

        if d < 0
            d += 4col + 6
        else
            d += 4 * (col - row) + 10
            row -= 1
        end
        col += 1
    end
    return @. CartesianIndex(rows + center[1], cols + center[2])
end
