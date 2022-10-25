function getID() {
    let url = window.location.search; // Récupération de la partie search de l'URL
    let params = new URLSearchParams(url);
    let id = params.get('orderID') 
    return id // On isole et retourne l'id de la page actuelle
}

let id = getID();

// Affichage de l'ID de la commande à partir l'URL

let displayID = document.getElementById("orderId");

displayID.innerHTML = id;
