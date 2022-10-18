function getItems() {
    return fetch("http://localhost:3000/api/products") // Récupération des données de l'API
        .then(reponse => reponse.json()) // Permet de lire les données au format JSON
        .catch(err => alert(err))
}

// Récupération du panier de LocalStorage
let localCart = localStorage.getItem("cart");
// Création d'un panier Page à partir du panier LocaleStorage
let CurrentCart = localCart ? JSON.parse(localCart) : []

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
            total();
        })

        // Fonctionnalité suppression

        deleteP.addEventListener("click", () => {
            
            let del = deleteP.closest("article");
            
            if(del.dataset.id === element.id && del.dataset.color === element.color) {
                
                
                let index = CurrentCart.indexOf(element)
                
                CurrentCart.splice(index, 1);
                console.log("supprimé")
                console.log(CurrentCart)
                
                localStorage.setItem('cart', JSON.stringify(CurrentCart));
                
            }
            location.reload();
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

// Appel des fonctions

renderCart();
total();
