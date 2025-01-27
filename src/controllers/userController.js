const { User ,Role } = require("../db/index.js");
const bcrypt = require("bcryptjs");

exports.createRole = async (req, res) => {
  try {
    const { RoleName } = req.body;

    // Check if RoleName is provided
    if (!RoleName) {
      return res.status(400).json({ message: "RoleName is required" });
    }

    // Create the new role
    const newRole = await Role.create({
      RoleName,
    });

    // Return the created role
    res.status(201).json({ message: "Role created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating role" });
  }
};

exports.addEmployee = async (req, res) => {
    try {
      const { Login, Email, Password } = req.body;  //Extraction des donnees de la requete

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

      res.status(201).json({ message: "Employee successfully created" });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }

  }

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
  
      res.status(201).json({ message: "Admin successfully created" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  exports.addSupportTeam = async (req, res) => {
    try {
      const { Login, Email, Password } = req.body; // Extraction des données de la requête
  
      // Vérifier si le rôle "support team" existe
      const role = await Role.findOne({ where: { RoleName: "support team" } });
      if (!role) {
        return res.status(404).json({ message: "Role 'support team' not found." });
      }
  
      // Vérifier si l'email existe déjà
      const existingUser = await User.findOne({ where: { Email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
  
      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(Password, 10);
  
      // Créer le membre de l'équipe de support
      const supportTeamMember = await User.create({
        Login: Login,
        Email: Email,
        Password: hashedPassword,
        RoleId: role.RoleId,
      });
  
      res.status(201).json({ message: "Support team member successfully created" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  

  // Authentifier l'utilisateur sans utiliser de token
  exports.login = async (req, res) => {
    try {
      const { Email, Password } = req.body;
  
      // Find the user by email 
      const user = await User.findOne({ where: { Email } });
  
      if (!user) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(Password, user.Password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const role = await Role.findOne({
        where: { RoleId: user.RoleId }, // Use the RoleId from the user to get the RoleName
        attributes: ['RoleName'], // Only fetch RoleName
      });

      // Send a response with only the required fields
      const UserInfo = {
        UserId: user.UserId,
        Login: user.Login,
        Email: user.Email,
        RoleName: role.RoleName , // RoleName might be null if no associated role is found
      };
  
      res.status(200).json({ message: "Authentication successful", user: UserInfo });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
 
  exports.deleteById=async (req, res) => {
    try {
      
      const { UserId } = req.params;  //extrait l'Email et le Password envoyes par l'employe dans la requete

      // Trouver l'utilisateur par email

      const user = await User.findOne({ where: { UserId  } });   //demande d'inclure toutes les informations du role associe
      if (user) {
        await User.destroy({ where: { UserId  } });
        res.status(200).json({ message: "User has been deleted" });   
      }
      else{
        return res.status(404).json({ message: "User not found" });
      }
      
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  exports.getAllUsers = async (req, res) => {
    try {
      // Fetch all users
      const users = await User.findAll();
  
      if (users.length > 0) {
        // Use map to iterate through users and fetch their roles
        const usersInfo = await Promise.all(users.map(async (user) => {
          // Fetch the role based on the RoleId of the user
          const role = await Role.findOne({
            where: { RoleId: user.RoleId }, // Use the RoleId from the user to get the RoleName
            attributes: ['RoleName'], // Fetch only RoleName
          });
  
          return {
            UserId: user.UserId,
            Login: user.Login,
            Email: user.Email,
            RoleName: role.RoleName , 
          };
        }));
  
        // Send the response with the users' info
        return res.status(200).json({ message: "All Users", users: usersInfo });

      } else {
        return res.status(404).json({ message: "No users found in the database" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  

  exports.updateUser = async (req, res) => {
    try {
      const { UserId } = req.params; // Extract UserId from the request parameters
      const { Login, Email, Password } = req.body; // Extract updated data from the request body
  
      // Find the user by UserId
      const user = await User.findOne({ where: { UserId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if email is being updated and already in use
      if (Email && Email !== user.Email) {
        const existingUser = await User.findOne({ where: { Email } });
        if (existingUser) {
          return res.status(400).json({ message: "Email is already in use" });
        }
      }
  
      // Hash the new password if provided
      let hashedPassword = user.Password;
      if (Password) {
        hashedPassword = await bcrypt.hash(Password, 10);
      }
  
      // Update the user details
      await user.update({
        Login: Login || user.Login,
        Email: Email || user.Email,
        Password: hashedPassword,
      });
  
      res.status(200).json({ message: "User successfully updated" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
  




 










