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

Bind form HTML element for in order to validate.

```js
class ABC extends Component{

    form = null;

    registerForm = (form) => {
        new Validate(form, opts)
            .on('beforeValid', () => {})
            .on('validError', () => {})
            .on('elementError', function(el, er){
                let name = el.getAttribute('id') || el.getAttribute('name');
                console.log(el);
                console.log(er);
            })
            .validation();
    }

    componentDidMount(){
        this.registerForm(this.form);
    }

    render(){
        return (
            <form ref={e => this.form = e}>
            
                <input type="text" name="username" />
                <input type="password" id="password" />
            
            </form>
        )
    }
}
```