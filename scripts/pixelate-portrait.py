#!/usr/bin/env python3
"""
Pixelate Portrait Script
Converts a photo to a halftone/dithered pixel art style similar to the Statue of Liberty design.
Inspired by military/defense tech brutalist aesthetic.

Usage:
    python3 scripts/pixelate-portrait.py input.png output.png

Optional arguments:
    --dot-size     Size of halftone dots (default: 4)
    --contrast     Contrast adjustment (default: 1.5)
    --threshold    Black/white threshold 0-255 (default: 128)
"""

import sys
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
import argparse


def create_halftone_dots(image, dot_size=4, angle=22):
    """
    Create halftone dot pattern effect
    """
    # Convert to grayscale
    gray = image.convert('L')

    # Get dimensions
    width, height = gray.size

    # Create new image for halftone
    halftone = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(halftone)

    # Sample the image in a grid pattern
    for y in range(0, height, dot_size):
        for x in range(0, width, dot_size):
            # Get average brightness in this cell
            box = gray.crop((x, y, min(x + dot_size, width), min(y + dot_size, height)))
            avg_brightness = sum(box.getdata()) / len(list(box.getdata()))

            # Calculate dot radius based on darkness (inverted)
            # Darker areas = larger dots
            darkness = 255 - avg_brightness
            dot_radius = (darkness / 255) * (dot_size / 2)

            if dot_radius > 0.5:  # Only draw visible dots
                # Draw circular dot
                center_x = x + dot_size // 2
                center_y = y + dot_size // 2
                draw.ellipse(
                    [center_x - dot_radius, center_y - dot_radius,
                     center_x + dot_radius, center_y + dot_radius],
                    fill='black'
                )

    return halftone


def create_square_pixel_effect(image, pixel_size=4, threshold=128):
    """
    Create square pixel dithering effect like old computer graphics with transparency

    Args:
        image: PIL Image
        pixel_size: Size of each square pixel block (default: 4)
        threshold: Brightness threshold to determine if pixel is drawn (default: 128)
    """
    # Convert to grayscale for brightness calculation
    if image.mode == 'RGBA':
        # Blend with white background first for better grayscale conversion
        background = Image.new('RGB', image.size, (255, 255, 255))
        background.paste(image, mask=image.split()[3] if image.mode == 'RGBA' else None)
        gray = background.convert('L')
    else:
        gray = image.convert('L')

    width, height = gray.size

    # Create new RGBA image with transparent background
    result = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    pixels = result.load()

    # Process in blocks
    for block_y in range(0, height, pixel_size):
        for block_x in range(0, width, pixel_size):
            # Get average brightness in this block
            brightness_sum = 0
            pixel_count = 0
            color_r, color_g, color_b = 0, 0, 0

            for py in range(block_y, min(block_y + pixel_size, height)):
                for px in range(block_x, min(block_x + pixel_size, width)):
                    brightness_sum += gray.getpixel((px, py))

                    # Get original color
                    if image.mode == 'RGBA':
                        r, g, b, a = image.getpixel((px, py))
                    else:
                        r, g, b = image.convert('RGB').getpixel((px, py))

                    color_r += r
                    color_g += g
                    color_b += b
                    pixel_count += 1

            # Calculate average brightness and color
            avg_brightness = brightness_sum / pixel_count
            avg_r = int(color_r / pixel_count)
            avg_g = int(color_g / pixel_count)
            avg_b = int(color_b / pixel_count)

            # Decide whether to draw this block based on brightness
            # Using a dithering pattern for better appearance
            if avg_brightness < threshold:
                # Draw the entire square block with average color
                for py in range(block_y, min(block_y + pixel_size, height)):
                    for px in range(block_x, min(block_x + pixel_size, width)):
                        pixels[px, py] = (avg_r, avg_g, avg_b, 255)

    return result


def create_feathered_mask(size, feather_amount=100):
    """
    Create a circular gradient mask that fades to transparent at edges

    Args:
        size: (width, height) tuple
        feather_amount: Distance from edge to start fade (default: 100)
    """
    width, height = size
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)

    # Calculate center and radius
    center_x, center_y = width // 2, height // 2
    max_radius = min(center_x, center_y)

    # Draw concentric circles with decreasing opacity for gradient effect
    for r in range(max_radius, 0, -1):
        if r > max_radius - feather_amount:
            # Feather zone - calculate opacity
            fade_progress = (max_radius - r) / feather_amount
            opacity = int(255 * (1 - fade_progress))
        else:
            # Inner zone - full opacity
            opacity = 255

        bbox = [
            center_x - r,
            center_y - r,
            center_x + r,
            center_y + r
        ]
        draw.ellipse(bbox, fill=opacity)

    return mask


def apply_edge_blur(image, blur_radius=3, feather_amount=100):
    """
    Apply blur to the edges of the image and add feathered fade

    Args:
        image: PIL Image (must be RGBA)
        blur_radius: Radius of the blur effect (default: 3)
        feather_amount: Distance from edge for feather fade (default: 100)
    """
    if image.mode != 'RGBA':
        image = image.convert('RGBA')

    # Extract the alpha channel
    alpha = image.split()[3]

    # Create a blurred version of the alpha channel
    blurred_alpha = alpha.filter(ImageFilter.GaussianBlur(blur_radius))

    # Create feathered mask
    feather_mask = create_feathered_mask(image.size, feather_amount)

    # Combine blurred alpha with feather mask (multiply effect)
    from PIL import ImageChops
    combined_alpha = ImageChops.multiply(blurred_alpha, feather_mask)

    # Create new image with combined alpha
    r, g, b, _ = image.split()
    result = Image.merge('RGBA', (r, g, b, combined_alpha))

    return result


def create_pixel_portrait(input_path, output_path, dot_size=4, contrast=1.5,
                         threshold=128, use_halftone=True, dot_scale=1.0,
                         blur_edges=True, blur_radius=5, feather_amount=120):
    """
    Main function to create pixelated portrait with halftone effect

    Args:
        input_path: Path to input image
        output_path: Path to save output image
        dot_size: Spacing between halftone dots (default: 4)
        contrast: Contrast enhancement factor (default: 1.5)
        threshold: Not used in halftone mode
        use_halftone: Use halftone dots effect (default: True)
        dot_scale: Scale factor for dot size (default: 1.0)
        blur_edges: Apply edge blur and feather (default: True)
        blur_radius: Radius for edge blur (default: 5)
        feather_amount: Distance from edge for feather fade (default: 120)
    """
    print(f"Loading image from {input_path}...")
    image = Image.open(input_path)

    # Resize to a reasonable size if too large
    max_size = 800
    if max(image.size) > max_size:
        ratio = max_size / max(image.size)
        new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
        image = image.resize(new_size, Image.Resampling.LANCZOS)
        print(f"Resized to {new_size}")

    # Enhance contrast
    if contrast != 1.0:
        print(f"Enhancing contrast by {contrast}x...")
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(contrast)

    # Sharpen for better dot definition
    print("Sharpening image...")
    image = image.filter(ImageFilter.SHARPEN)

    # Create square pixel effect
    if use_halftone:
        print(f"Applying square pixel effect (size: {dot_size}, threshold: {threshold})...")
        result = create_square_pixel_effect(image, pixel_size=dot_size, threshold=threshold)
    else:
        print(f"Applying legacy halftone effect...")
        result = create_halftone_dots(image, dot_size)

    # Apply edge blur and feather if requested
    if blur_edges:
        print(f"Applying edge blur (radius: {blur_radius}) and feather (amount: {feather_amount})...")
        result = apply_edge_blur(result, blur_radius, feather_amount)

    # Save result
    print(f"Saving to {output_path}...")
    result.save(output_path, 'PNG', optimize=True)
    print(f"✓ Done! Halftone portrait saved to {output_path}")

    return result


def main():
    parser = argparse.ArgumentParser(
        description='Convert portrait to square pixel dithering like old computer graphics'
    )
    parser.add_argument('input', help='Input image path')
    parser.add_argument('output', help='Output image path')
    parser.add_argument('--pixel-size', type=int, default=4,
                       help='Size of square pixels (default: 4, smaller = more detail)')
    parser.add_argument('--threshold', type=int, default=128,
                       help='Brightness threshold 0-255 (default: 128, lower = more pixels)')
    parser.add_argument('--contrast', type=float, default=2.0,
                       help='Contrast adjustment (default: 2.0)')
    parser.add_argument('--blur-radius', type=int, default=6,
                       help='Edge blur radius (default: 6, 0 = no blur)')
    parser.add_argument('--feather', type=int, default=100,
                       help='Edge feather amount in pixels (default: 100)')

    args = parser.parse_args()

    try:
        create_pixel_portrait(
            args.input,
            args.output,
            dot_size=args.pixel_size,
            threshold=args.threshold,
            contrast=args.contrast,
            use_halftone=True,
            blur_edges=args.blur_radius > 0,
            blur_radius=args.blur_radius,
            feather_amount=args.feather
        )
    except FileNotFoundError:
        print(f"Error: Input file '{args.input}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
