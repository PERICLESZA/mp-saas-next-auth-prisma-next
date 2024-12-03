import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials'
import { findUserByCredentials } from "./lib/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
      email:{},
      password: {},
      },
      authorize: async (credentials) => {

        const email = credentials?.email ?? "";
        const password = credentials?.password ?? "";

        //lógica de autenticação
        // procura usuário com credenciais
        const user = await findUserByCredentials(
          credentials.email as string, 
          credentials.password as string)
        //se não autenticado retorn null
        //se autenticado, retorna user
        return user;
      }
    })
  ],
});
