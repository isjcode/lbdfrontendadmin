import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {nanoid} from "nanoid";

import { useLocation, useSearchParams, useNavigate} from "react-router-dom";

// Data

function PersonUpdate() {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newProfessionID, setNewProfessionID] = useState(-1);
  const [selectedImage, setSelectedImage] = useState(null);


  const [professions, setProfessions] = useState([]);

  const token = localStorage.getItem("token");
  const myHeaders = new Headers();
  myHeaders.append('Authorization', "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    fetch("http://destroyer123-001-site1.btempurl.com/api/admin/Professions/GetAll", {
      headers: myHeaders,
    })
      .then((response) => response.json())
      .then((d) => {
        console.log(d);
        setProfessions(d);
        setNewProfessionID(d[0].ID);
      });
  }, []);

  const handleName = (e) => {
    setNewName(e.target.value);
  };
  const handleDescription = (e) => {
    setNewDescription(e.target.value);
  };

  const handleSelect = (e) => {
    const id = professions.find(a => a.Name === e.target.value).ID;
    setNewProfessionID(id);
  };

  useEffect(() => {
    console.log(newProfessionID);
  }, [newProfessionID])

  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 
  const id = searchParams.get("id");


  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim().length !== 0 && newDescription.trim().length !== 0) {
      const formData = new FormData();
      if (newProfessionID == -1) {
        setNewProfessionID(professions[0].ID);
      }

      formData.append("File", selectedImage);
      formData.append("Name", newName);
      formData.append("Description", newDescription);
      formData.append("ProfessionID", newProfessionID);
      formData.append("id", id);
      const options = {
        method: "POST",
        body: formData,
        header: myHeaders,
      };
      axios({
        method: "POST",
        url: `http://destroyer123-001-site1.btempurl.com/api/admin/People/Update?id=${id}`,
        // url: `http://localhost:64531/api/admin/People/Update?id=${id}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" ,
                   "Authorization": "Bearer " + token,
      },
      })
        .then(function (response) {
          //handle success
          navigate("/tables");
          console.log(response);
        })
        .catch(function (response) {
        //handle error
        console.log(response);
      });

    }
  };
  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit}>
        <div>
          <label value="Name" htmlFor="new-name"> Name </label> 
          <input id="new-name" onChange={handleName} value={newName}  placeholder="New name." /> 
        </div>
        <div>
          <label value="Description" htmlFor="new-description"> Description </label> 
          <input id="new-description" onChange={handleDescription} value={newDescription} />
        </div>
        <div>
          <label> Image 
              <input onChange={(event) => {
                console.log(event.target.files[0]);
                setSelectedImage(event.target.files[0]);
              }}
                type="file" name="myImage" accept="image/jpeg" />
          </label>
        </div>
        <div>
           <label htmlFor="professions">Choose a profession:</label>
            <select onChange={handleSelect} value={newProfessionID} id="professions" name="professions">
              {professions.map(p => <option key={nanoid()} data-lid={p.ID} value={p.Name}> {p.Name} </option>)}
            </select> 
          </div>
        <button> update </button>
      </form>
    </DashboardLayout>
  );
}

export default PersonUpdate;