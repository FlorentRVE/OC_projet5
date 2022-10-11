
function getItems() {
    return fetch("http://localhost:3000/api/products") // Récupération des données de l'API
        .then(reponse => reponse.json()) // Permet de lire les données au format JSON
        .catch(err => alert(err))// On attribue le nom Data à la réponse
}

async function displayItems() {
    let data = await getItems();

    data.forEach(element => {                   // Pour chaque élément de l'array data ...
        
        // Création de la balise <img>
        let image = document.createElement("img");
        image.src = element.imageUrl;
        image.alt = element.altTxt
        
        // Création de la balise <h3>
        let title = document.createElement("h3");
        title.innerText = element.name;
        
        // Création de la balise <p>
        let description = document.createElement("p");
        description.innerText = element.description
        
        // Création des différents contenant
        let article = document.createElement("article");
        let ancre = document.createElement("a");
        let section = document.getElementById("items");

        // On attache nos balise dans le contenant <article>
        article.appendChild(title);
        article.appendChild(image);
        article.appendChild(description);

        // Qui lui-même sera rattaché au contenant <a>
        ancre.appendChild(article);

        // Qui lui-même sera rattaché au contenant <section>
        section.appendChild(ancre);
    });
}

displayItems();