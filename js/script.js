const apiURL = "https://64c9d8efb2980cec85c278b4.mockapi.io/users";
const tbody = document.querySelector("#tbody");
function closepopup(){
    const popup = document.getElementById("add-user-div");
    popup.classList.add("hide-add-user");
    popup.classList.remove("show-add-user")
}
function openpopup(){
    const popup = document.getElementById("add-user-div");
    popup.classList.remove("hide-add-user");
    popup.classList.add("show-add-user")
}
function fetchUsers() {
    fetch(apiURL)
      .then((response) => response.json())
      .then((data) => {
        tbody.innerHTML = "";
        data.forEach((user) => {
          createTableRow(user);
        });
      })
      .catch((error) => console.error("Error fetching users:", error));
  }
  
  function createTableRow(user) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.age}</td>
      <td>${user.state}</td>
      <td class="functions">
        <button class="editBtn" data-userid="${user.id}">Edit</button>
        <button class="deleteBtn" data-userid="${user.id}">Delete</button>
      </td>
    `;
  
    const editBtn = tr.querySelector(".editBtn");
    const deleteBtn = tr.querySelector(".deleteBtn");
  
    editBtn.addEventListener("click", () => editUser(user));
    deleteBtn.addEventListener("click", () => deleteUser(user));
  
    tbody.appendChild(tr);
  }

  function deleteUser(user) {
    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`${apiURL}/${user.id}`, {
        method: "DELETE",
      })
        .then(() => {
          fetchUsers();
        })
        .catch((error) => console.error("Error deleting user:", error));
    }
  }

const form = document.getElementById("add-user-form");


form.addEventListener("submit", function (e) {
  e.preventDefault();
  
  const name = document.getElementById("new-name")
  const age = document.getElementById("new-age")
  const state = document.getElementById("new-state")
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log(this.responseText);
      fetchUsers();
        }
    };
    xhttp.open(
        "POST",
        apiURL,
        true
        );
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(
          JSON.stringify({
            name: name.value,
            age: age.value,
            state: state.value,
          })
        );
            fetchUsers()
            closepopup();
 
  name.value = "";
  age.value = null;
  state.value = null;
});
  
function editUser(user){

  const row = document.querySelector(`[data-userid="${user.id}"]`).parentNode.parentNode;
   const nameCell = row.querySelector("td:nth-child(1)");
   const ageCell = row.querySelector("td:nth-child(2)");
   const stateCell = row.querySelector("td:nth-child(3)");


   nameCell.dataset.originalValue = nameCell.textContent;
   ageCell.dataset.originalValue = ageCell.textContent;
   stateCell.dataset.originalValue = stateCell.textContent;

   nameCell.innerHTML = `<input type="text" id="updateName" value="${user.name}">`;
   ageCell.innerHTML = `<input type="number" id="updateAge" value="${user.age}">`;
   stateCell.innerHTML = `<input type="text" id="updateState" value="${user.state}">`;

   const inputs = row.querySelectorAll("input");
   inputs.forEach((input) => {
     input.addEventListener("keyup", (e) => {
       if (e.key === "Enter") {
         saveChanges(user, row);
      console.log(row)
       }
     });
   });
}
function saveChanges(user, tr) {
  const name = tr.querySelector("#updateName").value;
  const age = tr.querySelector("#updateAge").value;
  const state = tr.querySelector("#updateState").value;

  const updatedUser = {
    name,
    age,
    state,
  };

  fetch(`${apiURL}/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  })
    .then(() => {
      fetchUsers();
    })
    .catch((error) => console.error("Error updating user:", error));
console.log(tr)
}
