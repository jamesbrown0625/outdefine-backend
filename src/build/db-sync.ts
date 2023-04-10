
import db = require ("src/model/index");
import config = require("src/config/stage");

async function syncDB() {
  try {
    console.log(`Running db sync for ${config.getStage()} environment`);
    await db.getSyncedDB();
    console.log(`Successfully completed db sync in ${config.getStage()} environment`);
  }
  catch (err) {
    console.log(`Error Occured Syncing DB for ${config.getStage()} with error::${JSON.stringify(err)}`);
    process.exit(1);
  }
}

syncDB();
