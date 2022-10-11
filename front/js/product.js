function getItems() {
    return fetch("http://localhost:3000/api/products") // Récupération des données de l'API
        .then(reponse => reponse.json()) // Permet de lire les données au format JSON
        .catch(err => alert(err))
}

function getID() {
    let url = window.location.search; // Récupération de la partie search de l'URL
    let params = new URLSearchParams(url);
    let id = params.get('id') 
    return id // On isole et retourne l'id de la page actuelle
}

async function displayProduct() {
    let data = await getItems();
    let id = getID(); // Récupération de l'id de la page actuelle


    data.forEach(element => {                   // Pour chaque élément de l'array data ...
        if(element._id == id) {                 // Si l'id de l'URL == l'id produit dans la boucle alors on affiche

        // Création de la balise <img>
        let image = document.createElement("img");
        image.src = element.imageUrl;
        image.alt = element.altTxt
        
        // Remplissage de la balise <h1>
        let title = document.getElementById("title");
        title.innerHTML = element.name;

        // Remplissage du prix
        let price = document.getElementById("price");
        price.innerHTML = element.price;
        
        // Création de la balise <p>
        let description = document.getElementById("description")
        description.innerHTML = element.description


        // Rattache de l'img au contenant
        let img_container = document.querySelector(".item__img");
        img_container.appendChild(image);
        }


    });
}

displayProduct();