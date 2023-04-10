import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IMSAAgreement, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "msa_agreements";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IMSAAgreement> = {
    msa_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    msa_version: { type: DataTypes.STRING },
    s3_url: { type: DataTypes.STRING },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IMSAAgreement
  }

  const MSAAgreement: any = <MyModelStatic>sequelize.define(tableName, attributes);

  return MSAAgreement;
};

export const MSAAgreement = createDatabase(sequelize);
