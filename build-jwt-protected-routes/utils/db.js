import path from "path";
import fs from "fs";

const FILE = path.join(import.meta.dirname, "../data/users.json");

export const readUsers = () => {
    const data = fs.readFileSync(FILE, "utf-8").trim();
    if (!data) return [];

    return JSON.parse(data);
}

export const writeUsers = (users) => {
    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

export const findByEmail = (email) => {
    const users = readUsers();
    return users.find(user => user.email === email) || null;
}

export const findById = (id) => {
    const users = readUsers();
    return users.find(user => user.id === id) || null;
}