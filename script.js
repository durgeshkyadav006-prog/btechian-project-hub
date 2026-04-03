import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBlS4LwzuO1uxCgph9y5ga2Q8yOOnXRrKA",
    authDomain: "btechian-project-hub.firebaseapp.com",
    projectId: "btechian-project-hub",
    storageBucket: "btechian-project-hub.appspot.com",
    messagingSenderId: "93247049291",
    appId: "1:93247049291:web:8142eba210cb221e42c7ce"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

window.addProject = async function () {
    let name = document.getElementById("projectName").value;
    let desc = document.getElementById("projectDesc").value;
    let fileInput = document.getElementById("projectImageFile");
    let file = fileInput.files[0];

    if(!name || !desc || !file){
        alert("Fill all fields and select an image");
        return;
    }

    // Upload image to Firebase Storage
    let storageRef = ref(storage, 'projects/' + file.name);
    await uploadBytes(storageRef, file);
    let imageUrl = await getDownloadURL(storageRef);

    // Save to Firestore
    await addDoc(collection(db, "projects"), {
        name: name,
        desc: desc,
        image: imageUrl
    });

    fileInput.value = '';
    document.getElementById("projectName").value = '';
    document.getElementById("projectDesc").value = '';

    displayProjects();
};

async function displayProjects(){
    let list = document.getElementById("projectList");
    list.innerHTML = "";
    const data = await getDocs(collection(db, "projects"));
    data.forEach((docSnap) => {
        let p = docSnap.data();
        let div = document.createElement("div");
        div.className = "project-card";
        div.innerHTML = `
            <img src="${p.image}" />
            <h3>${p.name}</h3>
            <p>${p.desc.substring(0,50)}...</p>
            <button onclick="deleteProject('${docSnap.id}', event)">Delete</button>
        `;
        div.addEventListener("click", e=>{
            if(e.target.tagName !== "BUTTON") openModal(p);
        });
        list.appendChild(div);
    });
}

window.deleteProject = async function(id, e){
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this project?")){
        await deleteDoc(doc(db, "projects", id));
        displayProjects();
    }
}

function openModal(p){
    document.getElementById("modalName").innerText = p.name;
    document.getElementById("modalImage").src = p.image;
    document.getElementById("modalDesc").innerText = p.desc;
    document.getElementById("modal").style.display = "flex";
}

window.closeModal = function(){
    document.getElementById("modal").style.display = "none";
}

displayProjects();
