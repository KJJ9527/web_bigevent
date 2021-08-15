$(function () {

  var layer = layui.layer
  var form = layui.form
  initArtCateList()

  // 获取文章分类列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  var indexAdd = null;
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '260px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理的形式，为form-add 表单绑定submit 事件
  $('body').on('submit', '#form-add', function (e) {
    // 阻止表单默认提交行为
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增列表失败！')
        }
        else {
          layer.msg('新增列表成功！')
          // 获取文章分类列表
          initArtCateList()
          // 根据索引关闭对应的弹出层
          layer.close(indexAdd)
        }
      }
    })
  })


  // 编辑，删除等操作

  // 通过代理的形式，为 btn-edit 按钮绑定点击事件
  var indexEdit = null;
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '260px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })

    
    // 发起请求获取对应分类的数据
    var id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新文章分类失败！')
        }
        else {
          layer.msg('更新文章分类成功！')
          layer.close(indexEdit)
          initArtCateList()
        }
      }
    })
  })

  // 通过代理的形式，为 btn-del 按钮绑定点击事件
  $('tbody').on('click', '.btn-del', function () {
    var id = $(this).attr('data-id')
    // 弹出一个删除文章分类信息的层
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res) {
          if(res.status !==0) {
            return layer.msg('删除分类失败！')
          }
          else {
            layer.msg('删除分类成功！')
            layer.close(index);
            initArtCateList()
          }
        }
      })
      
    });
  })
})