const { User ,Role } = require("../db/index.js");
const bcrypt = require("bcryptjs");

exports.addEmployee = async (req, res) => {
    try {
      const { Login, Email, Password } = req.body;  //Extraction des donnees de la requete
      console.log(Login, Email, Password);
      // Verifier si le role "employee" existe
      const role = await Role.findOne({ where: { RoleName: "employee" } });
      if (!role) {
        return res.status(404).json({ message: "Role 'employee' not found." });
      }

      // Verifier si l'email existe deja
      const existingUser = await User.findOne({ where: { Email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Creer l'employe
      const employee = await User.create({
        Login: Login,
        Email: Email,
        Password: hashedPassword,
        RoleId: role.RoleId,
      });

      res.status(201).json({ message: "Employee successfully created", employee });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }

  }

  // addAdmin
  exports.addAdmin= async (req, res) => {
    try {
      const { Login, Email, Password } = req.body; // Extraction des donnees de la requete
  
      // Verifier si le role "admin" existe
      const role = await Role.findOne({ where: { RoleName: "admin" } });
      if (!role) {
        return res.status(404).json({ message: "Role 'admin' not found." });
      }
  
      // Verifier si l'email existe deja
      const existingUser = await User.findOne({ where: { Email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
  
      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(Password, 10);
  
      // Creer l'administrateur
      const admin = await User.create({
        Login: Login,
        Email: Email,
        Password: hashedPassword,
        RoleId: role.RoleId,
      });
  
      res.status(201).json({ message: "Admin successfully created", admin });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  // Authentifier l'utilisateur sans utiliser de token
  exports.authenticateUser=async (req, res) => {
    try {
      const { Email, Password } = req.body;  //extrait l'Email et le Password envoyes par l'employe dans la requete

      // Trouver l'utilisateur par email
      const user = await User.findOne({ where: { Email }, include: Role });   //demande d'inclure toutes les informations du role associe
      if (!user) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Verifier le mot de passe

      const isPasswordValid = await bcrypt.compare(Password, user.Password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      res.status(200).json({ message: "Authentication successful", user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },




  // Authentifier un administrateur
  exports.authenticateAdmin=async (req, res) => {
    try {
      const { Email, Password } = req.body; // Extraction des donnees de la requete
      
      // Trouver l'utilisateur par email
      const user = await User.findOne({ where: { Email }, include: Role }); // Inclure les informations du role associe
      if (!user) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Verifier si l'utilisateur a le role "admin"
      if (user.Role.RoleName !== "admin") {
        return res.status(403).json({ message: "Access denied: Not an admin" });
      }

      // Verifier le mot de passe
      const isPasswordValid = await bcrypt.compare(Password, user.Password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      res.status(200).json({ message: "Admin authentication successful", user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };










