import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { employment } from "../src/data/employment.ts";

const output = new URL("../../docs/", import.meta.url);
const page = async (path) => readFile(new URL(path, output), "utf8");

test("built pages agree on employment and keep the inactive availability state out of the HTML", async () => {
    const home = await page("index.html");
    const experience = await page("experience/index.html");
    const about = await page("about/index.html");
    const role = home.match(/<section class="current-role"[^>]*>(.*?)<\/section>/s)?.[1];
    const firstJob = experience.match(/<div class="timeline-content"[^>]*>(.*?)<div class="timeline-item"/s)?.[1];
    assert.ok(role, "homepage role exists");
    assert.ok(firstJob, "first timeline entry exists");

    if (employment.availableForDeployment) {
        for (const html of [role, firstJob, about]) {
            assert.ok(html.includes(`After wrapping up at ${employment.lastEmployer},`));
        }
        assert.ok(role.includes("AVAILABLE FOR DEPLOYMENT"));
        assert.ok(firstJob.includes(`${employment.availableSince} – Present`));
    } else {
        for (const html of [role, firstJob]) {
            assert.ok(html.includes(employment.currentRole.title));
            assert.ok(html.includes(employment.currentRole.company));
            assert.ok(html.includes(employment.currentRole.period));
        }
        assert.ok(about.includes(employment.currentRole.description));
        if (employment.currentRole.achievements.length === 0) {
            assert.ok(!firstJob.includes("KEY ACHIEVEMENTS:"), "no empty achievements heading");
        }
    }

    for (const path of ["index.html", "about/index.html", "experience/index.html", "skills/index.html", "projects/index.html", "contact/index.html"]) {
        const html = await page(path);
        assert.equal(html.includes("AVAILABLE FOR OPPORTUNITIES"), employment.availableForDeployment, `${path} ticker`);
        if (!employment.availableForDeployment) {
            assert.ok(!html.includes("AVAILABLE FOR DEPLOYMENT"), `${path} hides the availability card`);
            assert.ok(!html.includes("After wrapping up at"), `${path} hides the job-seeking copy`);
        }
    }
    assert.ok(experience.includes("Jun 2025 – May 2026"), "past Ferocia history remains");
});

test("company logos ship with the site and every selected project has artwork or neutral initials", async () => {
    const experience = await page("experience/index.html");
    const projects = await page("projects/index.html");
    const images = [...experience.matchAll(/<img\b[^>]*src="([^"]+)"/g)];
    const roles = [...experience.matchAll(/class="timeline-item"/g)];
    assert.equal(images.length, roles.length - Number(employment.availableForDeployment));
    assert.equal([...projects.matchAll(/class="card-logo"/g)].length, 5);
    for (const html of [experience, projects, await page("index.html")]) {
        for (const [, src] of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
            assert.ok(src.startsWith("/"), `logo is locally served: ${src}`);
            assert.ok((await readFile(new URL(src.slice(1), output))).length > 0, `asset exists: ${src}`);
        }
    }
    for (const repo of ["LGTVMenuBar", "ptv_cli", "FlixBridge", "new-mac", "tidy-tabs"]) {
        assert.ok(projects.includes(`https://github.com/thesammykins/${repo}`), `${repo} is linked`);
    }
    assert.ok(!projects.includes("jamf_terraform_baselines"), "owner-rejected project stays excluded");
});
