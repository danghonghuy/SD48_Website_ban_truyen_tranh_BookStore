function cleartext() {
  (document.getElementById("usernameinput").value = ""),
    (document.getElementById("passwordinput").value = "");
}
async function Register() {
  const data = {
    username: document.getElementById("usernameinput").value.trim(),
    Password: document.getElementById("passwordinput").value.trim(),
  };
  try {
    const res = await callApi("User/login", data);
    if (res.status == "Error") {
      Toastify({
        text: res.message,
        duration: 3500,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #ef9f9f, #e20808)",
        },
      }).showToast();
      cleartext();
    } else {
      Toastify({
        text: res.message,
        duration: 3500,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      localStorage.setItem("accessToken", res.data.accessTken);

      if (res.data.roleName.includes("Admin")) {
        //navigate dashboa
        window.location.href = "./dashboard.html";
      }
    }
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 2500,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: false, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #ef9f9f, #e20808)",
      },
    }).showToast();

    //chuyen huong
  }
}
