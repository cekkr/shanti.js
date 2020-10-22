///
/// Menu drawer
///

if (vars.platform != 'darwin')
    readMenu($("#topMenu"), vars.menu);

function readMenu(el, menu){
    el.append( "<ul></ul>" );
    var elUl = el.children('ul').last();
    
    if(menu.items){
        for(var item of menu.items)
            addItem(elUl, item);
    }
}

function addItem(el, item){    
    el.append('<li><a href="#"><span class="label">'+item.label+'</span></a></li>');
    var elItem = el.children('li').last();  
    
    if(item.click){    
        $(elItem).click(function(){
           item.click.apply(this, [item, thisWindow, thisWindow.webContents]);
        });
    }
    
    if(item.submenu)
        readMenu(elItem, item.submenu);
}