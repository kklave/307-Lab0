// src/MyApp.jsx

import React, {useState, useEffect} from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  // function removeOneCharacter(index) {
  //   const updated = characters.filter((character, i) => {
  //     return i !== index;
  //   });
  //   setCharacters(updated);
  // }

  function removeOneCharacter(index) {
    const userToDeleteID = characters[index].id;
  
    const promise = fetch(`http://localhost:8000/users/${userToDeleteID}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.status === 204) 
        {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        } 
        else if (res.status === 404) 
        {
          console.error("Resource not found.");
        } 
      })
      .catch((error) => {
        console.log(error);
      });

      return promise;
  }


  function updateList(person) { 
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          //setCharacters([...characters, person]);
          return res.json();
        } 
        else {
          console.log("Not 201");
        }
      })
      .then((json) => {
        setCharacters([...characters, json]);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />    
      </div>
  );
}


export default MyApp;