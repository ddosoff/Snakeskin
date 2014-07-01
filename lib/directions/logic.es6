Snakeskin.addDirective(
	'if',

	{
		block: true,
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save(`if (${this.prepareOutput(command, true)}) {`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'elseIf',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		if (this.structure.name !== 'if') {
			return this.error(`directive "${this.name}" can only be used with a "if"`);
		}

		if (this.isSimpleOutput()) {
			this.save(`} else if (${this.prepareOutput(command, true)}) {`);
		}
	}
);

Snakeskin.addDirective(
	'else',

	{
		placement: 'template'
	},

	function () {
		if (this.structure.name !== 'if') {
			return this.error(`directive "${this.name}" can only be used with a "if"`);
		}

		if (this.isSimpleOutput()) {
			this.save('} else {');
		}
	}
);

Snakeskin.addDirective(
	'switch',

	{
		block: true,
		placement: 'template',
		notEmpty: true,
		inside: {
			'case': true,
			'default': true
		}
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save(`switch (${this.prepareOutput(command, true)}) {`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'case',

	{
		block: true,
		placement: 'template',
		notEmpty: true,
		replacers: {
			'>': (cmd) => cmd.replace(/^>/, 'case '),
			'/>': (cmd) => cmd.replace(/^\/>/, 'end case')
		}
	},

	function (command) {
		this.startDir();

		if (this.structure.parent.name !== 'switch') {
			return this.error(`directive "${this.name}" can only be used within a "switch"`);
		}

		if (this.isSimpleOutput()) {
			this.save(`case ${this.prepareOutput(command, true)}: {`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('} break;');
		}
	}
);

Snakeskin.addDirective(
	'default',

	{
		block: true,
		placement: 'template'
	},

	function () {
		this.startDir();

		if (this.structure.parent.name !== 'switch') {
			return this.error(`directive "${this.name}" can only be used within a "switch"`);
		}

		if (this.isSimpleOutput()) {
			this.save('default: {');
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);