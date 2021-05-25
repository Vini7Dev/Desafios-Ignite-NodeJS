import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export default class StatementsAddSenderIdAndFK1621950386594 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn('statements', new TableColumn({
        name: 'sender_id',
        type: 'uuid',
        isNullable: true,
      }));

      await queryRunner.createForeignKey('statements', new TableForeignKey({
        name: 'fk_statements_sender_id',
        columnNames: ['sender_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('statements', 'fk_statements_sender_id');

      await queryRunner.dropColumn('statements', 'sender_id');
    }
}
