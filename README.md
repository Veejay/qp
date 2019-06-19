# "proper" parameterized queries for pg-node

## Motivations

The main postgresql library in node uses $1, $2... $n placeholders and arrays of values for its parameterized queries.
It works well but positional parameters are not ideal for three main reasons:

1. *order can be confused easily*

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

2. *adding new parameters is not easy*

You basically have to shift your parameters around in the array of values to find the right spot

3. and what I think is actually killer, *it doesn't make queries particularly revealing in terms of intent*