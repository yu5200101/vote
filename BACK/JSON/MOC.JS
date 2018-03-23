let fs = require('fs');

let random = (n, m)=> {
    return Math.round(Math.random() * (m - n) + n);
};

//->MOC USER 数据
~function () {
    let ary = [],
        xing = '赵钱孙李周吴郑王冯陈楚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏唐江',
        ming = '一二三四五六七八九';
    let matchId = 0;

    let bio = ['Live beautifully, dream passionately, love completely', 'Albert Einstein: Logic will get you from A to B. Imagination will take you everywhere', 'The greatest test of courage on earth is to bear defeat without losing heart', 'A mans best friends are his ten fingers', 'Only they who fulfill their duties in everyday matters will fulfill them on  great occasions'];

    let sloganAry = ['很多事情努力了未必有结果，但是不努力却什么改变也没有', '留一片空白，随时浓墨重彩', '你认为自己行就一定行，每天要不断向自己重复', '你是唯一的，你是非常独特的，你就是你生命中的第一名', '只要充分相信自己，没有什么困难可以足够持久', '不要沉沦，在任何环境中你都可以选择奋起', '一个人只有投身于伟大的时代洪流中，他的生命才会闪耀出光彩', '要培养各方面的能力，包括承受悲惨命运的能力', '只要你不认输，就有机会！', '只有收获，才能检验耕耘的意义；只有贡献，方可衡量人生的价值'];

    for (let i = 1; i <= 185; i++) {
        let sex = random(0, 10) % 2,
            isMatch = random(0, 10) % 2,
            phone = '1';
        for (let j = 1; j <= 10; j++) {
            phone += random(0, 9);
        }
        if (isMatch === 1) {
            matchId++;
            if (matchId < 10) {
                matchId = '00' + matchId;
            } else if (matchId < 100) {
                matchId = '0' + matchId;
            } else {
                matchId = '' + matchId;
            }
        }

        let obj = {
            "id": i,
            "name": `${xing[random(0, 31)]}${ming[random(0, 8)]}`,
            "picture": sex === 0 ? 'img/man.png' : 'img/woman.png',
            "phone": phone,
            "sex": sex,
            "password": "4af22e23abcea2099da82741",
            "bio": bio[random(0, 4)],
            "time": 1506090072369,
            "isMatch": isMatch,
            "matchId": isMatch === 1 ? matchId : '000',
            "slogan": isMatch === 1 ? sloganAry[random(0, 9)] : '',
            "voteNum": 0
        };
        ary.push(obj);
    }
    fs.writeFileSync('./USER.JSON', JSON.stringify(ary), 'utf-8');
}();