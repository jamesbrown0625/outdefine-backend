## How to add/update a field to database

To add or update a field, you'll need to do following.

1. Add the field in interface

```
For example;

In file src/interface/IRole.ts, add a field new_field as following.

export interface IRole {
  role_id?: number;
  job_type_id?: number;
  name?: string;
  new_field?: string;
}
```

2. Add the new property to model as well.

```
For example;

In file src/model/role.ts, add a new property new_field as following.

const attributes: SequelizeAttributes<IRole> = {
  role_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  job_type_id: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING(64) },
  new_field: { type: DataTypes.STRING(64) },
}

```

3. Update database by calling table_sync api.

```
GET http://localhost:3000/dev/outdefine/table_sync
```

4. If it returns 200 status code with success message, it means database is updated
