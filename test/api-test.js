const axios = require('axios');

// GET请求示例
async function testGet() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('GET请求结果:', response.data);
  } catch (error) {
    console.error('GET请求错误:', error.message);
  }
}

// POST请求示例
async function testPost() {
  try {
    const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1,
    });
    console.log('POST请求结果:', response.data);
  } catch (error) {
    console.error('POST请求错误:', error.message);
  }
}

// 处理302重定向的GET请求示例
async function testRedirect() {
  try {
    const response = await axios.get(
      '',
      {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 303; // 允许302状态
        },
        headers: {
          Cookie: ``,
        },
      }
    );

    const cookies = response.headers['set-cookie'];
    const redirectUrl = response.headers.location;

    console.log('重定向地址:', redirectUrl);
    console.log('Set-Cookie:', response.headers);
  } catch (error) {
    console.error('重定向请求错误:', error.message);
  }
}

// 运行测试
(async () => {
  //   console.log('开始GET请求测试');
  //   await testGet();

  //   console.log('\n开始POST请求测试');
  //   await testPost();

  console.log('\n开始重定向请求测试');
  await testRedirect();
})();
