// Browser contract checks against a running preview. Requires agent-browser on PATH.
// Usage: npm run test:navigation -- http://localhost:4321
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const url = process.argv[2];
if (!url) throw new Error('Pass the URL of a running portfolio preview.');
const session = `nav-${process.pid}`;
function browser(...args) {
    const input = args[0] === 'batch' ? args.pop() : undefined;
    const run = spawnSync('agent-browser', ['--session', session, '--restore', ...args, '--json'], { encoding: 'utf8', input });
    if (run.error) throw run.error;
    assert.equal(run.status, 0, run.stdout + run.stderr);
    const result = JSON.parse(run.stdout);
    for (const step of Array.isArray(result) ? result : [result]) {
        assert.equal(step.success, true, JSON.stringify(step));
    }
    return result.data;
}
const evaluate = (code) => browser('eval', code).result;
const wait = (condition) => browser('wait', '--fn', condition);
const settled = (path) => wait(`location.pathname.replace(/[/]$/, '') === '${path.replace(/\/$/, '')}' && !document.activeViewTransition && !document.documentElement.hasAttribute('data-astro-transition')`);
function navigate(path) {
    const loads = evaluate('navigationCheck.loads');
    browser('click', `.main-nav a[href="${path}"]`);
    // The URL can already match before a same-route click's fetch begins.
    wait(`navigationCheck.loads > ${loads}`);
    settled(path);
    const { fonts, animated } = evaluate(`({ fonts: navigationCheck.fontSwaps.at(-1), animated: typeof document.startViewTransition === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches })`);
    assert.ok(fonts, 'navigation must sample header text at the page swap');
    assert.deepEqual(fonts.after, fonts.before, 'header glyphs must not resize even briefly while stylesheets swap');
    if (animated) {
        assert.ok(fonts.edgePositions.length > 2, 'the pixel edge must animate across the viewport');
        assert.equal(new Set(fonts.edgePositions).size, fonts.edgePositions.length, 'the moving edge must not hold between discrete animation steps');
    }
}

try {
    browser('open', url);
    browser('set', 'viewport', '1280', '800', '2');
    wait(`document.querySelector('.globe-canvas')?.closest('astro-island')?.hasAttribute('ssr') === false && document.querySelector('.hero-background canvas')?.width > 300`);
    evaluate(`document.fonts.ready`);
    evaluate(String.raw`
        window.navigationCheck = { header: document.querySelector('.site-header'), globe: document.querySelector('.globe-canvas'), ticker: document.querySelector('.status-bar__ticker'), loads: 0, fontSwaps: [] };
        document.addEventListener('astro:page-load', () => navigationCheck.loads++);
        document.addEventListener('astro:before-swap', event => {
            const textWidths = () => [
                document.querySelector('.logo-text'),
                ...document.querySelectorAll('.nav-link'),
                document.querySelector('.site-header .status-bar__item'),
            ].map(element => {
                const range = document.createRange();
                range.selectNodeContents(element);
                return [element.textContent.trim(), range.getBoundingClientRect().width];
            });
            const before = textWidths();
            const edgePositions = [];
            let finished = false;
            event.viewTransition.ready.then(() => {
                function sampleEdge() {
                    if (finished) return;
                    const style = getComputedStyle(document.documentElement, '::view-transition-old(content)');
                    const edge = Number(style.clipPath.match(/^polygon\([^,]+,\s*(-?[\d.]+)%/)?.[1]);
                    // Ignore the off-screen beginning/end and the loading hold.
                    if (!document.documentElement.hasAttribute('data-page-preparing') && edge > 0 && edge < 95) edgePositions.push(edge);
                    requestAnimationFrame(sampleEdge);
                }
                requestAnimationFrame(sampleEdge);
            }, () => { finished = true; });
            event.viewTransition.finished.then(() => { finished = true; }, () => { finished = true; });
            const swap = event.swap;
            event.swap = () => {
                swap();
                // A later animation frame misses cached fonts recovering after a flash.
                navigationCheck.fontSwaps.push({ before, after: textWidths(), edgePositions });
            };
        });
        navigationCheck.wipes = [];
        document.addEventListener('astro:before-swap', event => {
            const result = { path: event.to.pathname, completed: false, cancelled: false };
            navigationCheck.wipes.push(result);
            event.viewTransition.ready.then(() => {
                const wipe = document.getAnimations().find(animation => animation.animationName === 'pixel-reveal');
                wipe?.finished.then(() => { result.completed = true; }, () => { result.cancelled = true; });
            }, () => {});
        });
    `);
    // Compare layout, excluding the Contact button's intentional hover transform.
    const menuGeometry = () => evaluate(`[...document.querySelectorAll('.main-nav a')].map(link => [link.offsetLeft, link.offsetTop, link.offsetWidth, link.offsetHeight])`);
    const initialMenu = menuGeometry();
    const titleTypography = () => evaluate(`(() => { const style = getComputedStyle(document.querySelector('.page-title')); return [style.fontSize, style.lineHeight, style.letterSpacing, style.fontWeight]; })()`);
    for (let round = 0; round < 2; round++) {
        for (const path of ['/about', '/projects', '/experience', '/skills', '/contact', '/']) {
            navigate(path);
            assert.equal(evaluate(`document.querySelector('.main-nav [aria-current="page"]').getAttribute('href')`), path);
            assert.equal(evaluate(`navigationCheck.header === document.querySelector('.site-header') && navigationCheck.globe === document.querySelector('.globe-canvas') && navigationCheck.ticker === document.querySelector('.status-bar__ticker')`), true);
            assert.equal(evaluate(`document.querySelectorAll('.globe-canvas').length`), 1);
            assert.deepEqual(menuGeometry(), initialMenu, 'changing the active link must not move or resize the persistent menu');
            if (path !== '/') assert.deepEqual(titleTypography(), ['56px', '61.6px', '2.8px', '700'], `${path} uses the shared desktop title scale`);
        }
    }
    assert.equal(evaluate('navigationCheck.loads'), 12, 'every click completes one client navigation');
    evaluate(`document.querySelector('.site-header .status-bar__ticker').getAnimations()[0].currentTime = 17000`);
    navigate('/projects');
    assert.ok(evaluate(`document.querySelector('.site-header .status-bar__ticker').getAnimations()[0].currentTime >= 17000`), 'the retained ticker must not jump back to the start');
    browser('batch', JSON.stringify([
        ['click', '.nav-link[href="/about"]'],
        ['click', '.nav-link[href="/projects"]'],
        ['click', '.nav-link[href="/skills"]'],
    ]));
    settled('/skills');
    assert.equal(evaluate(`document.querySelector('.nav-link[aria-current="page"]').getAttribute('href')`), '/skills', 'rapid clicks must reach the final requested page');
    navigate('/projects');
    browser('click', '.nav-link[href="/skills"]');
    wait(`location.pathname.replace(/[/]$/, '') === '/skills' && !document.documentElement.hasAttribute('data-page-preparing') && document.getAnimations().some(animation => animation.animationName === 'pixel-reveal' && animation.currentTime > 200 && animation.currentTime < 1000)`);
    browser('click', '.nav-link[href="/"]');
    settled('/');
    const interrupted = evaluate('navigationCheck.wipes.slice(-2)');
    assert.deepEqual(interrupted.map(wipe => wipe.path.replace(/[/]$/, '') || '/'), ['/skills', '/']);
    assert.ok(interrupted.every(wipe => wipe.completed && !wipe.cancelled), 'Skills → Home must finish both pixel edges, not cancel midway and pop the intermediate page into view');
    navigate('/');
    browser('back');
    settled('/skills');
    browser('forward');
    settled('/');
    browser('scroll', 'down', '900');
    wait('scrollY > 800');
    assert.equal(evaluate(`Math.round(document.querySelector('.site-header').getBoundingClientRect().top)`), 0);
    navigate('/about');
    assert.equal(evaluate(`document.querySelector('h1').getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom && document.querySelector('h1').getBoundingClientRect().bottom < innerHeight`), true, 'new page heading is visible below the persistent header');
    browser('click', '.theme-toggle');
    const theme = evaluate('document.documentElement.dataset.theme');
    navigate('/contact');
    assert.equal(evaluate('document.documentElement.dataset.theme'), theme);
    browser('click', '#contact-form button[type="submit"]');
    assert.equal(evaluate(`document.querySelectorAll('#contact-form [aria-invalid="true"]').length`), 3);
    assert.equal(evaluate('document.activeElement.id'), 'name');
    navigate('/projects');
    navigate('/contact');
    assert.equal(evaluate(`document.querySelector('#contact-form button[type="submit"]').disabled`), false);
    browser('click', '#contact-form button[type="submit"]');
    assert.equal(evaluate(`document.querySelectorAll('#contact-form [aria-invalid="true"]').length`), 3);
    browser('set', 'viewport', '390', '844', '2');
    browser('click', '.mobile-menu-toggle');
    wait(`document.querySelector('.nav-links').getBoundingClientRect().top < 200 && !document.querySelector('.nav-links').inert`);
    browser('press', 'Escape');
    assert.equal(evaluate(`document.querySelector('.mobile-menu-toggle').getAttribute('aria-expanded')`), 'false');
    browser('click', '.mobile-menu-toggle');
    wait(`getComputedStyle(document.querySelector('.nav-links')).opacity === '1'`);
    browser('click', '.nav-link[href="/skills"]');
    settled('/skills');
    assert.equal(evaluate(`document.querySelector('.mobile-menu-toggle').getAttribute('aria-expanded')`), 'false');
    assert.equal(evaluate(`document.querySelector('.nav-links').inert`), true);
    for (const path of ['/about', '/projects', '/experience', '/skills', '/contact']) {
        browser('click', '.mobile-menu-toggle');
        wait(`getComputedStyle(document.querySelector('.nav-links')).opacity === '1'`);
        navigate(path);
        assert.deepEqual(titleTypography(), ['32px', '35.2px', '1.6px', '700'], `${path} uses the shared narrow title scale`);
        assert.equal(evaluate(`document.documentElement.scrollWidth <= innerWidth && document.querySelector('.page-title').getBoundingClientRect().right <= innerWidth`), true, `${path} wraps without horizontal overflow`);
    }
    browser('set', 'media', 'light', 'reduced-motion');
    wait(`document.documentElement.dataset.autoplay === 'paused'`);
    browser('click', '.nav-logo');
    settled('/');
    assert.equal(evaluate('document.documentElement.dataset.autoplay'), 'paused', 'navigation must not restart the reduced-motion clock');
    assert.equal(evaluate(`getComputedStyle(document.documentElement, '::view-transition-new(content)').animationName`), 'none');
    browser('set', 'media', 'light');
    wait(`document.documentElement.dataset.autoplay === 'playing'`);
    console.log('PASS: repeated routes, continuously advancing pixel edge, stable header glyphs during stylesheet swaps, stable menu geometry, consistent desktop/narrow titles, persistent header/globe/ticker, history, deep scroll, theme, contact revisits, narrow menu and reduced motion');
} catch (error) {
    console.error(evaluate(`({ path: location.pathname, title: document.title, ready: document.readyState, autoplay: document.documentElement.dataset.autoplay, canvases: [...document.querySelectorAll('canvas')].map(c => [c.className, c.width, c.height]) })`));
    throw error;
} finally {
    browser('close');
}
