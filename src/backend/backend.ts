import express from "express";
import cors from "cors";
import { sequelize } from "./database";
import registrosRoutes from "./routes/registros.routes";
import { iniciarAgendamentoDeBoletos } from "./jobs/agendador";

const app = express();
const PORTA = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

app.use("/registros", registrosRoutes);

async function iniciarServidor(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("✓ Conexão com o banco de dados estabelecida.");

    await sequelize.sync({ alter: true });
    console.log("✓ Banco de dados sincronizado.");

    iniciarAgendamentoDeBoletos();

    app.listen(PORTA, () => {
      console.log(`✓ Servidor rodando na porta ${PORTA}`);
      console.log(`  Acesse: http://localhost:${PORTA}`);
    });
  } catch (error) {
    console.error("✕ Erro ao iniciar o servidor:", error);
  }
}

iniciarServidor();
