/**
 * redux模块：对象
 *  1.createStore(reducer): 接收一个reducer函数，返回store对象
 *    使用: createStore(reducer)
 *  2.combineReducers(reducers): 接收一个包含多个reducer函数的对象，返回新的reducer函数
 *    使用: combineReducers({count, msgs})
 *  3.store对象
 *    getState(): 得到内部管理state对象
 *    dispatch(action): 分发action，触发reducer调用，返回新的state
 *    subscribe(listener): 订阅state的监听器
 */

export function createStore(reducer) {
  // 内部state对象
  let state
  // 内部listener数组
  const listeners = []

  // 初始化state
  state = reducer(state, { type: '@jass-redux' })

  // 得到内部管理state对象
  function getState() {
    return state
  }

  // 分发action，触发reducer调用，返回新的state
  function dispatch(action) {
    // 调用reducer，得到新的state并保存
    state = reducer(state, action)
    // 调用listeners中所有的监听器回调函数
    listeners.forEach(listener => listener())
  }

  // 订阅state的监听器
  function subscribe(listener) {
    listeners.push(listener)
  }

  return { getState, dispatch, subscribe }
}

// 接收一个包含多个reducer函数的对象，返回新的reducer函数
export function combineReducers(reducers) {
  // 这个函数会传给createStore
  return function (state = {}, action) {
    // 依次调用所有的reducer函数，得到n个新的子状态，封装成对象并返回
    return Object.keys(reducers).reduce((newState, key) => {
      newState[key] = reducers[key](state[key], action)
      return newState
    }, {})

    // // 准备一个用来保存所有新状态的容器对象
    // const newState = {}
    // // 得到所有reducer的函数名
    // const keys = Object.keys(reducers)
    // // 遍历所有函数名
    // keys.forEach(key => {
    //   // 得到对应的子reducer函数
    //   const childReducer = reducers[key]
    //   // 得到对应的子state
    //   const childState = state[key]
    //   // 执行子reducer
    //   const newChildState = childReducer(childState, action)
    //   // 保存到新的总state中
    //   newState[key] = newChildState
    // })
    // // 返回新的总state
    // return newState
  }
}
