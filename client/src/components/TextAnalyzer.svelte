<script>
    const { exerciseId } = $props();
    let text = $state("");
    let submissionId = $state(null);
    let gradingStatus = $state("");
    let grade = $state(null);
    let pollHandle = null;

    const submit = async () => {
        console.log("exerciseId:", exerciseId);
        const res = await fetch(`/api/exercises/${exerciseId}/submissions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source_code: text }),
        });
        const data = await res.json();
        submissionId = data.id;

        pollHandle = setInterval(async () => {
            const r = await fetch(`/api/submissions/${submissionId}/status`);
            const s = await r.json();

            gradingStatus = s.grading_status;
            grade = s.grade;

            if (gradingStatus === "graded") {
                clearInterval(pollHandle);
                pollHandle = null;
            }
        }, 500);
    };
</script>

<textarea bind:value={text}></textarea>
<button onclick={submit}>Submit</button>

{#if submissionId !== null}
    <p>Submission id: {submissionId}</p>
    <p>Grading status: {gradingStatus}</p>
    <p>Grade: {grade}</p>
{/if}
