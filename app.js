let level = 1; //niveau du jeu
let delays = [0.8, 0.5, 0.4, 0.2, 0.1]; // tableau des délais en fonction des niveaux
let colors = ["red", "blue", "purple", "orange", "yellow", "pink"]; //tableau des couleurs du carré qui varient en fonction des délais
let square1 = createSquare(100,"black"); //Premier carré
let square2 = createSquare(100,"black"); //Deuxième carré
let square3 = createSquare(100,"black"); // Troisième carré
let gameCtn = document.getElementById("color_game_ctn"); //Conteneur du jeu (div)
let levelCtn = createLevel(gameCtn, 50, 170); // Conteneur de l'affichage du niveau du jeu

window.addEventListener("load",()=>{displayGame(square1, square2, square3, gameCtn,levelCtn, level)});
gameCtn.addEventListener("mouseover", (event) => {onMouseOver(event, delays, level, colors)});
gameCtn.addEventListener("mouseout",(event) => {onMouseOut(event,square1, square2, square3, levelCtn, gameCtn)});

/**
 * Affiche le jeu
 * @param square1 un élémént HTML qui représente le carré1
 * @param square2 un élémént HTML qui représente le carré2
 * @param square3 un élémént HTML qui représente le carré3
 * @param gameCtn conteneur du jeu
 * @param levelCtn conteneur du niveau
 * @param level niveau actuel du joueur
 */
function displayGame(square1, square2, square3, gameCtn, levelCtn, level){
    displaySquare(gameCtn, square1, 50, 20);
    displaySquare(gameCtn, square2, 250, 20);
    displaySquare(gameCtn, square3, 450, 20);
    displayLevel(levelCtn, level);
}

/**
 * Créer un carré
 * @param length  :la longueur du carré
 * @param color : la couleur du carré
 * @returns {HTMLDivElement} : un élémént HTML qui représente le carré
 */
function createSquare(length, color){
    let elementDiv = document.createElement("div");
    elementDiv.style.width = length+"px";
    elementDiv.style.height = length+"px";
    elementDiv.style.backgroundColor = color;
    elementDiv.style.position = "absolute";
    elementDiv.name = "square";
    return elementDiv;
}

/**
 * Créer l'élément qui contient le niveau
 * @param gameCtn : le conteneur du jeu
 * @param position_x : position en x
 * @param position_y : position en y
 * @returns {HTMLDivElement} : un élément HTML conteneur
 */
function createLevel(gameCtn, position_x, position_y){
    let divElement = document.createElement("div");
    divElement.style.color = "green";
    divElement.style.position = "absolute";
    divElement.style.left = position_x+"px";
    divElement.style.top = position_y+"px";
    gameCtn.appendChild(divElement);
    return divElement;
}

/**
 * Afficher le niveau du jeu
 * @param levelCtn : conteneur du niveau
 * @param level : niveau du jeu
 */
function displayLevel(levelCtn, level){
    levelCtn.innerHTML = `Le niveau est le suivant : ${level}`;
}

/**
 * Affiche un carré dans le jeu
 * @param gameCtn : conteneur du jeu
 * @param square : un élémént HTML qui représente le carré
 * @param position_x : la position du carré en horizontal
 * @param position_y : la position du carré en vertical
 */
function displaySquare(gameCtn, square, position_x, position_y){
    square.style.left = position_x+"px";
    square.style.top = position_y+"px";
    gameCtn.appendChild(square);
}

/**
 * Evenement au survol du conteneur du jeu
 * @param event : événement du survol
 * @param delays : la liste des délais
 * @param level : le niveau du jeu
 * @param colors : la liste des couleurs que prend les carrés
 */
function onMouseOver(event,delays, level, colors){
    if(event.target.name == "square"){
        loopColor(event.target, delays, level, colors);
    }
}

/**
 * Change la couleur du carré au bout d'un certain délais (dépend du niveau de jeu)
 * @param square : un élémént HTML qui représente un carré
 * @param delays : la tableau des délais
 * @param level : le niveau du joueur
 * @param colors : la tableau des couleurs
 */
function loopColor(square, delays, level, colors){
    let idInterval = setInterval(()=>{nextColor(square, colors)}, delays[level-1]*1000);
    square.addEventListener("mouseout",()=>{clearInterval(idInterval)});
}

/**
 * Change la couleur d'un carré en fonction de sa couleur précédente
 * @param square : un carré
 * @param colors : le tableau des couleurs
 */
function nextColor(square, colors){
    let color = getColor(square);
    let index = colors.indexOf(color);
    index++;
    if(index >= colors.length) index = 0;
    changeColor(colors[index], square);
}

/**
 * Récupère la couleur d'un carré
 * @param square : la carré
 * @returns {string} : la couleur du carré
 */
function getColor(square){
    return square.style.backgroundColor;
}

/**
 * Change la couleur du carré
 * @param color : la nouvelle couleur
 * @param square : un élémént HTML qui représente un carré
 */
function changeColor(color, square){
    square.style.backgroundColor = color;
}

/**
 * Evenement si on quitte un carré
 * @param event : l'événement qui quitte le carré
 * @param square1 : carré 1
 * @param square2 : carré 2
 * @param square3 : carré 3
 * @param levelCtn : le conteneur du niveau
 * @param gameCtn : le conteneur du jeu
 */
function onMouseOut(event,square1, square2, square3, levelCtn, gameCtn){
    if(event.target.name == "square"){
        winning(square1, square2, square3, levelCtn, gameCtn);
    }
}

/**
 * Si je gagne, je change de niveau, si j'ai atteint le niveau 5, j'affiche un message de victoire
 * @param square1 : le carré 1
 * @param square2 : le carré 2
 * @param square3 : le carré 3
 * @param levelCtn : le conteneur du niveau
 * @param gameCtn : le conteneur du jeu
 */
function winning(square1, square2, square3, levelCtn, gameCtn){
    //Si je gagne, je change de niveau
    if(isEqualColors(square1, square2, square3)){
        let nextLevel = changeLevel();
        //si j'ai atteint le dernier niveau, j'affiche un message de victoire
        if(nextLevel > delays.length ){
            displayWinMessage(gameCtn);
        }else{
            //sinon, j'affiche le nouveau niveau
            displayLevel(levelCtn, nextLevel);
            changeColor("black", square1);
            changeColor("black", square2);
            changeColor("black", square3);
        }
    }
}

/**
 * Pour savoir si on a gagné
 * @param square1 : un élémént HTML qui représente le carré1
 * @param square2 : un élémént HTML qui représente le carré2
 * @param square3 : un élémént HTML qui représente le carré3
 * @returns {boolean} true pour gagné, false pour perdu
 */
function isEqualColors(square1, square2, square3){
    if(getColor(square1)=="black") return false;
    return getColor(square1) == getColor(square2) && getColor(square3) == getColor(square2)
}

/**
 * Pour changer de niveau : on incrémente la variable globale level
 * @returns {number} : un entier représentant le nouveau niveau
 */
function changeLevel(){
    level++;
    let nextLevel = level;
    return nextLevel
}

/**
 * Affiche un message de victoire
 * @param gameCtn : conteneur du jeu
 */
function displayWinMessage(gameCtn){
    gameCtn.innerHTML = "<h3 style='color:red'>Vous avez gagné !!!</h3>";
}