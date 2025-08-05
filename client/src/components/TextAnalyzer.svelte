<script>
    let text = $state("");
    let analyzedText = $state("");
    let charCount = $derived(analyzedText.length);
    let ifCount = $derived((analyzedText.match(/if/g) || []).length);

    const analyzeText = () => {
        analyzedText = text;
    };
</script>

<textarea bind:value={text}></textarea>
<button onclick={analyzeText}>Submit</button>

{#if charCount > 0}
    <p>Characters: {charCount}</p>
    <p>ifs: {ifCount}</p>
{/if}
