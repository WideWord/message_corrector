var correct = (function() {

	function Node() {
		
		this.next = {};

		this.getNext = function (ch) {
			if (this.next[ch] != undefined) return this.next[ch];
			var res = new Node();
			this.next[ch] = res;
			return res;
		}

		this.setNext = function(ch, node) {
			this.next[ch] = node;
		}

	}

	function Dictonary() {
		
		this.root = new Node();

		this.addWord = function (word) {
			var node = this.root;
			for (var i = 0, iend = word.length; i < iend; ++i) {
				node = node.getNext(word[i]);
			}
			node.setNext(' ', this.root);
		}
		
		this.correct = function (str) {
			var queue = [{
				node:this.root,
				passed:0,
				errors:0,
				str:str,
				backStr:''
			}];
			var result;
			while (queue.length > 0) {
				var cur = queue[0];

				if (cur.str == '') {
					if (cur.node == this.root) {
						if (result == undefined || result.errors > cur.errors) result = cur;
					}
				}

				// без ошибок	
				if (cur.str.length > 0) if (cur.node.next[cur.str[0]]) {
					queue.push({
						node:cur.node.next[cur.str[0]],
						passed:cur.passed + 1,
						errors:cur.errors,
						str:cur.str.slice(1, cur.str.length),
						backStr:cur.backStr + cur.str[0]
					});
				}

				// на больших строках обычно меньше ошибок, поэтому обратная зависимость 
				if (cur.errors / cur.passed < 3 / cur.passed) {
					for (var ch in cur.node.next) {
						if (ch == cur.str[0]) continue;
						// символ заменили
						if (cur.str.length > 0) queue.push({
							node:cur.node.next[ch],
							passed:cur.passed + 1,
							errors:cur.errors + 1,
							str:cur.str.slice(1, cur.str.length),
							backStr:cur.backStr + ch
						});
						// символ удалили (нам надо его вставить)
						queue.push({
							node:cur.node.next[ch],
							passed:cur.passed + 1,
							errors:cur.errors + 1,
							str:cur.str,
							backStr:cur.backStr + ch
						});
					}
					// символ вставили (нам надо его удалить)
					if (cur.str.length > 0) queue.push({
						node:cur.node,
						passed:cur.passed + 1,
						errors:cur.errors + 1,
						str:cur.str.slice(1, cur.str.length),
						backStr:cur.backStr
 					});
				}
				
				queue.shift();
			}
			if (result)
				return result.backStr;
			else return undefined; // слишком много ошибок
		}

	}

	var dictonary = new Dictonary();
	var words = "privet kak dela adio fwekfn wfiuhwei wiefh weufh weifu ewfi ewfi qowidj eoifjw qodij wepfoji qopwdij pqwefj oqwdij qpwodj vwoefi owefih owefj tpho ahgdv rebh".split(' ');
	words.forEach(function(word) { dictonary.addWord(word); });

	return function(str) {
		return dictonary.correct(str);
	};

})();

