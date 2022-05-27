import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import User from '../db/users';
import logging from '../config/logging';

const loginUser = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req?.body;
    console.log('username', req?.body);
    if (name) {
        const user = User.getUser(name);
        if (user) {
            logging.info('User', `User ${name} logged in`);
            return res.status(200).json(user);
        } else {
            const user = User.addUser({ name: name, id: randomUUID() });
            logging.info('User', `User ${name} logged in`);
            return res.status(200).json(user);
        }
    }
};

export default { loginUser };
