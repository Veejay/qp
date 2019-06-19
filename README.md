# ✌️ proper ✌️ parameterized queries for pg-node

## Motivations

The main postgresql library in node uses `$1, $2... $n` placeholders and arrays of values for its parameterized queries.
It works well but positional parameters are not ideal for three main reasons:

1. **order can be confused easily**

```js
const query = `
SELECT 
  age, height 
FROM 
  some_table 
JOIN 
  some_other_table 
ON 
  some_criteria 
WHERE 
  field1 = $1 
AND
  field2 = $2
AND
  field3 = $3
` 

const parameters = [field1_value, field3_value, field2_value] // oops!
```

2. **adding new parameters: not easy**

You basically have to shift your parameters around in the array of values to find the right spot

3. **it doesn't make queries particularly revealing in terms of intent**

## Proposed interface

```js
// tagged template
const query = sql` 
SELECT 
  age, height 
FROM 
  some_table 
JOIN 
  some_other_table 
ON 
  some_criteria 
WHERE 
  field1 = ${'field1'} 
AND
  field2 = ${'field2'}
AND
  field3 = ${'field3'}
` 

const parameters = {field1: value1, field3: value3, field2: value2} // doesn't matter, still works

const result = await qp(query, parameters)
```

## PROS

- queries are more meaningful now, we're passing keys that can have a revealing name
- order is meaningless (how it should be)
- we can add validation easily (if keys are missing, misnamed, etc)
- very small module
- doesn't break anything (same pg-node queries going to the SQL engine behind the scene)

# CONS / OPEN QUESTIONS

- due to JS limitations, use of tagged templates and strings inside of placeholders feels clunky
- too small to have a meaningful impact on performance but would have to be measured
- no idea about more complex querying scenarios and how well the module would support that