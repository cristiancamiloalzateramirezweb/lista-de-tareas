const formulario = document.getElementById("formulario");
const input = document.getElementById("input");
const listaTarea = document.getElementById("lista-tareas");
const template = document.getElementById("template").content;
const fragment = document.createDocumentFragment();
const fecha = document.querySelector(".fecha");

const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString("es-CO", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
});

/* let tareas = {
    1629402838263: {
        id: 1629402838263,
        texto: 'Tarea 1',
        estado: false
    }
} */

let tareas = {};

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("tareas")) {
        tareas = JSON.parse(localStorage.getItem("tareas"));
    }
    pintarTareas();
});

listaTarea.addEventListener("click", (e) => {
    btnAccion(e);
});

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    setTarea(e);
});

const setTarea = (e) => {
    if (input.value.trim() === "") {
        console.log("esta vacio");
        return;
    }
    const tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false,
    };
    tareas[tarea.id] = tarea;
    console.log(tareas);
    formulario.reset();
    pintarTareas();
};

const pintarTareas = () => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
    if (Object.values(tareas).length === 0) {
        listaTarea.innerHTML = `
        <div class="alerta">
            No hay tareas pendientes 😍
        </div>
        `
        return
    }
    listaTarea.innerHTML = "";
    let i = 1;
    Object.values(tareas).forEach((tarea) => {
        const clone = template.cloneNode(true);
        clone.querySelector("h2").textContent = "Tarea " + i;
        clone.querySelector("p").textContent = tarea.texto;
        if (tarea.estado) {
            clone.querySelector(".tareas").classList.replace("tareas", "tareas2");
            clone.querySelectorAll(".fas")[0].classList.replace("fa-check-circle", "fa-undo-alt").style;
            clone.querySelector("p").style.textDecoration = "line-through";
        }
        clone.querySelectorAll(".fas")[0].dataset.id = tarea.id;
        clone.querySelectorAll(".fas")[1].dataset.id = tarea.id;
        fragment.appendChild(clone);
        i++;
    });
    listaTarea.appendChild(fragment);
};

const btnAccion = (e) => {
    if (e.target.classList.contains("fa-check-circle")) {
        tareas[e.target.dataset.id].estado = true;
        pintarTareas();
    }
    if (e.target.classList.contains("fa-minus-circle")) {
        delete tareas[e.target.dataset.id];
        pintarTareas();
    }
    if (e.target.classList.contains("fa-undo-alt")) {
        tareas[e.target.dataset.id].estado = false;
        pintarTareas();
    }
    e.stopPropagation();
};
