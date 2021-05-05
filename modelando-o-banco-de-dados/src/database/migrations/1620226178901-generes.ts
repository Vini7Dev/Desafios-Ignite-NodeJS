import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class generes1620226178901 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'generes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'gamesId',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          }
        ],
        foreignKeys: [
          {
            name: 'fk_generes_gamesId',
            columnNames: ['gamesId'],
            referencedTableName: 'games',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }
        ]
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('generes');
    }
}
