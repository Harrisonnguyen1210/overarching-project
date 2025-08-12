<script>
    const { exerciseId } = $props();

    import { useUserState } from "../states/userState.svelte.js";
    import ExerciseDetail from "./ExerciseDetail.svelte";
    import TextAnalyzer from "./TextAnalyzer.svelte";
    import UserInfo from "../components/auth/UserInfo.svelte";
    const userState = useUserState();
</script>

<UserInfo client:only />
<ExerciseDetail {exerciseId} />

{#if userState.email}
    <TextAnalyzer {exerciseId} />
{:else}
    <p>Login or register to complete exercises.</p>
{/if}
