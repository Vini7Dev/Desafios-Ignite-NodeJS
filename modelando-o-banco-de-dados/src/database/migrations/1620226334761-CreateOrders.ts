import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateOrders1620226334761 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'gamesId',
            type: 'uuid'
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'quantity',
            type: 'numeric',
          },
          {
            name: 'created_at',
            type: 'timestamp',
          },
        ],
        foreignKeys: [
          {
            name: 'fk_orders_gamesId',
            columnNames: ['gamesId'],
            referencedTableName: 'gamse',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
          {
            name: 'fk_orders_userId',
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          }
        ]
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('orders');
    }
}
