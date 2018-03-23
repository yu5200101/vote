let less = require('less'),
    fs = require('fs');
let fileAry = ['./index.less', './detail.less', './register.less'];
fileAry.forEach((item, index)=> {
    let con = fs.readFileSync(item, 'utf-8');
    less.render(con, {compress: true}, (error, value)=> {
        let newFileName = item.replace(/\.less/ig, '.min.css').replace('./css/', '');
        fs.writeFileSync(`../${newFileName}`, value.css);
    });
});