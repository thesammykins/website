<script lang="ts">
    import { onMount } from 'svelte';
    import { autoplay } from './autoplay';
    // World Atlas 2.0.2 / Natural Earth; notice: /licenses/world-atlas.txt.
    import worldMapUrl from '../data/countries-110m.json?url';

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let animationId: number;
    let rotation = 0;
    let worldData: ReturnType<typeof project>[][] | null = null;
    let lastFrame = 0;
    let reducedMotion = false;
    let visible = true;

    // Globe configuration - larger for better visibility
    const GLOBE_SIZE = 64;
    const RADIUS = GLOBE_SIZE / 2;
    const ROTATION_SPEED = 0.3; // Slower, more tactical

    // Melbourne coordinates
    const MELBOURNE_LAT = -37.8136;
    const MELBOURNE_LON = 144.9631;

    // Grid geography is fixed too; rotate cached points rather than doing
    // thousands of latitude/longitude trigonometric calculations every frame.
    const graticule: ReturnType<typeof project>[][] = [];
    for (let lat = -80; lat <= 80; lat += 20) {
        const line = [];
        for (let lon = -180; lon <= 180; lon += 5) line.push(project(lon, lat, 0));
        graticule.push(line);
    }
    for (let lon = -180; lon <= 180; lon += 30) {
        const line = [];
        for (let lat = -90; lat <= 90; lat += 5) line.push(project(lon, lat, 0));
        graticule.push(line);
    }

    // Fetch world map data - using GeoJSON directly
    onMount(() => {
        const controller = new AbortController();
        async function loadWorld() {
            try {
                const response = await fetch(worldMapUrl, { signal: controller.signal });
                if (!response.ok) throw new Error(`World data HTTP ${response.status}`);
                const data = await response.json();
                if (controller.signal.aborted) return;
                // Geography is fixed; only the view rotation changes per frame.
                worldData = extractGeoJSON(data).map(shape =>
                    shape.map(([lon, lat]) => project(lon, lat, 0))
                );
                if (!document.hidden && visible) drawGlobe();
            } catch (e) {
                if (!controller.signal.aborted) console.error('Failed to load world data:', e);
            }
        }
        void loadWorld();
        return () => controller.abort();
    });

    // Extract GeoJSON from TopoJSON
    function extractGeoJSON(topology: any) {
        const coordinates: number[][][] = [];

        if (!topology.arcs || !topology.objects?.countries?.geometries) {
            console.error('Invalid topology structure');
            return coordinates;
        }

        const { arcs, transform } = topology;
        const { scale, translate } = transform;

        // Process each country geometry
        for (const geometry of topology.objects.countries.geometries) {
            if (!geometry.arcs) continue;

            // Handle MultiPolygon and Polygon
            const arcsList = Array.isArray(geometry.arcs[0][0]) ? geometry.arcs : [geometry.arcs];

            for (const arcGroup of arcsList) {
                for (const arcRing of arcGroup) {
                    const coords: number[][] = [];

                    for (const arcIndex of arcRing) {
                        const arc = arcs[arcIndex < 0 ? ~arcIndex : arcIndex];
                        const reverse = arcIndex < 0;

                        let x = 0, y = 0;
                        const arcCoords: number[][] = [];

                        for (const [dx, dy] of arc) {
                            x += dx;
                            y += dy;
                            arcCoords.push([x, y]);
                        }

                        if (reverse) arcCoords.reverse();

                        for (const [x, y] of arcCoords) {
                            const lon = x * scale[0] + translate[0];
                            const lat = y * scale[1] + translate[1];
                            coords.push([lon, lat]);
                        }
                    }

                    if (coords.length > 0) {
                        coordinates.push(coords);
                    }
                }
            }
        }

        return coordinates;
    }

    // 3D projection - orthographic (globe view)
    function project(lon: number, lat: number, rot: number) {
        const lambda = (lon - rot) * (Math.PI / 180);
        const phi = lat * (Math.PI / 180);

        const x = Math.cos(phi) * Math.sin(lambda);
        const y = -Math.sin(phi);
        const z = Math.cos(phi) * Math.cos(lambda);

        return { x, y, z };
    }

    function drawGlobe() {
        if (!ctx || !canvas) return;

        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / (2 * dpr);
        const centerY = canvas.height / (2 * dpr);
        const radius = RADIUS - 3;
        const angle = rotation * Math.PI / 180;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // BRUTALIST STYLING
        // Heavy border for globe
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Ocean fill - tactical dark
        ctx.fillStyle = '#0a1128';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw graticule (grid lines) for military look
        ctx.strokeStyle = '#00eaff33';
        ctx.lineWidth = 0.5;

        for (const line of graticule) {
            ctx.beginPath();
            let first = true;
            for (const point of line) {
                if (point.z * cos + point.x * sin > 0) {
                    const x = centerX + (point.x * cos - point.z * sin) * (radius - 2);
                    const y = centerY + point.y * (radius - 2);
                    first ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                    first = false;
                }
            }
            ctx.stroke();
        }

        // Draw continents with brutalist styling
        if (worldData) {
            ctx.fillStyle = '#ff5722'; // Orange accent for land
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 0.5;

            for (const shape of worldData) {
                ctx.beginPath();
                let first = true;

                for (const point of shape) {
                    if (point.z * cos + point.x * sin > 0) {
                        const x = centerX + (point.x * cos - point.z * sin) * (radius - 2);
                        const y = centerY + point.y * (radius - 2);

                        if (first) {
                            ctx.moveTo(x, y);
                            first = false;
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                }

                ctx.closePath();
                ctx.fill();
            }
        }

        // Melbourne targeting marker - military style
        const melbPos = project(MELBOURNE_LON, MELBOURNE_LAT, rotation);
        if (melbPos.z > 0) {
            const melbX = centerX + melbPos.x * (radius - 2);
            const melbY = centerY + melbPos.y * (radius - 2);

            // Crosshair target
            const size = 6;
            ctx.strokeStyle = '#00ff88'; // Green accent
            ctx.lineWidth = 2;

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(melbX - size, melbY);
            ctx.lineTo(melbX + size, melbY);
            ctx.stroke();

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(melbX, melbY - size);
            ctx.lineTo(melbX, melbY + size);
            ctx.stroke();

            // Center dot
            ctx.fillStyle = '#00ff88';
            ctx.beginPath();
            ctx.arc(melbX, melbY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animate(timestamp = performance.now()) {
        if (!reducedMotion && lastFrame && timestamp - lastFrame < 1000 / 30) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        const elapsed = lastFrame ? Math.min(timestamp - lastFrame, 50) : 0;
        lastFrame = timestamp;
        rotation += ROTATION_SPEED * elapsed / (1000 / 60);
        if (rotation >= 360) rotation -= 360;

        drawGlobe();
        if (!reducedMotion) animationId = requestAnimationFrame(animate);
    }

    onMount(() => {
        const syncAnimation = () => {
            cancelAnimationFrame(animationId);
            lastFrame = 0;
            if (reducedMotion) rotation = MELBOURNE_LON;
            if (!document.hidden && visible) animate();
        };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            syncAnimation();
        });
        if (canvas) {
            ctx = canvas.getContext('2d');

            const dpr = window.devicePixelRatio || 1;
            canvas.width = GLOBE_SIZE * dpr;
            canvas.height = GLOBE_SIZE * dpr;
            canvas.style.width = `${GLOBE_SIZE}px`;
            canvas.style.height = `${GLOBE_SIZE}px`;

            if (ctx) {
                ctx.scale(dpr, dpr);
                syncAnimation();
            }
        }
        observer.observe(canvas);
        const unsubscribe = autoplay.subscribe((playing) => {
            reducedMotion = !playing;
            syncAnimation();
        });
        document.addEventListener('visibilitychange', syncAnimation);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            observer.disconnect();
            unsubscribe();
            document.removeEventListener('visibilitychange', syncAnimation);
        };
    });
</script>

<canvas
    bind:this={canvas}
    class="globe-canvas"
    width="64"
    height="64"
    aria-label="Spinning globe with Melbourne highlighted"
></canvas>

<style>
    .globe-canvas {
        display: block;
        color: var(--accent-orange);
    }
</style>
