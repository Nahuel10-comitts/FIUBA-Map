var FORMAPI = 'https://docs.google.com/forms/u/0/d/1xUf-9SWdGf0jv_weLRe4tlXb-GWHkH-kc-v_S8kKGCI'
var SHEETAPI = "https://spreadsheets.google.com/feeds/list/1B7ytzx_-XvmaMApIb1UX3DXBCSCAAelXs_TuJ0Ww2fE/default/public/values?alt=json"

function save(clave, carrera, materias){
    var form = $("<form id='formRecord' type='hidden' action=" + FORMAPI + " onsubmit='return window.submitGoogleForm(this)'></form>")
    form.append("<input name='entry.774465991' value=" + clave + ">")
    form.append("<input name='entry.992084860' value=" + carrera + ">")
    form.append("<input name='entry.2026137499' value=" + materias + ">")
    form.submit()
}

function load(clave){
    $.ajax({
        url: SHEETAPI,
        method: 'GET',
        success: function(data) {
            loadMap(data,clave)
        }
    })
}

function loadMap(api, clave){
    $("#clave").val(clave)
    var data = api.feed.entry
    usuario = null
    data.forEach(fila => {
        if(fila.gsx$clave.$t == clave) {
            usuario = fila
        }
    })
    if (!usuario) {
        warning(clave)
        update(null, 'sistemas', null)
        return 
    }
    let carrera = usuario.gsx$carrera.$t
    let materias = usuario.gsx$materias.$t 
    update(null,carrera, materias)
}

function warning(clave){
    let html = `
        <small><div class="alert">
            <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
            <strong>Padrón no registrado!</strong> Seleccioná tu carrera, marca las materias que aprobaste y toca el boton de guardar.
            <br>
            Una vez guardado, podés entrar a <a href=https://fdelmazo.github.io/FIUBA-Map/?clave=`+clave+`>https://fdelmazo.github.io/FIUBA-Map/?clave=`+clave+`</a> y ver tu progreso.
        </div></small>
    `
    $('#warning').append($(html));
}

$('#databaseButton').off('click').on('click',function(){
    let clave = $("#clave").val()
    if (!clave){ return }
    if (clave.toLowerCase() == 'party') {PARTYMODE = true; return}
    let carrera = carreraActual
    let materiasArr = []
    NODOS.forEach(nodo => {
        if (nodo.aprobada) {materiasArr.push(nodo.id)}
    })
    let materias = materiasArr.join('-')
    save(clave,carrera,materias)

    setTimeout(function() {
        window.location = "https://fdelmazo.github.io/FIUBA-Map?clave="+clave;
    }, 1000)
    
})

$('#databaseReload').off('click').on('click',function(){
    let clave = $("#clave").val()
    if (!clave){ return }
    if (clave.toLowerCase() == 'party') {PARTYMODE = true; return}
    window.location = "https://fdelmazo.github.io/FIUBA-Map?clave="+clave;    
})

$('#clave')[0].addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("databaseReload").click();
    }
  });