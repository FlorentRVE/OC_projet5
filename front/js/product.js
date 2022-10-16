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
        
        // Remplissage de la balise <p>
        let description = document.getElementById("description")
        description.innerHTML = element.description

        // Rattache de l'img au contenant
        let img_container = document.querySelector(".item__img");
        img_container.appendChild(image);
     
        for(let i = 0; i< element.colors.length; i++) {  //Boucle permettant d'afficher les choix de couleurs

        // Création de balise <option>
        let option = document.createElement("option");
        option.value = element.colors[i];
        option.innerHTML = element.colors[i];

        // Rattache des <option> à la balise <select> avec l'id "colors"
        let colors = document.getElementById("colors")
        colors.appendChild(option)
        }

        }
    });
}

displayProduct();

// =========================== Ajout panier =======================

let product = {  // Création d'un objet produit
    id: "",
    qte: "",
    color: ""
}

function addToCart() {
    let button = document.getElementById("addToCart");

    button.addEventListener("click", function() {

        // Récupération ID produit 
        product.id = getID();

        // Récupération quantité produit
        let quantity = document.getElementById("quantity");
        product.qte = quantity.value;

        // Récupération couleur produit
        let color = document.getElementById("colors");
        product.color = color.value;

        //////////////// A ce stade objet produit crée

        // Récupération du panier de LocalStorage
        let localCart = localStorage.getItem("cart");
        // Création d'un panier Page à partir du panier LocaleStorage
        let CurrentCart = localCart ? JSON.parse(localCart) : []

        // Ajout produit dans le panier Page
        
        let newArticle = true;

        for(var i=0; i<CurrentCart.length; i++) {
            if(product.id === CurrentCart[i].id && product.color === CurrentCart[i].color) {
                
                newArticle = false;
                CurrentCart[i].qte = parseInt(product.qte) + parseInt(CurrentCart[i].qte)
                console.log("Quantité +")

            }
        }
               
        if(newArticle){
            
            CurrentCart.push(product);
            console.log("Product ajouté au panier")
            
        } 
     
        
        console.log(product);
        console.log(CurrentCart);
        
        // Réassignation du panier actuelle au LocalStorage
        localStorage.setItem('cart', JSON.stringify(CurrentCart));

    })
}

addToCart();
// localStorage.clear()