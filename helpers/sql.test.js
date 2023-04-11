const { sqlForPartialUpdate } = require('./sql.js')
const superTest = require('supertest')

describe('sqlHelper', function(){
    test('correct output', function(){
        const result = sqlForPartialUpdate(
            {title: 'rosie'}, {title: 'title'}
        )
        expect(result).toEqual({"setCols" : "\"title\"=$1", "values": ["rosie"]})
    })
    
    test('missing data and jstosql input', function(){
        const result = sqlForPartialUpdate(
            {title: ''}, {title: ''}
        )
        expect(result).toEqual({"setCols" : "\"title\"=$1", "values": [""]})
    })
    
    test('missing jstosql input', function(){
        const result = sqlForPartialUpdate(
            {title: ''}
        )
        expect(result).toEqual('no data')
    })
    
    test('missing data input', function(){
        const result = sqlForPartialUpdate(
            12,{ title: ''}
        )
        expect(result).toEqual('no data')
    })
    
    test('All Input Incorrect', function(){
        const result = sqlForPartialUpdate(
            12, 'test'
        )
        expect(result).toEqual('no data')
    })
    
        test('correct output # 2', function(){
            const result = sqlForPartialUpdate(
                {title: 'rosie', test: 'test'}, {title: 'title', test: 'quack'}
            )
            expect(result).toEqual({"setCols": "\"title\"=$1, \"quack\"=$2", "values": ["rosie", "test"]})
        })

})