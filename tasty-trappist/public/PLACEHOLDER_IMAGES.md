# Image Specifications for Pixel-Perfect Rendering

**Component:** `PixelatedCanvas.svelte`  
**Default Pixel Size:** 16px  
**Last Updated:** December 2024

---

## How Pixel-Perfect Rendering Works

The `PixelatedCanvas` component divides an image into a grid of uniform blocks. Each block is `pixelSize × pixelSize` pixels and displays the average color of that region.

**For pixel-perfect rendering, your image dimensions MUST be exact multiples of the `pixelSize` value.**

### Formula

```
Perfect Width = pixelSize × number_of_horizontal_blocks
Perfect Height = pixelSize × number_of_vertical_blocks
```

**Example:** For `pixelSize={16}`:
- ✅ 1600×1600 = 16 × 100 × 16 × 100 (perfect)
- ✅ 1200×1200 = 16 × 75 × 16 × 75 (perfect)
- ❌ 1201×1200 = NOT a multiple of 16 (will clip 1px)

---

## Recommended Image Resolutions

### For pixelSize={16} (Default/Hero Images)

| Resolution | Grid Size | Use Case |
|------------|-----------|----------|
| **1600×1600** | 100×100 blocks | Optimal quality, hero images |
| **1280×1280** | 80×80 blocks | High quality, smaller file size |
| **1200×1200** | 75×75 blocks | Current placeholder size ✓ |
| **960×960** | 60×60 blocks | Good balance |
| **800×800** | 50×50 blocks | Minimum recommended |
| **640×640** | 40×40 blocks | Low detail fallback |

### For pixelSize={12}

| Resolution | Grid Size | Use Case |
|------------|-----------|----------|
| **1200×1200** | 100×100 blocks | Higher detail |
| **960×960** | 80×80 blocks | Good quality |
| **720×720** | 60×60 blocks | Standard |

### For pixelSize={8}

| Resolution | Grid Size | Use Case |
|------------|-----------|----------|
| **1600×1600** | 200×200 blocks | Very high detail |
| **1200×1200** | 150×150 blocks | High detail |
| **800×800** | 100×100 blocks | Standard |

---

## Required Images for Website

### 1. **hero-home.png**
- **Page:** Homepage (`index.astro`)
- **Recommended:** 1600×1600px @ pixelSize={16}
- **Subject:** Full body portrait, professional stance
- **Style:** Tactical/military aesthetic
- **Current:** `/avatar-pixelated.png` (placeholder)

### 2. **hero-about.png**
- **Page:** About/Team page (`about.astro`)
- **Recommended:** 1280×1280px @ pixelSize={16}
- **Subject:** Close-up portrait, approachable expression
- **Style:** Professional but friendly
- **Current:** `/avatar-pixelated.png` (placeholder)

### 3. **hero-experience.png**
- **Page:** Experience page (`experience.astro`)
- **Recommended:** 1200×1200px @ pixelSize={16}
- **Subject:** Side profile or action shot, tactical vibe
- **Style:** Dynamic, operational feel
- **Current:** `/avatar-pixelated.png` (placeholder)

### 4. **hero-skills.png**
- **Page:** Skills page (`skills.astro`)
- **Recommended:** 1200×1200px @ pixelSize={16}
- **Subject:** Technical/matrix style, more abstract
- **Style:** Could be more stylized/graphic
- **Current:** `/avatar-pixelated.png` (placeholder)

### 5. **hero-contact.png**
- **Page:** Contact page (`contact.astro`)
- **Recommended:** 960×960px @ pixelSize={16}
- **Subject:** Direct gaze, welcoming gesture
- **Style:** Approachable, ready to engage
- **Current:** `/avatar-pixelated.png` (placeholder)

---

## Image Preparation Guidelines

### Format Requirements
- **Format:** PNG with transparency preferred
- **Color Space:** sRGB
- **Bit Depth:** 24-bit (8-bit per channel) or 32-bit with alpha
- **Compression:** PNG compression enabled (lossless)

### Design Considerations
1. **Background Compatibility:** Images will be rendered at 0.12-0.25 opacity over mint/cyan (#d0f7f4) background
2. **Contrast:** Ensure sufficient contrast at low opacity
3. **Detail Level:** Fine details smaller than `pixelSize` will be averaged out
4. **Transparency:** Alpha channel is preserved and averaged per block
5. **Pre-pixelation:** NOT required - component handles pixelation uniformly

### Quality Tips
- **Avoid:** Images with critical details smaller than 16×16px (they'll blur when averaged)
- **Prefer:** Bold shapes, clear silhouettes, strong contrast
- **Test:** Always test at target `pixelSize` to verify appearance
- **Sharp Edges:** Work best with uniform pixelation algorithm

---

## Validation Checklist

Before deploying an image, verify:

- [ ] Width is a multiple of `pixelSize` (e.g., 1600 % 16 = 0)
- [ ] Height is a multiple of `pixelSize` (e.g., 1600 % 16 = 0)
- [ ] File size is reasonable (< 500KB recommended)
- [ ] Image looks good at low opacity (0.12-0.25)
- [ ] Critical details are larger than `pixelSize × pixelSize`
- [ ] Format is PNG
- [ ] File is placed in `/public/` directory

---

## Per-Page Customization

Each page can use different `pixelSize` values:

```astro
<!-- Higher detail for hero -->
<PixelatedCanvas
  src="/hero-home.png"
  pixelSize={12}
  className="background-portrait"
  client:load
/>

<!-- Lower detail for background effect -->
<PixelatedCanvas
  src="/hero-contact.png"
  pixelSize={24}
  className="background-portrait"
  client:load
/>
```

**Remember:** Always ensure image dimensions are multiples of the chosen `pixelSize`.

---

## Quick Reference: Common Multiples of 16

Perfect widths/heights for `pixelSize={16}`:

```
512, 528, 544, 560, 576, 592, 608, 624, 640, 656, 672, 688, 704, 720, 736, 752, 768, 784, 800, 816, 832, 848, 864, 880, 896, 912, 928, 944, 960, 976, 992, 1008, 1024, 1040, 1056, 1072, 1088, 1104, 1120, 1136, 1152, 1168, 1184, 1200, 1216, 1232, 1248, 1264, 1280, 1296, 1312, 1328, 1344, 1360, 1376, 1392, 1408, 1424, 1440, 1456, 1472, 1488, 1504, 1520, 1536, 1552, 1568, 1584, 1600, 1616, 1632, 1648, 1664, 1680, 1696, 1712, 1728, 1744, 1760, 1776, 1792, 1808, 1824, 1840, 1856, 1872, 1888, 1904, 1920...
```

**Recommended:** 800, 960, 1200, 1280, 1600, 1920

---

## Troubleshooting

### "Image dimensions are not perfect multiples" Warning

**Problem:** Your image dimensions don't divide evenly by `pixelSize`.

**Solution:** Resize your image to the nearest perfect multiple:
- For 1201×1200 @ pixelSize={16} → Resize to 1200×1200
- For 1920×1080 @ pixelSize={16} → Resize to 1920×1072 or change to pixelSize={8}

### Image Looks Blurry

**Problem:** Too much detail lost in pixelation.

**Solutions:**
1. Reduce `pixelSize` (e.g., 16 → 12 → 8)
2. Use higher resolution source image (more blocks)
3. Simplify image composition (bolder shapes)

### File Size Too Large

**Problem:** PNG file exceeds desired size.

**Solutions:**
1. Reduce image resolution (but keep as multiple of `pixelSize`)
2. Use PNG compression tools (TinyPNG, ImageOptim)
3. Reduce color depth if appropriate
4. Remove unnecessary alpha channel if fully opaque

---

## Example Component Usage

```astro
<PixelatedCanvas
  src="/hero-home.png"
  alt="Samantha Myers - Engineering Manager"
  className="background-portrait"
  pixelSize={16}
  enableHover={true}
  hoverBrightness={1.3}
  hoverRadius={2}
  client:load
/>
```

**Component Props:**
- `src` - Path to image (must be in `/public/`)
- `alt` - Accessibility description
- `className` - CSS class for styling
- `pixelSize` - Size of each pixel block (default: 16)
- `enableHover` - Enable hover brightness effect (default: true)
- `hoverBrightness` - Brightness multiplier on hover (default: 1.3)
- `hoverRadius` - Radius of hover effect in blocks (default: 2)

---

**Questions?** See `src/components/PixelatedCanvas.svelte` for component source code.