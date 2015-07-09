var FormFlood = (function() {
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
	};

	function FormFlood(formElement, options) {
		var i;
		for (i in FormFlood.defaultOptions) if (FormFlood.defaultOptions.hasOwnProperty(i)) {
			options[i] = options[i] !== undefined ? options[i] : FormFlood.defaultOptions[i];
		}

		this.elements = formElement.elements;
		this.key = this.generateKey();
		this.options = options;
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
					return randomDate / 1000;

			}
		},
		getDateTime: function() {},
		getDateTimeLocal: function() {},
		getEmail: function() {},
		getMonth: function() {},
		getNumber: function() {},
		getRange: function() {},
		getSearch: function() {},
		getTel: function() {},
		getTime: function() {},
		getUrl: function() {},
		getWeek: function() {},
		getHidden: function() {},
		getText: function() {},
		getRadio: function() {},
		getCheckbox: function() {},

		floodElements: function() {
			var els = this.elements,
				i = 0,
				max = els.length,
				el,
				type,
				methodKey;

			for(; i < max; i++) {
				el = els[i];
				switch (el.nodeName) {
					case FormFlood.nodeNameInput:
						type = (el.getAttribute('type') || '').toLowerCase();
						if (type === FormFlood.typeCheckbox) {
							this.handleCheckboxes(el);
						} else if (type === FormFlood.typeRadio) {
							this.handleRadios(el);
						} else {
							this.handleInput(el);
						}
						
						break;
					case FormFlood.nodeNameSelect:
						this.handleSelect(el);
						break;
				}
				methodKey = el.getAttribute('type')
			}
		},

		handleInput: function() {},
		handleRadios: function() {},
		handleCheckboxes: function () {},
		handleSelect: function() {}
	};

	FormFlood.defaultOptions = {
		dateFormat: 'unix'
	};

	FormFlood.dateFormatUnix = 'unix';
	FormFlood.typeCheckbox = 'checkbox';
	FormFlood.typeRadio = 'radio';
	FormFlood.nodeNameInput = 'INPUT';
	FormFlood.nodeNameSelect = 'SELECT';

	return FormFlood;
});