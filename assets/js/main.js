var i = 0;
var j = 0;

function loadTrack(data){
    var url = data.src

    var audio_fx = null
    audio_fx = document.createElement('audio')
    audio_fx.setAttribute('src',url)
    audio_fx.load()
    audio_fx.addEventListener('loadeddata',function(){
        //alert("cargo")
        data.callBack(audio_fx)
    })
    audio_fx.addEventListener('error',function(){
        console.log("error cargando")
        data.callBack(null)
    })
}

function loadImg(data){
    var img = new Image()
    img.onload = function(){
        img.onload = null
        img.onerror = null
        data.callBack(img)
    }
    img.onerror = function(){
        img.onload = null
        img.onerror = null
        data.callBack(null)   
    }
    img.src = data.src
}

function getE(idname){
    return document.getElementById(idname)
}

var load_item = 0
var audios_fotos = []

function loadItems(){
    if(load_item==items_data.length){
        getE('sonido-btn').setAttribute('onclick','clickSonido()')
        
        setCintaItems()
        setModalInfo()

        if(window.innerWidth>575){
            activateSCroll()
            getE('cinta').addEventListener('mousemove', moveScroll, true)
            getE('cinta').addEventListener('mouseleave', outScroll, true)
            getE('cinta').addEventListener('mouseenter', overSCroll, true)
            window.top.postMessage({'completado': false, 'alto': 507}, '*' );
        }else{
            var picture_img_height = (getE('picture-img').getBoundingClientRect().width * 66.66) / 100
            getE('picture-img').style.height = picture_img_height+'px'
            getE('cinta-wrapper').style.width = (130 * items_data.length)+'px'
            window.top.postMessage({'completado': false, 'alto': 600}, '*' );
        }

        unsetLoader()
        intro_mp3.play()
        clickSonido()
    }else{
        loadItem()
    }
}


function loadItem(){
    loadImg({src:'assets/fotos/'+items_data[load_item].id+'.'+items_data[load_item].tipo, callBack: function(){
        loaderUpdate()
        loadTrack({src: 'assets/audios/'+items_data[load_item].id+'.mp3', callBack: function(data){
            loaderUpdate()
            audios_fotos.push(data)
            load_item++
            loadItems()
        }})
    }})
}


function setCintaItems(){
    for(i = 0;i<items_data.length;i++){
        var div_item = document.createElement('div')
        div_item.id = 'cinta-item-'+items_data[i].id
        div_item.className = 'cinta-item'
        div_item.innerHTML = '<div class="cinta-item-picture" onclick="clickCintaItem('+i+')" onmouseenter="overCintaItem('+i+')" onmouseleave="outCintaItem('+i+')"><img src="assets/fotos/'+items_data[i].id+'.'+items_data[i].tipo+'" /></div>'

        getE('cinta-wrapper').appendChild(div_item)
    }
} 

var over_item = -1

function overCintaItem(ite){
    over_item = ite
    getE('cinta-tooltip-txt').innerHTML = items_data[ite].peligro
    over_mp3.play()
}

function outCintaItem(ite){
    over_item = -1
}

var click_item = 0
var animacion_click_item = null
var animating_click_item = false
var modal_status = 'closed'

function clickCintaItem(ite){
    intro_mp3.pause()
    if(!animating_click_item){
        if(modal_status=='opened'){
            animating_click_item = true
            getE('picture-img').className = 'picture-img-off'
            getE('cinta-item-'+items_data[click_item].id).removeAttribute('class')
            getE('picture-info-btn').className = 'picture-info-btn-off'
            cerrarModal(false)

            animacion_click_item = setTimeout(function(){
                clearTimeout(animacion_click_item)
                animacion_click_item = null
                animating_click_item = false

                click_item = ite
                setModalInfo()
                abrirModal(false)
            },1000)
        }else{
            getE('picture-img').className = 'picture-img-off'
            getE('cinta-item-'+items_data[click_item].id).removeAttribute('class')
            getE('picture-info-btn').className = 'picture-info-btn-off'
            
            click_item = ite
            setModalInfo()
            abrirModal(false)
        }

        click_mp3.play()
    }
}

function setModalInfo(info){
    getE('cinta-item-'+items_data[click_item].id).className = 'cinta-item-active'
    getE('picture-img').getElementsByTagName('img')[0].src = 'assets/fotos/'+items_data[click_item].id+'.'+items_data[click_item].tipo
    getE('picture-img').className = 'picture-img-on'

    getE('modal-header-txt').innerHTML = '<span>Peligro: </span> '+items_data[click_item].peligro
    getE('modal-body-txt1').innerHTML = '<p><span>Riesgo: </span>'+items_data[click_item].riesgo+'</p>'
    var txt2 = "<p>Medidas de control:</p>"
    txt2+='<ul>'
    for(i = 0;i<items_data[click_item].medidas.length;i++){
        txt2+='<li>'+items_data[click_item].medidas[i]+'</li>'
    }
    txt2+='</ul>'
    getE('modal-body-txt2').innerHTML = txt2
    getE('modal-body-txt3').innerHTML = '<p><span>👤 Responsable:</span> '+items_data[click_item].responsable+'</p>'
}

function cerrarModal(btn){
    getE('modal').className = 'modal-off'
    modal_status = 'closed'

    if(btn){
        getE('picture-info-btn').className = 'picture-info-btn-on'
    }

    audios_fotos[click_item].pause()
}
function abrirModal(btn){
    getE('modal').className = 'modal-on'
    modal_status = 'opened'

    if(btn){
        getE('picture-info-btn').className = 'picture-info-btn-off'
    }

    audios_fotos[click_item].currentTime = 0
    audios_fotos[click_item].play()
    transicion_mp3.play()
}