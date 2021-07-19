$(function() {
  // 点击去注册账号链接
  $('#link_reg').on('click',function() {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击去登录链接
  $('#link_login').on('click',function() {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 从 layui 中获取 form对象
  var form = layui.form
  // 通过form.verify 自定义规则
  form.verify({
    username: function(value, item){ //value：表单的值、item：表单的DOM对象
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
      if(/(^\_)|(\__)|(\_+$)/.test(value)){
        return '用户名首尾不能出现下划线\'_\'';
      }
      if(/^\d+\d+\d$/.test(value)){
        return '用户名不能全为数字';
      }
      
      //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
      if(value === 'xxx'){
        alert('用户名不能为敏感词');
        return true;
      }
    }
    
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    ,pass: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致的规则
    repass:function(value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败，则return一个提示消息
      var pwd = $('#form_reg [name=password]').val();
      if(value !== pwd) {
        return '两次密码不一致'
      }
    }
  })
  // 从layui 中获取 layer对象
  var layer = layui.layer
  // 监听注册表单的提交事件
  $('#form_reg').on('submit',function(e) {
    // 阻止表单默认提交行为
    e.preventDefault();
    // 发起ajax的post请求
    let data = {username: $('#form_reg [name=username]').val(),password: $('#form_reg [name=password]').val()}
    $.post('http://api-breakingnews-web.itheima.net/api/reguser',data,function(res) {
      if(res.status !== 0) {
        return layer.msg(res.message, {
          icon: 2,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        }, function(){
          //do something
        });
      }
      layer.msg(res.message, {
        icon: 1,
        time: 2000 //2秒关闭（如果不配置，默认是3秒）
      }, function(){
        // 模拟人的点击行为
        $('#link_login').click()
      });
    })
  })

  // 监听登录表单的提交事件
  $('#form_login').on('submit',function(e) {
    let data = $('#form_login').serialize()
    // 阻止表单的默认提交行为
    e.preventDefault();
    $.post('http://api-breakingnews-web.itheima.net/api/login',data,function(res) {
      if(res.status !== 0) {
        return layer.msg(res.message,{
          icon:3,
          time:2000 //2秒关闭（如果不配置，默认是3秒）
        },function() {
          // do something
        });
      }
      layer.msg(res.message, {
        icon:1,
        time:2000 //2秒关闭（如果不配置，默认是3秒）
      },function() {
        // console.log(res.token);
        // 将登录成功得到的 token 字符串,保存到 localStorage 中
        localStorage.setItem('token',res.token)
        console.log(localStorage);
        location.href = '/index.html'
      })
    })
  })
})
