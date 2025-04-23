// backend.js
import express from "express";
import cors from "cors";
import x from "./user-services.js"



const app = express();
const port = 8000;

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


app.delete("/users/:id", (req, res) => {
  const id = req.params.id; //or req.params.id

  x.findUserById(id)
    .then((user) => {
      if (user) {
        return user.deleteOne().then(() => {
          res.status(204).send();
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


app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

