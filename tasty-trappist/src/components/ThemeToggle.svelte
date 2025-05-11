<!-- Animated 80s Theme Toggle -->
<script>
  import { onMount } from 'svelte';
  let dark = false; // Default to light theme, will be updated onMount

  onMount(() => {
    console.log('[ThemeToggle] onMount: Component mounted');
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      console.log('[ThemeToggle] onMount: savedTheme from localStorage:', savedTheme);
      if (savedTheme) {
        dark = savedTheme === 'dark';
      } else {
        console.log('[ThemeToggle] onMount: No saved theme, checking OS preference.');
        dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('[ThemeToggle] onMount: OS prefers dark mode:', dark);
      }
      updateTheme();

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        console.log('[ThemeToggle] OS theme changed, localStorage theme:', localStorage.getItem('theme'));
        if (!localStorage.getItem('theme')) {
          dark = e.matches;
          console.log('[ThemeToggle] OS theme changed, applying new OS dark mode state:', dark);
          updateTheme();
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  });

  function toggle() {
    console.log('[ThemeToggle] toggle: function called. Current dark state:', dark);
    if (typeof window !== 'undefined') {
      dark = !dark;
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      console.log('[ThemeToggle] toggle: localStorage set to:', localStorage.getItem('theme'));
      updateTheme();
    }
  }

  function updateTheme() {
    console.log('[ThemeToggle] updateTheme: called with dark state:', dark);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      console.log('[ThemeToggle] updateTheme: data-theme set to:', document.documentElement.getAttribute('data-theme'));
      if (dark) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
      }
      console.log('[ThemeToggle] updateTheme: body classes:', document.body.className);
    }
  }
</script>
<style>
  .toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff200;
    border: 3px solid #ff5af7;
    border-radius: 50%;
    width: 54px;
    height: 54px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #00eaff;
    transition: background 0.2s, border 0.2s, box-shadow 0.2s;
    position: fixed;
    top: 24px;
    right: 32px;
    z-index: 200;
  }
  .toggle:hover {
    background: #ff5af7;
    border-color: #fff200;
    box-shadow: 4px 4px 0 #a259ff;
  }
  .icon {
    width: 32px;
    height: 32px;
    transition: transform 0.3s cubic-bezier(.4,0,.2,1);
  }
  .toggle:active .icon {
    transform: scale(0.92) rotate(-10deg);
  }
</style>
<button
  class="toggle"
  type="button"
  aria-pressed={dark}
  aria-label="Toggle dark/light mode"
  on:click={toggle}
>
  {#if !dark}
    <!-- Sun with sunglasses -->
    <svg class="icon" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" fill="#fff200" stroke="#ff5af7" stroke-width="3" />
      <rect x="10" y="12" width="12" height="4" rx="2" fill="#1a0033" />
      <rect x="10" y="12" width="4" height="4" rx="2" fill="#00eaff" />
      <rect x="18" y="12" width="4" height="4" rx="2" fill="#00eaff" />
      <rect x="13" y="20" width="6" height="2" rx="1" fill="#1a0033" />
    </svg>
  {:else}
    <!-- Neon moon -->
    <svg class="icon" viewBox="0 0 32 32" fill="none">
      <path d="M24 16c0 5-4 9-9 9 3-2 5-5 5-9s-2-7-5-9c5 0 9 4 9 9z" fill="#a259ff" stroke="#00eaff" stroke-width="3" />
      <circle cx="20" cy="14" r="2" fill="#fff200" />
    </svg>
  {/if}
</button> 