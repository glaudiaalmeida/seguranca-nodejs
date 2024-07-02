const database = require('../models');
const Sequelize = require('sequelize');

const permissoesRoles = (listaPermissoes) => {
    return async (req, res, next) => {
        const { usuarioId } = req;
        const usuario = await database.usuarios.findOne({
            include: [
                {
                    model: database.permissoes,
                    as: 'usuario_permissoes',
                    attributes: ['id', 'nome']
                }
            ],
            where: {
                id: usuarioId
            }
        });
        if (!usuario) {
            throw new Error('Usuário informado não cadastrado!')
        }

        let listaRolesId = [];

        Object.values(usuario.usuario_roles).map((role) => {
            listaRolesId.push(role.id);
        });

        if (listaRolesId.length == 0) {
            return res.status(401).send('Usuário não autorizado para esta funcionalidade')
        }

        const roles = await database.roles.findAll({
            include: [
                {
                    model: database.permissoes,
                    as: 'role_das_permissoes',
                    attributes: ['id', 'nome']
                }
            ],
            where: {
                id: {
                    [Sequelize.Op.in]: listaRolesId
                }
            }
        });

        let possuiPermissao = false;

        roles.map((role) => {
            possuiPermissao = role.roles_das_permissoes
            .map((permissao) => permissao.nome)
            .some((permissao) => listaPermissoes.includes(permissao))
        });

        if (!possuiPermissao) {
            return res.status(401).send('Usuário não autorizado para esta funcionalidade')
        }

        return next();
    }
};

module.exports = permissoesRoles;

