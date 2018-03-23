let detailRender = (function ($) {
    let passId = null,
        $plan = $.Callbacks();

    let $headerBox = $('.headerBox');

    let userInfo = localStorage.getItem('userInfo');
    userInfo = userInfo ? JSON.parse(userInfo) : {};

    //=>数据绑定
    $plan.add(result=> {
        let {id, name, picture, sex, phone, bio, isMatch, matchId, slogan, voteNum}=result;

        let str = ``;
        str += `<div class="userInfo">
            <img src="${picture}" alt="" class="picture">
            <p class="info">
                <span>${name}</span>
                ${isMatch == 1 ? ` | <span>编号 #${matchId}</span>` : ``}
            </p>
            <p class="bio">${bio}</p>
            ${isMatch == 1 ? `<div class="vote">${voteNum}</div>` : ``}
        </div>
        ${isMatch == 1 ? `<div class="slogan">${slogan}</div>
        <a href="javascript:;" class="voteBtn">投他一票</a>` : ``}
        `;
        $headerBox.html(str);
    });

    //=>进一步验证投他一票的按钮
    $plan.add(result=> {
        let $voteBtn = $headerBox.find('.voteBtn');
        //->如果登录了,而且展示的是自己的信息,我们不能投票
        if (userInfo.id == passId) {
            $voteBtn.remove();
            return;
        }

        //->当前这个人不是我,但是我已经投票了,也不再显示
        if (userInfo.id != passId) {
            $.ajax({
                url: '/checkUser',
                dataType: 'json',
                data: {
                    userId: userInfo.id,
                    checkId: passId
                },
                success: result=> {
                    result.isVote == 1 ? $voteBtn.remove() : null;
                }
            });
        }

        //->点击投票按钮投票
        $voteBtn.tap(function () {
            if (!userInfo.id) {
                Dialog.show('请先登录!');
                return;
            }
            $.ajax({
                url: '/vote',
                data: {
                    userId: userInfo.id,
                    participantId: passId
                },
                dataType: 'json',
                cache: false,
                success: result=> {
                    if (result.code == 1) {
                        Dialog.show('投票失败！');
                        return;
                    }
                    Dialog.show('投票成功！');
                    let $vote = $headerBox.find('.vote');
                    $vote.html(parseFloat($vote.html()) + 1);
                    $voteBtn.remove();
                }
            });
        });
    });

    //=>获取详细信息
    let queryData = function () {
        $.ajax({
            url: '/getUser',
            dataType: 'json',
            data: {userId: passId},
            success: result=> {
                let {code, message, data}=result;
                if (code == 0) {
                    //->SUCCESS
                    $plan.fire(data);
                    return;
                }
                //->ERROR:提示客户当前查询的客户信息不匹配,点击确定后,回到首页面(这块的需求有产品决定或者自己处理即可)
                /*alert('您所查询的数据不匹配！');//=>真实项目中最好不要使用ALERT或者CONFIRM这些内置的弹出框(内置的太丑),有些APP会自动屏蔽ALERT
                 window.location.href = 'index.html';*/
                Dialog.show('您所查询的数据不匹配!', {
                    callBack: ()=> {
                        window.location.href = 'index.html';
                    }
                });
            }
        });
    };

    //=>获取我投递的和投递我的
    let voteInfoFn = function () {
        //=>获取投递我的
        let $voteMy = $('#voteMy'),
            $voteMyList = $voteMy.find('.list');
        $.ajax({
            url: '/getVoteMy?userId=' + userInfo.id,
            dataType: 'json',
            success: result=> {
                let {code, total, list}=result;
                if (code != 0) return;
                $voteMyList.html(bindHTML(list));
                $voteMy.css('display', 'block');
            }
        });

        //=>获取我投递的
        let $myVote = $('#myVote'),
            $myVoteList = $myVote.find('.list');
        $.ajax({
            url: '/getMyVote?userId=' + userInfo.id,
            dataType: 'json',
            success: result=> {
                let {code, total, list}=result;
                if (code != 0) return;
                $myVoteList.html(bindHTML(list));
                $myVote.css('display', 'block');
            }
        });
    };

    let bindHTML = function (data) {
        let str = ``;
        data.forEach(item=> {
            let {id, name, picture, sex, matchId, slogan, voteNum, isVote}=item;
            str += `<li>
                <a href="detail.html?userId=${id}">
                    <img src="${picture}" alt="" class="picture">
                    <p class="title">${name}</p>
                    <p class="bio">${slogan || ``}</p>
                </a>
                <div class="vote">
                    ${matchId ? `<span class="voteNum">${voteNum}</span>
                    ${isVote == 0 ? `<a href="javascript:;" class="voteBtn">投他一票</a>` : ``}
                    ` : ``}
                </div>
            </li>`;
        });
        return str;
    };

    return {
        init: function () {
            //=>获取地址栏中传递进来USER-ID的值
            //window.location.href:获取当前页面URL地址
            //window.location.href='xxx':在JS中让页面跳转到XXX页面(在本页面实现页面跳转,不是以新窗口跳转)
            //window.open('xxx'):这个也是JS中页面跳转的方式(基于新窗口打开页面,等价于A中 target='_blank')
            passId = window.location.href.myQueryURLParameter()['userId'];
            if (userInfo.id) {
                //=>已经登录了,但是如果passId没有,说明没有传递值,此时我们应该看的是自己的
                !passId ? passId = userInfo.id : null;
            }

            queryData();

            //=>展示我投票的和投递我的(个人中心)
            if (userInfo.id == passId) {
                voteInfoFn();
            }
        }
    }
})(Zepto);
detailRender.init();