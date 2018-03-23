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
        total = 0;//=>总数量

    //=>记录一些后续可能会用到的数据
    $plan.add(result=> {
        pageNum = result.pageNum;
        total = result.total;

        //->判断是否获取到数据,从而控制列表或者提示的显示隐藏
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
                    ${isVote == 1 ? `` : `<a href="javascript:;" class="voteBtn">投${sex == 0 ? `他` : `她`}一票</a>`}
                </div>
            </li>`;
        });
        //$userContainer.html($userContainer.html()+str); //=>它的原理是innerHTML,每一次操作都会把原有绑定的数据先当字符串拿出来,再和最新的拼接,最后整体存放进去(对原有已经绑定的有影响,性能消耗也比较大)
        $userContainer.append(str);
    });

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
                search: $input.val(),//=>搜索框中输入的内容
                userId: 0
            },
            success: $plan.fire
        });
    };

    return {
        init: function () {
            queryData();
        }
    }
})(Zepto);
indexRender.init();