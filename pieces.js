import { ajoutListenersAvis, ajoutListenerEnvoyerAvis } from "./avis.js";

// Récupération des pièces depuis le fichier JSON
const reponse = await fetch("http://localhost:8081/pieces/");
const pieces = await reponse.json();
ajoutListenerEnvoyerAvis()


// Fonction qui génère toute la page web
function genererPieces(pieces) {
    for (let i = 0; i < pieces.length; i++){
        
        const article = pieces[i];

        // Récupération de l'élément du DOM qui accueillera les fiches
		const sectionFiches = document.querySelector(".fiches");

        const pieceElement = document.createElement("article");

        // On crée l’élément img.
        const imageElement = document.createElement("img");
        // On accède à l’indice i de la liste pieces pour configurer la source de l’image.
        imageElement.src = article.image;

        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;

        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;   //Opérateur Ternaire

        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "(Pas de description pour le moment.)"; //Opérateur Nullish

        const disponibleElement = document.createElement("p");
        disponibleElement.innerText = article.disponibilité ? "En stock" : "Rupture de stock";


        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";

        // On rattache nos Elements à pieceElement (la balise article)
        sectionFiches.appendChild(pieceElement)
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(disponibleElement);

        pieceElement.appendChild(avisBouton);

        // Ajout de la fonction ajoutListenersAvis
        ajoutListenersAvis();
    }
}

//Première affichage de la page
genererPieces(pieces)


//trier
const boutonCroissant = document.querySelector(".btn-croissant");
boutonCroissant.addEventListener("click", function () {
 
    const piecesCroissant = Array.from(pieces);

    piecesCroissant.sort(function(a,b){
        return a.prix - b.prix
    });
    // Effacement de l'écran et regénération de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesCroissant);
});

const boutonDecroissant = document.querySelector(".btn-decroissant");
boutonDecroissant.addEventListener("click", function () {
 
    const piecesDecroissant = Array.from(pieces);

    piecesDecroissant.sort(function(a,b){
        return b.prix - a.prix
    });
    // Effacement de l'écran et regénération de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesDecroissant);
});


//filter
const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.prix <=35;
    })
    // Effacement de l'écran et regénération de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

const boutonFiltrer2 = document.querySelector(".btn-filtrer-2");
boutonFiltrer2.addEventListener("click", function () {
    const piecesFiltrees2 = pieces.filter(function(piece){
        return piece.description;
    })
    // Effacement de l'écran et regénération de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees2);
});


const noms = pieces.map(piece => piece.nom);
for(let i = pieces.length -1 ; i >= 0; i--){
   if(pieces[i].prix > 35){
       noms.splice(i,1)
   }
}


//Création de la liste abordable
const abordablesElements = document.createElement('ul');
abordablesElements.innerText = "Pièces abordables :" 
//Ajout de chaque nom à la liste
for(let i=0; i < noms.length ; i++){
   const nomElement = document.createElement('li');
   nomElement.innerText = noms[i];
   abordablesElements.appendChild(nomElement)
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.abordables').appendChild(abordablesElements)



const nomsDispo = pieces.map(piece => piece.nom);
const prixDispo = pieces.map(piece => piece.prix);

for(let i = pieces.length -1 ; i >= 0; i--){
   if(pieces[i].disponibilité != true){
       nomsDispo.splice(i,1)
       prixDispo.splice(i,1)
   }
}

    //Création de la liste disponible
const disponibleElements = document.createElement('ul');
disponibleElements.innerText = "Pièces disponible :" 

//Ajout de chaque nom à la liste
for(let i=0; i < nomsDispo.length ; i++){
   const nomDispoElement = document.createElement('li');
   nomDispoElement.innerText = `${nomsDispo[i]} -- ${prixDispo[i]} €`;
   disponibleElements.appendChild(nomDispoElement)
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.disponible').appendChild(disponibleElements)


const inputPrixMax = document.querySelector('#prix-max');
inputPrixMax.addEventListener('input', function(){
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.prix <= inputPrixMax.value
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
})

