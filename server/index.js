const Hapi = require('hapi');
const pg = require('pg');
const conString = require('./postgres.config');

const client = new pg.Client(conString);
const server = new Hapi.Server();

const port = process.env.PORT || 3000;

server.connection({ port, host: 'localhost', routes: { cors: true } });
client.connect();

server.route({
  method: 'GET',
  path: '/get/{owner}',
  handler(request, reply) {
    return client.query(`SELECT todo FROM todos WHERE owner='${request.params.owner}'`, (GetErr, result) => {
      if (GetErr) {
        return console.error('error running query', GetErr);
      }
      return reply(result.rows);
    });
  },
});
server.route({
  method: 'POST',
  path: '/post/{todo*2}',
  handler(request, reply) {
    const todoInfo = request.params.todo.split('/');
    const owner = todoInfo[1];
    const todo = todoInfo[0];
    return client.query(`INSERT INTO todos (owner, todo) VALUES('${owner}', '${todo}')`, (PostErr, result) => {
      if (PostErr) {
        return console.error('error running query', PostErr);
      }
      return reply(result);
    });
  },
});
server.route({
  method: 'DELETE',
  path: '/delete/{todo}',
  handler(request, reply) {
    return client.query(`DELETE FROM todos WHERE todo='${request.params.todo}'`, (DelErr, result) => {
      if (DelErr) {
        return console.error('error running query', DelErr);
      }
      return reply(result);
    });
  },
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
