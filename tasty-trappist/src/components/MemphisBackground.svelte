<!-- Animated Memphis/80s SVG background shapes -->
<script>
  import { onMount } from 'svelte';

  let shapes = [];
  const shapeTypes = ['circle', 'triangle', 'rectangle', 'wavy', 'cross', 'confetti', 'gridline'];
  const numShapes = 150; // Increased density

  // Helper to generate random numbers in a range
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  onMount(() => {
    const generateShapes = () => {
      const newShapes = [];
      const { innerWidth, innerHeight } = window;
      for (let i = 0; i < numShapes; i++) {
        const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const size = random(20, 80); // Increased size range: min 20, max 80
        const x = random(-80, innerWidth + 80); // Allow shapes to go off-screen slightly, adjusted for new size
        const y = random(-80, innerHeight + 80); // Adjusted for new size
        const rotation = random(0, 360);
        // Use CSS variables for colors, they will be picked up from index.astro
        const colorVars = ['--pattern-main', '--pattern-accent1', '--pattern-accent2', '--pattern-accent3'];
        const mainColor = `var(${colorVars[Math.floor(Math.random() * 2)]})`; // Prioritize main and accent1
        const accentColor = `var(${colorVars[Math.floor(random(1,4))]})`; // any accent for secondary

        newShapes.push({ id: i, type, x, y, size, rotation, mainColor, accentColor });
      }
      shapes = newShapes;
      console.log('[MemphisBackground] Generated shapes:', shapes); // DEBUG
    };

    generateShapes();
    // Optional: Regenerate on resize, could be debounced for performance
    // window.addEventListener('resize', generateShapes);
    // return () => window.removeEventListener('resize', generateShapes);
  });

  // $: console.log('[MemphisBackground] Shapes array updated:', shapes); // DEBUG reactive changes
</script>

<style>
  .memphis-bg-pattern {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0; /* Behind main content, but above page background color */
    overflow: hidden; /* Prevent scrollbars from off-screen shapes */
  }

  .shape-group {
    /* For very subtle parallax or group animation if desired later */
    /* animation: subtleDrift 20s linear infinite alternate; */
  }

  @keyframes subtleDrift {
    0% { transform: translate(0px, 0px); }
    100% { transform: translate(5px, 8px); }
  }
</style>

<svg class="memphis-bg-pattern" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
  <!-- Definition for a grid pattern -->
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--pattern-accent3, #ffb3e6)" stroke-width="0.5" opacity="0.3"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />

  <g class="shape-group">
    {#each shapes as shape (shape.id)}
      <g transform={`translate(${shape.x}, ${shape.y}) rotate(${shape.rotation} ${shape.size/2} ${shape.size/2})`}>
        {#if shape.type === 'circle'}
          <circle cx={shape.size / 2} cy={shape.size / 2} r={shape.size / 2} fill={shape.mainColor} />
          <circle cx={shape.size / 2} cy={shape.size / 2} r={shape.size / 2 * 0.6} fill={shape.accentColor} />
        {:else if shape.type === 'triangle'}
          <polygon 
            points={`0,${shape.size} ${shape.size/2},0 ${shape.size},${shape.size}`}
            fill={shape.mainColor} 
            stroke={shape.accentColor} 
            stroke-width={Math.max(1, shape.size / 15)}
          />
        {:else if shape.type === 'rectangle'}
          <rect width={shape.size * 1.5} height={shape.size * 0.7} fill={shape.mainColor} stroke={shape.accentColor} stroke-width={Math.max(1, shape.size / 20)} />
        {:else if shape.type === 'wavy'}
          <path 
            d={`M 0,${shape.size/2} Q ${shape.size/10},${shape.size/4} ${shape.size/5},${shape.size/2} T ${2*shape.size/5},${shape.size/2} T ${3*shape.size/5},${shape.size/2} T ${4*shape.size/5},${shape.size/2} T ${shape.size},${shape.size/2}`}
            stroke={shape.mainColor} 
            stroke-width={Math.max(2, shape.size / 10)} 
            fill="none" 
          />
        {:else if shape.type === 'cross'}
          <line x1={0} y1={0} x2={shape.size} y2={shape.size} stroke={shape.accentColor} stroke-width={Math.max(4, shape.size / 6)} stroke-linecap="round" />
          <line x1={0} y1={shape.size} x2={shape.size} y2={0} stroke={shape.accentColor} stroke-width={Math.max(4, shape.size / 6)} stroke-linecap="round" />
        {:else if shape.type === 'confetti'}
          <!-- Small, rotated rects for confetti -->
          <rect width={shape.size / 3} height={shape.size / 5} fill={shape.mainColor} />
        {:else if shape.type === 'gridline'}
           <!-- This type is now handled by the pattern fill, but you could add individual thicker lines too -->
        {/if}
      </g>
    {/each}
  </g>
</svg> 