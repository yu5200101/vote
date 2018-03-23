let loginRender = (function ($) {
    let $userName = $('#userName'),
        $userPass = $('#userPass'),
        $submit = $('#submit');


    let $plan = $.Callbacks();
    $plan.add(data => {
        localStorage.setItem('userInfo', JSON.stringify(data));
        Dialog.show('登录成功！', {
            callBack: function () {
                let {history = encodeURIComponent('index.html')} = location.href.myQueryURLParameter();
                location.href = decodeURIComponent(history);
            }
        })
    });
    let submitFn = function () {
        //=>密码的处理
        let passWord = $userPass.val().trim();
        if (passWord === '######') {
            //=>属于记住用户名和密码功能自动补充的，我们需要把本地存储的加密后的密码获取到提交给服务器
            let userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                userInfo = JSON.parse(userInfo);
                passWord = userInfo['password'];
            }
        } else {
            //=>属于用户自己输入的：我们把密码进行md_5加密再传递给服务器
            passWord = hex_md5(passWord);
        }
        $.ajax({
            url: '/login',
            type: 'POST',
            dataType: 'json',
            data: {
                name: $userName.val().trim(),
                password: passWord
            },
            success: result => {
                let {code, data} = result;
                if (code != 0) {
                    Dialog.show('登录失败!');
                    return;
                }
                $plan.fire(data);
            }
        });
    };
    return {
        init() {
            //=>记住用户名密码
            let userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                userInfo = JSON.parse(userInfo);
                $userName.val(userInfo['name']);
                $userPass.val('######');
                //=>我们不是从本地获取密码放在文本框中
                //=>1、本地存储的密码是经过静谧的，放在文本框中太长
                //=>2、当用户点击提交的时候，自己输入的是经过MD5加密处理，如果是默认记录的我们直接把上一个本地记录的，已经加密的传递给服务器即可（不需要重新md_5处理了）
            }
            $submit.tap(submitFn);
        }
    }
})(Zepto);
loginRender.init();