import { Request, Response, Router } from 'express';
import * as bags from './controllers/bags';
import * as cuboids from './controllers/cuboids';

const router = Router();

router
  .get('/', (req: Request, res: Response) => res.send('Cuboids'))
  .get('/bags', bags.list)
  .get('/bags/:id', bags.get)
  .post('/bags', bags.create)
  .get('/cuboids', cuboids.list)
  .get('/cuboids/:id', cuboids.get)
  .patch('/cuboids/:id', cuboids.update)
  .delete('/cuboids/:id', cuboids.deleteCubo)
  .post('/cuboids', cuboids.create);

export default router;
