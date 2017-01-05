const fs = require('fs');
// const Project = require('./lib/models/project');
// const Task = require('./lib/models/task');
// const Project = require('./lib/models/project');
const User = require('./lib/models/user');
const connection = require('./lib/setup-mongoose');

// const users = JSON.parse(fs.readFileSync('sample.users.json'));
// const tasks = JSON.parse(fs.readFileSync('sample.tasks.json'));
const users = JSON.parse(fs.readFileSync('sample.data.json'));

// console.log('Loaded ', users.length, ' users');
// users.forEach((user) => {
//   console.log(user);
// });
// console.log('Loaded ', tasks.length, ' tasks');
// tasks.forEach((task) => {
//   console.log(task);
// });

const drop = () => connection.db.dropDatabase(loadstuff);

if (connection.readyState === 1) drop();
else {
  connection.on('open', drop);
}

// const old_loadstuff = () => {
//   Promise.all(
//     users.map((user) => {
//       console.log('Saving user ', user);
//       const newuser = new User(user);
//       newuser.generateHash(user.password);
//       return newuser.save();
//     })
//   )
//   .then(() => {
//     // console.log('Done with users, moving on to tasks...');
//     // console.log('tasks = ', tasks);
//     Promise.all(
//       tasks.map((task) => {
//         // console.log('task.user ', task.user);
//         return User.findOne({ username: task.user })
//           .then((user) => {
//             // console.log('user ', user);
//             task.userId = user._id;
//             return new Task(task).save();
//           })
//           .catch(err => {
//             console.log('err ', err.message);
//           });
//       })
//     )
//     .then(() => {
//       process.exit(0);
//     })
//     .catch(err => {
//       console.log('err ', err.message);
//     });
//   });
// };

const loadstuff = () => {
  Promise.all(
    users.map((user) => {
      console.log('Saving user ', user.username);
      const newuser = new User({ username: user.username, password: user.password, email: user.email });
      newuser.generateHash(user.password);
      return newuser.save();
    })
  )
  .then(() => {
    users.forEach((user) => {
      projects.map(() => {
        
      })
    });
    // Add the toplevel projects
    return Promise.all(
      tasks.map((task) => {
        return User.findOne({ username: task.user })
          .then((user) => {
            task.userId = user._id;
            return new Task(task).save();
          })
          .catch(err => {
            console.log('err ', err.message);
          });
      })
    );
  })
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.log('err ', err.message);
  });
};