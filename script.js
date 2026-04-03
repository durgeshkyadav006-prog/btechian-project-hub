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

// ✅ Delete project function
window.deleteProject = async function(id) {
    if(confirm("Are you sure you want to delete this project?")) {
        const docRef = doc(db, "projects", id);
        await deleteDoc(docRef);
        displayProjects(); // list refresh
    }
};

// ✅ Add Project function
window.addProject = async function () {
    let name = document.getElementById("projectName").value.trim();
    let desc = document.getElementById("projectDesc").value.trim();
    let image = document.getElementById("projectImage").value.trim();

    if (!name || !desc || !image) {
        alert("Please fill all fields including image URL!");
        return;
    }

    await addDoc(collection(db, "projects"), {
        name: name,
        desc: desc,
        image: image
    });

    // Clear input fields after adding
    document.getElementById("projectName").value = "";
    document.getElementById("projectDesc").value = "";
    document.getElementById("projectImage").value = "";

    displayProjects();
};

// ✅ Display projects
async function displayProjects() {
    let list = document.getElementById("projectList");
    list.innerHTML = "";

    const data = await getDocs(collection(db, "projects"));

    data.forEach((doc) => {
        let p = doc.data();
        let id = doc.id;

        let div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";
        div.style.borderRadius = "5px";

        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <img src="${p.image}" width="200" style="display:block; margin-bottom:10px;">
            <button onclick="deleteProject('${id}')">Delete</button>
        `;

        list.appendChild(div);
    });
}

// Load data on page start
displayProjects();
