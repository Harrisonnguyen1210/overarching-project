<script>
    const { exerciseId } = $props();
    import { useExerciseState } from "../states/exerciseState.svelte.js";
    const exerciseState = useExerciseState();

    exerciseState.fetchSingle(exerciseId);
</script>

{#if exerciseState.exercise}
    <h1>{exerciseState.exercise.title}</h1>
    <p>{exerciseState.exercise.description}</p>
{:else}
    <p>Loading...</p>
{/if}
