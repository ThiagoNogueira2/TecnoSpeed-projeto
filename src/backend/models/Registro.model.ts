import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";

export class Registro extends Model {
  public id!: number;
  public nome_banco!: string;
  public tempo!: number;
  public erro!: string | null;
  public codigo!: string;
  public disparado_em!: Date;
  public statusBanco!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Registro.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome_banco: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tempo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    erro: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    disparado_em: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    statusBanco: {
      type: DataTypes.ENUM("online", "offline"),
      allowNull: false,
      defaultValue: "offline",
    },
  },
  {
    sequelize,
    tableName: "registros",
    schema: "public",
    modelName: "Registro",
  }
);

