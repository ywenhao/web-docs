# 提效技巧

## 前提

- 统一代码风格
- 统一代码规范
- 组件解耦，封装复用

## 提效

- 总所周知，前端就是一职多角色。ui 有问题会找前端；接口报错，也会找前端；产品设计不到位，也会找前端。前端人应该深有体会。自身强大，全栈才会好点。
- 前端在开发过程中，会遇到很多问题，很多的团队和同事都不会规范开发，导致开发效率低。如果团队规范流程，开发就会很舒服，效率自然容易提升。我们可以通过一些方式尽可能的提升效率，让自己轻松一点。
- 在不规范的团队中，对接口过程中，70%的时间都是和后端联调，一边改，一边等他改，还要帮他调试，他打断点，我们点页面的方式，反反复复的，恶心加龟速。
- 有的后端同事写的接口80%都调不通，我们联调很痛苦，效率特别低下，其实我们可以改变一下方式，就可以提升一定的效率。

1. 对着原型和设计稿，先把项目样式界面画出来，逻辑写好，写不了的地方加`TODO`注释，方便后面开发，在后面开发过程中一定要删除`TODO`。
2. 对接口的时候前置接口先走通，花点时间调通好，比如说登录接口。
3. 项目里面很多模块都是大同小异的，前端的代码可以封装复用。
4. 接口报错频率高，写的烂的，没必要边对边测，可以对着接口文档把字段和验证对好，后面甩个局域网地址让他们自己测。
5. 如果接口字段等错误比较多的，可以写个文档，把截图和说明写好，同时自己的代码里面也写好，积多一点后，把文档甩给后端，让他们自己调试修bug。
6. 测试这一步本来应该他们自己写好接口就自测的，但是很多后端都是代码生成好、写好接口就不管了，就等着前端来对接口，边对边改。
