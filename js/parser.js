function Parser(el, val) {
	this.$val = val;
	this.$el = this.isEleNode(el) ? el : document.querySelector(el);
	if(this.$el) {
		this.parseEle(this.$el);
	}
}

Parser.prototype = {
	parseEle: function(el) {
		var self = this;
		var childNodes = el.childNodes;
		[].slice.call(childNodes).forEach((node) => {
		  var text = node.textContent;
		  // 匹配{{}}
		  var reg = /\{\{((?:.|\n)+?)\}\}/;
		  if(self.isEleNode(node)) {
		  	self.parse(node);
		  }else if(self.isTextNode(node) && reg.test(text)) {
		  	self.parseText(node, RegExp.$1.trim());
		  }
		  // 有子节点
		  if(node.childNodes && node.childNodes.length) {
		  	self.parseEle(node);
		  }
		})
	},
  	parse: function(node) { // 解析
    	var nodeAttr = node.attributes;
    	var self = this;
    	[].slice.call(nodeAttr).forEach((attr) => {
    	  var attrName = attr.name;
    	  if(self.isDirective(attrName)) {
    	  	var exp = attr.value;
    	  	node.innerHTML = typeof this.$val[exp] === 'undefined' ? '' : this.$val[exp];
    	  	node.removeAttribute(attrName);
    	  }
    	})
  	},
  	parseText: function(node, exp) { // 匹配
  		node.textContent = typeof this.$val[exp] === 'undefined' ? '' : this.$val[exp];
  	},
  	isEleNode: function(node) { // element元素
  		return node.nodeType === 1;
  	},
  	isTextNode: function(node) { // 纯文本
  		return node.nodeType === 3;
  	},
  	isDirective: function(attr) {
  		return attr.indexOf('p-') === 0;
  	}
}
