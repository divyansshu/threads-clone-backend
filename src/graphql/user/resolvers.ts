import userServices, { createUserPayload } from "../../services/userService";

const queries = {
    getUserToken: async (_: any, payload: { email: string, password: string }) => {
        const email = payload.email;
        const password = payload.password;
        const token = await userServices.getUserToken(email, password);
        return token;
    },
    getCurrentLoggedInUser: async (_:any, parameters: any, context: any) => {
        if(context && context.user) {
            const id = context.user.id;
            const user = await userServices.getUserById(id);
            return user;    
        }
        throw new Error("who are you");
    }
};
const mutations = {
    createUser: async (_: any, payload: createUserPayload) => {
        const res = await userServices.createUser(payload);
        return res.id;
    }
};

export const resolvers = { queries, mutations };