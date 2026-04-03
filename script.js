// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

// Delete project function
window.deleteProject = async function(id) {
    if(confirm("Are you sure you want to delete this project?")) {
        const docRef = doc(db, "projects", id);
        await deleteDoc(docRef);
        displayProjects();
    }
};

// Add Project function
window.addProject = async function () {
    const name = document.getElementById("projectName").value.trim();
    const desc = document.getElementById("projectDesc").value.trim();
    const image = document.getElementById("projectImage").value.trim();

    if (!name || !desc || !image) {
        alert("Please fill all fields including image URL!");
        return;
    }

    await addDoc(collection(db, "projects"), {
        name: name,
        desc: desc,
        image: image
    });

    // Clear inputs after adding
    document.getElementById("projectName").value = "";
    document.getElementById("projectDesc").value = "";
    document.getElementById("projectImage").value = "";

    displayProjects();
};

// Display all projects
async function displayProjects() {
    const list = document.getElementById("projectList");
    list.innerHTML = "";

    const data = await getDocs(collection(db, "projects"));

    data.forEach((docItem) => {
        const p = docItem.data();
        const id = docItem.id;

        const div = document.createElement("div");
        div.className = "project-card";

        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <button onclick="deleteProject('${id}')">Delete</button>
        `;

        list.appendChild(div);
    });
}

// Load projects on page start
displayProjects();
