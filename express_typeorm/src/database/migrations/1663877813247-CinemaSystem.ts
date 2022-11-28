import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CinemaSystem1663877813247 implements MigrationInterface {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I dont want to configure the seating for every show
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          { name: 'role', type: 'integer', default: true},
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    
    await queryRunner.createTable(
      new Table({
        name: 'movies',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'title', type: 'varchar' },
          { name: 'isActive', type: 'boolean', default: true},
          { name: 'releaseDate', type: 'timestamp'},
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'slots',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'start_dt',
            type: 'timestamp',
          },
          {
            name: 'end_dt',
            type: 'timestamp',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'showrooms',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'movie_slots',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'movieId', type: 'integer' },
          { name: 'slotId', type: 'integer' },
          { name: 'showroomId', type: 'integer' },
          {
            name: 'isBooked',
            type: 'boolean'
          }
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'movie_slots',
      new TableForeignKey({
        columnNames: ['movieId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'movies',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'movie_slots',
      new TableForeignKey({
        columnNames: ['slotId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'slots',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'movie_slots',
      new TableForeignKey({
        columnNames: ['showroomId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'showrooms',
        onDelete: 'CASCADE',
      }),
    );

    

    await queryRunner.createTable(
      new Table({
        name: 'seat_price',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'seatType', type: 'varchar' },
          { name: 'FareType', type: 'varchar' },
          { name: 'price', type: 'integer'},
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'seats',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'totalSeats', type: 'integer' },
          { name: 'bookedSeats', type: 'integer' },
          { name: 'seatPriceId', type: 'integer' },
          { name: 'movieSlotsId', type: 'integer'},
          { name: 'seatNumber', type: 'integer' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'seats',
      new TableForeignKey({
        columnNames: ['seatPriceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'seat_price',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'seats',
      new TableForeignKey({
        columnNames: ['movieSlotsId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'movie_slots',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'booking',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'userId', type: 'integer' },
          { name: 'movieSlotsId', type: 'integer' },
          { name: 'seatId', type: 'integer' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'booking',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'booking',
      new TableForeignKey({
        columnNames: ['movieSlotsId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'movie_slots',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'booking',
      new TableForeignKey({
        columnNames: ['seatId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'seats',
        onDelete: 'CASCADE',
      }),
    );

  }
  

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('booking');
    await queryRunner.dropTable('seats');
    await queryRunner.dropTable('seat_price');
    await queryRunner.dropTable('movie_slots');
    await queryRunner.dropTable('showrooms');
    await queryRunner.dropTable('slots');
    await queryRunner.dropTable('movies');
    await queryRunner.dropTable('users');
  }
}
