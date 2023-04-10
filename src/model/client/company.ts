import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { ICompanyDetail, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "company_lists";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<ICompanyDetail> = {
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    recruitcrm_slug: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    industry: { type: DataTypes.STRING },
    stage: { type: DataTypes.STRING },
    number_of_employees: { type: DataTypes.STRING },
    number_of_open_roles: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    phone_number: { type: DataTypes.STRING },
    summary: { type: DataTypes.TEXT },
    remote_first: { type: DataTypes.BOOLEAN },

    logo: { type: DataTypes.STRING },
    logo_number: { type: DataTypes.INTEGER },
    logo_type: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    banner: { type: DataTypes.STRING },
    banner_number: { type: DataTypes.INTEGER },
    banner_type: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ICompanyDetail
  }

  const Company: any = <MyModelStatic>sequelize.define(tableName, attributes);
  Company.associate = (models: any) => {
    Company.hasOne(models.CompanySocialLink, {
      as: "CompanySocialLink",
      foreignKey: "company_id",
    });
    Company.hasOne(models.CompanyServiceAgreement, {
      as: "CompanyServiceAgreement",
      foreignKey: "company_id",
    });
    Company.hasMany(models.Contract, { as: "JobsContract", foreignKey: "company_id" });
    Company.hasMany(models.ClientProfile, {
      foreignKey: "company_id",
    });
    Company.hasMany(models.InvoiceHistory, {
      foreignKey: "company_id",
    });
    Company.hasOne(models.JobPosting, { foreignKey: "company_id" });
  };

  return Company;
};

export const Company = createDatabase(sequelize);
