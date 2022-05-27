interface User {
    id: string;
    name: string;
}
const users: User[] = [];

const getUsers = (): User[] => {
    return users;
};

const getUser = (name: string): User | undefined => {
    return users.find((user) => user.name === name);
};

const addUser = (user: User): User | undefined => {
    if (getUser(user.name)) return;
    users.push(user);
    return user;
};

export default {
    getUsers,
    getUser,
    addUser
};
