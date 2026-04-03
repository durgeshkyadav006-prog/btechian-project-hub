// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBlS4LwzuO1uxCgph9y5ga2Q8yOOnXRrKA",
  authDomain: "btechian-project-hub.firebaseapp.com",
  projectId: "btechian-project-hub",
  storageBucket: "btechian-project-hub.firebasestorage.app",
  messagingSenderId: "93247049291",
  appId: "1:93247049291:web:8142eba210cb221e42c7ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Updated function with image
window.addProject = async function () {
    let name = document.getElementById("projectName").value;
    let desc = document.getElementById("projectDesc").value;
    let image = document.getElementById("projectImage").value;

    if (!name || !desc || !image) {
        alert("Fill all fields");
        return;
    }

    await addDoc(collection(db, "projects"), {
        name: name,
        desc: desc,
        image: image
    });

    displayProjects();
};

// Show data
async function displayProjects() {
    let list = document.getElementById("projectList");
    list.innerHTML = "";

    const data = await getDocs(collection(db, "projects"));

    data.forEach((doc) => {
        let p = doc.data();

        let div = document.createElement("div");
        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <img src="${p.image}" width="200">
        `;

        list.appendChild(div);
    });
}

// Load data on start
displayProjects();
