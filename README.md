# 预览

![image](img/image.png)

# 环境准备
前端node环境 v18.17.1 [官网](https://nodejs.org/en) 
后端python 3.11.0rc2  [官网](https://www.python.org/) 
![image](img/image2.png)
# 启动 vue 前端

进入前端文件夹

```sh
cd .\frontend\
```

## 下载依赖

```sh
npm install
```

### 启动

```sh
npm run dev
```

待后端启动后，刷新打开 http://localhost:5173/


# 启动 python+flask 后端，由于没有使用数据库，查询次数有限

进入后端文件夹

```sh
cd .\backend\
```
### 下载依赖

```sh
pip install -r requirements.txt 
```

### 启动测试数据

```sh
flask --app test run
```

### 启动正式数据

```sh
flask --app app run
```

# 报错,因为 tushare 积分不够，可能展示不出来，将 app.py 中的 token 换成您自己的 token，或者启动 test.py 测试数据！

![image](img/image1.png)
