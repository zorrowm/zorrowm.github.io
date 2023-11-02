const menuConfig2D = [
  {
    name: '前端开发资源',
    icon: 'icon-a-Layermanagement_3',
    key: 'frontResource',
    children: [
      {
        name: '01.JavaScript',
        key: '01',
        children: [
          {
            name: 'JavaScript 教程',
            path: 'https://wangdoc.com/javascript/',
            info: '通俗易懂的JavaScript教程'
          },
          {
            name: 'ES6 入门教程',
            //icon: '/img/menuConfig/swaggerAPI.png',
            path: 'https://es6.ruanyifeng.com/',
            info: '通俗易懂的ES6入门教程'
          },
          {
            name: 'JavaScript 30',
            //icon: '/img/menuConfig/swaggerAPI.png',
            path: 'https://javascript30.com/',
            info: '使用原生JavaScript在30天内完成30个项目'
          },
          {
            name: '现代 JavaScript 教程',
            //icon: '/img/menuConfig/swaggerAPI.png',
            path: 'https://zh.javascript.info/',
            info: '最近很流行的JavaScript教程'
          },
          {
            name: 'Node.js学习指南',
            //icon: '/img/menuConfig/swaggerAPI.png',
            path: 'https://blog.poetries.top/node-learning-notes/',
            info: '系统的Node.js学习教程和笔记系统整理'
          },
          {
            name: 'JS 代码规范',
            //icon: '/img/menuConfig/swaggerAPI.png',
            path: 'https://github.com/ryanmcdermott/clean-code-javascript',
            info: '优秀的 JS代码规范'
          },
          {
            name: 'TypeScript 教程',
            //icon: '/img/menuConfig/swaggerAPI.png',
            path: 'https://github.com/xcatliu/typescript-tutorial',
            info: '通俗易懂的TypeScript教程'
          },
          {
            name: 'TypeScript 教程',
            //icon: '/img/menuConfig/swaggerAPI.png',
            path: 'https://jspang.com/detailed?id=63',
            info: '最好的TypeScript 视频+图文教程'
          }
        ]
      },
      {
        name: '02.CSS样式',
        key: '02',
        children: [
          {
            name: 'CSS Tricks 效果大全',
            //icon: '/img/menuConfig/resizeImage.png',
            path: 'https://lhammer.cn/You-need-to-know-css/#/zh-cn/',
            info: 'CSS的各种效果实现 有很多动画效果'
          },
          {
            name: 'CSS Inspiration',
            //icon: '/img/menuConfig/compressimage.png',
            path: 'https://github.com/chokcoco/CSS-Inspiration',
            info: 'CSS灵感的诞生地 我每天都的网站'
          },
          {
            name: 'CSS 常用样式',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://github.com/QiShaoXuan/css_tricks',
            info: '有很多常用的CSS样式'
          },
          {
            name: 'Animista',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://animista.net/',
            info: 'CSS动画库 主打按需定制CSS动画效果'
          },
          {
            name: 'CSS Minifier',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://cssminifier.com/',
            info: '在线CSS代码简化/压缩工具'
          },
          {
            name: 'Sass: Sass 文档',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://sass.bootcss.com/documentation',
            info: 'Sass 中文网 成熟、稳定、强大的CSS扩展语言'
          },
          {
            name: 'Less 快速入门',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://less.bootcss.com',
            info: 'Less 快速入门 | Less.js 中文文档 将CSS赋予了动态语言特性的样式语言'
          },
          {
            name: 'stylus',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://stylus-lang.com/',
            info: 'CSS扩展 富有变现里、动态、健壮的CSS'
          }
        ]
      },
      {
        name: '03.算法数据',
        key: '03',
        children: [
          {
            name: 'JavaScript 算法与数据结构',
            //icon: '/img/menuConfig/tdtapi.png',
            path: 'http://github.com/trekhleb/javascript-algorithms',
            info: '多种基于JavaScript的算法与数据结构'
          },
          {
            name: 'leetcode 解题之路 ',
            //icon: '/img/menuConfig/cesiumAPI.png',
            path: 'https://github.com/azl397985856/leetcode',
            info: '私藏LeetCode解题攻略'
          },
          {
            name: '五分钟学算法',
            //icon: '/img/menuConfig/mapboxapi.png',
            path: 'https://github.com/MisterBooo/LeetCodeAnimation',
            info: '每天拿出五分钟 学学算法 比如上个厕所就学了'
          },
          {
            name: '数据结构与算法项目推荐',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://github.com/biaochenxuying/blog/issues/43',
            info: 'Github上170K+Star的前端学习数据结构和算法题目'
          },
          {
            name: 'JavaScript 十大经典排序算法',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://github.com/biaochenxuying/blog/issues/42',
            info: 'JavaScript排序必会题目 作者功力很深 值得学习'
          },
          {
            name: '算法可视化工具',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://github.com/algorithm-visualizer/algorithm-visualizer',
            info: '用可视化工具和交互方式 让你从代码中可视化算法 '
          },
          {
            name: '算法可视化来源',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://visualgo.net/en',
            info: ' '
          },
          {
            name: '算法的工作方式',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://github.com/skidding/illustrated-algorithms',
            info: '变量和操作的可视化表示 增强了控制流和实际源代码'
          }
        ]
      },
      {
        name: '04.前端面试',
        key: '04',
        children: [
          {
            name: '前端面试常考问题整理',
            //icon: '/img/menuConfig/resizeImage.png',
            path: 'https://lhammer.cn/You-need-to-know-css/#/zh-cn/',
            info: 'CSS的各种效果实现 有很多动画效果'
          },
          {
            name: '前端开发面试题',
            //icon: '/img/menuConfig/compressimage.png',
            path: 'https://github.com/markyun/My-blog/tree/master/Front-end-Developer-Questions',
            info: ''
          },
          {
            name: 'WEB前端面试宝典',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://github.com/h5bp/Front-end-Developer-Interview-Questions/',
            info: ''
          },
          {
            name: '掘金前端面试题合集',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://github.com/shfshanyue/blog/blob/master/post/juejin-interview.md',
            info: ''
          },
          {
            name: '前端面试图谱',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://yuchengkai.cn',
            info: ''
          },
          {
            name: '前端面试开源项目汇总',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://github.com/biaochenxuying/blog/issues/47',
            info: 'Github上100K+ Star 的前端面试开源项目汇总'
          }
        ]
      },
      {
        name: '05.技术社区',
        key: '05',
        children: [
          {
            name: 'GitHub',
            //icon: '/img/menuConfig/tdtapi.png',
            path: 'https://github.com/',
            info: '高质量内容创作和分享平台'
          },
          {
            name: 'Stackoverflow',
            //icon: '/img/menuConfig/cesiumAPI.png',
            path: 'https://stackoverflow.com/',
            info: '一个回答技术问题的网站'
          },
          {
            name: '掘金',
            //icon: '/img/menuConfig/mapboxapi.png',
            path: 'https://juejin.cn/',
            info: '国内的很多优质前端文章都掘金'
          },
          {
            name: '博客园',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.cnblogs.com/',
            info: '一个很纯粹的技术博客平台'
          },
          {
            name: '知乎',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.zhihu.com/',
            info: '很多程序人喜欢泡在知乎'
          },
          {
            name: 'CSDN',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.csdn.net/',
            info: '老牌社区 程序员必上的一个社区 '
          },
          {
            name: 'v2ex',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://segmentfault.com/',
            info: '程序员分享和探索的社区'
          },
          {
            name: 'segmentfault',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://segmentfault.com/',
            info: '低调技术博客社区'
          },
          {
            name: 'Node.js 中文社区',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://cnodejs.org/',
            info: 'node专业中文社区'
          },
          {
            name: '博客杂志站点',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.smashingmagazine.com/',
            info: '一个 web 技术类的博客杂志站点'
          },
          {
            name: 'JS 技术的网站',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.jstips.co/',
            info: '每天推出一个JS技巧的网站'
          },
          {
            name: 'W3Cplus',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.jstips.co/',
            info: '推广国内行业的技术博客'
          },
          {
            name: '印记中文',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://docschina.org/',
            info: '最权威的技术中文文档社区'
          }
        ]
      },
      {
        name: '06.前端博客',
        key: '06',
        children: [
          {
            name: '技术胖博客',
            //icon: '/img/menuConfig/resizeImage.png',
            path: 'https://jspang.com/',
            info: '专注前端 每年100集免费前端视频'
          },
          {
            name: '腾讯Alloy Team ',
            //icon: '/img/menuConfig/compressimage.png',
            path: 'http://www.alloyteam.com/',
            info: '腾讯前端博客 每天必看'
          },
          {
            name: '淘系前端博客',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://fed.taobao.org/',
            info: '淘宝前端博客 代表中国最强前端实力'
          },
          {
            name: '京东凹凸实验室',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://aotu.io/',
            info: '京东前端技术博客'
          },
          {
            name: '饿了么前端博客',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://zhuanlan.zhihu.com/ElemeFE',
            info: '知乎上的最强前端博客'
          },
          {
            name: '百度前端博客',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'http://fex.baidu.com/',
            info: '百度前端团队旗下博客'
          },
          {
            name: '360奇舞团',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://75.team/',
            info: '360公司前端团队'
          },
          {
            name: '美团技术博客',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://tech.meituan.com/',
            info: '美团技术团队博客'
          }
        ]
      },
      {
        name: '07.构建工具',
        key: '07',
        children: [
          {
            name: 'NPM',
            //icon: '/img/menuConfig/tdtapi.png',
            path: 'https://www.npmjs.com/',
            info: '包管理和项目构建工具'
          },
          {
            name: 'webpack',
            //icon: '/img/menuConfig/cesiumAPI.png',
            path: 'https://webpack.js.org/',
            info: '前端最流行的项目构建工具'
          },
          {
            name: 'Yarn',
            //icon: '/img/menuConfig/mapboxapi.png',
            path: 'https://juejin.cn/',
            info: '后起之秀 优秀的包管理和构建工具'
          },
          {
            name: 'Gulp',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.gulpjs.com.cn/',
            info: '老牌构建工具'
          },
          {
            name: 'Babel',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://babeljs.io/',
            info: 'ES6构建转换工具'
          },
          {
            name: 'ESLint',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://cn.eslint.org/',
            info: '可组装的JavaScript和JSX检查工具'
          },
          {
            name: 'PostCSS',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.postcss.com.cn/',
            info: '用JavaScript转换CSS代码的工具'
          }
        ]
      },
      {
        name: '08.部署工具',
        key: '08',
        children: [
          {
            name: 'Github Page',
            //icon: '/img/menuConfig/tdtapi.png',
            path: 'https://pages.github.com/',
            info: 'Github提供的免费静态网站托管服务'
          },
          {
            name: 'Netlify',
            //icon: '/img/menuConfig/cesiumAPI.png',
            path: 'https://www.netlify.com/',
            info: '30秒内部署你的网站'
          },
          {
            name: 'Vercel',
            //icon: '/img/menuConfig/mapboxapi.png',
            path: 'https://vercel.com/',
            info: '快速部署你的网站 国外很流行'
          },
          {
            name: 'Surge',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://surge.sh/',
            info: '一个命令部署你的网站'
          },
          {
            name: 'Heroku',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.heroku.com/',
            info: '运动构建 、 运行你的网站和应用'
          }
        ]
      },
      {
        name: '09.静态站点搭建',
        key: '09',
        children: [
          {
            name: 'Hexo',
            //icon: '/img/menuConfig/resizeImage.png',
            path: 'https://hexo.io/zh-cn/',
            info: '最流行的静态博客程序 Markdown编写 生成静态站点'
          },
          {
            name: 'VuePress',
            //icon: '/img/menuConfig/compressimage.png',
            path: 'https://www.vuepress.cn/',
            info: 'Vue驱动的静态网站生成器'
          },
          {
            name: 'GitBook',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://fed.taobao.org/',
            info: 'https://www.gitbook.com/'
          }
        ]
      },
      {
        name: '10.前端代码规范',
        key: '10',
        children: [
          {
            name: 'Tgideas',
            //icon: '/img/menuConfig/tdtapi.png',
            path: 'https://tgideas.qq.com/doc/index.html',
            info: '腾讯前端代码规范 值得参考'
          },
          {
            name: '京东',
            //icon: '/img/menuConfig/cesiumAPI.png',
            path: 'https://guide.aotu.io/index.html',
            info: '京东前端代码规范文档'
          },
          {
            name: 'Bootstrap编码规范',
            //icon: '/img/menuConfig/mapboxapi.png',
            path: 'https://codeguide.bootcss.com/',
            info: '合个人和小团队使用的代码规范'
          },
          {
            name: 'ES6 编程风格',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://es6.ruanyifeng.com/#docs/style',
            info: '阮一峰编写的ES6代码规范 值得每个人阅读并参考'
          },
          {
            name: 'Airbnb 前端代码规范',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://github.com/airbnb/javascript',
            info: '国外企业的前端代码规范'
          },
          {
            name: 'ESLint',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://eslint.org/',
            info: '代码规范检查和格式化工具'
          },
          {
            name: 'Prettier',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://prettier.io/',
            info: 'VSCode 最热门的代码格式化工具 让你写出漂亮的代码'
          }
        ]
      },
      {
        name: '11.调试抓包',
        key: '11',
        children: [
          {
            name: 'Whistle',
            //icon: '/img/menuConfig/resizeImage.png',
            path: 'https://wproxy.org/whistle/',
            info: '代理抓包工具 我一直在用的工具 很好很强大'
          },
          {
            name: 'Fiddler',
            //icon: '/img/menuConfig/compressimage.png',
            path: 'https://www.telerik.com/fiddler',
            info: '使用人数最多的抓包工具'
          }
        ]
      },
      {
        name: '12.在线工具',
        key: '12',
        children: [
          {
            name: 'CodePen',
            //icon: '/img/menuConfig/tdtapi.png',
            path: 'https://codepen.io/',
            info: '前端在线测试和演示工具'
          },
          {
            name: 'Can I use',
            //icon: '/img/menuConfig/cesiumAPI.png',
            path: 'https://caniuse.com/',
            info: 'Web前端兼容性列表'
          },
          {
            name: 'TinyPNG',
            //icon: '/img/menuConfig/mapboxapi.png',
            path: 'https://tinypng.com/',
            info: 'PNG/JPG 图片在线压缩工具'
          },
          {
            name: 'CNZZ',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.umeng.com/',
            info: '老牌站点统计工具 5年前国内站长必上网站'
          },
          {
            name: 'web.dev',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://web.dev/measure/',
            info: '评测网站性能 基于Lighthouse'
          },
          {
            name: 'Shape Divider',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://gtmetrix.com/',
            info: '定制各种形状SVG的工具'
          },
          {
            name: 'GTmetrix',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://gtmetrix.com/',
            info: '网页性能在线分析工具'
          },
          {
            name: 'Carbon',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://carbon.now.sh/',
            info: '代码转图片工具'
          },
          {
            name: 'Wappalyzer',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.wappalyzer.com/',
            info: '检测某个网站的技术栈'
          },
          {
            name: 'CODEIF',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://unbug.github.io/codelf',
            info: '变量方法起名工具 人工智能加持'
          },
          {
            name: 'tool.lu',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://tool.lu/',
            info: '程序员在线工具大全'
          }
        ]
      },
      {
        name: '13.开发工具',
        key: '13',
        children: [
          {
            name: 'VSCode',
            //icon: '/img/menuConfig/resizeImage.png',
            path: 'https://code.visualstudio.com/',
            info: '前端最流行的编辑器'
          },
          {
            name: 'Sublime Text',
            //icon: '/img/menuConfig/compressimage.png',
            path: 'https://www.sublimetext.com/',
            info: '轻量级代码编辑工具 曾经我的最爱'
          },
          {
            name: 'WebStom',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://www.jetbrains.com/webstorm/',
            info: '忠爱粉最多的编辑器'
          },
          {
            name: 'Atom',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://atom.io/',
            info: '用的人很多 我却不喜欢的编辑器'
          },
          {
            name: 'Typora',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://www.typora.io/',
            info: '程序人Mrakdown笔记 一直在用的笔记工具'
          }
        ]
      },
      {
        name: '14.开发者大会',
        key: '14',
        children: [
          {
            name: 'Vue.js开发者大会',
            //icon: '/img/menuConfig/tdtapi.png',
            path: 'https://fequan.com/',
            info: '前端人必须关注的前端大会'
          },
          {
            name: '中国JS开发者大会',
            //icon: '/img/menuConfig/cesiumAPI.png',
            path: 'https://jsconfchina.com/',
            info: '公司每年必组织参加的技术大会'
          },
          {
            name: 'CSS开发者大会',
            //icon: '/img/menuConfig/mapboxapi.png',
            path: 'https://css.w3ctech.com/',
            info: '提高CSS技术的开发者大会 打开视野 面向世界'
          },
          {
            name: 'D2前端开发者大会',
            //icon: '/img/menuConfig/openlayers.png',
            path: 'https://www.alibabaf2e.com/',
            info: '阿里组织的大会 可以看直播'
          }
        ]
      },
      {
        name: '15.WEB图标',
        key: '15',
        children: [
          {
            name: 'Font Awesome',
            //icon: '/img/menuConfig/resizeImage.png',
            path: 'http://www.fontawesome.com.cn/',
            info: '网站开发最流行的图标集'
          },
          {
            name: 'Feather',
            //icon: '/img/menuConfig/compressimage.png',
            path: 'https://feathericons.com/',
            info: '简洁美观的开源图标'
          },
          {
            name: 'Material Design Icons',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://material.io/resources/icons/',
            info: '轻快、精美的符号图标'
          },
          {
            name: 'Tabler Icons',
            //icon: '/img/menuConfig/bgRemove.png',
            path: 'https://tablericons.com/',
            info: '681枚可定制的开源SVG图标'
          }
        ]
      }
    ]
  }
];

// window.menus = menuConfig2D;
export default menuConfig2D;
