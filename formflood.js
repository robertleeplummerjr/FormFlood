var FormFlood = (function(document) {
	"use strict";

	var inputTypeLookup = {
            //standard text
            'text': 'Text',
            'hidden': 'Hidden',
            'password': 'Password',

            //html 5 text
            'color': 'Color',
            'date': 'Date',
            'datetime': 'DateTime',
            'datetime-local': 'DateTimeLocal',
            'email': 'Email',
            'month': 'Month',
            'number': 'Number',
            'range': 'Range',
            'search': 'Search',
            'tel': 'Tel',
            'time': 'Time',
            'url': 'Url',
            'week': 'Week',

            //others
            'radio': 'Radio',
            'checkbox': 'Checkbox'
        },
        inputGroup = function(el, type, name) {
	        if (!type) throwWarning(el, 'no type set');
	        if (!name) throwWarning(el, 'no name set');

            return el.querySelectorAll('[type="' + type + '"][name="' + name + '"]');
        },
        randomFromIndex = function(els) {
            return Math.round(Math.random() * (els.length - 1));
        },
        randomTrue = function() {
            return Math.round(Math.random() * 1) === 1;
        },
		throwWarning = function(el, e) {
			var err = new Error(e);
			err.element = err;
			console.log(err);
		};

	function FormFlood(formElement, options) {
        options = options || {};
		var i;
		for (i in FormFlood.defaultOptions) if (FormFlood.defaultOptions.hasOwnProperty(i)) {
			options[i] = options[i] !== undefined ? options[i] : FormFlood.defaultOptions[i];
		}

        this.form = formElement;
		this.elements = formElement.elements;
		this.options = options;

        this.handledInputs = null;
	}

	FormFlood.prototype = {
		generateKey: function(length) {
			length = length || 5;

			var text = "",
				possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i=0; i < length; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			return text;
		},
		getColor: function(input) {
			return (Math.random().toString(16) + '000000').slice(2, 8);
		},
		getDate: function(input, start, end) {
			start = start || new Date(2000, 0, 1);
			end = end || new Date();

			var randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

			switch (this.options.dateFormat) {
				case FormFlood.dateFormatUnix:
                    console.log(randomDate);
					return Math.round(randomDate / 1000);

			}
		},

        getText: function(input) {
            return (input.getAttribute('name') || input.className.replace(' ', '')) + this.key;
        },
        getHidden: function(input) {
            return (input.getAttribute('name') || input.className.replace(' ', '')) + this.key;
        },
        getPassword: function(input) {
            return (input.getAttribute('name') || input.className.replace(' ', '')) + this.key;
        },

		getDateTime: function(input) {
            return this.getText(input);
        },
		getDateTimeLocal: function(input) {
            return this.getText(input);
        },
		getEmail: function(input) {
            return this.getText(input) + '@' + 'www.com';
        },
		getMonth: function(input) {
            return this.getText(input);
        },
		getNumber: function(input) {
            return this.getText(input);
        },
		getRange: function(input) {
            return this.getText(input);
        },
		getSearch: function(input) {
            return this.getText(input);
        },
		getTel: function(input) {
            return this.getText(input);
        },
		getTime: function(input) {
            return this.getText(input);
        },
		getUrl: function(input) {
            return this.getText(input);
        },
		getWeek: function(input) {
            return this.getText(input);
        },

		fill: function() {
            this.key = this.generateKey();
            this.handledInputs = [];

			var els = this.elements,
				i = 0,
				max = els.length,
				el,
				type,
				methodKey;
			for(; i < max; i++) {
				el = els[i];

                if (this.handledInputs.indexOf(el) > -1) continue;

                this.handledInputs.push(el);

				switch (el.nodeName) {
					case FormFlood.nodeNameInput:
						type = (el.getAttribute('type') || '').toLowerCase();

                        if (this.options.ignoreType.indexOf(type) > -1) continue;

						if (type === FormFlood.typeCheckbox) {
							this.handleCheckboxes(this.getGroup(el));
						} else if (type === FormFlood.typeRadio) {
							this.handleRadios(this.getGroup(el));
						} else {
							this.handleInput(el);
						}
						
						break;
					case FormFlood.nodeNameSelect:
						this.handleSelect(el);
						break;
					case FormFlood.nodeNameTextArea:
						this.handleTextArea(el);
						break;
				}
				methodKey = el.getAttribute('type')
			}

            return this;
		},

        getGroup: function(el) {
            var group = inputGroup(this.form, el.getAttribute('type'), el.getAttribute('name')),
                i = 0,
                max = group.length;

            for (; i < max; i++) {
                this.handledInputs.push(group[i]);
            }
            return group;
        },

		handleInput: function(el) {
            var type = el.getAttribute('type'),
                getMethod = this['get' + inputTypeLookup[type]],
                value = getMethod.call(this, el);

            el.value = value;

            return this;
        },
		handleRadios: function(els) {
            els[
                randomFromIndex(els)
            ].checked = true;

            return this;
        },
		handleCheckboxes: function (els) {
            var i = 0,
                max = els.length;

            for(; i < max; i++) {
                els[i].checked = randomTrue();
            }

            return this;
        },
		handleSelect: function(el) {
            var options = el.querySelectorAll('option'),
                i = randomFromIndex(options);

            el.value = options[i].getAttribute('value');

            return this;
        },
		handleTextArea: function(el) {
			el.value = this.getText(el);
			return this;
		}
	};

	FormFlood.defaultOptions = {
		dateFormat: 'unix',
        ignoreType: 'file'
	};

	FormFlood.dateFormatUnix = 'unix';
	FormFlood.typeCheckbox = 'checkbox';
	FormFlood.typeRadio = 'radio';
	FormFlood.nodeNameInput = 'INPUT';
	FormFlood.nodeNameSelect = 'SELECT';
	FormFlood.nodeNameTextArea = 'TEXTAREA';

    /**
     *
     * @param {HTMLElement} [parent]
     */
    FormFlood.menu = function(parent) {
        var forms = document.querySelectorAll('form'),
            ui = document.createElement('ul'),
            style = ui.style,
            li,
            a,
            i = 0,
            max = forms.length;

        ui.className = 'panel';
        style.opacity = 0.6;
        style.width = '10%';
        style.height = '300px';
        style.right = '0';
        style.top = '0';
        style.position = 'absolute';

        for (; i < max; i++) {
            (function(form) {
                li = document.createElement('li');
                a = document.createElement('a');

                a.setAttribute('href', '#');
                a.innerHTML = 'Flood Form #' + (i + 1);

                li.appendChild(a);
                ui.appendChild(li);

                a.onclick = function() {
                    if (!this.formFlood) {
                        this.formFlood = new FormFlood(form);
                    }

	                try {
		                this.formFlood.fill();
	                } catch(e) {
		                console.log(e);
	                }

                    return false;
                };
	            a.onmouseover = function() {
		            form.style.transition = form.style['-webkit-transition'] = 'all 0.3s linear';
		            form.style.boxShadow = '0px 5px 20px #888888';
	            };
	            a.onmouseout = function() {
		            form.style.boxShadow = '';
	            };
            })(forms[i]);
        }

        if (parent) {
            parent.appendChild(ui);
        } else {
            document.querySelector('body').appendChild(ui);
        }
    };

	return FormFlood;
})(document);