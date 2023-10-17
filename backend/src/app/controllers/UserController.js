const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class UserController {
  
  static async register (req,res) {
    const { name, email, phone, password, confirmPassword } = req.body;
    
    // validações
    if (!name) return res.status(422).json({message: 'O nome é obrogatório!'});
    if (!email) return res.status(422).json({message: 'O email é obrigatório!'});
    if (!password) return res.status(422).json({message: 'A senha é obrigatória!'});
    if (!confirmPassword) return res.status(422).json({message: 'A confirmação de senha é obrigatória!'});
    if (!phone) return res.status(422).json({message: 'O telefone é obrogatório!'});

    // verificar se `password` e `confirmPassword` são idênticas
    if (password !== confirmPassword) return res.status(422).json({ message: 'A senha e a confirmação de senha devem ser iguais!' });

    // verifica se o usuário ja existe
    const userExists = await User.findOne({ email: email });
    if (userExists)return res.status(422).json({ message: 'Este email já está em uso, por favor utilize outro!' });

    // cria a senha criptografada com o `bcrypt`
    const salt = await bcrypt.genSalt(11);
    const passwordHash = await bcrypt.hash(password, salt);

    // cria o objeto do usuário
    const user = new User ({
      name,
      email,
      phone,
      password: passwordHash
    });

    try {
      const newUser = await user.save();
      createUserToken ( newUser, req, res);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }

  static async login (req, res) {
    const { email, password } = req.body;

    // validações
    if (!email) return res.status(422).json({ message: 'O email é obrigatório! '});
    if (!password) return res.status(422).json({ message: 'A senha é obrigatória!'});

    // verificar se o usuário realmente existe
    const user = await User.findOne({ email: email});
    if (!user) return res.status(422).json({ message: 'Usuário não existe, crie uma conta primeiro!'});

    // verifica se a senha coincide com a senha do banco de dados
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(422).json({ message: 'Senha inválida!' });

    createUserToken(user, req, res);
  }

  static async checkUser (req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "tccpostos");

      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select('-password');

    if (!user) return res.status(422).json({ message: 'Usuário não existe, crie uma conta primeiro!'});

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const id = req.params.id;

    // verifica se o usuário existe
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmPassword } = req.body;

    if (!email) return res.status(422).json({ message: 'O email é obrigatório! '});

    // verifica se email já está em uso
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) return res.status(422).json({message: 'Por favor, utilize outro email!'});
    user.email = email;

    //validações
    if (!name) return res.status(422).json({ message: 'O nome é obrigatório! '});
    user.name = name;

    if (!phone) return res.status(422).json({ message: 'O telefone é obrigatório! '});
    user.phone = phone;

    if (password != confirmPassword) return res.status(422).json({ message: "As senhas não coincidem!" });
    else if (password === confirmPassword && password != null) {
      // criando nova senha
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }

    try {
      // retorna os dados aualizados do user
      await User.findOneAndUpdate(
        {_id: user.id},
        {$set: user},
        {new: true},
      );

      res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
}