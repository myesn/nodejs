'use strict';

const mongoose = require('mongoose');
const faker = require('faker');

async function connect() {
  mongoose.connection.once('open', () => console.log('connected'));
  mongoose.connection.on(
    'error',
    console.error.bind(console, 'connection error:')
  );

  return await mongoose.connect('mongodb://localhost/', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
}

function defineSchema(connection) {
  const { Schema } = mongoose;
  const { ObjectId } = Schema;

  const Person = new Schema({
    name: {
      first: String,
      last: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: {
        unique: true,
        sparse: true,
      },
    },
    account: {
      type: String,
      required: true,
      match: /[a-zA-Z0-9]/,
      minLength: 1,
      maxLength: 20,
      trim: true,
      index: {
        unique: true,
        sparse: true,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 8,
      trim: true,
    },
    age: { type: Number, required: true, min: 18, index: true },
    alive: Boolean,
    createdAt: { type: Date, required: true, default: new Date() },
  });

  const Comment = new Schema();

  Comment.add({
    title: {
      type: String,
      index: true,
    },
    date: Date,
    body: String,
    comments: [Comment],
  });

  const Post = new Schema({
    title: {
      type: String,
      index: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    date: Date,
    buf: Buffer,
    comments: [Comment],
    creator: ObjectId,
  });

  // accessing a specific schema type by key
  Post.path('date').default(() => new Date());
  Post.path('date').set((v) => (v === 'now' ? new Date() : v));

  // pre hook
  Post.pre('save', (next, done) => {
    emailAuthor(done);
    next();
  });

  // methods
  Post.methods.findCreator = (callback) => {
    return this.db.model('Person').findById(this.creator, callback);
  };

  Post.statics.findByTitle = (title, callback) => {
    return this.find({ title }, callback);
  };

  Post.methods.expressiveQuery = (creator, date, callback) => {
    return this.find('creator', creator).where('date').gte(date).run(callback);
  };

  // plugins
  function slugGenerator(options) {
    options = options || {};
    const key = options.key || 'title';

    return function slugGenerator(schema) {
      schema.path(key).set(function (v) {
        this.slug = v
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .replace(/-+/g, '');
        return v;
      });
    };
  }

  Post.plugin(slugGenerator());

  // define model
  connection.model('Post', Post);
  connection.model('Person', Person);
}

function emailAuthor(done) {
  console.log('emailAuthor', done);
}

async function addPerson(connection) {
  const Person = mongoose.model('Person');
  const person = new Person({
    name: {
      first: faker.name.firstName(),
      last: faker.name.lastName(),
    },
    email: faker.internet.email(),
    account: faker.internet.userName(),
    password: faker.internet.password(8),
    age: faker.datatype.number({
      min: 18,
      max: 100,
    }),
  });

  await person.save();
}

function loopAddPerson(loopTimes) {
  Array(loopTimes)
    .fill()
    .forEach(async (el, i) => {
      await addPerson();
      console.log(`person ${i + 1} created`);
    });
}

async function main() {
  const connection = await connect();

  defineSchema(connection);
  console.log('current defined schemas: ', connection.modelNames());

  // addPerson(connection);
  const loopTimes = faker.datatype.number();
  console.log(`${loopTimes} person will be created`);
  loopAddPerson(faker.datatype.number());
  console.log(`done`);
  // console.log('person saved');
}

main();
