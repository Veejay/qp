// very basic validator for now, can be extended with more fancy checks
class Validator {
    validates(query, parameters) {
      const {values:placeholders} = query
      return placeholders.every(placeholder => {
        return parameters.hasOwnProperty(placeholder)
      })
    }
  }

  module.exports = Validator