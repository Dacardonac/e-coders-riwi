// (function () { // guardian 
//     const userOnline = localStorage.getItem('userOnline')

//     if(userOnline === null) {
//         window.location.href="/"
//     } else {
//         console.log(userOnline);
//     }
// })()

const btnLogout = document.getElementById('btn-logout');

btnLogout.addEventListener('click', () => {
    localStorage.removeItem("userOnline");
    window.location.href = "/";

});

function getData() {
    let res = JSON.parse(localStorage.getItem('userOnline'));
    console.log(res);
};

getData();

async function getCoders(options) {
    const skills = options.coderSkills;
    const coderCore = options.coderCore;
    const URLCODERS = "http://localhost:3000/authCoders";
    const coderCoreParam = (!coderCore || coderCore === 'All') ? '' : `?coderCore=${coderCore}`; // Cuando tiene ! al principio significa un NO y evalua si esta vacio, null o undefined
    const coderSkillsParam = !skills ? '' : `?coderSkills_like=${skills}`
    // Forma la URl que me hace el llamado a la API que trae la info de la base de datos
    const response = await fetch(`${URLCODERS}${coderCoreParam}${coderSkillsParam}`);
    return await response.json();
};

// Funcion de filtrado
async function createCards(options) {
    document.getElementById("products").replaceChildren(); // Limpia las cards
    const coders = await getCoders(options);
    // Proceso de creación de las cards
    for (let coder of coders) {

        // Card
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <article class="container">
                <figure class="card-img">
                    <img src="${coder.userImage}" alt="Image coder">
                </figure>
                <h5 class="name card-title">${coder.coderName.charAt(0).toUpperCase() + coder.coderName.slice(1).toLowerCase() + " " + coder.coderLastName.charAt(0).toUpperCase() + coder.coderLastName.slice(1).toLowerCase()}</h5>
                <h6 class="core card-subtitle">${coder.coderCore.charAt(0).toUpperCase() + coder.coderCore.slice(1).toLowerCase()}</h6>
                <p class="skills">${coder.coderSkills.join(" - ")}</p>
                <hr class="card-divider">
                <div class="card-footer">
                    <button class="card-btn">Get in touch</button>
                </div>
            </article>
        `;
        document.getElementById("products").appendChild(card);
    };

};

const buttons = document.querySelectorAll(".button-tag");

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const filterText = button.innerText;
        createCards({ coderCore: filterText });
        setActiveBtn(filterText);
    });
});

// Funcion para botones activos o inactivos
function setActiveBtn(tag) {
    buttons.forEach((button) => {
        if (tag.toUpperCase() == button.innerText.toUpperCase()) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        };
    });
};

// Escucha del botón de búsqueda
document.getElementById('search').addEventListener('click', () => {
    const getSkills = document.getElementById('search-input').value;
    createCards({ coderSkills: getSkills });
});

// Escucha de la tecla 'Enter' en el campo de entrada
document.getElementById('search-input').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const getSkills = event.target.value;
        createCards({ coderSkills: getSkills });
    }
});

setActiveBtn('All');
createCards({ coderCore: 'All' });