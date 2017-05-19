(function ($) {

    var timerid;
    var tree_wrap;
    $.fn.spread = function (o) {
        o = $.extend(
            {
                time: 3000,                     //隐藏时间
                wrapClass: "tree_wrap",         //外层div或ul的样式名
                showFunc: "slideDown('slow')",  //显示方法（show() fadeIn() slideDown()）
                hideFunc: "slideUp('slow')",     //隐藏方法（hide() fadeOut() slideUp）
                isExpandAll: false,               //是否全部展开（如果设为true,伸展动画将失效）
                expandLevel: 0,
                event: "hover"                        //默认为hover(即：mouseenter,mouseleave的合成事情),可设置为"toggle"
            }, o || {});

        tree_wrap = $(".tree_wrap", this);

        //初始化样式
        if (o.wrapClass != "tree_wrap")
            tree_wrap.removeClass("tree_wrap").addClass(o.wrapClass);

        var tree_wrap_first_dl_ul_list = $(".tree_wrap>dl,.tree_wrap>ul", this);
        var tree_wrap_first_dt_li_list = $(".tree_wrap>dl>dt,.tree_wrap>ul>li", this);

        tree_wrap_first_dt_li_list.find("dt,li").each(function () {

            $(this).addClass("tree_child_wrap");

        });

        if (!o.isExpandAll) {
            $(tree_wrap_first_dl_ul_list.find("dl,ul")).each(function () {
                $(this).hide();
            });
        }

        if (o.isExpandAll)
            $(".tree_child_wrap", tree_wrap).show();

        $("li,dt", tree_wrap).each(function () {
            if ($(this).children('ul,dl').length) {
                $(this).addClass("hasChildren");
                if (o.isExpandAll)
                    $(this).addClass("expand");
            } else {
                $(this).addClass("noChildren");
            }
        });
        //-------------

        if (o.event == "toggle") {
            $(">li.hasChildren>a,>dl>dt.hasChildren>a", tree_wrap).toggle(function (e) {
                if (o.isExpandAll)
                    return;

                eval("$(this).parent().addClass('current').children('ul,dl')." + o.showFunc + ";");

            }, function (e) {
                e.stopPropagation();
                if (o.isExpandAll)
                    return;

                $(this).parent().removeClass("current");
                cl();
            });
        } else {
            $("li,dt", tree_wrap).hover(function (e) {
                if (o.isExpandAll)
                    return;

                if (timerid)
                    clearTimeout(timerid);
                timerid = setTimeout(cl, o.time);

                eval("$(this).addClass('current').children('ul,dl')." + o.showFunc + ";");

            }, function () {
                if (o.isExpandAll)
                    return;

                $(this).removeClass("current");
                timerid = setTimeout(cl, o.time);
            });
        }



        function cl() {
            eval("$('li:not(.current),dt:not(.current)', tree_wrap).children('ul,dl')." + o.hideFunc + ";");
        }
    }

})(jQuery);

//-----------------------
function SetHome(obj, vrl) {
    try {
        obj.style.behavior = 'url(#default#homepage)'; obj.setHomePage(vrl);
    }
    catch (e) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }
            catch (e) {
                alert("Your Browser does not support ");
            }
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage', vrl);
        }
    }
}

function addFavorite() {
    var vDomainName = window.location.href;
    var description = document.title;
    try {//IE
        window.external.AddFavorite(vDomainName, description);
    } catch (e) {//FF
        window.sidebar.addPanel(description, vDomainName, "");
    }
}

var hashValue = location.hash.substring(1);
if (hashValue) {
    var arrHash = hashValue.split('f');
    if (arrHash[0]) {
        $(window).scrollTop(arrHash[0]);
    }
    if (arrHash[1]) {
        $(window).scrollLeft(arrHash[1]);
    }
}

(function ($) {

    var menu;

    $.fn.f360Menu = function (event) {

        menu = $('>ul', this).addClass('menu');

        $('ul', menu).addClass('dropdown-menu').hide().parent('li').addClass('dropdown');

        var eventName = $(this).attr('data-event') ? $(this).attr('data-event') : "mouseenter";

        if (eventName == "click") {
            $("body").click(function () {
                $('ul', menu).hide();
                $('li', menu).removeClass('open');
            });
        }
        if (eventName == "mouseenter") {
            $('li', menu).mouseleave(function () {
                $(this).removeClass('open');
                refreshUI($(this));
            });
        }

        $('li a', menu).bind(eventName, function (e) {
            e.stopPropagation();

            var _li = $(this).parent('li');

            if (eventName == "click" && _li.hasClass('open')) {
                _li.removeClass('open');
                refreshUI(_li);
            } else {
                _li.filter('.dropdown').addClass('open');
                _li.siblings('li').removeClass('open');
                refreshUI(_li);
            }

        });
    }

    function refreshUI(o) {
        o.parent('ul').children('li').each(function () {
            if ($(this).hasClass('open')) {
                $(this).children('.dropdown-menu').show();
            } else {
                $(this).children('.dropdown-menu').hide();
            }
        });
    }

    $("html").click(function () {
        var hashValue = location.hash.substring(1);

        if (hashValue == "?") {
            prompt("", "\"width\":" + $(this)[0].clientWidth + ",\"height\":" + $(this)[0].clientHeight + ",\"scroll_top\":" + $(this).scrollTop() + ",\"scroll_left\":" + $(this).scrollLeft());
            return false;
        }

    });

    if ($('.menu-nav').length == 1) {
        $('.menu-nav').f360Menu();
    }

})(jQuery);

(function ($) {

    $.fn.setValue = function (val) {
        if ($(this).is(":input"))
            $(this).val(val);
        else
            $(this).text(val);
        return $(this);
    }

    $.fn.getValue = function (val) {
        if ($(this).is(":input"))
            return $(this).val();
        else
            return $(this).text();
    }

    $.fn.f360Search = function (o) {
        if (window.search_obj) {
            o = window.search_obj;
        }
        o = $.extend(
            {
                inputDefaultText: '',           //输入框显示的文字，为空时，默认取得该标签上的文字
                selectedOptionClass: 'on',      //当选项为偏平式显示时，选中状态的样式名，默认为on
                optionHtmlTag: ''                //选项标签，如果为空时，指向自己,非偏平式不用改
            }, o || {});

        //取得对象
        var isFlat = false;                    //指示是否偏平式
        var targetDropdown = $('.search_dropdown', this);//下拉框
        if (targetDropdown.is(":hidden"))
            isFlat = true;

        var targetInput = $('.search_enter', this);//输入框
        var targetButton = $('.search_button', this);//搜索按钮

        if (targetDropdown.length <= 0 || targetInput.length <= 0 || targetButton.length <= 0) {
            return false;
        }

        var targetPanel;
        if (targetDropdown.attr("data-panel")) {
            targetPanel = $('.' + targetDropdown.attr("data-panel") + '', this);
        } else {
            targetPanel = targetDropdown.next();
        }

        //下拉框处理
        targetDropdown.click(function () {
            targetPanel.toggle();
        });

        targetPanel.mouseleave(function () {
            if (!isFlat) {
                $(this).hide();
            }
        });

        var paneloptions = targetPanel.find("a");
        if (paneloptions.length <= 0) {
            paneloptions = targetPanel.children();
        }
        paneloptions.click(function () {
            targetDropdown.setValue($(this).getValue()).attr("data-url", $(this).attr("data-url"));
            if (isFlat) {
                if (o.optionHtmlTag) {//有指定选项标签的情况
                    $(this).parents(o.optionHtmlTag).addClass(o.selectedOptionClass).siblings(o.optionHtmlTag).removeClass(o.selectedOptionClass);
                } else {
                    $(this).addClass(o.selectedOptionClass).siblings().removeClass(o.selectedOptionClass);
                }
            } else {
                targetPanel.hide();
            }
        });

        paneloptions.each(function () {
            var _selectedPageUrl = targetDropdown.attr("data-page");
            var _optionPageUrl = $(this).attr("data-page");
            if (_optionPageUrl.indexOf(_selectedPageUrl + ",") >= 0) {
                targetDropdown.setValue($(this).text()).attr("data-url", $(this).attr("data-url"));
            }
        });

        //输入框处理
        var oriText = o.inputDefaultText;
        if (targetInput.length > 0) {
            if (!oriText) {
                oriText = targetInput.val();
            }
            targetInput.focus(function () {
                if (targetInput.val() == oriText) {
                    targetInput.val("").addClass("hascontent").removeClass("nocontent");;
                }
            });
            targetInput.blur(function () {
                if (targetInput.val() == "") {
                    targetInput.val(oriText).addClass("nocontent").removeClass("hascontent");
                } else {
                    targetInput.addClass("hascontent").removeClass("nocontent");
                }
            });
        }

        //搜索按钮处理
        function searchSubmit(url, key) {
            if (oriText == key || !key)
                return false;

            key = encodeURIComponent(key);

            if (url.indexOf("?") >= 0) {
                url += "&key=" + key;
            } else {
                url += "?key=" + key;
            }
            //window.open(url, "_blank");//会造成新页面被浏览器所拦截
            location.href = url;
        }

        targetInput.keydown(function (event) {
            if (event.keyCode == 13) {
                var _url = targetDropdown.attr("data-url");
                var _key = targetInput.val();
                searchSubmit(_url, _key);
            }
        });

        targetButton.click(function () {
            var _url = targetDropdown.attr("data-url");
            var _key = targetInput.val();
            searchSubmit(_url, _key);
        });
    }

    if ($('.search').length == 1)
        $('.search').f360Search();

    $.fn.f360GoBooking = function (url) {

        if (!$.cookie)
            return;

        $.cookie('booking-title', null);
        $.cookie("booking-title", $(this).attr("data-title"), { path: '/' });

        var _url = url;
        if (!_url && $(this).attr("data-url")) {
            _url = $(this).attr("data-url");
        } else {
            _url = "gbook";
        }
        window.location.href = "http://static2.fuhai360.com/" + _url + ".html";
    }

    $.f360GetBookingInfo = function () {

        if (!$.cookie)
            return;

        var o;

        var _title = "";
        if ($.cookie("booking-title")) {
            _title = $.cookie("booking-title");
            $.cookie('booking-title', null);
        }

        o = {
            title: _title
        }
        return o;
    }

    //关闭微件按钮
    $.fn.f360CloseBlock = function () {
        $(this).click(function () {
            var _block = $(this).parents("[block]");
            if (_block.length > 0) {
                _block.remove();
            }
        });
    }

    if ($('.close').length > 0) {
        $('.close').f360CloseBlock();
    }
})(jQuery);