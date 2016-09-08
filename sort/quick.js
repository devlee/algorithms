// 快速排序
// 步骤为：
// 1.从数列中挑出一个元素，称为"基准"（pivot），
// 2.重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的
//   后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处于数列的中间位置。
//   这个称为分区（partition）操作。
// 3.递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。

// 方法一：递归，缺点：浪费空间
Array.prototype.quickSort = function(){
  const len = this.length
  var left = []
  var right = []
  var i = 1
  var mid = []

  if (len <= 1) {
    return this
  }

  mid = [this[0]]

  for (; i < len; i ++) {
    if (this[i] < mid) {
      left.push(this[i])
    } else {
      right.push(this[i])
    }
  }

  return left.quickSort().concat(mid.concat(right.quickSort()))
}

// 方法二：原地分区改进 in-place partition
// 交换
Array.prototype.swap = function(i, j) {
  var t = this[j]

  this[j] = this[i]
  this[i] = t

  return this
}

// 插入排序
Array.prototype.insertSort = function(func, from, to) {
  for (var i = from + 1; i <= to; i ++) {
    if (func(this[i], this[i - 1]) < 0) {
      for (var j = from; j < i; j ++) {
        if (func(this[j], this[i]) > 0) {
          this.swap(i, j)
        }
      }
    }
  }

  return this
}

// 取第三个数
Array.prototype.getThirdIndex = function(func, from, to) {
  // const l = to - from
  // google v8 使用了 var t = new InternalArray()
  // if (l > 1000) {
  //   var t = []
  //   var ic = 200 + ((from - to) & 15)
  //   var j = 0
  //   from += 1
  //   to -= 1
  //   for (var i = 0; i < to; i += ic) {
  //     t[j] = [i, this[i]]
  //     j++
  //   }
  //   t.sort(function(a, b) {
  //     return func(a[1], b[1])
  //   })
  //   return t[t.length >> 1][0]
  // } else {
    return from + ((to - from) >> 1)
  // }
}

// 尾递归分区
Array.prototype.partition = function(func, from, to) {
  if (!this.length) return []

  from = typeof from === 'undefined' ? 0 : from
  to = typeof to === 'undefined' ? this.length - 1 : to

  if (from >= to) return this

  if (to - from + 1 < 22) {
    this.insertSort(func, from, to)
    return this
  }

  // 基准使用三数取中法获得
  const thirdIndex = this.getThirdIndex(func, from, to)

  if (this[thirdIndex] > this[to]) this.swap(thirdIndex, to)

  if (this[from] > this[to]) this.swap(from, to)

  if (this[thirdIndex] > this[from]) this.swap(thirdIndex, from)

  const p = this[from]
  // 从第一个元素开始
  var i = from
  // 两边往中间同时查找
  var j = to

  // 左右分组
  var f = from
  var t = to
  var fl = 0
  var tl = 0

  while(i < j) {
    // 从右往左查找比基准小的元素
    while(i < j && func(this[j], p) >= 0) {
      if (func(this[j], p) == 0) {
        this.swap(j, t)
        t --
        tl ++
      }
      j --
    }

    // 从左往右查找比基准大的元素
    while(i < j && func(this[i], p) <= 0) {
      if (func(this[i], p) == 0) {
        this.swap(i, f)
        f ++
        fl ++
      }
      i ++
    }

    if (i < j) {
      this.swap(i, j)
    }
  }

  this.swap(i, from)

  // 一次快排结束
  // 相同元素聚集

  // example
  // 1111...333313333...1111
  // s---------ki-----------
  // f = from + fl
  var k = i - 1
  var s = from
  while (s < f && this[k] != p) {
    this.swap(k, s)
    k --
    s ++
  }

  // example
  // 1111...333313333...1111
  // -----------jk---------s
  // t = to - tl
  k = j + 1
  s = to
  while (s > t && this[k] != p) {
    this.swap(k, s)
    k ++
    s --
  }

  this.partition(func, from, i - fl - 1)
  this.partition(func, i + tl + 1, to)

  return this
}

// 快速排序入口函数
Array.prototype.quickSort = function(func) {
  if (typeof func !== 'function') {
    func = function(a, b) {
      return a - b;
    }
  }

  this.partition(func)

  return this
}
