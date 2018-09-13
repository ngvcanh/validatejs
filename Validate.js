const ucfirst = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const bindValidateControl = (element, rules, vObj) => {
    let validateElement = () => {
        let value = element.value;
        let name = Object.keys(rules)[0] || '';
        let valid = vObj[`validate${ucfirst(name)}`](value, rules[name]);

        if (!valid.status){
            if (!!vObj.formListener.elementError && Function === vObj.formListener.elementError.constructor){
                vObj.formListener.elementError(element, valid);
            }
        }
    }

    element.addEventListener('keyup', validateElement);
};

const bindRuleElement = validate => {
    
    if (!!validate.form && validate.form instanceof HTMLElement){
        let { fields, form } = validate;
        
        if (!!fields && Object === fields.constructor){
            for (let name in fields){
                let el = form.querySelectorAll(`[id=${name}]`);
                
                if (el.length) bindValidateControl(el[0], fields[name], validate);
                else{
                    el = form.querySelectorAll(`[name=${name}]`);
                    el.forEach(e => bindValidateControl(e, fields[name], validate));
                }
            }
        }
    }
};

const initOptions = opt => {
    let o = { fields : {}, formListener : {} }

    if (!!opt){
        let { fields, formListener } = opt;

        if (!!fields && Object === fields.constructor){
            for (let id in fields){
                if (!!fields[id] && Object === fields[id].constructor){
                    o.fields[id] = fields[id];
                }
            }
        }

        if (!!formListener && Object === formListener.constructor){
            for (let processName in formListener){
                if (!!formListener[processName] && Function === formListener[processName]){
                    o.formListener[processName] = formListener[processName];
                }
            }
        }
    }

    return o;
};

const notEmpty = val => {
    val = val.toString() || '';
    return !!val.length;
}

const minLength = (val, min) => {
    val = val.toString() || '';
    return val.length >= +min;
}

const maxLength = (val, max) => {
    val = val.toString() || '';
    return val.length <= +max;
}

const resultError = (type, message, param) => ({ status : false, type, message, ...param });

var Validate = function(form, opts){
    this.form = (!!form && form instanceof HTMLFormElement) ? form : null;
    let { fields, formListener } = initOptions(opts);

    this.fields = fields;
    this.formListener = formListener;
};

Validate.prototype.on = function(processName, callback){
    if (!!processName && !!callback && String === processName.constructor && Function === callback.constructor){
        this.formListener[processName] = callback;
    }
    return this;
};

Validate.prototype.validation = function(){
    bindRuleElement(this);
    return this;
};

Validate.prototype.validateString = function(value, rules){

    if (!!rules && Object === rules.constructor){
        if ('notEmpty' in rules && !!rules.notEmpty && !notEmpty(value))
            return resultError('notEmpty', rules.notEmpty.message || '');

        if ('minLength' in rules && !!rules.minLength && !isNaN(+rules.minLength.length)){
            let min = rules.minLength.length;
            if (!minLength(value, min)) 
                return resultError('minLength', rules.minLength.message || '', { min, value });
        }
            
        if ('maxLength' in rules && !!rules.maxLength && !isNaN(+rules.maxLength.length)){
            let max = rules.maxLength.length;
            if (!maxLength(value, max)) 
                return resultError('maxLength', rules.maxLength.message || '', { max, value });
        }

        if ('regex' in rules && !!rules.regex && !!rules.regex.pattern && RegExp === rules.regex.pattern){
            if (!rules.regex.pattern.test(value))
                return resultError('regex', rules.regex.message || '', { value });
        }
    }

    return { status : true };
};

Validate.prototype.validateNumber = function(value, rules){
    value = +value;

    if (!isNaN(value)) return resultError('NaN', 'VALUE_NOT_A_NUMBER');
};

Validate.prototype.validateInteger = function(){

};

Validate.prototype.validateEmail = function(value, rules){
    if (!!rules && Object === rules.constructor){
        rules.regex = {
            pattern : /^[a-z\d]+[a-z\d\-\._]*[a-z\d]+@([a-z\d\-]+\.){1,2}[a-z]{2,}$/gi,
            message : 'ERROR_EXPRESSION_EMAIL'
        }

        let vStr = this.validateString(value, rules);
        if (!vStr.status) return vStr;
    }

    return { status : true };
};

Validate.prototype.validateDomain = function(){
    if (!!rules && Object === rules.constructor){
        rules.regex = {
            pattern : /^(https?:\/\/)?(www\.)?([a-z\d\.]+\.){1,3}[a-z]{2,}\/?$/gi,
            message : 'ERROR_EXPRESSION_DOMAIN'
        };

        let vStr = this.validateString(value, rules);
        if (!vStr.status) return vStr;
    }

    return { status : true };
};

Validate.prototype.validateIPv4 = function(value){
    let rules = {
        minLength : {
            length : 7,
            message : 'ERROR_MIN_LENGTH_IPV4'
        },
        maxLength : {
            length : 15,
            message : 'ERROR_MAX_LENGTH_IPV4'
        },
        regex : {
            pattern : /\b((25[0-5]|2[0-4]\d|[01]?\d\d?)(\.|$)){4}\b/g,
            message : 'ERROR_EXPRESSION_IPV4'
        }
    }
    let vStr = this.validateString(value, rules);
    if (!vStr.status) return vStr;
}

export default Validate;