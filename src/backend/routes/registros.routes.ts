import { Router, Request, Response } from "express";
import { sequelize } from "../database";
import { Registro } from "../models/Registro.model";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    const registros = await Registro.findAll();
    res.json(registros);
  } catch (error: any) {
    console.error("Erro ao buscar registros:", error);

    const erroConexao =
      error.name === "SequelizeConnectionError" ||
      error.name === "SequelizeConnectionRefusedError";

    if (erroConexao) {
      console.warn("Banco de dados indisponível. Retornando array vazio.");
      res.json([]);
    } else {
      res.status(500).json({
        message: "Erro ao buscar registros.",
        error: error.message,
      });
    }
  }
});

router.get("/:nomeBanco", async (req: Request, res: Response) => {
  try {
    const { nomeBanco } = req.params;

    const registros = await Registro.findAll({
      where: { nome_banco: nomeBanco },
    });

    if (registros.length === 0) {
      res.status(404).json({
        message: `Nenhum registro encontrado para o banco: ${nomeBanco}`,
      });
      return;
    }

    res.json(registros);
  } catch (error) {
    console.error("Erro ao buscar registros do banco:", error);
    res.status(500).json({
      message: "Erro ao buscar registros do banco.",
    });
  }
});

export default router;

