<script>
  export let opacity = 0.3;
  export let gridSize = 40;
  export let animate = true;
</script>

<svg class="grid-pattern" width="100%" height="100%" class:animate>
  <defs>
    <pattern id="technical-grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
      <path
        d="M {gridSize} 0 L 0 0 0 {gridSize}"
        fill="none"
        stroke="var(--pattern-grid)"
        stroke-width="1"
      />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#technical-grid)" {opacity} />
</svg>

<style>
  .grid-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  .grid-pattern.animate {
    animation: gridPulse 8s ease-in-out infinite;
  }

  @keyframes gridPulse {
    0%, 100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.6;
    }
  }
</style>
