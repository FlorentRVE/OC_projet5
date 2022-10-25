function getItems() {
    return fetch("http://localhost:3000/api/products") // Récupération des données de l'API
        .then(reponse => reponse.json()) // Permet de lire les données au format JSON
        .catch(err => alert(err))
}

// Récupération du panier de LocalStorage

let localCart = localStorage.getItem("cart");

// Création d'un panier Page à partir du panier LocaleStorage

let CurrentCart = localCart ? JSON.parse(localCart) : []

// Affichage du panier

async function renderCart() {
    let data = await getItems();

    CurrentCart.forEach(element => {           // Pour chaque élément du panier ...

        let id = element.id;

        // Création du contenant <article>
        let article = document.createElement("article");
        article.className = "cart__item";
        article.dataset.id = element.id;
        article.dataset.color = element.color;

        // Création <div> class="cart__item__img"
        let CartItemImg = document.createElement("div");
        CartItemImg.className = "cart__item__img";

        // Création <div> class="cart__item__content"
        let CartItemContent = document.createElement("div");
        CartItemContent.className = "cart__item__content";

        // Création <div> class="cart__item__content__description"
        let CartItemContentDescription = document.createElement("div");
        CartItemContentDescription.className = "cart__item__content__description";

        // Création <div> class="cart__item__content__settings"
        let CartItemContentSettings = document.createElement("div");
        CartItemContentSettings.className = "cart__item__content__settings";

        // Création <div> class="cart__item__content__settings__quantity"
        let CartItemContentSettingsQuantity = document.createElement("div");
        CartItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

        // Création <div> class="cart__item__content__settings__delete"
        let CartItemContentSettingsDelete = document.createElement("div");
        CartItemContentSettingsDelete.className = "cart__item__content__settings__delete";

        // Création de la balise <img>
        let image = document.createElement("img");
        data.forEach( item => {

                if(id === item._id) {
                image.src = item.imageUrl;
                }
            }
        )

        // Création de la balise <h2>
        let h2 = document.createElement("h2");
        data.forEach( item => {
            
            if(id === item._id) {
                h2.innerHTML = item.name;
            }
        }
    )
        
        // Création de la balise <input>
        let input = document.createElement("input");
        input.type = "number";
        input.className = "itemQuantity";
        input.name = "itemQuantity";
        input.value = element.qte;  // La valeur de base correspond à la quantité du produit actuel
        input.min = "1";
        input.max = "100";

        // Création de la balise <p> pour la couleur
        let color = document.createElement("p");
        color.innerHTML = element.color;

        // Création de la balise <p> pour le prix
        let price = document.createElement("p");
        data.forEach( item => {

            if(id === item._id) {
            price.innerHTML = item.price;
            }
        }
    )

        // Création de la balise <p> pour la quantité
        let qte = document.createElement("p");
        qte.innerHTML = element.qte;

        // Création de la balise <p> delete item
        let deleteP = document.createElement("p");
        deleteP.innerHTML = "Supprimer";
        deleteP.className = "deleteItem";

        ///////////// Intégration des différents éléments

        // <div> cart item img
        CartItemImg.appendChild(image);

        // <div> cart item content description
        CartItemContentDescription.appendChild(h2);
        CartItemContentDescription.appendChild(color);
        CartItemContentDescription.appendChild(price);

        // <div> cart item setting quantity
        CartItemContentSettingsQuantity.appendChild(qte);
        CartItemContentSettingsQuantity.appendChild(input);

        // <div> cart item setting delete
        CartItemContentSettingsDelete.appendChild(deleteP);

        // <div> cart item setting 
        CartItemContentSettings.appendChild(CartItemContentSettingsQuantity);
        CartItemContentSettings.appendChild(CartItemContentSettingsDelete);

        // <div> cart item content
        CartItemContent.appendChild(CartItemContentDescription);
        CartItemContent.appendChild(CartItemContentSettings);

        // <article>
        article.appendChild(CartItemContent);
        article.appendChild(CartItemImg);
        
        // Intégration à la balise <section>

        let section = document.getElementById("cart__items");
        section.appendChild(article);


        // Fonctionnalité modification

        input.addEventListener("change", (event) => {
            qte.innerHTML = event.target.value;
            element.qte = event.target.value;

            console.log(element.qte)
            console.log(CurrentCart)

            localStorage.setItem('cart', JSON.stringify(CurrentCart));
            total(); // recalcul du total
        })

        // Fonctionnalité suppression

        deleteP.addEventListener("click", () => {
            
            let del = deleteP.closest("article");
            
            if(del.dataset.id === element.id && del.dataset.color === element.color) {
                
                
                let index = CurrentCart.indexOf(element)
                
                CurrentCart.splice(index, 1);
                console.log("supprimé")
                
                localStorage.setItem('cart', JSON.stringify(CurrentCart));
                
            }
            location.reload();
            console.log(CurrentCart)
        })


    });
}

// Affichage du total

async function total() {

    let data = await getItems();
    
    let totalqte = document.getElementById("totalQuantity");
    let totalprice = document.getElementById("totalPrice");

    let sumQte = 0;
    let sumPrice = 0;

    for (let i = 0; i < CurrentCart.length; i++) {
        sumQte += parseInt(CurrentCart[i].qte);
    }

    for (let i = 0; i < CurrentCart.length; i++) {

        data.forEach( item => {

            if(CurrentCart[i].id === item._id) {
            sumPrice += parseInt(item.price * CurrentCart[i].qte);
            }
        })
    }

    totalqte.innerHTML = sumQte;
    totalprice.innerHTML = sumPrice;
}

// =============== Gestion du formulaire et passage commande ==================

// Création d'un objet Contact

let contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: ""
}

// Création du tableau regroupant les ID produit

let products = [];

// Création de l'objet final qui contiendra l'objet contact et le tableau des ID produits à envoyer via la requête POST

let orderValid = {};

// =====================================

// Récupération des inputs du formulaire via les IDs

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let mail = document.getElementById("email");

// Récupération des <p> pour afficher les erreurs via les IDs

let firstNameError = document.getElementById("firstNameErrorMsg");
let lastNameError = document.getElementById("lastNameErrorMsg");
let adressError = document.getElementById("addressErrorMsg");
let cityError = document.getElementById("cityErrorMsg");
let mailError = document.getElementById("emailErrorMsg");

// Création d'un array regroupant les différents input avec lesquels on va intéragir

let form = [firstName, lastName, address, city, mail];

// Booléens "Faux" par défaut qui deviendront "Vrai" si les formats des différents inputs sont valable

let validAddress = false;
let validLastName = false;
let validFirstName = false;
let validMail = false;
let validCity = false;

// Booléen qui deviendra Vrai si TOUS les champs input sont de format correct

let inputValid = false; 

form.forEach(element => {                   // On parcours l'array regroupant les inputs

    element.addEventListener("change", (e) => {      // Et pour chaque input ...

        let chaine = e.target.value;                // On récupére la valeur du champs

        if(e.target.id === "email") {               // Si l'ID du champs est email

            let reg = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi;   // Regex utilisé pour vérifier les format email
        
            console.log(chaine.match(reg));

            if(chaine.match(reg) === null) { 

                console.log("error typo");
                mailError.innerHTML = "Format incorrect"
                validMail = false;
                
            } else {
                
                console.log("Format valide")
                validMail = true;
                mailError.innerHTML = "";
            }
        }
        
        if(e.target.id === "address") {     // Même procédé pour le champs Adresse
            
            
            let reg = /\b(\d{1,}) [a-zA-Z0-9\s]+ ? [a-zA-Z]+ ? [0-9]{5,6}\b/gi;
            
            console.log(chaine.match(reg));
            
            if(chaine.match(reg) === null) {
                
                console.log("error typo");
                adressError.innerHTML = "Format incorrect"
                validAddress = false;
                
            } else {
                
                console.log("Format valide");
                validAddress = true;
                adressError.innerHTML = "";
            }
        }

        if(e.target.id === "firstName") {     // Idem pour les autres champs
            
            
            let reg = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/gi;
            
            console.log(chaine.match(reg));
            
            if(chaine.match(reg) === null) {
                
                console.log("error typo");
                firstNameError.innerHTML = "Format incorrect"
                validFirstName = false;
                
            } else {
                
                console.log("Format valide");
                validFirstName = true;
                firstNameError.innerHTML = "";
            }
        }

        if(e.target.id === "lastName") { 
            
            
            let reg = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/gi;
            
            console.log(chaine.match(reg));
            
            if(chaine.match(reg) === null) {
                
                console.log("error typo");
                lastNameError.innerHTML = "Format incorrect"
                validLastName = false;
                
            } else {
                
                console.log("Format valide");
                validLastName = true;
                lastNameError.innerHTML = "";
            }
        }

        if(e.target.id === "city") { 
            
            
            let reg = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/gi;
            
            console.log(chaine.match(reg));
            
            if(chaine.match(reg) === null) {
                
                console.log("error typo");
                cityError.innerHTML = "Format incorrect"
                validCity = false;
                
            } else {
                
                console.log("Format valide");
                validCity = true;
                cityError.innerHTML = "";
            }
        }

        // Enfin on autorise la validation si tous les champs sont validés

        if(validAddress === true && validMail == true && validCity == true 
            && validFirstName == true && validLastName == true) {

            inputValid = true;
            
            // Complétion des infos contact
            
            contact.firstName = firstName.value;
            contact.lastName = lastName.value;
            contact.address = address.value;
            contact.city = city.value;
            contact.email = mail.value;
            
            // Complétion du tableau ID
            
            CurrentCart.forEach(element => products.push(element.id))
            
            // Complétion de l'objet à envoyer via la requête POST
            
            orderValid = {
                contact,
                products
            }
            
            console.log("Prêt pour l'envoi !");
            console.log(orderValid);
        }
    })
})

// Utiliser Fetch avec POST au click sur le boutton "Commander"

let orderBtn = document.getElementById("order");

orderBtn.addEventListener("click", function(e) {

    if(CurrentCart.length != 0) { // Si le panier n'est pas vide ...

        if(inputValid === true) { // ... et si tous les champs sont rempli correctement

            e.preventDefault() // Empeche l'activation du "submit" du boutton qui produit une erreur
    
            // Définition du corps de la requête POST
    
            let option = {
                method: 'POST',
                headers: {'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(orderValid),
            }
    
            // Requête POST à l'API
    
            fetch("http://localhost:3000/api/products/order", option)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                console.log(data.orderId)
                window.location.href = "confirmation.html?orderID=" + data.orderId; // Redirection intégrant l'ID de la commande
                localStorage.clear();
            })
            .catch(err => console.log(err))
    
        }
    } else {
        alert("Panier vide !")
    }
    

    
})

// ============================================================

// Appel des fonctions

renderCart();
total();
