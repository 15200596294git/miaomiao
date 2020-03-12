// 引入Vue实例
import Vue from 'vue'
// 引入组件MessageBox
import MessageBox from './MessageBox'
// 向外抛出
export var messageBox = (function() {
  var defaults = {
    title: '',
    content: '',
    cancel: '',
    ok: '',
    handleCancel: '',
    handleOk: ''
  };
  var MyComponent = Vue.extend(MessageBox);
  return function(opts) {
    for(var attr in opts) {
      defaults[attr] = opts[attr];
    }
    var vm = new MyComponent({
      el: document.createElement('div'),
      data: {
        title: defaults.title,
        content: defaults.content,
        cancel: defaults.cancel,
        ok: defaults.ok,
      },
      methods: {
        handleCancel() {
          defaults.handleCancel && defaults.handleCancel.call(this);
          document.body.removeChild(vm.$el);
        },
        handleOk() {
          defaults.handleOk && defaults.handleOk.call(this);
          document.body.removeChild(vm.$el);
        }
      }
    });
    // 挂载到body后面
    document.body.appendChild(vm.$el)
  }
})()