const menuConfig2D = [
  {
    name: '内网测试环境',
    icon: 'icon-Lab',
    key: 'intest',
    children: [
      {
        name: '影像系统',
        key: 'intestimage',
        children: [
          {
            name: '首页',
            icon: './img/product/imagesys.png',
            path: 'http://192.168.1.33:82',
            info: '影像前端登录界面'
          },
          {
            name: 'DataSource',
            icon: './img/product/hprose.png',
            path: 'http://192.168.1.33:1001/DataSource',
            type: 'hprose',
            info: 'DataSource'
          },
          {
            name: 'DataManage',
            icon: './img/product/hprose.png',
            path: 'http://192.168.1.33:1003/DataManage',
            type: 'hprose',
            info: 'DataManage'
          },
          {
            name: 'ImageAdmin',
            icon: './img/product/hprose.png',
            path: 'http://192.168.1.33:1002/ImageAdmin',
            type: 'hprose',
            info: 'ImageAdmin'
          },
          {
            name: 'ImageProvider',
            icon: './img/product/hprose.png',
            path: 'http://192.168.1.33:1006/ImageProvider',
            type: 'hprose',
            info: 'ImageProvider'
          },
          {
            name: 'ImageTilehprose',
            icon: './img/product/hprose.png',
            path: 'http://192.168.1.33:1005/ImageTile',
            type: 'hprose',
            info: 'ImageTilehprose'
          },
          {
            name: 'ImageTileapi',
            icon: './img/product/api.png',
            path: 'http://192.168.1.33:1005/IMGWMTS',
            type: 'api',
            info: 'ImageTileapi'
          },
          {
            name: 'ThumbProvider',
            icon: './img/product/hprose.png',
            path: 'http://192.168.1.33:1004/ThumbProvider',
            type: 'hprose',
            info: 'ThumbProvider'
          },
          {
            name: 'pgsql',
            icon: './img/product/postgresql.jpg',
            path: '192.168.1.33:5433/imgmanagedb',
            type: 'database'
          },
          {
            name: 'mongo',
            icon: './img/product/mongodb.jpg',
            path: '192.168.1.33:27017',
            type: 'database'
          },
          {
            name: 'redis',
            icon: './img/product/redis.jpg',
            path: '192.168.1.33:6379',
            type: 'database'
          }
        ]
      },
      {
        name: '矢量系统',
        key: 'intestvector',
        children: [
          {
            name: '矢量系统-首页',
            icon: './img/product/vectorsys.png',
            path: 'http://192.168.1.18:92'
          },
          {
            name: 'cloud',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://192.168.1.15:11081/VTCloud'
          },
          // {
          //   name: 'tilehprose',
          //   icon: './img/product/hprose.png',
          //   type: 'hprose',
          //   path: 'http://192.168.1.15:11082/VTDataTile'
          // },
          {
            name: 'tileapi',
            icon: './img/product/api.png',
            type: 'api',
            path: 'http://192.168.1.15:11082/vtile'
          },
          {
            name: 'produce',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://192.168.1.15:11085/VTProduce'
          },
          {
            name: 'spatialdata',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://192.168.1.15:11081/hprose'
          },
          {
            name: 'pgsql',
            icon: './img/product/postgresql.jpg',
            type: 'database',
            path: 'http://192.168.1.15:5434/vtmanagedb'
          },
          {
            name: 'mongo',
            icon: './img/product/mongodb.jpg',
            type: 'database',
            path: 'http://192.168.1.15:27019'
          },
          {
            name: 'redis',
            icon: './img/product/redis.jpg',
            type: 'database',
            path: 'http://192.168.1.33:6379/1'
          }
        ]
      },
      {
        name: '配图系统',
        key: 'intestmap',
        children: [
          {
            name: '矢量配图首页',
            icon: './img/product/stylemap.png',
            path: 'http://192.168.1.18:91'
          },
          {
            name: 'VTFigure',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://192.168.1.15:9001/VTFigure'
          },
          {
            name: 'VTFigureResources',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://192.168.1.15:9002/swagger'
          },
          {
            name: 'pgsql',
            icon: './img/product/postgresql.jpg',
            type: 'database',
            path: '192.168.1.15:5432/vtmapdb'
          },
          {
            name: 'mongo',
            icon: './img/product/mongodb.jpg',
            type: 'database',
            path: '192.168.1.33:27017'
          },
          {
            name: 'redis',
            icon: './img/product/redis.jpg',
            type: 'database',
            path: '192.168.1.33:6379'
          }
        ]
      },
      {
        name: '瓦片发布系统',
        key: 'intestwmts',
        children: [
          {
            name: '瓦片发布系统-首页',
            icon: './img/product/tilemap.png',
            path: 'http://192.168.1.14:81'
          },
          {
            name: '后台',
            icon: './img/product/api.png',
            type: 'api',
            path: 'http://192.168.1.14:6001/swagger/v1/swagger.json'
          },
          {
            name: 'pgsql',
            icon: './img/product/postgresql.jpg',
            type: 'database',
            path: '192.168.1.14:5434/sso1'
          },
          {
            name: 'redis',
            icon: './img/product/redis.jpg',
            type: 'database',
            path: '192.168.1.5:1379'
          }
        ]
      },
      {
        name: '用户系统',
        key: 'intestuser',
        children: [
          {
            name: '用户管理首页',
            icon: '',
            path: 'http://192.168.1.5:180'
          },
          {
            name: '后台',
            icon: './img/product/hprose.png',
            type: 'api',
            path: 'http://192.168.1.5:181/swagger'
          },
          {
            name: 'pgsql',
            icon: './img/product/postgresql.jpg',
            type: 'database',
            path: '192.168.1.14:5434/sso1'
          },
          {
            name: 'redis',
            icon: './img/product/redis.jpg',
            type: 'database',
            path: '192.168.1.5:1379'
          }
        ]
      }
    ]
  },
  {
    name: '正式环境',
    icon: 'icon-Lab',
    key: 'out',
    children: [
      {
        name: '影像系统',
        key: 'outimage',
        children: [
          {
            name: '首页',
            icon: './img/product/imagesys.png',
            path: 'http://211.103.133.129:280',
            info: '影像前端登录界面'
          },
          {
            name: 'DataSource',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:282/DataSource',
            info: 'DataSource'
          },
          {
            name: 'DataManage',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:281/DataManage',
            info: 'DataManage'
          },
          {
            name: 'ImageAdmin',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:283/ImageAdmin',
            info: 'ImageAdmin'
          },
          {
            name: 'ImageProvider',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:284/ImageProvider',
            info: 'ImageProvider'
          },
          {
            name: 'ImageTilehprose',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:285/ImageTile',
            info: 'ImageTilehprose'
          },
          {
            name: 'ImageTileapi',
            icon: './img/product/api.png',
            type: 'api',
            path: 'http://211.103.133.129:285/IMGWMTS',
            info: 'ImageTileapi'
          },
          {
            name: 'ThumbProvider',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:286/ThumbProvider',
            info: 'ThumbProvider'
          }
        ]
      },
      {
        name: '矢量系统',
        key: 'outvector',
        children: [
          {
            name: '矢量系统首页',
            icon: './img/product/vectorsys.png',
            path: 'http://211.103.133.129:380'
          },
          {
            name: 'cloud',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:381/VTCloud'
          },
          {
            name: 'tilehprose',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:384/VTDataTile'
          },
          {
            name: 'tileapi',
            icon: './img/product/hprose.png',
            type: 'api',
            path: 'http://211.103.133.129:384/swagger'
          },
          {
            name: 'produce',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:382/VTProduce'
          },
          {
            name: 'spatialdata',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:383/hprose'
          }
        ]
      },
      {
        name: '配图系统',
        key: 'outmap',
        children: [
          {
            name: '配图系统首页',
            icon: './img/product/stylemap.png',
            path: 'http://211.103.133.129:480'
          },
          {
            name: 'VTFigure',
            icon: './img/product/hprose.png',
            type: 'hprose',
            path: 'http://211.103.133.129:481/VTFigure'
          },
          {
            name: 'VTFigureResources',
            icon: './img/product/hprose.png',
            type: 'api',
            path: 'http://211.103.133.129:482/swagger'
          }
        ]
      },
      {
        name: '瓦片发布系统',
        key: 'outwmts',
        children: [
          {
            name: '首页',
            icon: './img/product/tilemap.png',
            path: 'http://211.103.133.129:580'
          },
          {
            name: '后台',
            icon: './img/product/api.png',
            type: 'api',
            path: 'http://211.103.133.129:581/swagger'
          }
        ]
      },
      {
        name: '用户系统',
        key: 'outuser',
        children: [
          {
            name: '首页',
            //icon: './img/product/hprose.png',
            path: 'http://211.103.133.129:180'
          },
          {
            name: '后台',
            icon: './img/product/hprose.png',
            type: 'api',
            path: 'http://211.103.133.129:181/swagger'
          }
        ]
      }
    ]
  }
];

// window.menus = menuConfig2D;
export default menuConfig2D;
