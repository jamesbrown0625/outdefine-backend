import SequelizeMock from 'sequelize-mock'

const database = new SequelizeMock()

export { database }

export * from './mockTable'
