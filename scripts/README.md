# Image Processing Scripts

## Pixelate Portrait Script

Converts photos to pixelated/dithered style for brutalist defense tech aesthetic.

### Installation

Install required dependencies:

```bash
pip3 install Pillow
```

### Usage

Basic usage with dithering (recommended):

```bash
python3 scripts/pixelate-portrait.py input.png output.png
```

### Examples

**Default dithered effect (Floyd-Steinberg):**
```bash
python3 scripts/pixelate-portrait.py avatar.png avatar-pixelated.png
```

**Halftone dots effect:**
```bash
python3 scripts/pixelate-portrait.py avatar.png avatar-halftone.png --halftone --dot-size 3
```

**High contrast dithering:**
```bash
python3 scripts/pixelate-portrait.py avatar.png avatar-contrast.png --contrast 2.0
```

**Adjust black/white threshold:**
```bash
python3 scripts/pixelate-portrait.py avatar.png avatar-threshold.png --threshold 100
```

### Parameters

- `--dot-size` - Size of halftone dots when using `--halftone` (default: 4, smaller = more detail)
- `--contrast` - Contrast enhancement (default: 1.5, higher = more dramatic)
- `--threshold` - Black/white cutoff point 0-255 (default: 128, lower = more black)
- `--halftone` - Use halftone dots instead of dithering

### Output

The script will:
1. Resize image if larger than 800px (maintaining aspect ratio)
2. Enhance contrast
3. Sharpen the image
4. Apply dithering or halftone effect
5. Save as optimized PNG

### Tips

For best results:
- Use a high-contrast portrait photo
- Face should be well-lit with clear features
- Try different threshold values (100-140) for different looks
- Dithering works better for detailed portraits
- Halftone creates a more "printed" look
