import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { ICompanyServiceAgreement, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "company_service_agreement";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<ICompanyServiceAgreement> = {
    company_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    signed_by: { type: DataTypes.INTEGER },
    agreed: { type: DataTypes.BOOLEAN },
    authorized: { type: DataTypes.BOOLEAN },
    msa_id: { type: DataTypes.INTEGER },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ICompanyServiceAgreement
  }

  const CompanyServiceAgreement: any = <MyModelStatic>sequelize.define(tableName, attributes);
  CompanyServiceAgreement.associate = (models: any) => {
    CompanyServiceAgreement.belongsTo(models.Company, { foreignKey: "company_id" });
  };

  return CompanyServiceAgreement;
};

export const CompanyServiceAgreement = createDatabase(sequelize);
