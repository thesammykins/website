<!-- Animated 80s Tag component for skills/interests -->
<script>
  export let color = '#ff5af7';
  export let accent = '#fff200';
</script>
<style>
  .tag {
    display: inline-flex;
    align-items: center;
    background: var(--tag-bg, #fff200);
    border-radius: 12px 4px 12px 4px;
    padding: 0.35rem 1rem 0.35rem 1.2rem;
    font-size: 1.05rem;
    font-family: 'Fira Mono', monospace;
    color: #1a0033;
    font-weight: 700;
    letter-spacing: 0.01em;
    margin-bottom: 0.2em;
    margin-right: 0.5em;
    box-shadow: 2px 2px 0 #ff5af7;
    cursor: pointer;
    transition: transform 0.18s, background 0.18s, color 0.18s;
    position: relative;
    z-index: 1;
    overflow: visible;
  }
  .tag:hover {
    background: #ff5af7;
    color: #fff200;
    transform: scale(1.08) rotate(-2deg);
    box-shadow: 4px 4px 0 #00eaff;
  }
  .tag:active {
    transform: scale(0.96) rotate(2deg);
    background: #00eaff;
    color: #fff200;
  }
  .geo {
    position: absolute;
    left: -18px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
    opacity: 0.7;
    pointer-events: none;
  }
</style>
<span class="tag">
  <svg class="geo" width="18" height="18" viewBox="0 0 18 18">
    <polygon points="9,2 16,16 2,16" fill={color} stroke={accent} stroke-width="2" />
  </svg>
  <slot />
</span> 