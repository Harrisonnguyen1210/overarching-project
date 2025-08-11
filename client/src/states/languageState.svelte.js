let languages = $state([]);

const useLanguageState = () => {
    return {
        get languages() {
            return languages;
        },
        async fetch() {
            const res = await fetch("/api/languages");
            languages = await res.json();
        },
    };
};

export { useLanguageState };
