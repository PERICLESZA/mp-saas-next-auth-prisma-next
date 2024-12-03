"use server";

import db from "@/lib/db";
import { hashSync } from "bcrypt-ts";

export default async function registerAction(_prevState: any, formData: FormData) {
  try {
    // Convertendo os dados do FormData para um objeto
    const entries = Array.from(formData.entries());
    const data = Object.fromEntries(entries) as {
      name: string;
      email: string;
      password: string;
      login: string;
    };

    // Validação básica
    if (!data.name || !data.email || !data.password || !data.login) {
      return {
        message: "Preencha todos os campos",
        success: false,
      };
    }

    // Verificação de duplicidade no banco de dados
    const existingUser = await db.login.findFirst({
      where: {
        OR: [
          { email: data.email },
          { login: data.login },
        ],
      },
    });

    if (existingUser) {
      return {
        message: `Usuário já existe: ${existingUser.login}`,
        success: false,
      };
    }

    // Tentativa de inserir no banco de dados
    await db.login.create({
      data: {
        login: data.login,
        email: data.email,
        nome: data.name,
        senha: hashSync(data.password),
      },
    });
    console.log('usuário cadastrado com sucesso!')
    return {
      message: "Usuário cadastrado com sucesso!",
      success: true,
    };
  } catch (error: any) {
    console.error("Erro ao inserir registro:", error.message || error);
    return {
      message: error.message || "Erro desconhecido",
      success: false,
    };
  }
}
