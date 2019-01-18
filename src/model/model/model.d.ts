import 'reflect-metadata';
import {Sequelize} from '../../sequelize/sequelize/sequelize';
import {FindOptions} from './build-count-create-find/find-options';
import * as Promise from 'bluebird';
import {
  AddScopeOptions,
  AggregateOptions,
  BulkCreateOptions,
  DestroyOptions,
  DropOptions,
  GetTableNameOptions,
  InstanceDestroyOptions,
  InstanceIncrementDecrementOptions,
  InstanceRestoreOptions,
  InstanceSaveOptions,
  InstanceSetOptions,
  InstanceUpdateOptions,
  RestoreOptions,
  SchemaOptions,
  ScopeOptions,
  SyncOptions,
  TruncateOptions,
  UpdateOptions,
  UpsertOptions,
  ValidationError
} from 'sequelize';
import {AssociationActionOptions} from "../../associations/shared/association-action-options";
import {BuildOptions} from "./build-count-create-find/build-options";
import {CreateOptions} from "./build-count-create-find/create-options";
import {FindOrInitializeOptions} from "./build-count-create-find/find-or-initialize-options";
import {FindCreateFindOptions} from "./build-count-create-find/find-create-find-options";
import {CountOptions} from './build-count-create-find/count-options';
import {ColumnOptions} from "../column/column-options/column-options";
import {FilteredModelAttributes} from '../shared/filtered-model-attributes';
import {ModelType} from './model-type';
import {Hooks} from '../../hooks/shared/hooks';
import {FilteredModelAttributeKeys} from '../shared/filtered-model-attribute-keys';
import {AssociationGetOptions} from './association/association-get-options';
import {AssociationCountOptions} from './association/association-count-options';
import {WhereOptions} from "./build-count-create-find/where-options";

/* tslint:disable:array-type */
/* tslint:disable:max-line-length */

/**
 * Based on "Model" and "Instance" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/sequelize/index.d.ts#L3671
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/sequelize/index.d.ts#L2791
 */

export declare abstract class Model<T extends Model<T>> extends Hooks {

  constructor(values?: FilteredModelAttributes<T>, options?: BuildOptions);

  /**
   * List of primary key attribute names
   */
  static primaryKeyAttributes: string[];

  /**
   * Primary key attribute name
   */
  static primaryKeyAttribute: string;

  /**
   * Hash map providing column options per attribute name
   */
  static attributes: { [key: string]: ColumnOptions };

  /**
   * Hash map providing column options per attribute name
   */
  static rawAttributes: { [key: string]: ColumnOptions };

  /**
   * Returns true if model is initialized
   */
  static isInitialized: boolean;

  /**
   * Hash map providing association options per association name
   */
  static associations?: { [key: string]: any };

  /**
   * Remove attribute from model definition
   *
   * @param attribute
   */
  static removeAttribute(attribute: string): void;

  /**
   * Sync this Model to the DB, that is create the table. Upon success, the callback will be called with the
   * model instance (this)
   */
  static sync(options?: SyncOptions): Promise<any>;

  /**
   * Drop the table represented by this Model
   *
   * @param options
   */
  static drop(options?: DropOptions): Promise<void>;

  /**
   * Apply a schema to this model. For postgres, this will actually place the schema in front of the table
   * name
   * - `"schema"."tableName"`, while the schema will be prepended to the table name for mysql and
   * sqlite - `'schema.tablename'`.
   *
   * @param schema The name of the schema
   * @param options
   */
  static schema<T extends Model<T>>(this: ModelType<T>, schema: string, options?: SchemaOptions): Model<T>;

  /**
   * Get the tablename of the model, taking schema into account. The method will return The name as a string
   * if the model has no schema, or an object with `tableName`, `schema` and `delimiter` properties.
   *
   * @param options The hash of options from any query. You can use one model to access tables with matching
   *     schemas by overriding `getTableName` and using custom key/values to alter the name of the table.
   *     (eg.
   *     subscribers_1, subscribers_2)
   * @param options.logging=false A function that gets executed while running the query to log the sql.
   */
  static getTableName(options?: GetTableNameOptions): string | Object;

  /**
   * Add a new scope to the model. This is especially useful for adding scopes with includes, when the model you want to include is not available at the time this model is defined.
   *
   * By default this will throw an error if a scope with that name already exists. Pass `override: true` in the options object to silence this error.
   *
   * @param {String}          name The name of the scope. Use `defaultScope` to override the default scope
   * @param {Object|Function} scope
   * @param {Object}          [options]
   * @param {Boolean}         [options.override=false]
   */
  static addScope<T extends Model<T>>(name: string, scope: FindOptions<T> | Function, options?: AddScopeOptions): void;

  /**
   * Apply a scope created in `define` to the model. First let's look at how to create scopes:
   * ```js
   * var Model = sequelize.define('model', attributes, {
   *   defaultScope: {
   *     where: {
   *       username: 'dan'
   *     },
   *     limit: 12
   *   },
   *   scopes: {
   *     isALie: {
   *       where: {
   *         stuff: 'cake'
   *       }
   *     },
   *     complexFunction: function(email, accessLevel) {
   *       return {
   *         where: {
   *           email: {
   *             $like: email
   *           },
   *           accesss_level {
   *             $gte: accessLevel
   *           }
   *         }
   *       }
   *     }
   *   }
   * })
   * ```
   * Now, since you defined a default scope, every time you do Model.find, the default scope is appended to
   * your query. Here's a couple of examples:
   * ```js
   * Model.findAll() // WHERE username = 'dan'
   * Model.findAll({ where: { age: { gt: 12 } } }) // WHERE age > 12 AND username = 'dan'
   * ```
   *
   * To invoke scope functions you can do:
   * ```js
   * Model.scope({ method: ['complexFunction' 'dan@sequelize.com', 42]}).findAll()
   * // WHERE email like 'dan@sequelize.com%' AND access_level >= 42
   * ```
   *
   * @return Model A reference to the model, with the scope(s) applied. Calling scope again on the returned
   *     model will clear the previous scope.
   */
  static scope<T extends Model<T>>(this: ModelType<T>, options?: string | string[] | ScopeOptions | WhereOptions<any>): ModelType<T>;
  static scope<T extends Model<T>>(this: ModelType<T>, ...scopes: (string | ScopeOptions | WhereOptions<any>)[]): ModelType<T>;

  /**
   * Search for multiple instances.
   *
   * __Simple search using AND and =__
   * ```js
   * Model.findAll({
   *   where: {
   *     attr1: 42,
   *     attr2: 'cake'
   *   }
   * })
   * ```
   * ```sql
   * WHERE attr1 = 42 AND attr2 = 'cake'
   * ```
   *
   * __Using greater than, less than etc.__
   * ```js
   *
   * Model.findAll({
   *   where: {
   *     attr1: {
   *       gt: 50
   *     },
   *     attr2: {
   *       lte: 45
   *     },
   *     attr3: {
   *       in: [1,2,3]
   *     },
   *     attr4: {
   *       ne: 5
   *     }
   *   }
   * })
   * ```
   * ```sql
   * WHERE attr1 > 50 AND attr2 <= 45 AND attr3 IN (1,2,3) AND attr4 != 5
   * ```
   * Possible options are: `$ne, $in, $not, $notIn, $gte, $gt, $lte, $lt, $like, $ilike/$iLike, $notLike,
   * $notILike, '..'/$between, '!..'/$notBetween, '&&'/$overlap, '@>'/$contains, '<@'/$contained`
   *
   * __Queries using OR__
   * ```js
   * Model.findAll({
   *   where: Sequelize.and(
   *     { name: 'a project' },
   *     Sequelize.or(
   *       { id: [1,2,3] },
   *       { id: { gt: 10 } }
   *     )
   *   )
   * })
   * ```
   * ```sql
   * WHERE name = 'a project' AND (id` IN (1,2,3) OR id > 10)
   * ```
   *
   * The success listener is called with an array of instances if the query succeeds.
   *
   * @see    {Sequelize#query}
   */
  static findAll<T extends Model<T>>(this: ModelType<T>, options?: FindOptions<T>): Promise<T[]>;

  static all<T extends Model<T>>(this: ModelType<T>, options?: FindOptions<T>): Promise<T[]>;

  /**
   * Search for a single instance by its primary key. This applies LIMIT 1, so the listener will
   * always be called with a single instance.
   */
  static findById<T extends Model<T>>(this: ModelType<T>, identifier?: number | string, options?: FindOptions<T>): Promise<T | null>;

  static findByPk<T extends Model<T>>(this: ModelType<T>, identifier?: number | string, options?: FindOptions<T>): Promise<T | null>;

  static findByPrimary<T extends Model<T>>(this: ModelType<T>, identifier?: number | string, options?: FindOptions<T>): Promise<T | null>;

  /**
   * Search for a single instance. This applies LIMIT 1, so the listener will always be called with a single
   * instance.
   */
  static findOne<T extends Model<T>>(this: ModelType<T>, options?: FindOptions<T>): Promise<T | null>;

  static find<T extends Model<T>>(this: ModelType<T>, options?: FindOptions<T>): Promise<T | null>;

  /**
   * Run an aggregation method on the specified field
   *
   * @param field The field to aggregate over. Can be a field name or *
   * @param aggregateFunction The function to use for aggregation, e.g. sum, max etc.
   * @param options Query options. See sequelize.query for full options
   * @return Returns the aggregate result cast to `options.dataType`, unless `options.plain` is false, in
   *     which case the complete data result is returned.
   */
  static aggregate<T extends Model<T>>(this: ModelType<T>, field: FilteredModelAttributeKeys<T> | '*', aggregateFunction: string, options?: AggregateOptions): Promise<Object>;

  /**
   * Count the number of records matching the provided where clause.
   *
   * If you provide an `include` option, the number of matching associations will be counted instead.
   */
  static count<T extends Model<T>>(this: ModelType<T>, options?: CountOptions<T>): Promise<number>;

  /**
   * Find all the rows matching your query, within a specified offset / limit, and get the total number of
   * rows matching your query. This is very usefull for paging
   *
   * ```js
   * Model.findAndCountAll({
   *   where: ...,
   *   limit: 12,
   *   offset: 12
   * }).then(function (result) {
   *   ...
   * })
   * ```
   * In the above example, `result.rows` will contain rows 13 through 24, while `result.count` will return
   * the
   * total number of rows that matched your query.
   *
   * When you add includes, only those which are required (either because they have a where clause, or
   * because
   * `required` is explicitly set to true on the include) will be added to the count part.
   *
   * Suppose you want to find all users who have a profile attached:
   * ```js
   * User.findAndCountAll({
   *   include: [
   *      { model: Profile, required: true}
   *   ],
   *   limit 3
   * });
   * ```
   * Because the include for `Profile` has `required` set it will result in an inner join, and only the users
   * who have a profile will be counted. If we remove `required` from the include, both users with and
   * without
   * profiles will be counted
   */
  static findAndCount<T extends Model<T>>(this: ModelType<T>, options?: FindOptions<T>): Promise<{ rows: T[], count: number }>;

  static findAndCountAll<T extends Model<T>>(this: ModelType<T>, options?: FindOptions<T>): Promise<{ rows: T[], count: number }>;

  /**
   * Find the maximum value of field
   */
  static max<T extends Model<T>>(this: ModelType<T>, field: FilteredModelAttributeKeys<T>, options?: AggregateOptions): Promise<any>;

  /**
   * Find the minimum value of field
   */
  static min<T extends Model<T>>(this: ModelType<T>, field: FilteredModelAttributeKeys<T>, options?: AggregateOptions): Promise<any>;

  /**
   * Find the sum of field
   */
  static sum<T extends Model<T>>(this: ModelType<T>, field: FilteredModelAttributeKeys<T>, options?: AggregateOptions): Promise<number>;

  /**
   * Builds a new model instance. Values is an object of key value pairs, must be defined but can be empty.
   */
  static build<T extends Model<T>>(this: ModelType<T>, record?: FilteredModelAttributes<T>, options?: BuildOptions): T;

  /**
   * Undocumented bulkBuild
   */
  static bulkBuild<T extends Model<T>>(this: ModelType<T>, records: FilteredModelAttributes<T>[], options?: BuildOptions): T[];

  /**
   * Builds a new model instance and calls save on it.
   */
  static create<T extends Model<T>>(this: ModelType<T>, values?: FilteredModelAttributes<T>, options?: CreateOptions): Promise<T>;

  /**
   * Find a row that matches the query, or build (but don't save) the row if none is found.
   * The successfull result of the promise will be (instance, initialized) - Make sure to use .spread()
   */
  static findOrInitialize<T extends Model<T>>(this: ModelType<T>, options: FindOrInitializeOptions<FilteredModelAttributes<T>>): Promise<[T, boolean]>;

  static findOrBuild<T extends Model<T>>(this: ModelType<T>, options: FindOrInitializeOptions<FilteredModelAttributes<T>>): Promise<[T, boolean]>;

  /**
   * Find a row that matches the query, or build and save the row if none is found
   * The successful result of the promise will be (instance, created) - Make sure to use .spread()
   *
   * If no transaction is passed in the `options` object, a new transaction will be created internally, to
   * prevent the race condition where a matching row is created by another connection after the find but
   * before the insert call. However, it is not always possible to handle this case in SQLite, specifically
   * if one transaction inserts and another tries to select before the first one has comitted. In this case,
   * an instance of sequelize.TimeoutError will be thrown instead. If a transaction is created, a savepoint
   * will be created instead, and any unique constraint violation will be handled internally.
   */
  static findOrCreate<T extends Model<T>>(this: ModelType<T>, options: FindOrInitializeOptions<FilteredModelAttributes<T>>): Promise<[T, boolean]>;

  /**
   * A more performant findOrCreate that will not work under a transaction (at least not in postgres)
   * Will execute a find call, if empty then attempt to create, if unique constraint then attempt to find again
   */
  static findCreateFind<T extends Model<T>>(this: ModelType<T>, options: FindCreateFindOptions<FilteredModelAttributes<T>>): Promise<[T, boolean]>;

  /**
   * Insert or update a single row. An update will be executed if a row which matches the supplied values on
   * either the primary key or a unique key is found. Note that the unique index must be defined in your
   * sequelize model and not just in the table. Otherwise you may experience a unique constraint violation,
   * because sequelize fails to identify the row that should be updated.
   *
   * **Implementation details:**
   *
   * * MySQL - Implemented as a single query `INSERT values ON DUPLICATE KEY UPDATE values`
   * * PostgreSQL - Implemented as a temporary function with exception handling: INSERT EXCEPTION WHEN
   *   unique_constraint UPDATE
   * * SQLite - Implemented as two queries `INSERT; UPDATE`. This means that the update is executed
   * regardless
   *   of whether the row already existed or not
   *
   * **Note** that SQLite returns undefined for created, no matter if the row was created or updated. This is
   * because SQLite always runs INSERT OR IGNORE + UPDATE, in a single query, so there is no way to know
   * whether the row was inserted or not.
   */
  static upsert<T extends Model<T>>(this: ModelType<T>, values: FilteredModelAttributes<T>, options?: UpsertOptions): Promise<boolean>;

  static insertOrUpdate<T extends Model<T>>(this: ModelType<T>, values: FilteredModelAttributes<T>, options?: UpsertOptions): Promise<boolean>;

  /**
   * Create and insert multiple instances in bulk.
   *
   * The success handler is passed an array of instances, but please notice that these may not completely
   * represent the state of the rows in the DB. This is because MySQL and SQLite do not make it easy to
   * obtain
   * back automatically generated IDs and other default values in a way that can be mapped to multiple
   * records. To obtain Instances for the newly created values, you will need to query for them again.
   *
   * @param records List of objects (key/value pairs) to create instances from
   */
  static bulkCreate<T extends Model<T>>(this: ModelType<T>, records: FilteredModelAttributes<T>[], options?: BulkCreateOptions): Promise<T[]>;

  /**
   * Truncate all instances of the model. This is a convenient method for Model.destroy({ truncate: true }).
   */
  static truncate(options?: TruncateOptions): Promise<void>;

  /**
   * Delete multiple instances, or set their deletedAt timestamp to the current time if `paranoid` is enabled.
   *
   * @return Promise<number> The number of destroyed rows
   */
  static destroy(options?: DestroyOptions): Promise<number>;

  /**
   * Restore multiple instances if `paranoid` is enabled.
   */
  static restore(options?: RestoreOptions): Promise<void>;

  /**
   * Increment the value of one or more columns. This is done in the database, which means it does not use the values currently stored on the Instance. The increment is done using a
   * ```sql
   * SET column = column + X WHERE foo = 'bar'
   * ```
   * query. To get the correct value after an increment into the Instance you should do a reload.
   *
   * ```js
   * Model.increment('number', { where: { foo: 'bar' }) // increment number by 1
   * Model.increment(['number', 'count'], { by: 2, where: { foo: 'bar' } }) // increment number and count by 2
   * Model.increment({ answer: 42, tries: -1}, { by: 2, where: { foo: 'bar' } }) // increment answer by 42, and decrement tries by 1.
   *                                                        // `by` is ignored, since each column has its own value
   * ```
   *
   * @param fields If a string is provided, that column is incremented by the value of `by` given in options.
   *               If an array is provided, the same is true for each column.
   *               If an object is provided, each column is incremented by the value given.
   */
  static increment<T extends Model<T>>(fields: FilteredModelAttributeKeys<T> | FilteredModelAttributeKeys<T>[] | Object,
                                       options?: InstanceIncrementDecrementOptions & { silent?: boolean }): Promise<[Array<T>, number]> | Promise<[number, void]>;

  /**
   * Update multiple instances that match the where options. The promise returns an array with one or two
   * elements. The first element is always the number of affected rows, while the second element is the actual
   * affected rows (only supported in postgres with `options.returning` true.)
   */
  static update<T extends Model<T>>(this: ModelType<T>, values: FilteredModelAttributes<T>, options: UpdateOptions): Promise<[number, Array<T>]>;

  /**
   * Run a describe query on the table. The result will be return to the listener as a hash of attributes and
   * their types.
   */
  static describe(): Promise<Object>;

  /**
   * Unscope the model
   */
  static unscoped<T extends Model<T>>(this: ModelType<T>): ModelType<T>;

  /**
   * A reference to the sequelize instance
   */
  static sequelize: Sequelize;


  dataValues: FilteredModelAttributes<this>;

  /**
   * Default id automatically created by sequelize
   */
  id?: number | any;

  /**
   * createdAt timestamps automatically created by sequelize if timestamps is true
   */
  createdAt?: Date | any;

  /**
   * updatedAt timestamps automatically created by sequelize if timestamps is true
   */
  updatedAt?: Date | any;

  /**
   * deletedAt timestamps automatically created by sequelize if paranoid is true
   */
  deletedAt?: Date | any;

  /**
   * version number automatically created by sequelize if table options.version is true
   */
  version?: number | any;

  /**
   * Returns true if this instance has not yet been persisted to the database
   */
  isNewRecord: boolean;

  /**
   * Returns the Model the instance was created from.
   *
   * @see Model
   */
  Model: Model<this>;

  /**
   * A reference to the sequelize instance
   */
  sequelize: Sequelize;

  /**
   * Adds relation between specified instances and source instance
   */
  $add<R extends Model<R>>(propertyKey: string, instances: R | R[] | string[] | string | number[] | number, options?: AssociationActionOptions): Promise<this>;

  /**
   * Sets relation between specified instances and source instance
   * (replaces old relations)
   */
  $set<R extends Model<R>>(propertyKey: string, instances: R | R[] | string[] | string | number[] | number, options?: AssociationActionOptions): Promise<this>;

  /**
   * Returns related instance (specified by propertyKey) of source instance
   */
  $get<R extends Model<R>>(propertyKey: string, options?: AssociationGetOptions<R>): Promise<R | R[]>;

  /**
   * Counts related instances (specified by propertyKey) of source instance
   */
  $count<R extends Model<R>>(propertyKey: string, options?: AssociationCountOptions<R>): Promise<number>;

  /**
   * Creates instances and relate them to source instance
   */
  $create<R extends Model<R>>(propertyKey: string, values: any, options?: AssociationActionOptions): Promise<R | this>; // TODO@robin seems to be an seq issue; shouldn't be R OR this, but only one of them

  /**
   * Checks if specified instances is related to source instance
   */
  $has<R extends Model<R>>(propertyKey: string, instances: R | R[] | string[] | string | number[] | number, options?: any): Promise<this>;

  /**
   * Removes specified instances from source instance
   */
  $remove<R extends Model<R>>(propertyKey: string, instances: R | R[] | string[] | string | number[] | number, options?: any): Promise<this>;


  /**
   * Get an object representing the query for this instance, use with `options.where`
   */
  where(): Object;

  /**
   * Get the value of the underlying data value
   */
  getDataValue(key: FilteredModelAttributeKeys<T>): any;

  /**
   * Update the underlying data value
   */
  setDataValue(key: FilteredModelAttributeKeys<T>, value: any): void;

  /**
   * If no key is given, returns all values of the instance, also invoking virtual getters.
   *
   * If key is given and a field or virtual getter is present for the key it will call that getter - else it
   * will return the value for key.
   *
   * @param options.plain If set to true, included instances will be returned as plain objects
   */
  get(key: FilteredModelAttributeKeys<this>, options?: { plain?: boolean, clone?: boolean }): any;
  get(options?: { plain?: boolean, clone?: boolean }): any;


  /**
   * Set is used to update values on the instance (the sequelize representation of the instance that is,
   * remember that nothing will be persisted before you actually call `save`). In its most basic form `set`
   * will update a value stored in the underlying `dataValues` object. However, if a custom setter function
   * is defined for the key, that function will be called instead. To bypass the setter, you can pass `raw:
   * true` in the options object.
   *
   * If set is called with an object, it will loop over the object, and call set recursively for each key,
   * value pair. If you set raw to true, the underlying dataValues will either be set directly to the object
   * passed, or used to extend dataValues, if dataValues already contain values.
   *
   * When set is called, the previous value of the field is stored and sets a changed flag(see `changed`).
   *
   * Set can also be used to build instances for associations, if you have values for those.
   * When using set with associations you need to make sure the property key matches the alias of the
   * association while also making sure that the proper include options have been set (from .build() or
   * .find())
   *
   * If called with a dot.seperated key on a JSON/JSONB attribute it will set the value nested and flag the
   * entire object as changed.
   *
   * @param options.raw If set to true, field and virtual setters will be ignored
   * @param options.reset Clear all previously set data values
   */
  set(key: FilteredModelAttributeKeys<this>, value: any, options?: InstanceSetOptions): this;
  set(keys: FilteredModelAttributes<this>, options?: InstanceSetOptions): this;

  setAttributes(key: FilteredModelAttributeKeys<this>, value: any, options?: InstanceSetOptions): this;
  setAttributes(keys: FilteredModelAttributes<this>, options?: InstanceSetOptions): this;

  /**
   * If changed is called with a string it will return a boolean indicating whether the value of that key in
   * `dataValues` is different from the value in `_previousDataValues`.
   *
   * If changed is called without an argument, it will return an array of keys that have changed.
   *
   * If changed is called without an argument and no keys have changed, it will return `false`.
   */
  changed(key: FilteredModelAttributeKeys<this>, value?: any): boolean;
  changed(): boolean | string[];

  /**
   * Returns the previous value for key from `_previousDataValues`.
   */
  previous(key: FilteredModelAttributeKeys<this>): any;

  /**
   * Validate this instance, and if the validation passes, persist it to the database.
   *
   * On success, the callback will be called with this instance. On validation error, the callback will be
   * called with an instance of `Sequelize.ValidationError`. This error will have a property for each of the
   * fields for which validation failed, with the error message for that field.
   */
  save(options?: InstanceSaveOptions): Promise<this>;

  /**
   * Refresh the current instance in-place, i.e. update the object with current data from the DB and return
   * the same object. This is different from doing a `find(Instance.id)`, because that would create and
   * return a new instance. With this method, all references to the Instance are updated with the new data
   * and no new objects are created.
   */
  reload(options?: FindOptions<this>): Promise<this>;

  /**
   * Validate the attribute of this instance according to validation rules set in the model definition.
   *
   * Emits null if and only if validation successful; otherwise an Error instance containing
   * { field name : [error msgs] } entries.
   *
   * @param options.skip An array of strings. All properties that are in this array will not be validated
   */
  validate(options?: { skip?: string[] }): Promise<ValidationError>;

  /**
   * This is the same as calling `set` and then calling `save`.
   */
  update(key: FilteredModelAttributeKeys<this>, value: any, options?: InstanceUpdateOptions): Promise<this>;
  update(keys: FilteredModelAttributes<this>, options?: InstanceUpdateOptions): Promise<this>;

  updateAttributes(key: FilteredModelAttributeKeys<this>, value: any, options?: InstanceUpdateOptions): Promise<this>;
  updateAttributes(keys: FilteredModelAttributes<this>, options?: InstanceUpdateOptions): Promise<this>;

  /**
   * Destroy the row corresponding to this instance. Depending on your setting for paranoid, the row will
   * either be completely deleted, or have its deletedAt timestamp set to the current time.
   */
  destroy(options?: InstanceDestroyOptions): Promise<void>;

  /**
   * Restore the row corresponding to this instance. Only available for paranoid models.
   */
  restore(options?: InstanceRestoreOptions): Promise<void>;

  /**
   * Increment the value of one or more columns. This is done in the database, which means it does not use
   * the values currently stored on the Instance. The increment is done using a
   * ```sql
   * SET column = column + X
   * ```
   * query. To get the correct value after an increment into the Instance you should do a reload.
   *
   * ```js
   * instance.increment('number') // increment number by 1
   * instance.increment(['number', 'count'], { by: 2 }) // increment number and count by 2
   * instance.increment({ answer: 42, tries: 1}, { by: 2 }) // increment answer by 42, and tries by 1.
   *                                                        // `by` is ignored, since each column has its own
   *                                                        // value
   * ```
   *
   * @param fields If a string is provided, that column is incremented by the value of `by` given in options.
   *               If an array is provided, the same is true for each column.
   *               If an object is provided, each column is incremented by the value given.
   */
  increment(fields: FilteredModelAttributeKeys<this> | FilteredModelAttributeKeys<this>[] | {[key: string]: number},
            options?: InstanceIncrementDecrementOptions & { silent?: boolean }): Promise<this>;

  /**
   * Decrement the value of one or more columns. This is done in the database, which means it does not use
   * the values currently stored on the Instance. The decrement is done using a
   * ```sql
   * SET column = column - X
   * ```
   * query. To get the correct value after an decrement into the Instance you should do a reload.
   *
   * ```js
   * instance.decrement('number') // decrement number by 1
   * instance.decrement(['number', 'count'], { by: 2 }) // decrement number and count by 2
   * instance.decrement({ answer: 42, tries: 1}, { by: 2 }) // decrement answer by 42, and tries by 1.
   *                                                        // `by` is ignored, since each column has its own
   *                                                        // value
   * ```
   *
   * @param fields If a string is provided, that column is decremented by the value of `by` given in options.
   *               If an array is provided, the same is true for each column.
   *               If an object is provided, each column is decremented by the value given
   */
  decrement(fields: FilteredModelAttributeKeys<this> | FilteredModelAttributeKeys<this>[] | {[key: string]: number},
            options?: InstanceIncrementDecrementOptions & { silent?: boolean }): Promise<this>;

  /**
   * Check whether all values of this and `other` Instance are the same
   */
  equals(other: Model<T>): boolean;

  /**
   * Check if this is eqaul to one of `others` by calling equals
   */
  equalsOneOf(others: Model<T>[]): boolean;

  /**
   * Convert the instance to a JSON representation. Proxies to calling `get` with no keys. This means get all
   * values gotten from the DB, and apply all custom getters.
   */
  toJSON(): any;

}
