import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { Id } from 'objection';
import { Capacity } from '../errors/Capacity';
import { Cuboid } from '../models';

export const list = async (req: Request, res: Response): Promise<Response> => {
  
  try {
    const cuboids = await Cuboid.query()
      .where({})
      .withGraphFetched('bag');

    return res.status(HttpStatus.OK).json(cuboids);
  } catch (error) {
    console.error('GET_ALL_ERROR', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
  }

  
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const cuboid = await Cuboid.query()
      .findById(id);

    if (cuboid) {
      return res.status(HttpStatus.OK).send({ ...cuboid }); 
    } else {
      return res.status(HttpStatus.NOT_FOUND).send({}); 
    }

  } catch (error) {
    console.error('GET_ERROR', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
  }
}
  

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { width, height, depth, bagId } = req.body;

  try {
    const cuboid = await Cuboid.query().insert({
      width,
      height,
      depth,
      bagId,
    });
  
    return res.status(HttpStatus.CREATED).json(cuboid); 
  } catch (error) {
    console.error('CREATE_ERROR', error);
    // if (typeof error === 'Capacity') {
    //   return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({}); 
    // }
    return res.status(HttpStatus.CREATED).json({}); 
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;

  try {
    const cuboid = await Cuboid.query()
      .findById(id).update(req.body);
    
      const updated = await Cuboid.query()
      .findById(id).withGraphFetched('bag');
    return res.status(HttpStatus.OK).json(updated);
  } catch (error) {
    console.error('UPDATE_ERROR', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
  }
  
};

export const deleteCubo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;

  try {
    const cuboid = await Cuboid.query()
      .findById(id);

      if (cuboid) {
        await Cuboid.query().findById(id).del()
        return res.status(HttpStatus.OK).json({});
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({});
      }
    
  } catch (error) {
    console.error('DELETE_ERROR', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
  }
  
};


