import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IWebhookEventLog, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "hackerearth_webhook_event_logs";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IWebhookEventLog> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    webhook_event_id: { type: DataTypes.STRING },
    webhook_event_type: { type: DataTypes.STRING },
    webhook_attempt_number: { type: DataTypes.INTEGER },
    webhook_payload: { type: DataTypes.TEXT },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IWebhookEventLog
  }

  const AssessmentWebhookEventLogs: any = <MyModelStatic>sequelize.define(tableName, attributes);
  // AssessmentWebhookEventLogs.associate = (models: any) => {
  // }

  return AssessmentWebhookEventLogs;
};

export const AssessmentWebhookEventLogs = createDatabase(sequelize);
