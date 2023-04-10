import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IAssessmentTestBank, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "assessment_test_bank";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IAssessmentTestBank> = {
    test_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    start_datetime: { type: DataTypes.STRING },
    creation_datetime: { type: DataTypes.STRING },
    end_datetime: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    slug: { type: DataTypes.STRING },
    duration: { type: DataTypes.INTEGER },
    cutoff_score: { type: DataTypes.INTEGER },
    problem_types_data: { type: DataTypes.STRING },
    practice_test_slug: { type: DataTypes.STRING },
    job_type: { type: DataTypes.INTEGER },
    role: { type: DataTypes.INTEGER },
    mcq_or_coding: { type: DataTypes.STRING, defaultValue: "mcq" },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IAssessmentTestBank;
  };

  const AssessmentTestBank: any = <MyModelStatic>sequelize.define(tableName, attributes);
  AssessmentTestBank.associate = (models: any) => {
    AssessmentTestBank.hasOne(models.JobType, { as: "JobType", foreignKey: "job_type" });
    AssessmentTestBank.hasOne(models.Role, { as: "Role", foreignKey: "role" });
    // AssessmentTestBank.hasMany(models.HackerearthReport, {
    //   as: 'HackerearthReport',
    //   foreignKey: 'test_id',
    // })
  };

  return AssessmentTestBank;
};

export const AssessmentTestBank = createDatabase(sequelize);
