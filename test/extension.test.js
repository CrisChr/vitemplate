const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const {_createQuickPicker, _createCommand} = require("../src/create")

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('create Quick Picker test', () => {
		assert.strictEqual(vscode.window.createQuickPick(), _createQuickPicker([{
			label: "Vue",
			picked: false
		}], "Install Vue", () => {}));
	});

	test("create command test", () => {
		const params = {
			framework: "Vue",
			path: "./test/pro",
			packageManager: "pnpm",
			projectName: "test-vue",
			useTs: "Yes"
		}
		assert.strictEqual(_createCommand(params),
		`cd ./test/pro && pnpm create vite test-vue --template vue-ts && cd test-vue && pnpm install`
		)
	})
});
