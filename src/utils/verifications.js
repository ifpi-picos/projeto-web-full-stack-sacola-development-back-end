import UserModel from "../models/user.js";


export async function verifyIfUserExists(id) {
    try {
        if (!id) throw new Error('Id não informado!');


        const user = await UserModel.findById(id);

        if (!user) throw new Error('Usuário não encontrado!');
        return !!user;
    } catch (error) {
        throw new Error(error.message);
    }
}