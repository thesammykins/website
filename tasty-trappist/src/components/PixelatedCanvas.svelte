<script lang="ts">
    import { onMount } from "svelte";

    // Core props
    export let src: string;
    export let alt: string = "";
    export let className: string = "";
    export let pixelSize: number = 16;

    // Fade animation props
    export let enableRandomFade: boolean = true;
    export let fadeInterval: number = 100;
    export let fadePixelsPerTick: number = 10;
    export let fadeSpeed: number = 0.1;
    export let initialOpacityMin: number = 0.5;
    export let initialOpacityMax: number = 1.0;
    export let fadeOutMin: number = 0;
    export let fadeOutMax: number = 0.3;
    export let fadeInMin: number = 0.7;
    export let fadeInMax: number = 1.0;
    export let autoRestore: boolean = true;

    // Edge blur props
    export let edgeBlurTop: number = 0;
    export let edgeBlurRight: number = 0;
    export let edgeBlurBottom: number = 0;
    export let edgeBlurLeft: number = 0;

    // Hover interaction props
    export let enableHover: boolean = true;
    export let hoverBrightness: number = 1.3;
    export let hoverRadius: number = 2;

    interface PixelData {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    interface PixelState {
        currentOpacity: number;
        targetOpacity: number;
        speed: number;
    }

    // Canvas and image state
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let img: HTMLImageElement;
    let loaded = false;
    let imageData: ImageData | null = null;
    let pixelGrid: PixelData[][] = [];
    let pixelStates: PixelState[][] = [];
    let hoverState: { row: number; col: number; strength: number }[] = [];
    let animationId: number;
    let fadeIntervalId: number;
    let isHovering = false;

    onMount(() => {
        ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;

        img.onload = () => {
            initializeCanvas();
            loaded = true;
            animate();

            // Start continuous fade trigger
            if (enableRandomFade) {
                fadeIntervalId = window.setInterval(
                    triggerRandomFades,
                    fadeInterval,
                );
            }
        };

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            if (fadeIntervalId) clearInterval(fadeIntervalId);
        };
    });

    function initializeCanvas() {
        if (!ctx || !img) return;

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Calculate grid dimensions
        const cols = Math.floor(canvas.width / pixelSize);
        const rows = Math.floor(canvas.height / pixelSize);

        // Validate dimensions for pixel-perfect rendering
        const perfectWidth = cols * pixelSize;
        const perfectHeight = rows * pixelSize;

        if (canvas.width !== perfectWidth || canvas.height !== perfectHeight) {
            console.warn(
                `PixelatedCanvas: Image dimensions (${canvas.width}x${canvas.height}) are not perfect multiples of pixelSize (${pixelSize}).\n` +
                    `Expected: ${perfectWidth}x${perfectHeight} (${cols}x${rows} blocks)\n` +
                    `This will cause ${canvas.width - perfectWidth}px horizontal and ${canvas.height - perfectHeight}px vertical clipping.\n` +
                    `For pixel-perfect rendering, use image dimensions that are multiples of ${pixelSize}.`,
            );
        }

        // Draw full image to get pixel data
        ctx.drawImage(img, 0, 0);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Build pixel grid by sampling average color of each block
        pixelGrid = [];
        pixelStates = [];
        for (let row = 0; row < rows; row++) {
            const rowData: PixelData[] = [];
            const rowStates: PixelState[] = [];
            for (let col = 0; col < cols; col++) {
                const avgColor = getAverageColor(
                    col * pixelSize,
                    row * pixelSize,
                    pixelSize,
                    pixelSize,
                );
                rowData.push(avgColor);

                // Initialize pixel state with random initial opacity
                const initialOpacity =
                    Math.random() * (initialOpacityMax - initialOpacityMin) +
                    initialOpacityMin;
                rowStates.push({
                    currentOpacity: initialOpacity,
                    targetOpacity: initialOpacity,
                    speed: fadeSpeed * (0.5 + Math.random() * 0.5),
                });
            }
            pixelGrid.push(rowData);
            pixelStates.push(rowStates);
        }
    }

    function getAverageColor(
        startX: number,
        startY: number,
        width: number,
        height: number,
    ): PixelData {
        if (!imageData) return { r: 0, g: 0, b: 0, a: 0 };

        let r = 0,
            g = 0,
            b = 0,
            a = 0;
        let count = 0;

        for (let y = startY; y < startY + height && y < canvas.height; y++) {
            for (let x = startX; x < startX + width && x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                r += imageData.data[index];
                g += imageData.data[index + 1];
                b += imageData.data[index + 2];
                a += imageData.data[index + 3];
                count++;
            }
        }

        return {
            r: Math.round(r / count),
            g: Math.round(g / count),
            b: Math.round(b / count),
            a: Math.round(a / count),
        };
    }

    function triggerRandomFades() {
        if (!pixelStates.length) return;

        const rows = pixelStates.length;
        const cols = pixelStates[0].length;

        // Pick random pixels and assign them new target opacities
        for (let i = 0; i < fadePixelsPerTick; i++) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);

            const fadeOut = Math.random() > 0.5;
            const newTarget = fadeOut
                ? Math.random() * (fadeOutMax - fadeOutMin) + fadeOutMin
                : Math.random() * (fadeInMax - fadeInMin) + fadeInMin;

            pixelStates[row][col].targetOpacity = newTarget;
            // Randomize speed for this new transition
            pixelStates[row][col].speed =
                fadeSpeed * (0.5 + Math.random() * 0.5);
        }
    }

    function handleMouseMove(e: MouseEvent) {
        if (!canvas || !pixelGrid.length || !enableHover) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const col = Math.floor(x / pixelSize);
        const row = Math.floor(y / pixelSize);

        // Update hover state
        hoverState = [];
        for (let dy = -hoverRadius; dy <= hoverRadius; dy++) {
            for (let dx = -hoverRadius; dx <= hoverRadius; dx++) {
                const newRow = row + dy;
                const newCol = col + dx;

                if (
                    newRow >= 0 &&
                    newRow < pixelGrid.length &&
                    newCol >= 0 &&
                    newCol < pixelGrid[0].length
                ) {
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= hoverRadius) {
                        const strength = 1 - distance / hoverRadius;
                        hoverState.push({ row: newRow, col: newCol, strength });
                    }
                }
            }
        }
    }

    function handleMouseEnter() {
        isHovering = true;
    }

    function handleMouseLeave() {
        isHovering = false;
        hoverState = [];
    }

    function animate() {
        if (!ctx || !pixelGrid.length) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const rows = pixelGrid.length;
        const cols = pixelGrid[0]?.length || 0;

        // Create hover map for quick lookup
        const hoverMap = new Map<string, number>();
        for (const hover of hoverState) {
            hoverMap.set(`${hover.row},${hover.col}`, hover.strength);
        }

        // Draw each pixel block
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const pixel = pixelGrid[row][col];
                const state = pixelStates[row][col];
                const x = col * pixelSize;
                const y = row * pixelSize;

                // Interpolate current opacity toward target
                const diff = state.targetOpacity - state.currentOpacity;
                state.currentOpacity += diff * state.speed;

                // Snap to target when very close
                if (Math.abs(diff) < 0.001) {
                    state.currentOpacity = state.targetOpacity;

                    // If not hovering and autoRestore is on, set target back to full opacity
                    if (
                        !isHovering &&
                        autoRestore &&
                        state.targetOpacity < 0.99
                    ) {
                        state.targetOpacity = 1.0;
                    }
                }

                // Calculate edge blur opacity multiplier
                let edgeOpacity = 1.0;

                // Top edge blur
                if (edgeBlurTop > 0) {
                    const distanceFromTop = row * pixelSize;
                    if (distanceFromTop < edgeBlurTop) {
                        edgeOpacity *= Math.max(
                            0,
                            distanceFromTop / edgeBlurTop,
                        );
                    }
                }

                // Bottom edge blur
                if (edgeBlurBottom > 0) {
                    const distanceFromBottom = (rows - row - 1) * pixelSize;
                    if (distanceFromBottom < edgeBlurBottom) {
                        edgeOpacity *= Math.max(
                            0,
                            distanceFromBottom / edgeBlurBottom,
                        );
                    }
                }

                // Left edge blur
                if (edgeBlurLeft > 0) {
                    const distanceFromLeft = col * pixelSize;
                    if (distanceFromLeft < edgeBlurLeft) {
                        edgeOpacity *= Math.max(
                            0,
                            distanceFromLeft / edgeBlurLeft,
                        );
                    }
                }

                // Right edge blur
                if (edgeBlurRight > 0) {
                    const distanceFromRight = (cols - col - 1) * pixelSize;
                    if (distanceFromRight < edgeBlurRight) {
                        edgeOpacity *= Math.max(
                            0,
                            distanceFromRight / edgeBlurRight,
                        );
                    }
                }

                // Check if this pixel is being hovered
                const hoverStrength = hoverMap.get(`${row},${col}`) || 0;

                let r = pixel.r;
                let g = pixel.g;
                let b = pixel.b;
                const a = pixel.a;

                // Apply hover brightness effect
                if (hoverStrength > 0 && enableHover) {
                    const factor = 1 + (hoverBrightness - 1) * hoverStrength;
                    r = Math.min(255, Math.round(r * factor));
                    g = Math.min(255, Math.round(g * factor));
                    b = Math.min(255, Math.round(b * factor));
                }

                // Combine fade opacity and edge blur
                const finalOpacity = state.currentOpacity * edgeOpacity;

                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(a / 255) * finalOpacity})`;
                ctx.fillRect(x, y, pixelSize, pixelSize);
            }
        }

        animationId = requestAnimationFrame(animate);
    }
</script>

<canvas
    bind:this={canvas}
    class="{className} {loaded ? 'loaded' : ''}"
    on:mousemove={handleMouseMove}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    aria-label={alt}
></canvas>

<style>
    canvas {
        display: block;
        max-width: 100%;
        height: auto;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
        opacity: 0;
        transition: opacity 0.6s ease-in-out;
    }

    canvas.loaded {
        opacity: 1;
    }
</style>
