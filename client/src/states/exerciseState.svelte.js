let exercises = $state([]);
let exercise = $state(null);

const useExerciseState = () => {
    return {
        get exercises() {
            return exercises;
        },
        get exercise() {
            return exercise;
        },
        async fetchByLanguage(languageId) {
            const res = await fetch(`/api/languages/${languageId}/exercises`);
            exercises = await res.json();
        },
        async fetchSingle(exerciseId) {
            const res = await fetch(`/api/exercises/${exerciseId}`);
            if (res.ok) {
                exercise = await res.json();
            } else {
                exercise = null;
            }
        },
    };
};

export { useExerciseState };
