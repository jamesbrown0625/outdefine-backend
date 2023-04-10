import { database } from './index'

const MockTable = database.define('mocked_table', [], {})
MockTable.findByPk = (query) => MockTable.findById(query)

export { MockTable }
