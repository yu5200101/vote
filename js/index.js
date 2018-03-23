let indexRender = (function ($) {
    let $userList = $('.userList'),
        $userContainer = $userList.find('ul'),
        $userTip = $userList.find('.tip'),
        $headerBox = $('.headerBox'),
        $input = $headerBox.find('input'),
        $searchBtn = $headerBox.find('.searchBtn');

    let $plan = $.Callbacks(),
        limit = 10,//=>每页展示的数量
        page = 1,//=>当前页码
        pageNum = 0,//=>总页数
        total = 0,//=>总数量
        isLoading = true;//=>用来记录当前是否正在加载最新的数据 TRUE:正在加载 FALSE:已经加载完成

    //=>获取已经登录的信息
    let userInfo = localStorage.getItem('userInfo');
    userInfo = userInfo ? JSON.parse(userInfo) : {};

    //=>记录一些后续可能会用到的数据
    $plan.add(result=> {
        pageNum = result.pageNum;
        total = result.total;

        result['code'] == 0 ? ($userContainer.css('display', 'block'), $userTip.css('display', 'none')) : ($userContainer.css('display', 'none'), $userTip.css('display', 'block'));
    });

    //=>数据绑定
    $plan.add(result=> {
        let {code, list}=result;
        if (code != 0) return;

        let str = ``;
        list.forEach((item, index)=> {
            let {id, name, picture, sex, matchId, slogan, voteNum, isVote}=item;
            str += `<li>
                <a href="detail.html?userId=${id}">
                    <img src="img/${sex == 0 ? 'man.png' : 'woman.png'}" alt="" class="picture">
                    <p class="title">
                        <span>${name}</span>
                        |
                        <span>编号 #${matchId}</span>
                    </p>
                    <p class="slogan">${slogan}</p>
                </a>
                <div class="vote">
                    <span class="voteNum">${voteNum}</span>
                    ${isVote == 1 ? `` : `<a href="javascript:;" class="voteBtn" data-id="${id}">投${sex == 0 ? `他` : `她`}一票</a>`}
                </div>
            </li>`;
        });
        $userContainer.append(str);

        isLoading = false;//=>数据绑定完成让其变为FALSE代表加载完成
    });

    //=>投票操作
    let voteFn = function (e) {
        let $target = $(e.target);
        if ($target.hasClass('voteBtn')) {
            //=>验证是否登录
            if (!userInfo.id) {
                Dialog.show('请您先登录再投票!');
                return;
            }
            $.ajax({
                url: '/vote',
                data: {
                    userId: userInfo.id,
                    participantId: $target.attr('data-id')
                },
                dataType: 'json',
                cache: false,
                success: result=> {
                    let {code}=result;
                    if (code != 0) {
                        Dialog.show('投票失败!');
                        return;
                    }
                    Dialog.show('感谢您的支持!');
                    let $pre = $target.prev('span');
                    $pre.html(parseFloat($pre.html()) + 1);
                    $target.remove();
                }
            });
        }
    };

    //=>通过AJAX获取需要的数据
    let queryData = function () {
        $.ajax({
            url: '/getMatchList',
            type: 'GET',
            dataType: 'json',
            cache: false,
            data: {
                limit: limit,
                page: page,
                search: $input.val(),
                userId: userInfo.id || 0
            },
            success: $plan.fire
        });
    };

    //=>搜索匹配
    let searchFn = function () {
        page = 1;//=>设置PAGE=1,重新展示搜索的内容
        isLoading = true;//=>证明当前正在请求与搜索关键词匹配的数据(此时不进行下拉刷新等操作)
        $userContainer.html('');//=>在展示新数据之前,先把容器中的老数据清空,这样后期才能在开始位置展示搜索的信息
        queryData();
    };

    return {
        init: function () {
            queryData();
            $userContainer.tap(voteFn);

            //=>下拉刷新
            $(window).on('scroll', ()=> {
                if (isLoading) return;
                if (page >= pageNum) return;

                let {scrollTop:scrollT, clientHeight:winH, scrollHeight:scrollH}=document.documentElement;
                if (scrollT + winH + 100 >= scrollH) {
                    isLoading = true;
                    page++;
                    queryData();
                }
            });

            //=>点击搜索
            $searchBtn.tap(searchFn);
            $input.on('input', searchFn);
        }
    }
})(Zepto);
indexRender.init();