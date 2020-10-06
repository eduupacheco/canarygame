var plays = 0, puntuation = 0, maxpuntuation = 0
var src = getJsonData().islands
var islandsforgame = new Array()

$(() => {
    init()
    $('#difficulty').selectmenu({
        change: (event, data) => {
            switch (data.item.value) {
                case "1":
                    generateIslandsComponents()
                    generatePictures(4)
                    reset()
                    maxpuntuation = 4
                    showPuntuation()
                    $('#game-zone').show()
                    break
                case "2":
                    generateIslandsComponents()
                    generatePictures(7)
                    reset()
                    maxpuntuation = 7
                    showPuntuation()
                    $('#game-zone').show()
                    break
                case "3":
                    generateIslandsComponents()
                    generatePictures(8)
                    reset()
                    maxpuntuation = 8
                    showPuntuation()
                    $('#game-zone').show()
                    break
            }
        },
        width: '500px'
    });
});

/**
 * This function initialize the game
 */
function init() {
    generateIslandsComponents()
    generatePictures(7)
    puntuation = 0
    maxpuntuation = 7
    islandsforgame = []
    skinsforgame = []
    showPuntuation()
}

/**
 * This function do a reset for the game
 */
function reset() {
    plays = 0
    puntuation = 0
    maxpuntuation = 0
    islandsforgame = []
    showPuntuation()
    $('.droppable').css('border','black solid 2px')
    
}

/**
 * This function shows the puntuation panel
 */
function showPuntuation() {
    $('#puntuation').html('' + puntuation)
    $('#max-puntuation').html('/' + maxpuntuation)
}

/**
 * This function generate the islands components to show
 */
function generateIslandsComponents() {
    $('#game-zone-islands').html(() => {
        var components = ''
        var islands = new Array()
        src.forEach(element => {
            islands.push(element.name)
        });
        shuffle(islands)
        var nislands = parseInt(Math.random() * (8 - 4) + 4)
        for (let i = 0; i < nislands; i++) {
            islandsforgame.push(islands[i])
            components += `<div id="${islands[i]}" class="bg-white m-0 p-0 droppable" style="width: 180px; height: 180px; padding: 0.5em; border: black 2px solid">
            <img src="./img/islas/${islands[i]}.png" style="width: 100%; height: 100%;"><p></p>
            </div>`
        }
        return components
    });
    $(".droppable").droppable({
        drop: function (event, ui) {
            if (isValid($(this), $(ui.draggable))) {
                $(this)
                    .addClass('ui-state-highlight')
                    .css('border', 'solid 2px green')
            } else {
                $(this)
                    .addClass('ui-state-highlight')
                    .css('border', 'solid 2px red')
            }
            listenerPlay()
        }
    });
}

/**
 * This function generates the draggabled skins to play
 * @param {} n 
 */
function generatePictures(n) {
    $('#game-zone-pictures').html(() => {
        var components = ''
        var skinsforgame = new Array()
        src.forEach(data => {
            islandsforgame.forEach(name => {
                if(data.name.includes(name)){
                    for (let i = 0; i < data.skins.length; i++) {
                        skinsforgame.push(data.skins[i])
                    }
                }
            })
        });
        
        shuffle(skinsforgame)
        for (let i = 0; i < n; i++) {
            //console.log(skinsforgame[i])
            components += `<div id="${skinsforgame[i]}" class="draggable" style="width: 130px; height: 160px; padding: 0.5em;">
            <img src="./img/trajes/${skinsforgame[i]}.png" style="width: 100%; height: 100%;">
        </div>`
        }
        //console.log('-')
        return components
    });
    $(".draggable").draggable({
        containment: '#game-zone',
        cursor: 'grabbing'
    })
}

/**
 * This function check out each play by the user and if his couple is correct or incorrect
 */
function isValid(island, skin) {
    $(skin).draggable('disable')
    if ($(island).attr('id').includes($(skin).attr('id').split('-')[0])) {
        setSoundCorrect()
        setNotification('correct')
        puntuation++
        showPuntuation()
        return true
    } else {
        setSoundIncorrect()
        setNotification('incorrect')
        return false
    }
}

/**
 * This functions works for stay listening how many times the user has played
 */
function listenerPlay() {
    plays++
    if(plays > 0){
        disableOptions()
    }
    if (plays == maxpuntuation) {
        setModal()
        reset()
        init()
    }
}

/**
 * This functions disables de options for the game
 */
function disableOptions() {
    $('#options').removeClass('d-flex')
    $('#options').hide()
}

/**
 * This functions enables de options for the game
 */
function enableOptions() {
    $('#options').addClass('d-flex')
    $('#options').show()
}

/**
 * This function reproduces the audioFX for the correct answer effect
 */
function setSoundCorrect() {
    var audio = new Audio()
    audio.src = './canarygame/audio/correct.mp3'
    audio.play()
}

/**
 * This function reproduces the audioFX for the incorrect answer effect
 */
function setSoundIncorrect() {
    var audio = new Audio()
    audio.src = './canarygame/audio/incorrect.mp3'
    audio.play()
    audio.volume = 0.1
}

/**
 * This functions shows the toasts
 * @param {*} str 
 */
function setNotification(str) {
    toastr.options.closeButton = true;
    toastr.options.positionClass = 'toast-bottom-right'
    switch (str) {
        case 'correct':
            toastr.success('Correcto', '<i>Éxito</i>')
            break
        case 'incorrect':
            toastr.error('Incorrecto', '<i>Error</i>')
            break
    }
}

/**
 * This function creates the modal element to ask to the user
 */
function setModal() {
    $("#modal").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Sí": function () {
                reset()
                init()
                $(this).dialog('close')
                enableOptions()
                $('#game-zone').hide()
                enableOptions()
            },
            "No": function () {
                reset()
                init()
                $('#game-zone').hide()
                $(this).dialog('close')
                $('#options').after('<div class="d-flex justify-content-center"><h3>Gracias por jugar. ¡Vuelve pronto! :(</h3></div><div class="d-flex justify-content-center"><img src="./img/islascanarias.gif"></div>')
            }
        },
        show: {
            effect: "fade",
            duration: 800
          }
    }).html(`<p>Has obtenido ${puntuation} de ${maxpuntuation} <strong></p><p>¿Quieres volver a jugar?</p>`)
}

/**
 * This functions returns a randomized array
 * @param {*} element 
 */
function shuffle(element) {
    var j, x, i
    for (i = element.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = element[i]
        element[i] = element[j]
        element[j] = x
    }
    return element
}

/**
 * This function get the source of each island
 */
function getJsonData() {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "./mocks/islands.json", false);
    xhReq.send(null);
    xhReq = JSON.parse(xhReq.responseText);
    return xhReq;
}
