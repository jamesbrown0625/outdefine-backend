import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { SequelizeAttributes } from "@interface";
import { ENUM_REVIEW_DIRECTION, getEnumField, sequelize } from "@config";
import { IReview } from "src/interface/contract";

const tableName = "contract_review";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IReview> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    contract_id: { type: DataTypes.INTEGER },
    company_id: { type: DataTypes.INTEGER },
    freelancer_id: {
      type: DataTypes.INTEGER,
    },
    direction: getEnumField(ENUM_REVIEW_DIRECTION, "direction"),
    reviewer_name: { type: DataTypes.STRING },
    company_name: { type: DataTypes.STRING },
    reviewer_role: { type: DataTypes.STRING },
    rating: { type: DataTypes.INTEGER },
    review: { type: DataTypes.TEXT },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IReview
  }

  const ContractReview: any = <MyModelStatic>sequelize.define(tableName, attributes);
  // ContractReview.associate = (models: any) => {}

  return ContractReview;
};

export const ContractReview = createDatabase(sequelize);
