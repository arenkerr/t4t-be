# t4t-be

t4t is a social platform for the trans community to share information, resources, and mutual aid.

## Run

```shell
yarn
yarn start
```

## More info

- [Database design](https://lucid.app/lucidchart/6f39e43d-3782-4c6e-80e4-c69a7fff49f5/edit?viewport_loc=154%2C131%2C2485%2C1231%2C0_0&invitationId=inv_36f318d6-ad31-49d9-af15-b63ab7a2542d)
- [Frontend](https://github.com/arenkerr/t4t-fe)

## Create a new migration

```
sequelize-cli model:generate --name [table name] --attributes column:type
```

## Regenerate types from gql schema

```
yarn types
```
