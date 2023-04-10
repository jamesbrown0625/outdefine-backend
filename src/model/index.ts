import { sequelize } from "@config";
import UserFactory from "./user";
import InvoiceHistoryFactory from "./invoice/history";
import JobTypeFactory from "./job_type";
import RoleFactory from "./role";
import SkillFactory from "./skill";
import TalentReferralFactory from "./token/referral";
import TalentReferralHistoryFactory from "./token/referral_history";
import FreelancerRewardFactory from "./token/reward";
import FreelancerWalletFactory from "./token/wallet";
import * as models from "./models";

const db = {
  sequelize,
  User: UserFactory(sequelize),

  ...models,

  // Global Tables
  JobType: JobTypeFactory(sequelize),
  Role: RoleFactory(sequelize),
  Skill: SkillFactory(sequelize),

  // Token Tables
  TalentReferral: TalentReferralFactory(sequelize),
  TalentReferralHistory: TalentReferralHistoryFactory(sequelize),
  FreelancerReward: FreelancerRewardFactory(sequelize),
  FreelancerWallet: FreelancerWalletFactory(sequelize),

  // Invoice
  InvoiceHistory: InvoiceHistoryFactory(sequelize),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const initTables = async (param) => {
  await db.User.sync(param);

  // Global Tables
  await db.JobType.sync(param);
  await db.Role.sync(param);
  await db.Skill.sync(param);

  // Token Tables
  await db.TalentReferral.sync(param);
  await db.TalentReferralHistory.sync(param);
  await db.FreelancerReward.sync(param);
  await db.FreelancerWallet.sync(param);

  const keys = Object.keys(models);
  for (let i = 0; i < keys.length; i++) await db[keys[i]].sync(param);

  // Invoice
  await db.InvoiceHistory.sync(param);

  await db.MSAAgreement.sync(param);
};

const getDB = async () => {
  return db;
};

const getSyncedDB = async () => {
  const param = { alter: true };
  await initTables(param);

  return db;
};

const getClearedDB = async () => {
  const param = { force: true };
  await initTables(param);

  return db;
};

const getSequelize = async () => {
  return sequelize;
};

export { getDB, getSyncedDB, getClearedDB, getSequelize };
