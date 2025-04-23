// backend.js
import express from "express";
import cors from "cors";
import x from "./user-services.js"



const app = express();
const port = 8000;

// const users = {
//   users_list: [
//     {
//       id: "xyz789",
//       name: "Charlie",
//       job: "Janitor"
//     },
//     {
//       id: "abc123",
//       name: "Mac",
//       job: "Bouncer"
//     },
//     {
//       id: "ppp222",
//       name: "Mac",
//       job: "Professor"
//     },
//     {
//       id: "yat999",
//       name: "Dee",
//       job: "Aspring actress"
//     },
//     {
//       id: "zap555",
//       name: "Dennis",
//       job: "Bartender"
//     }
//   ]
// };

const generateID = (user) => {
  user.id = (Math.random() * 100).toString();
}

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByJob = (job) => {
  return users["users_list"].filter(
    (user) => user["job"] === job
  );
};

const findUserById = (id) => {
  return users["users_list"].find((user) => user["id"] === id);
}

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const removeUser = (id) => {
  users.users_list = users.users_list.filter((user) => user.id !== id);
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  x.getUsers(name, job)
    .then((users) => {
      res.send({users_list : users})
    })
    .catch((error) => {
      console.log(error);
      res.send("Error getting users");
    });
});

// app.get("/users", (req, res) => {
//   const name = req.query.name;
//   const job = req.query.job;
//   let result;
//   if ((name != undefined) && (job != undefined))
//   {
//     result = findUserByName(name);
//     result = findUserByJob(job);
//     result = { users_list: result };
//     res.send(result);
//   }
//   else if (name != undefined) {
//     result = findUserByName(name);
//     result = { users_list: result };
//     res.send(result);
//   } else {
//     res.send(users);
//   }
// });

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id

  x.findUserById(id)
    .then((user) => {
      if (user === undefined) {
        res.status(404).send("Resource not found.");
      }
      else {
        res.json({users_list : user});
      }
    })
    .catch((error) => {
      console.log(error);
    })
});

// app.get("/users/:id", (req, res) => {
//   const id = req.params["id"]; //or req.params.id
//   let result = findUserById(id);
//   if (result === undefined) {
//     res.status(404).send("Resource not found.");
//   } else {
//     res.send(result);
//   }
// });

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  x.addUser(userToAdd)
    .then((new_user) => {
      res.status(201).json(new_user);
    })
    .catch((error) => {
      console.log(error);
    })
});

// app.post("/users", (req, res) => {
//   const userToAdd = req.body;
//   generateID(userToAdd);
//   addUser(userToAdd);
//   res.status(201).json(userToAdd);
// });

app.delete("/users/:id", (req, res) => {
  const id = req.params.id; //or req.params.id

  x.findUserById(id)
    .then((user) => {
      if (user) {
        return user.deleteOne().then(() => {
          res.status(204).send("Deleted");
        });
      }
      else {
        res.status(404).send("Resource not found.");
      }
    })
    .catch((error) => {
      console.log(error);
    })
});

// app.delete("/users/:id", (req, res) => {
//   const id = req.params.id; //or req.params.id
//   const userToRemove = findUserById(id);
//   if (userToRemove === undefined)
//   {
//     res.status(404).send("Resource not found.");
//   }
//   else 
//   {
//     removeUser(id);
//     res.status(204).send();
//   }
// });

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

