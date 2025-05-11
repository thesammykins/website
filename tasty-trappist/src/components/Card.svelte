<!-- Svelte Card: 80s animated, bold color, entrance and hover -->
<script>
  export let title;
  export let meta = '';
  import { fly, fade, scale } from 'svelte/transition';
</script>
<style>
  .card {
    background: linear-gradient(135deg, #ff5af7 0%, #00eaff 100%);
    border-radius: 18px;
    box-shadow: 0 4px 32px 0 rgba(0,0,0,0.18);
    padding: 1.3rem 1.2rem 1.2rem 1.2rem;
    margin-bottom: 0.7rem;
    border: 2.5px solid #fff200;
    position: relative;
    overflow: hidden;
    color: #1a0033;
    transition: transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.18s;
    cursor: pointer;
  }
  .card:hover {
    transform: scale(1.04) rotate(-1deg);
    box-shadow: 0 8px 48px 0 #ff5af7, 0 2px 12px #00eaff;
    border-color: #ff5af7;
  }
  .job-title {
    font-weight: 900;
    font-size: 1.18rem;
    color: #fff200;
    text-shadow: 1px 2px 0 #ff5af7, 0 1px 0 #00eaff;
    letter-spacing: 0.02em;
  }
  .job-meta {
    font-size: 1.01rem;
    color: #00eaff;
    margin-bottom: 0.5em;
    font-weight: 700;
  }
</style>
<div class="card" in:fly={{ y: 40, duration: 500 }}>
  <div class="job-title">{@html title}</div>
  {#if meta}
    <div class="job-meta">{meta}</div>
  {/if}
  <slot />
</div> 