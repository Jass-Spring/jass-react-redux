/**
 * react-redux模块
 * Provider组件类
 *  作用: 为所有的容器子组件提供store(context)
 *  <Provider store={store}>
 *    <App />
 *  </Provider/>
 * connect函数
 *  connect(mapStateToProps, mapDispatchToProps, mergeProps, options)
 *    mapStateToProps: 函数,用来确定一般属性
 *    mapDispatchToProps: 对象,用来确定函数(内部会使用dispatch方法)属性
 *  使用: export default connect(state => {}, {})(Xxx)
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Provider组件
export default class Provider extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  // 声明向子组件提供哪些context数据
  static childContextTypes = {
    store: PropTypes.object.isRequired
  }
  
  // 为子组件提供包含store的context
  getChildContext() {
    // 返回context对象
    return { store: this.props.store }
  }

  render () {
    // 将所有子标签返回
    return this.props.children
  }
}

// connect函数
export function connect(mapStateToProps = () => null, mapDispatchToProps = {}) {
  // 返回一个函数(接收一个组件)
  return (WrapComponent) => {
    // 返回一个容器组件
    return class ConnectComponent extends Component {
      // 声明获取context数据
      static contextTypes = {
        store: PropTypes.object.isRequired
      }

      constructor (props, context) {
        super(props)

        // 得到store
        const { store } = context

        // 包含一般属性的对象
        const stateProps = mapStateToProps(store.getState())
        // 包含函数属性的对象
        const dispatchProps = this.bindActionCreators(mapDispatchToProps)

        // 将所有的一般属性保存到state中
        this.state = { ...stateProps }

        // 将所有函数属性的对象保存到组件对象
        this.dispatchProps = dispatchProps
      }

      /**
       * 根据mapDispatchToProps返回一个包含分发action函数的对象
       */
      bindActionCreators = (mapDispatchToProps) => {
        return Object.keys(mapDispatchToProps).reduce((dispatchProps, key) => {
          // 添加一个包含dispatch语句的方法
          // 透传: 将函数接收到的参数,原样传递给内部函数调用
          dispatchProps[key] = (...args) => {
            // 分发action
            this.context.store.dispatch(mapDispatchToProps[key](...args))
          }
          return dispatchProps
        }, {})
      }

      componentDidMount () {
        console.log('componentDidMount', this.constructor)
        // 得到store
        const { store } = this.context
        // 订阅监听
        store.subscribe(() => {
          // redux中产生新的state,更新当前组件的状态
          this.setState(mapStateToProps(store.getState()))
        })
      }

      render () {
        return <WrapComponent {...this.state} {...this.dispatchProps} />
      }
    }
  }
}
