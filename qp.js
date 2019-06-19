const Validator = require('./validator')

const sql = (pieces, ...values) => {
  return { pieces, values }
}

const query = sql`
  SELECT 
    customer_id 
  FROM
    users
  WHERE
    created_at < ${'created_at'}
  AND
    age > ${'age'}
`

const parameters = {
  age: 30,
  created_at: Date.parse('2019-03-20')
}

/**
 * @description builds the pg-node compatible parameterized query from a tagged template and the associated parameters
 * @param {object} query - contains the pieces and values for the query extracted by a tagged template function 
 * @param {object} parameters - the key/value pairs for the values passed to the parameterized query
 * @returns {object} an object containing the actual final query sent to postgresql {query:string, parameters:array}
 */
const buildQueryArguments = (query, parameters) => {
  const { pieces, values } = query
  const [head, ...tail] = pieces
  const seed = { query: head, parameters: [] }

  if (tail.length === 0) {
    return seed
  } else {
    // recreate pg-style positional parameters
    return tail.reduce((memo, piece, index) => {
      memo.query += `$${index}${piece}`
      memo.parameters.push(parameters[values[index]])
      return memo
    }, seed)
  }
}

const executeQuery = (query, parameters) => {
  // would normally do something like db.web_read.execute(query, parameters), logging for now
  console.log(query, parameters)
  return true
}

const qp = (q, p) => {
  const validator = new Validator
  if (validator.validates(q, p)) {
    const { query, parameters } = buildQueryArguments(q, p)
    executeQuery(query, parameters)
  } else {
    throw new Error(`parameters don't match`)
  }
}

module.exports = qp