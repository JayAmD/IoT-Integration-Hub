import { Router } from "express";

const deviceRouter = Router();

deviceRouter.get('/', (req, res) => res.send('GET all devices'));

deviceRouter.get('/:id', (req, res) => res.send(`GET device details`));

deviceRouter.post('/', (req, res) => res.send('CREATE new device'));

deviceRouter.put('/:id', (req, res) => res.send(`UPDATE device details`));

deviceRouter.delete('/:id', (req, res) => res.send(`DELETE device`));

export default deviceRouter;