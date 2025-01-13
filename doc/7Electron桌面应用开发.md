## 配置Electron编译模式流程（桌面端）



1. 执行以下指令：**pnpm quasar  mode add electron** 或 **pnpm quasar dev -m electron**

新增了 src-electron目录 和自动安装必要的依赖库
![electron1.png](D:/个人/YS工作空间/ZorroGithub/xgis-md框架知识点与技术交流/data/electron1.png)


2. *不一定需要执行，如果运行第三步报错可以尝试运行这一步。 找到并切换到./node_modules/electron目录下命令窗口，执行命令：** npm install** ，需等待2分左右
   ![单独安装electron](D:/个人/YS工作空间/ZorroGithub/xgis-md框架知识点与技术交流/data/electron2.png)
3. 回到项目目录下，执行命令：**pnpm dev -m electron**  即可以本地窗体模式运行
   ![electron3.png](D:/个人/YS工作空间/ZorroGithub/xgis-md框架知识点与技术交流/data/electron3.png)
4. 运行效果
   ![electron4.png](D:/个人/YS工作空间/ZorroGithub/xgis-md框架知识点与技术交流/data/electron4.png)

