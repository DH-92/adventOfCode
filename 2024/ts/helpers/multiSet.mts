/**
 * Mnemonist MultiSet
 * ====================
 *
 * JavaScript implementation of a MultiSet.
 */

/**
 * Helpers.
 */
// const MULTISET_ITEM_COMPARATOR = function (a, b) {
//   if (a[1] > b[1]) return -1
//   if (a[1] < b[1]) return 1
//   return 0
// }

// TODO: helper functions: union, intersection, sum, difference, subtract

/**
 * MultiSet.
 *
 * @constructor
 */
export class MultiSet<T> {
  items: Map<T, number>
  size: number
  dimension: number
  constructor() {
    this.items = new Map()
    this.size = 0
    this.dimension = 0
  }

  /**
   * Method used to clear the structure.
   *
   * @return {undefined}
   */
  clear(): undefined {
    // Properties
    this.size = 0
    this.dimension = 0
    this.items.clear()
  }

  /**
   * Method used to add an item to the set.
   *
   * @param  {any}    item  - Item to add.
   * @param  {number} count - Optional count.
   * @return {MultiSet<T>}
   */
  add(item: T, count: number = 1): MultiSet<T> {
    if (count <= 0) {
      return (count === 0) 
        ? this 
        : this.remove(item, -count)
    }

    this.size += count

    const currentCount = this.items.get(item)
    if (currentCount === undefined) {
      this.dimension++
    } else {
      count += currentCount
    }

    this.items.set(item, count)
    return this
  }

  addMany(items: Array<T|[T]|[T, number]>): MultiSet<T> {
    items.forEach(item => Array.isArray(item) ? this.add(item[0], item[1]) : this.add(item))
    return this
  }

  /**
   * Method used to set the multiplicity of an item in the set.
   *
   * @param  {any}    item  - Target item.
   * @param  {number} count - Desired multiplicity.
   * @return {MultiSet}
   */
  set(item: T, count: number = 1): MultiSet<T> {
    const currentCount = this.items.get(item)
    // Setting an item to 0 or to a negative number means deleting it from the set
    if (count <= 0) {
      if (typeof currentCount === 'number') {
        this.size -= currentCount
        this.dimension--
      }

      this.items.delete(item)
      return this
    }
    this.size += count

    if (typeof currentCount !== 'number') {
      this.dimension++
    }
    this.items.set(item, count + (currentCount ?? 0))
    return this
  }

  /**
   * Method used to return whether the item exists in the set.
   *
   * @param  {any} item  - Item to check.
   * @return {boolan}
   */
  has = (item: T): boolean => this.items.has(item)

  /**
   * Method used to delete an item from the set.
   *
   * @param  {any} item  - Item to delete.
   * @return {boolan}
   */
  delete(item: T): boolean {
    const count = this.items.get(item)

    if (!count) {
      return false
    }

    this.size -= count
    this.dimension--
    this.items.delete(item)

    return true
  }

  /**
   * Method used to remove an item from the set.
   *
   * @param  {any} item  - Item to delete.
   * @param  {number} count - Optional count.
   * @return {undefined}
   */
  remove(item: T, count: number = 1): MultiSet<T> {
    if (count <= 0) {
      return (count === 0) ? this : this.add(item, -count)
    }

    const currentCount = this.items.get(item)

    if (currentCount === undefined) {
      return this
    }

    const newCount = Math.max(0, currentCount - count)

    if (!newCount) {
      this.items.delete(item)
      this.size -= currentCount
      this.dimension--
      return this
    }
    this.items.set(item, newCount)
    this.size -= count
    return this
  }

  /**
   * Method used to change a key into another one, merging counts if the target
   * key already exists.
   *
   * @param  {any} a - From key.
   * @param  {any} b - To key.
   * @return {MultiSet}
   */
  edit(a: T, b: T): MultiSet<T> {
    const am = this.multiplicity(a)

    // If a does not exist in the set, we can stop right there
    if (am === 0) return this

    const bm = this.multiplicity(b)

    this.items.set(b, am + bm)
    this.items.delete(a)

    return this
  }

  /**
   * Method used to return the multiplicity of the given item.
   *
   * @param  {any} item  - Item to get.
   * @return {number}
   */
  multiplicity(item: T): number {
    const count = this.items.get(item)

    if (typeof count === 'undefined') return 0

    return count
  }
  get = this.multiplicity
  count = this.multiplicity

  /**
   * Method used to return the frequency of the given item in the set.
   *
   * @param  {any} item - Item to get.
   * @return {number}
   */
  frequency(item: T): number {
    if (this.size === 0) return 0

    const count = this.multiplicity(item)

    return count / this.size
  }

  // /**
  //  * Method used to return the n most common items from the set.
  //  *
  //  * @param  {number} n - Number of items to retrieve.
  //  * @return {array}
  //  */
  // top(n: number): Array<any> {
  //   if (typeof n !== 'number' || n <= 0)
  //     throw new Error('mnemonist/multi-set.top: n must be a number > 0.')

  //   const heap = new FixedReverseHeap(Array, MULTISET_ITEM_COMPARATOR, n)

  //   const iterator = this.items.entries(),
  //     step

  //   while (((step = iterator.next()), !step.done)) heap.push(step.value)

  //   return heap.consume()
  // }

  /**
   * Method used to iterate over the set's values.
   *
   * @param  {function}  callback - Function to call for each item.
   * @param  {object}    scope    - Optional scope.
   * @return {undefined}
   */
  forEach(callback: Function, scope?: object): undefined {
    scope = arguments.length > 1 ? scope : this

    this.items.forEach((multiplicity, value) => {
      for (let i = 0; i < multiplicity; i++) {
        callback.call(scope, value, value)
      }
    })
  }

  /**
   * Method used to iterate over the set's multiplicities.
   *
   * @param  {function}  callback - Function to call for each multiplicity.
   * @param  {object}    scope    - Optional scope.
   * @return {undefined}
   */
  forEachMultiplicity(
    callbackfn: (value: number, key: T, map: Map<T, number>) => void,
    scope?: any,
  ): undefined {
    this.items.forEach(callbackfn, scope)
  }

  /**
   * Method returning an iterator over the set's keys. I.e. its unique values,
   * in a sense.
   *
   * @return {Iterator}
   */
  keys() {
    return this.items.keys()
  }

  // /**
  //  * Method returning an iterator over the set's values.
  //  *
  //  * @return {Iterator}
  //  */
  // values() {
  //   const iterator = this.items.entries()
  //   let inContainer = false
  //   let value: T
  //   let multiplicity: number
  //   let i: number

  //   // return new Iterator(
  //   function next() {
  //     if (!inContainer) {
  //       const step = iterator.next()

  //       if (step.done) return { done: true }

  //       inContainer = true
  //       value = step.value[0]
  //       multiplicity = step.value[1]
  //       i = 0
  //     }

  //     if (i >= multiplicity) {
  //       inContainer = false
  //       return next()
  //     }

  //     i++

  //     return {
  //       done: false,
  //       value: value,
  //     }
  //   }
  //   // )
  // }

  // /**
  //  * Attaching the #.entries method to Symbol.iterator if possible.
  //  */
  // [Symbol.iterator] = this.values

  /**
   * Method returning an iterator over the set's multiplicities.
   *
   * @return {Iterator}
   */
  multiplicities() {
    return this.items.entries()
  }

  /**
   * Convenience known methods.
   */
  inspect() {
    return this.items
  }
  // [Symbol.'nodejs.util.inspect.custom'] = this.inspect

  toJSON() {
    return JSON.stringify(this.items)
  }

  /**
   * Static @.from function taking an arbitrary iterable & converting it into
   * a structure.
   *
   * @param  {Iterable} iterable - Target iterable.
   * @return {MultiSet}
   */
  static from<T>(iterable: Iterable<T>): MultiSet<T> {
    const set = new MultiSet<T>()

    Array.from(iterable).forEach(value => {
      set.add(value)
    })

    return set
  }

  /**
   * Function returning whether the multiset A is a subset of the multiset B.
   *
   * @param  {MultiSet} A - First set.
   * @param  {MultiSet} B - Second set.
   * @return {boolean}
   */
  static isSubset<T>(A: MultiSet<T>, B: MultiSet<T>): boolean {
    const iterator = A.multiplicities()

    // Shortcuts
    if (A === B) return true

    if (A.dimension > B.dimension) return false

    let step
    while (((step = iterator.next()), !step.done)) {
      const [key, mA] = step.value
      if (B.multiplicity(key) < mA) {
        return false
      }
    }

    return true
  }

  /**
   * Function returning whether the multiset A is a superset of the multiset B.
   *
   * @param  {MultiSet} A - First set.
   * @param  {MultiSet} B - Second set.
   * @return {boolean}
   */
  static isSuperset<T>(A: MultiSet<T>, B: MultiSet<T>): boolean {
    return MultiSet.isSubset(B, A)
  }
}
