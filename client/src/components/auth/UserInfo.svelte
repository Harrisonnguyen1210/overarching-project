<script>
  import { useUserState } from "../../states/userState.svelte.js";
  const userState = useUserState();
</script>

{#if userState.loading}
  <p>Loading...</p>
{:else if userState.email}
  <p>{userState.email}</p>
{:else}
  <p>
    <a href="/auth/login">Login</a> or
    <a href="/auth/register">Register</a>
  </p>
{/if}
