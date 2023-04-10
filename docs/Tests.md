## Unit tests

Configuring Jest.config file : 
1. Always configute collectCoverage and collectCoverageFrom
2. In future, also configure coverageThreshold with specific value like say 80% to ensure test coverage never drops below the threshold

Run entire test suite:
npm test

Debug a specific test file:
1. Initiate Debug terminal
2. Run command : node '/relative_path/node_modules/jest/bin/jest.js' '/relative_path/filename.test.ts'

Known Issue : 
1. Coverage configuration is giving Error: Process completed with exit code 1 error in git workflow steps. Reverted the configuration.