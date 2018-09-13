# Validatejs

## I. Using

### 1. ReactJS

Import and generate options for the form.

```js
    import Validate from './Validate';
    var opts = {
        fields : {
            username : {
                string : {
                        notEmpty : {
                        message : 'Please do not empty.'
                    },
                    minLength : {
                        length : 3,
                        message : 'Minimum length {{min}}'
                    },
                    maxLength : {
                        length : 20,
                        message : 'Maximun length {{max}}'
                    }
                }
            },
            password : {
                string : {
                    notEmpty : {
                        message : 'Please do not empty.'
                    },
                    minLength : {
                        length : 3,
                        message : 'Minimum length {{min}}'
                    },
                    maxLength : {
                        length : 20,
                        message : 'Maximun length {{max}}'
                    }
                }
            }
        }
    };
```