const babylon = require('babylon')
const fs = require('fs')
const traverse = require('babel-traverse')
const _ = require('lodash')
const path = require('path')


module.exports = (fileUrl) => {
    // 最终返回的数据对象
    apis = {
        classes: [],
        methods: [],
        params: []
    }

    // 获取proxy下的所有class文件，默认只有子级
    const files = fs.readdirSync(fileUrl)

    apis.classes = _.map(_.filter(files, (ele) => {
        return ele.indexOf('.js') == ele.length - 3
    }), (ele) => {
        return ele.replace('.js', '')
    })

    _.forEach(apis.classes, classname => {
        const code = fs.readFileSync(fileUrl + '/' + classname + '.js').toString()
        const codeTree = babylon.parse(code, {
            sourceType: "script",
            plugins: [
                "classProperties",
            ],
        })

        traverse.default(codeTree, {
            ClassDeclaration(path) {
                console.log('正在对文件进行静态分析...')
                let methods = path.node && path.node.body && path.node.body.body
                let methodTemp = []
                let paramTemp = []

                _.forEach(methods, (ele) => {
                    if (ele.kind == 'method') {
                        methodTemp.push(ele.key.name)
                        paramTemp.push(
                            _.map(ele.params, ele => {
                                return ele.name
                            })
                        )
                    }
                })

                apis.methods.push(methodTemp)
                apis.params.push(paramTemp)
            }
        })
    })

    return apis
}