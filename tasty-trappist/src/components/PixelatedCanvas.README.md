# PixelatedCanvas Component

A Svelte component that renders images on a canvas with an interactive pixelated fade effect. Individual pixels randomly fade in and out, and the effect intensifies when hovering over the canvas.

## Features

- **Random Pixel Fading**: Pixels randomly fade in and out at configurable intervals
- **Hover Interaction**: Mouse movement creates a ripple effect that fades surrounding pixels
- **Edge Blur**: Configurable gradient fade on any edge for seamless blending
- **Transparency Support**: Properly handles PNG images with transparent backgrounds
- **Granular Customization**: Control every aspect of fading, opacity ranges, and hover behavior per-page
- **Performance Optimized**: Uses requestAnimationFrame and canvas clipping for smooth animations
- **Responsive**: Automatically scales with CSS while maintaining aspect ratio
- **Accessible**: Includes proper ARIA labels and semantic attributes

## Usage

```astro
---
import PixelatedCanvas from "../components/PixelatedCanvas.svelte";
---

<PixelatedCanvas
    src="/avatar-pixelated.png"
    alt="Profile image"
    className="my-custom-class"
    pixelSize={16}
    fadeInterval={100}
    fadePixelsPerTick={5}
    fadeSpeed={0.05}
    initialOpacityMin={0.6}
    initialOpacityMax={1.0}
    fadeOutMin={0.2}
    fadeOutMax={0.4}
    fadeInMin={0.8}
    fadeInMax={1.0}
    hoverRadius={3}
    hoverFadeStrength={0.6}
    enableRandomFade={true}
    enableHover={true}
    autoRestore={true}
    edgeBlurTop={0}
    edgeBlurRight={150}
    edgeBlurBottom={0}
    edgeBlurLeft={0}
    pixelOffsetX={0}
    pixelOffsetY={0}
    client:load
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Image source URL (dimensions should be multiples of pixelSize) |
| `alt` | `string` | `""` | Alt text for accessibility |
| `className` | `string` | `""` | Additional CSS classes |
| `pixelSize` | `number` | `8` | Size of each pixel block in pixels (must match source image pixelation) |
| `pixelOffsetX` | `number` | `0` | Horizontal offset for aligning pixel grid (0 to pixelSize-1) |
| `pixelOffsetY` | `number` | `0` | Vertical offset for aligning pixel grid (0 to pixelSize-1) |
| `enableAlignment` | `boolean` | `false` | Show cyan grid overlay for alignment debugging |
| `fadeInterval` | `number` | `100` | Milliseconds between random fade ticks |
| `fadePixelsPerTick` | `number` | `10` | How many pixels to fade per interval |
| `fadeSpeed` | `number` | `0.1` | Speed of opacity interpolation back to 1 (0-1) |
| `hoverRadius` | `number` | `2` | Radius of hover effect (in pixel blocks) |
| `enableRandomFade` | `boolean` | `true` | Enable/disable random pixel fading |
| `enableHover` | `boolean` | `true` | Enable/disable hover interaction |
| `autoRestore` | `boolean` | `true` | Auto-restore to full opacity when not hovering |
| `initialOpacityMin` | `number` | `0.5` | Starting opacity range minimum (0-1) |
| `initialOpacityMax` | `number` | `1.0` | Starting opacity range maximum (0-1) |
| `fadeOutMin` | `number` | `0` | Fade out target opacity minimum (0-1) |
| `fadeOutMax` | `number` | `0.3` | Fade out target opacity maximum (0-1) |
| `fadeInMin` | `number` | `0.7` | Fade in target opacity minimum (0-1) |
| `fadeInMax` | `number` | `1.0` | Fade in target opacity maximum (0-1) |
| `hoverFadeStrength` | `number` | `0.7` | How much hover reduces opacity (0-1) |
| `edgeBlurTop` | `number` | `0` | Blur distance from top edge in pixels (0 = no blur) |
| `edgeBlurRight` | `number` | `0` | Blur distance from right edge in pixels (0 = no blur) |
| `edgeBlurBottom` | `number` | `0` | Blur distance from bottom edge in pixels (0 = no blur) |
| `edgeBlurLeft` | `number` | `0` | Blur distance from left edge in pixels (0 = no blur) |

## How It Works

### Initialization
1. Loads the image and draws it to a canvas
2. Creates a 2D opacity grid based on `pixelSize`
3. Each grid cell starts with random opacity between `initialOpacityMin` and `initialOpacityMax`
4. Starts animation loop and random fade interval (if enabled)
5. **Validates dimensions**: Warns if image dimensions aren't perfect multiples of `pixelSize`

### Image Dimension Requirements

**IMPORTANT:** For proper pixel alignment, your source image dimensions should be exact multiples of `pixelSize`.

✅ **Good examples (pixelSize=8):**
- 768x1024 (96x128 blocks)
- 1024x1024 (128x128 blocks)
- 800x600 (100x75 blocks)

❌ **Bad examples (pixelSize=8):**
- 770x1024 (96.25x128 blocks - partial column)
- 1000x1000 (125x125 blocks - but 1000/8 = 125.0, so actually OK)
- 765x1020 (95.625x127.5 blocks - partial rows and columns)

**If dimensions aren't perfect multiples:**
- The component will display a console warning
- Only complete pixel blocks will be rendered (partial blocks are skipped)
- You may see a small strip of the image not rendered at the bottom/right edge
- Alignment may be difficult to achieve

**Solution:** Re-export your pre-pixelated image with dimensions that are multiples of your desired `pixelSize`.

### Pixel Grid Alignment
The `pixelOffsetX` and `pixelOffsetY` props allow you to align the canvas pixel grid with pre-pixelated images:
- If your pre-pixelated image's pixel blocks don't start at (0,0), the canvas grid may be misaligned
- Adjust these offsets (values from 0 to pixelSize-1) to shift the grid and match the image
- This ensures the canvas draws blocks that perfectly align with the image's existing pixels
- Proper alignment prevents blurry or misaligned rendering
- Use `enableAlignment={true}` to see a cyan grid overlay showing exactly where pixel blocks are drawn

### Random Fade Effect
- On each interval, randomly selects `fadePixelsPerTick` pixels
- 50% chance to fade out (opacity between `fadeOutMin` and `fadeOutMax`)
- 50% chance to fade in (opacity between `fadeInMin` and `fadeInMax`)
- Creates a glitchy, tactical appearance

### Hover Interaction (if `enableHover` is true)
- Tracks mouse position relative to canvas
- Calculates which pixel block is under the cursor
- Applies fade effect to surrounding pixels based on `hoverRadius`
- Fade intensity decreases with distance: `1 - (distance / radius) * hoverFadeStrength`
- Creates a ripple/reveal effect

### Edge Blur Effect
- Creates a gradient fade on specified edges for seamless blending
- Each edge can have independent blur distance in pixels
- Opacity multiplier calculated based on pixel distance from edge
- Works multiplicatively with animated fade effects
- Perfect for blending images with hard edges into backgrounds

### Animation Loop
- Uses `requestAnimationFrame` for 60fps rendering
- For each pixel block, clips that region and draws the full image with opacity
- Edge blur opacity multiplier applied to final opacity for gradient effect
- If `autoRestore` is true and not hovering, pixels smoothly interpolate back to full opacity
- Uses `fadeSpeed` to control interpolation rate: `opacity += (1 - opacity) * fadeSpeed`

## Examples

### Background Portrait (Homepage)
```astro
<PixelatedCanvas
    src="/avatar-pixelated.png"
    alt=""
    className="background-portrait"
    pixelSize={16}
    fadeInterval={100}
    fadePixelsPerTick={5}
    fadeSpeed={0.05}
    initialOpacityMin={0.6}
    initialOpacityMax={1.0}
    hoverRadius={3}
    client:load
/>
```

### Profile Image (About Page)
```astro
<PixelatedCanvas
    src="/avatar.png"
    alt="Samantha Myers"
    className="profile-image"
    pixelSize={8}
    fadeInterval={120}
    fadePixelsPerTick={3}
    fadeSpeed={0.03}
    hoverRadius={4}
    hoverFadeStrength={0.5}
    client:load
/>
```

### Subtle Background Effect
```astro
<PixelatedCanvas
    src="/avatar-pixelated-face.png"
    alt=""
    className="background-portrait"
    pixelSize={16}
    fadeInterval={80}
    fadePixelsPerTick={8}
    fadeSpeed={0.08}
    initialOpacityMin={0.4}
    initialOpacityMax={0.9}
    client:load
/>
```

### Hover-Only Effect (No Random Fade)
```astro
<PixelatedCanvas
    src="/image.png"
    alt="Interactive image"
    pixelSize={16}
    enableRandomFade={false}
    enableHover={true}
    hoverRadius={4}
    hoverFadeStrength={0.9}
    client:load
/>
```

### Static/No Restore Effect
```astro
<PixelatedCanvas
    src="/custom-image.png"
    alt="Custom image"
    pixelSize={12}
    autoRestore={false}
    fadeSpeed={0.15}
    fadeOutMin={0.1}
    fadeOutMax={0.5}
    client:load
/>
```

### Aggressive Fade Effect
```astro
<PixelatedCanvas
    src="/glitch-image.png"
    alt="Glitchy effect"
    pixelSize={8}
    fadeInterval={50}
    fadePixelsPerTick={15}
    fadeOutMin={0}
    fadeOutMax={0.2}
    fadeInMin={0.9}
    fadeInMax={1.0}
    fadeSpeed={0.2}
    client:load
/>
```

### Edge Blur for Blending (Right Edge)
```astro
<PixelatedCanvas
    src="/avatar-pixelated.png"
    alt=""
    className="background-portrait"
    pixelSize={16}
    edgeBlurRight={200}
    fadeInterval={100}
    fadePixelsPerTick={5}
    client:load
/>
```

### Edge Blur on Multiple Edges
```astro
<PixelatedCanvas
    src="/portrait.png"
    alt="Portrait"
    pixelSize={12}
    edgeBlurTop={100}
    edgeBlurRight={150}
    edgeBlurBottom={100}
    client:load
/>
```

### Vignette Effect (All Edges)
```astro
<PixelatedCanvas
    src="/image.png"
    alt="Vignette effect"
    pixelSize={8}
    edgeBlurTop={120}
    edgeBlurRight={120}
    edgeBlurBottom={120}
    edgeBlurLeft={120}
    client:load
/>
```

### Aligned Pixel Grid
```astro
<PixelatedCanvas
    src="/pre-pixelated-image.png"
    alt="Aligned pixels"
    pixelSize={8}
    pixelOffsetX={3}
    pixelOffsetY={2}
    fadeInterval={100}
    client:load
/>
```

### Alignment Grid (Development/Debugging)
```astro
<PixelatedCanvas
    src="/hero-image.png"
    alt=""
    pixelSize={8}
    enableAlignment={true}
    enableRandomFade={false}
    pixelOffsetX={4}
    pixelOffsetY={2}
    client:load
/>
```
**Note:** The cyan grid overlay shows exact pixel block boundaries. Adjust offsets until grid aligns with image pixels, then disable `enableAlignment` for production.

## Finding the Correct Pixel Offset

If your pre-pixelated image looks blurry or misaligned, you need to adjust `pixelOffsetX` and `pixelOffsetY` to align the canvas grid with the image's actual pixel blocks.

### Method 1: Alignment Grid Overlay (Recommended)

The easiest way to find the correct offset is using the built-in alignment grid:

1. **Enable the alignment grid**:
   ```astro
   <PixelatedCanvas
       src="/your-image.png"
       pixelSize={8}
       enableAlignment={true}
       enableRandomFade={false}
       pixelOffsetX={0}
       pixelOffsetY={0}
   />
   ```

2. **See the cyan grid overlay**: A bright cyan grid will appear showing exactly where each pixel block boundary is drawn.

3. **Adjust offsets**: Increment `pixelOffsetX` and `pixelOffsetY` (values 0-7 for pixelSize=8) until the cyan grid lines align with the visible pixel boundaries in your pre-pixelated image.

4. **Perfect alignment**: When correct, each cyan grid cell will perfectly frame a single solid-color pixel from the image.

5. **Disable and test**:
   ```astro
   <PixelatedCanvas
       src="/your-image.png"
       pixelSize={8}
       enableAlignment={false}  <!-- Turn off grid -->
       enableRandomFade={true}  <!-- Re-enable fading -->
       pixelOffsetX={4}  <!-- Your found value -->
       pixelOffsetY={2}  <!-- Your found value -->
   />
   ```

### Method 2: Visual Inspection

1. **Disable random fading** to see the grid clearly:
   ```astro
   <PixelatedCanvas
       src="/your-image.png"
       pixelSize={8}
       enableRandomFade={false}
       pixelOffsetX={0}
       pixelOffsetY={0}
   />
   ```

2. **Look for misalignment**: If pixels appear blurred or show multiple colors within a single block, the grid is misaligned.

3. **Adjust offsets incrementally**: Try values from 0 to (pixelSize - 1):
   - Start with `pixelOffsetX={0}` through `pixelOffsetX={7}` (for pixelSize=8)
   - Do the same for `pixelOffsetY`
   - When aligned correctly, each canvas block should show a solid color from the pre-pixelated image

4. **Re-enable fading** once aligned:
   ```astro
   <PixelatedCanvas
       src="/your-image.png"
       pixelSize={8}
       enableRandomFade={true}
       pixelOffsetX={4}  <!-- Your found value -->
       pixelOffsetY={2}  <!-- Your found value -->
   />
   ```

### Method 2: Browser DevTools

1. **Open your page** with the PixelatedCanvas component
2. **Open browser DevTools** (F12)
3. **Add temporary test code** to your page:
   ```javascript
   // Temporary: cycle through offsets with keyboard
   let offsetX = 0, offsetY = 0;
   document.addEventListener('keydown', (e) => {
       if (e.key === 'ArrowRight') offsetX = (offsetX + 1) % 8;
       if (e.key === 'ArrowLeft') offsetX = (offsetX - 1 + 8) % 8;
       if (e.key === 'ArrowDown') offsetY = (offsetY + 1) % 8;
       if (e.key === 'ArrowUp') offsetY = (offsetY - 1 + 8) % 8;
       console.log(`pixelOffsetX={${offsetX}} pixelOffsetY={${offsetY}}`);
   });
   ```
4. **Use arrow keys** to cycle through offset values and watch the console
5. **Note the values** that produce the clearest, most aligned result

### Signs of Correct Alignment

✅ **Good alignment:**
- Each pixel block shows a single solid color from the image
- Fading pixels transition cleanly between full opacity and fade
- No blurring or color mixing within blocks
- Sharp, clean pixelated appearance

❌ **Misalignment:**
- Pixels appear blurry or washed out
- Multiple colors visible within a single pixel block
- Fade effect looks messy or unclear
- Image looks like double-pixelation

### Tips

- **Check image dimensions first**: Ensure your image width and height are perfect multiples of `pixelSize` (e.g., 768x1024 for pixelSize=8)
- **Use the alignment grid**: Set `enableAlignment={true}` to see the pixel grid overlay - it's the fastest way to find correct offsets
- **Match your source image**: The `pixelSize` must match how the image was originally pixelated (usually 8px or 16px)
- **Watch the console**: The component warns if dimensions aren't perfect multiples of pixelSize
- **Start with offset 0**: Only adjust if you see misalignment
- **Small adjustments**: Offset values are typically 0-4 for most images
- **Check all pages**: Different images may need different offsets if they were pixelated separately
- **Disable alignment in production**: `enableAlignment` is a debugging tool - turn it off once aligned

## Styling

The component includes base styles for the canvas element:

```css
canvas {
    display: block;
    max-width: 100%;
    height: auto;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
}
```

You can override these with custom CSS classes:

```css
.my-custom-canvas {
    border: 3px solid var(--border-heavy);
    border-radius: 0;
    max-width: 500px;
}
```

## Performance Considerations

- Uses `willReadFrequently: true` context option for optimized `getImageData()` calls
- Animation runs at 60fps via `requestAnimationFrame`
- Pixel size affects performance: larger pixels = better performance
- Random fade interval can be adjusted based on desired effect vs. performance

### Recommended Settings by Use Case

**Background Images (subtle effect)**
- `pixelSize`: 12-20
- `fadeInterval`: 100-150ms
- `fadePixelsPerTick`: 5-8
- `fadeSpeed`: 0.03-0.08
- `initialOpacityMin`: 0.4-0.6
- `hoverFadeStrength`: 0.5-0.7

**Profile/Hero Images (medium intensity)**
- `pixelSize`: 6-12
- `fadeInterval`: 80-120ms
- `fadePixelsPerTick`: 3-5
- `fadeSpeed`: 0.03-0.05
- `initialOpacityMin`: 0.6-0.8
- `hoverFadeStrength`: 0.5-0.6

**Interactive Focus (high visibility)**
- `pixelSize`: 4-8
- `fadeInterval`: 60-100ms
- `fadePixelsPerTick`: 2-4
- `fadeSpeed`: 0.02-0.05
- `hoverRadius`: 3-5
- `hoverFadeStrength`: 0.3-0.5

**Glitch/Tactical Effect (aggressive)**
- `fadeInterval`: 40-80ms
- `fadePixelsPerTick`: 10-20
- `fadeOutMin`: 0
- `fadeOutMax`: 0.3
- `fadeSpeed`: 0.1-0.2

## Browser Compatibility

- Modern browsers with Canvas API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported
- Falls back gracefully if canvas not supported (shows nothing)

## Accessibility

- Canvas includes `role="img"` attribute
- `aria-label` set from `alt` prop
- Purely decorative images should use empty alt text (`alt=""`)
- Images with semantic meaning should include descriptive alt text

## Technical Details

### Rendering Method
The component uses canvas clipping to render pixel blocks efficiently:

```typescript
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render each pixel block
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * pixelSize;
            const y = row * pixelSize;
            
            ctx.save();
            
            // Apply edge blur multiplier
            const edgeOpacity = calculateEdgeOpacity(row, col);
            ctx.globalAlpha = pixelOpacities[row][col] * edgeOpacity;
            
            // Clip to this pixel block
            ctx.beginPath();
            ctx.rect(x, y, pixelSize, pixelSize);
            ctx.clip();
            
            // Draw the full image (only visible in clipped region)
            ctx.drawImage(img, 0, 0);
            
            ctx.restore();
        }
    }
    
    // Restore opacity if enabled
    if (!isHovering && autoRestore) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                pixelOpacities[row][col] += (1 - pixelOpacities[row][col]) * fadeSpeed;
            }
        }
    }
}
```

### Opacity Ranges
The component uses configurable opacity ranges for different effects:

- **Initial state**: Random opacity between `initialOpacityMin` and `initialOpacityMax`
- **Fade out**: Random opacity between `fadeOutMin` and `fadeOutMax`
- **Fade in**: Random opacity between `fadeInMin` and `fadeInMax`
- **Hover**: `1 - (distance / radius) * hoverFadeStrength`
- **Edge blur**: `Math.max(0, distanceFromEdge / blurDistance)` per edge, multiplied together

This allows fine-tuned control over the visual effect.

### Edge Blur Implementation
Edge blur creates a gradient opacity multiplier based on distance from edges:

```typescript
function calculateEdgeOpacity(row: number, col: number): number {
    let edgeOpacity = 1.0;
    
    // Top edge
    if (edgeBlurTop > 0) {
        const distanceFromTop = row * pixelSize;
        if (distanceFromTop < edgeBlurTop) {
            edgeOpacity *= Math.max(0, distanceFromTop / edgeBlurTop);
        }
    }
    
    // Bottom edge
    if (edgeBlurBottom > 0) {
        const distanceFromBottom = (rows - row - 1) * pixelSize;
        if (distanceFromBottom < edgeBlurBottom) {
            edgeOpacity *= Math.max(0, distanceFromBottom / edgeBlurBottom);
        }
    }
    
    // Left edge
    if (edgeBlurLeft > 0) {
        const distanceFromLeft = col * pixelSize;
        if (distanceFromLeft < edgeBlurLeft) {
            edgeOpacity *= Math.max(0, distanceFromLeft / edgeBlurLeft);
        }
    }
    
    // Right edge
    if (edgeBlurRight > 0) {
        const distanceFromRight = (cols - col - 1) * pixelSize;
        if (distanceFromRight < edgeBlurRight) {
            edgeOpacity *= Math.max(0, distanceFromRight / edgeBlurRight);
        }
    }
    
    return edgeOpacity;
}
```

Multiple edges multiply together, creating smooth corner transitions.

### Random Fade Implementation
```typescript
function randomFade() {
    for (let i = 0; i < fadePixelsPerTick; i++) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        
        const fadeOut = Math.random() > 0.5;
        const targetOpacity = fadeOut
            ? Math.random() * (fadeOutMax - fadeOutMin) + fadeOutMin
            : Math.random() * (fadeInMax - fadeInMin) + fadeInMin;
        
        pixelOpacities[row][col] = targetOpacity;
    }
}
```

### Hover Distance Calculation
Ripple effect uses Euclidean distance with configurable strength:

```typescript
const distance = Math.sqrt(dx * dx + dy * dy);
if (distance <= hoverRadius) {
    const fadeAmount = 1 - (distance / hoverRadius) * hoverFadeStrength;
    pixelOpacities[newRow][newCol] = Math.max(
        pixelOpacities[newRow][newCol],
        fadeAmount
    );
}
```

## Cleanup

Component properly cleans up on unmount:
- Cancels animation frame with `cancelAnimationFrame()`
- Clears fade interval with `clearInterval()`
- Releases canvas context

## Transparency Support

The clipping-based rendering method automatically preserves image transparency. The original image's alpha channel is maintained since we're drawing the actual image, not recreating pixels.

## Design Alignment

This component aligns with the **military/defense tech brutalist aesthetic**:

- **Tactical glitch effect**: Random pixel fading creates a digital/surveillance aesthetic
- **Technical precision**: Granular configurable parameters allow fine-tuned control per-page
- **Interactive systems**: Hover effect suggests responsive, intelligent systems
- **Pixelated rendering**: Works with pre-pixelated images, matching the low-fi tactical design language
- **Modular control**: Each page can customize the effect to match its specific content and purpose

## Future Enhancements

Potential improvements:
- [x] Granular per-page customization ✅
- [x] Edge blur for seamless blending ✅
- [ ] Configurable fade patterns (waves, ripples, diagonal sweeps)
- [ ] Color shift effects on fade
- [ ] Performance mode (reduce quality on low-end devices)
- [ ] Preset configurations as named presets (e.g., "tactical", "subtle", "aggressive")
- [ ] WebGL renderer for better performance with many pixels
- [ ] Export as static GIF/video for non-interactive fallback
- [ ] Pattern-based fading (grid, checkerboard, radial)
- [ ] Curved/radial edge blur options