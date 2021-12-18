const fs = require('fs');
const visits = JSON.parse(fs.readFileSync('./csv-Nurse.json'));
const tRows = JSON.parse(fs.readFileSync('./data.json'));

let lastpostcode = 0;
let postcodename = '';//这两只后面都变成上次轮到的值
let postcodeStart = 0;

let names = {};
let unnamedPostcodes = [];

visits.forEach((visit, i) => {
  //i从0开始
  if (visit.PostCode === lastpostcode) {
    // 当前轮到的postcode和上一个相同
    if (postcodename !== '' && visit.Suburb !== postcodename) {
      // Wanguri 和 Nakara postcode一样但是suburb不一样
      // 或者 every time when出现了一个新的suburb，qie shange postcodename buweikong. 此时yao让postcodename变为空
      postcodename = '';
    } else {
      //name一致根本不用讨论，因为不会有影响，skip就行
      // console.log(visit.Suburb + " dfeds " + postcodename);
    }
  } else {
    if (postcodename !== '') {
      names[lastpostcode] = postcodename;
      //这里的两其实都是上一轮的值
      //左边是key 右边是value
    } else {
      //当postcodename 为空时候,这也是刚开始循环的情况。 *注意19行postcodename被定义为空也会跑到这里来
      let tRow = tRows['' + lastpostcode];//因为tRow的key是string啊,但是去除引号 tRows[lastpostcode]也能使用
      // console.log(tRow);// tRows[0]undefined也能进行下去？？？！！！！确实不影响。但是结果有一个bug
      let BestNameFound = false;
      let lowestIndex = Infinity;
      let winningSuburb = '';
      let nameCount = {};

      for (let j = postcodeStart; j < i; j++) {
        // console.log('JJJJJIIII' + i)//每进入一个新的postcode group，j都会从那里开始
        // 此时的i是postcode 812所在的i
        if (!nameCount[visits[j].Suburb]) {
          //visits[j].Suburb是客户输入的suburb名
          //当假时，也就是没有计数的时候
          nameCount[visits[j].Suburb] = 1;
        } else {
          //曾经有过了就再加一
          nameCount[visits[j].Suburb]++;
        }
        let pos = tRow.toLowerCase().indexOf(visits[j].Suburb.toLowerCase());
        // console.log(visits[j].Suburb, pos)
        if (pos === 0) {
          //(pos === 0) 表示在alldata tRaw里面找到了护士的mushroom
          names[lastpostcode] = visits[j].Suburb;
          // console.log("1" + names);
          //此时两名字一样
          BestNameFound = true;
          //咱们可以找到名字
          break;//break是从循环里面跳出来的意思.而且写在break之前的活要干。   continue循环会继续，skip掉符合条件的代码
        } else {
          //护士输入的suburb不在主地区第零位， 
          if (pos !== -1 && pos < lowestIndex) {
            //不在第零位，但是可以找到match的，但是我们把这归于bestname没有found。bestNameFound为false
            lowestIndex = pos;
            winningSuburb = visits[j].Suburb;
            // 此时的winningsuburb就用用护士输入的suburb，此时这个护士输入的suburb值和大悉尼区的悉尼一样
          } else {
            //没写 压根没有一个字match找不到怎么办，因为这部分写在!BestNameFound里面了，没想到吧
          }
        }
      }

      if (!BestNameFound) {
        // 此处注意，第一轮循环是会进来的！！！！别因为写得太远你就不知道你在哪里了
        //压根没有匹配任何名字 or match位不在第零位，但是可以找到，但是我们把这归于bestName没有found
        if (winningSuburb !== '') {//如果有winningsuburb。即直接用护士输入的suburb
          names[lastpostcode] = winningSuburb;
          //object【key】=value
        } else {
          //没有最佳名字。或者像第一轮的情况有些事情还没做且winningsuburb为空。
          //或者压根没有一个字match
          //就用护士输入最多次的suburb，最终还是有名字的，即使不是最佳
          let highestCount = 0;
          Object.keys(nameCount).forEach((suburb) => {
            if (nameCount[suburb] > highestCount) {
              //value是数字，key是suburb
              winningSuburb = suburb;//最终整到的
              // console.log("should have th" + winningSuburb);
              highestCount = nameCount[suburb];
            } 
            else if (nameCount[suburb] === highestCount) {
              //the count is the same and no main area suburb name contain the suburb nurse insert
              // console.log(nameCount);
              winningSuburb = 'need to check';
              //去除这个部分就能强制被定义？？
            }
          });

          if (winningSuburb !== '') {
            names[lastpostcode] = winningSuburb;
            //方括号里面是key，右边是value
          } else {
            unnamedPostcodes.push(lastpostcode);
            // console.log(`this postcode has no name set because the count is the same and no main area suburb name contain the suburb nurse insert ` + lastpostcode);
            //do sth to above situate set the last suburb in nurse.json as the suburbm counts is the same

            //0在这里也会体现  为 '0': 'Nakara', 所以结论就是lastpostcode的初始值不能设置为0，改成visits[0].PostCode;
          }
        }
      }
    }
    postcodename = visit.Suburb; //postodename 是nurse去的且想要的名字
    lastpostcode = visit.PostCode;
    postcodeStart = i;
    //注意上面这三行是在for each循环的else statement里面的，所以这三个值会被更新，0那一轮之后，lastposcode和postcodename都会更新成第一个i 
    //i.e.postcode为810 的第一个输入的相应东西
    //postcodestart=0
  }

}

);
console.log("these postcodes array has no no winning suburb name ，because the count is the same and no main area suburb name contain the suburb nurse insert" + unnamedPostcodes);
console.log("number of postcodes has no winning suburb name is: " + unnamedPostcodes.length);
console.log(names);





