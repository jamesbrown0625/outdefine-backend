import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IInvoiceHistory, SequelizeAttributes } from "@interface";
import { getEnumField, ENUM_INVOICE_TYPE } from "@config";

const tableName = "invoices";

export default (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IInvoiceHistory> = {
    invoice_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    slug: { type: DataTypes.STRING },
    freelancer_id: { type: DataTypes.INTEGER },
    position: { type: DataTypes.STRING },
    company_id: { type: DataTypes.INTEGER },
    date_issued: { type: DataTypes.DATE },
    date_due: { type: DataTypes.DATE },
    date_received: { type: DataTypes.DATE },
    charges: { type: DataTypes.STRING },
    other_charges: { type: DataTypes.STRING },
    amount: { type: DataTypes.INTEGER },
    invoice_type: getEnumField(ENUM_INVOICE_TYPE, "invoice_type"),
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IInvoiceHistory
  }

  const InvoiceHistory: any = <MyModelStatic>sequelize.define(tableName, attributes);
  InvoiceHistory.associate = (models: any) => {
    InvoiceHistory.belongsTo(models.User, {
      as: "User",
      foreignKey: "freelancer_id",
    });
    InvoiceHistory.belongsTo(models.Company, {
      as: "Company",
      foreignKey: "company_id",
    });
    InvoiceHistory.belongsTo(models.FreelancerProfile, {
      as: "FreelancerProfile",
      foreignKey: "freelancer_id",
    });
  };

  return InvoiceHistory;
};
