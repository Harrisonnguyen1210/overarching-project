import { authClient } from "../utils/auth.js";

let userState = $state({ loading: true });
let userStatePromise = null;

const getUserFromSession = () => {
    if (userStatePromise) {
        return;
    }

    userStatePromise = userStatePromise || authClient.getSession();
    userStatePromise.then((session) => {
        if (session?.data?.user?.email) {
            userState = session?.data?.user;
        } else {
            userState = { email: null };
        }
    });
};

const useUserState = () => {
    if (import.meta.env.SSR) {
    } else if (!userState?.email) {
        getUserFromSession();
    }

    return {
        get loading() {
            return userState?.loading;
        },
        get email() {
            return userState?.email;
        },
    };
};

export { useUserState };
