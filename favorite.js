const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const friendList = JSON.parse(localStorage.getItem('friendList')) || []

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
      <div class="card m-2" style="width: 10rem;">
        <div><i class="fa-solid fa-star follow-star checked" data-starid="${item.id}"></i></div>
        <img src="${item.avatar}" class="card-img-top rounded-circle avatar" alt="User avatar" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
        <h6 class="card-title d-flex justify-content-center">${item.name}</h6>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

function showUserModal(id) {
  const modalTitle = document.querySelector("#user-modal-title");
  const modalGender = document.querySelector("#user-modal-gender");
  const modalBirthday = document.querySelector("#user-modal-birthday");
  const modalAge = document.querySelector("#user-modal-age");
  const modalRegion = document.querySelector("#user-modal-region");
  const modalEmail = document.querySelector("#user-modal-email");
  const modalAvatar = document.querySelector("#user-modal-avatar");

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data;
      modalTitle.innerText = data.name + " " + data.surname;
      modalGender.innerText = "Gender: " + data.gender;
      modalBirthday.innerText = "Birthday: " + data.birthday;
      modalAge.innerText = "Age: " + data.age;
      modalRegion.innerText = "Region: " + data.region;
      modalEmail.innerText = "Email: " + data.email;
      modalAvatar.innerHTML = `<img src="${data.avatar}" alt="user-avatar" class="img-fluid">`;
    })
    .catch((err) => console.log(err));
}

function removeFromFavorite(id) {
  if (!friendList || !friendList.length) return
  const friendIndex = friendList.findIndex((user) => user.id === id)
  if (friendIndex === -1) return
  friendList.splice(friendIndex, 1)
  localStorage.setItem('friendList', JSON.stringify(friendList))
  renderUserList(friendList)
  return alert('This user has been removed from your friend list!')
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.classList.contains('checked')) {
    removeFromFavorite(Number(event.target.dataset.starid))
  } else if (event.target.matches(".avatar")) {
    showUserModal(Number(event.target.dataset.id));
  }
});
renderUserList(friendList)