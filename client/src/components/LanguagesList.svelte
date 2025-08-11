<script>
    import { useLanguageState } from "../states/languageState.svelte.js";
    const languageState = useLanguageState();

    // Immediately trigger fetch when component is used
    languageState.fetch();
</script>

<h1>Available languages</h1>
<ul>
    {#each languageState.languages as lang}
        <li><a href={`/languages/${lang.id}`}>{lang.name}</a></li>
    {/each}
</ul>
