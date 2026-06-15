import bcrypt from 'bcryptjs';

const users = [
  {
    id: "user-1",
    email: "john@example.com",
    password: bcrypt.hashSync("password123", 10),
    name: "John Doe"
  },
  {
    id: "user-2",
    email: "jane@example.com",
    password: bcrypt.hashSync("secure456", 10),
    name: "Jane Smith"
  },
  {
    id: "user-3",
    email: "admin@example.com",
    password: bcrypt.hashSync("admin789", 10),
    name: "Admin User"
  }
];

export const UserModel = {
  findByEmail: (email) => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findById: (id) => {
    return users.find(u => u.id === id) || null;
  },

  create: (userData) => {
    const newUser = {
      id: `user-${users.length + 1}`,
      email: userData.email,
      password: bcrypt.hashSync(userData.password, 10),
      name: userData.name || ""
    };
    users.push(newUser);
    return newUser;
  },

  findAll: () => {
    return [...users];
  }
};
