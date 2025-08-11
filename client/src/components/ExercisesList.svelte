<script>
    const { languageId } = $props();
    import { useExerciseState } from "../states/exerciseState.svelte.js";
    const exerciseState = useExerciseState();

    exerciseState.fetchByLanguage(languageId);
</script>

<h1>Available exercises</h1>

<ul>
    {#each exerciseState.exercises as ex}
        <li><a href={`/exercises/${ex.id}`}>{ex.title}</a></li>
    {/each}
</ul>
