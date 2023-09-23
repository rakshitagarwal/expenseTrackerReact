function myfunc(event) {
  event.preventDefault();

  const amount = document.getElementById("amount").value;
  const etype = document.getElementById("etype").value;
  const cat = document.getElementById("cat").value;

  localStorage.setItem("amount", amount);
  localStorage.setItem("etype", etype);
  localStorage.setItem("cat", cat);

  localStorage.getItem("amount", amount);
  localStorage.getItem("etype", etype);
  localStorage.getItem("cat", cat);

  const obj = {
    amount,
    etype,
    cat,
  };

  localStorage.setItem(obj.etype, JSON.stringify(obj));
  showuseronscreen(obj);
}

function showuseronscreen(obj) {
  const parentele = document.getElementById("listofitems");

  const childele = document.createElement("li");
  childele.textContent = obj.amount + "-" + obj.etype + "-" + obj.cat;

  //parentele.innerHTML = parentele.innerHTML + '<li>${obj.name} - ${obj.email}</li>';

  const deletebtn = document.createElement("input");
  deletebtn.type = "button";
  deletebtn.value = "Delete";
  deletebtn.onclick = () => {
    localStorage.removeItem(obj.etype);
    parentele.removeChild(childele);
  };

  const editbtn = document.createElement("input");
  editbtn.type = "button";
  editbtn.value = "Edit";
  editbtn.onclick = () => {
    localStorage.removeItem(obj.email);
    parentele.removeChild(childele);
    document.getElementById("amount").value = obj.amount;
    document.getElementById("etype").value = obj.etype;
  };

  childele.appendChild(deletebtn);
  childele.appendChild(editbtn);
  parentele.appendChild(childele);
}
