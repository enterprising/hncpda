var url="http://cmsv2.fuhai360.com/";
var resource = "http://static2.fuhai360.com/";
var siteId = 0, lang = 'cn', pagesize = 8, pageindex = 1; load_data = true;

function initLoad(siteId,lang,pagesize,pageindex,load_data) {
    this.siteId = siteId;
    this.lang = lang;
    this.pagesize = pagesize;
    this.pageindex = pageindex;
    this.load_data = load_data;

    if (load_data) {
        loadMsgData(pagesize, pageindex);
    }
}

function loadMsgData(pageSize, pageIndex) {
    if ($('.div_messageList').length)
        $('.div_messageList').remove();

    $.ajax(url + '/async.ashx?act=loadMessage', {
        dataType: 'jsonp',
        type: 'get',
        data: {
            siteId: siteId,
            lang: lang,
            pageSize: pageSize,
            pageIndex: pageIndex
        },
        success: function (data) {
            if (data && data.success)
                $('#messageonline').prepend(data.msg);
            else
                $("#messageonline").prepend("<span>加载数据失败！</span>");
        }
    });
}

$("#btnMessageOnlineSubmit").click(function () {
    //结果显示
    var _resultMsg;
    if ($('#resultMsg').length)
        _resultMsg = $('#resultMsg').hide();
    else {
        _resultMsg = $("<div id='resultMsg' style='display:hidden;'></div>");
        $(this).after(_resultMsg);
    }

    //===========验证 begin===========
    var isValidate = true;
    $('.messageonline_items label:has(em)').each(function () {
        if ($(this).next(":input").val().length == 0) {
            _resultMsg.addClass("error").removeClass("success").html("请至少完成必填项").show();
            isValidate = false;
            return;
        }
    });
    if (!isValidate)
        return;

    if ($('#onlineTel').length && $('#onlineTel').val()) {
        var reg = /^[-—\d]*$/;
        if (!reg.test($('#onlineTel').val())) {
            _resultMsg.addClass("error").removeClass("success").html("电话格式不正确").show();
            return;
        }
    }

    if ($('#onlineEmail').length && $('#onlineEmail').val()) {
        var reg = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if (!reg.test($('#onlineEmail').val())) {
            _resultMsg.addClass("error").removeClass("success").html("邮箱地址格式不正确").show();
            return;
        }
    }

    if ($('#onlineWebsite').length && $('#onlineWebsite').val()) {
        var reg =/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
        if (!reg.test($('#onlineWebsite').val())) {
            _resultMsg.addClass("error").removeClass("success").html("网址格式不正确").show();
            return;
        }
    }
    //===========验证 end============

    //进度显示
    var _process;
    if ($('#progress').length)
        _process = $('#progress').show();
    else {
        _process = $("<div id='progress'><img src='" + resource + "/global/images/loading.gif'><span>提交中 …</span></div>");
        $(this).after(_process);
    }
	
	if ($.isFunction(window.feedbackDebug)) {
		feedbackDebug.apply(this,
			[
				url + '/async.ashx?act=addMessage',
				"siteId="+siteId+"&lang="+lang+"&" + $('.messageonline_items :input').serialize()
			]
		);
	}

    $.ajax(url + '/async.ashx?act=addMessage', {
        type: 'GET',
        dataType: 'JSONP',
        data: "siteId="+siteId+"&lang="+lang+"&" + $('.messageonline_items :input').serialize(),
        success: function (data) {
            _process.hide();
			$('#lnk_refrech').click();//刷新验证码
			if ($.isFunction(window.feedbackDebug)) {
				feedbackDebug.apply(this, arguments);
			}
            if (data && data.success) {
                _resultMsg.addClass("success").removeClass("error").html(data.msg).show();

                initForm();

                if (load_data) {
                    loadMsgData(pagesize, pageindex);
                }
                
            }
            else {
                if (data.msg)
                    _resultMsg.addClass("error").removeClass("success").html(data.msg).show();
                else
                    _resultMsg.addClass("error").removeClass("success").html("异步错误，请检查网络").show();
            }
        },
		error: function() {
			_process.hide();
			$('#lnk_refrech').click();
			if ($.isFunction(window.feedbackDebug)) {
				feedbackDebug.apply(this, arguments);
			}
		}
    });
});


function initForm() {
    $('.messageonline_items :input').each(function () {
        $(this).val("");
    });
}

$('#lnk_refrech').bind('click', function () {
    $('.img-wrap img').attr('src', url + '/gvc/?img&t=' + $.now());
    return false;
});