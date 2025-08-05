import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import deno from "@deno/astro-adapter";

export default defineConfig({
  adapter: deno(),
  integrations: [svelte()],
});