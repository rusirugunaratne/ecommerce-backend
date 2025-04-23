import { Request, Response } from "express";
import { prismaClient } from "..";

export const createProduct = async (req: Request, res: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });

  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prismaClient.product.update({
    where: { id: Number(id) },
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prismaClient.product.delete({
    where: { id: Number(id) },
  });
  res.json(product);
};

export const getProducts = async (req: Request, res: Response) => {
  const products = await prismaClient.product.findMany({});
  res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prismaClient.product.findFirst({
    where: { id: Number(id) },
  });
  res.json(product);
};
