var total_loader = (items_data.length * 2)/*audio + imagen por cada item*/
var current_loader = 0
function loaderUpdate(){
    current_loader++
    var loader_width = Math.round((current_loader*100)/total_loader)

    getE('loader-bar2').style.width = loader_width+'%'
}

function unsetLoader(){
    getE('loader').className = 'loader-off'
}