#!/usr/bin/env python3
"""
Remove white/light background from portrait image
"""

import sys
from PIL import Image
import argparse


def remove_background(input_path, output_path, threshold=240):
    """
    Remove white/light gray background from image

    Args:
        input_path: Path to input image
        output_path: Path to save output image
        threshold: Brightness threshold for background removal (default: 240)
    """
    print(f"Loading image from {input_path}...")
    image = Image.open(input_path)

    # Convert to RGBA if not already
    if image.mode != 'RGBA':
        image = image.convert('RGBA')

    # Get pixel data
    pixels = image.load()
    width, height = image.size

    print(f"Removing background (threshold: {threshold})...")
    # Process each pixel
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]

            # Calculate brightness (average of RGB)
            brightness = (r + g + b) / 3

            # If pixel is light (background), make it transparent
            if brightness > threshold:
                pixels[x, y] = (r, g, b, 0)  # Set alpha to 0 (transparent)

    print(f"Saving to {output_path}...")
    image.save(output_path, 'PNG')
    print(f"✓ Done! Background removed, saved to {output_path}")

    return image


def main():
    parser = argparse.ArgumentParser(
        description='Remove white/light background from portrait'
    )
    parser.add_argument('input', help='Input image path')
    parser.add_argument('output', help='Output image path (PNG)')
    parser.add_argument('--threshold', type=int, default=240,
                       help='Brightness threshold for background (default: 240)')

    args = parser.parse_args()

    try:
        remove_background(args.input, args.output, args.threshold)
    except FileNotFoundError:
        print(f"Error: Input file '{args.input}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
