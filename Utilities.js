// 封裝hasChildren()方法，不使用children屬性
Element.prototype.hasChildren = function() {
    var child = this.childNodes;
    var len = child.length;
    var arr = [];

    for(var i = 0; i < len; i++) {
       if(child[i].nodeType == 1) {
           arr.push(child[i]);
       }
    }
}

//封裝retSibling()方法，返回元素e的第n個兄弟元素節點，n為正，返回後面的兄弟元素節點，n為負，返回前面的，n為0，返回自己
Element.prototype.retSibling = function(e, n) {
  while(e && n) {
    if (n > 0) {
      if (e.nextElementSibling) {
        e = e.nextElementSibling;
      } else {
        for(e = e.nextSibling; e && e.nodeType != 1; e = e.nextSibling);
      }
      n--;
    } else {
      if (e.previousElementSibling) {
          e = e.previousElementSibling;
      } else {
          for(e = e.previousSibling; e && e.nodeType != 1; e = e.previousSibling);
      }
      n++;
    }
  }
  return e;
}

// 封裝函數insertAfter()，功能類似於insertBefore()
Element.prototype.insertAfter = function(targetNode, AfterNode) {
    var beforeNode = afterNode.nexElementSibling;
    if(beforeNode == null) {
       this.appendChild(targetNode);
    } else {
       this.insertBefore(targetNode, beforeNode);
    }
}

// 封裝函數列印日期(年/月/日 時:分:秒)
Date.prototype.printNow = function() {
   var date = new Date();
   var now = date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
   return now;
}


// 兼容性封裝
// 封裝兼容性方法，求scroll bar滾動距離 getScrollOffset()
function getScrollOffset() {
    if(window.pageXOffset) {
        //ie8及ie8以下不兼容
       return {
           x : window.pageXOffset,
           y : window.pageYOffset
       }
    } else {
        // 在IE9以下兼容性比較混亂，用時取兩個值相加，因為不可能存在兩個同時有值
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}

// 封裝兼容性方法，返回瀏覽器視窗尺寸 getViewportOffset()
function getViewportOffset() {
    if(window.innerWidth) {
        // IE8及IE8以下不兼容
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    } else {
        if(document.compatMode === "BackCompat") {
            // 適用於怪異模式下的瀏覽器
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight
            }
        } else {
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight
            }
        }
    }
}

// 封裝兼容性方法getStyle(elem, prop);
function getStyle(elem, prop) {
    if(window.getComputedStyle) {
        // ie8及ie8以下不兼容
        return window.getComputedStyle(elem, null)[prop];
    } else {
        return elem.currentStyle[prop];
    }
}

// 封裝兼容性的addEvent()方法
function addEvent(elem, type, handle) {
    if(elem.addEventLinstener) {
        // this指向的是dom元素本身
        elem.addEventListener(type, handle, false);
    } else if(elem.attachEvent) {
        // this指向window，所以用call改變this指向
        elem.attachEvent('on'+type, function(){
           handle.call(elem);
        });
    } else {
        // this指向的是dom元素本身
        elem['on'+type] = handle;
    }
}

// 封裝取消事件冒泡函數 stopBubble()
function stopBubble(event) {
    if(event.stopPropagation) {
        // 不支持ie9以下版本
        event.stopPropagarion();
    } else {
        event.cancelBubble = true;
    }
}


// 封裝阻止預設事件函數cancelHandler()
function cancelHandler(event) {
    if(event.preventDefault) {
        // ie9以下不兼容
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

// 封裝拖曳功能drag()
function drag(elem) {
    var disX, disY;

    // 使用已封裝好的監聽事件
    addEvent(elem, 'mousedown', function(e) {
       var event = e || window.event;
        disX = event.clientX - parseInt(getStyle(elem, 'left'));
        disY = event.clientY - parseInt(getStyle(elem, 'top'));

        addEvent(document, 'mousemove', mouseMove);
        addEvent(document, 'mouseup', mouseUp);
        stopBubble(event);
        cancelHandler(event);
    });

    function mouseMove(e) {
        var event = e || window.event;
        elem.style.left = event.clientX - disX + "px";
        elem.style.top = event.clientY - disY + "px";
    }

    function mouseUp(e) {
        var event = e || window.event;
        removeEvent(document, 'mousemove', mouseMove);
        removeEvent(document, 'mouseup', mouseUp);
    }
}
