/*
Eliza in JavaScript written by Michal Tyburski
Inspired by Peter Norvig PAIP Common Lisp program and Weizenbaum orginal article.
*/

// AI code

function getBinding(variable, bindings) {
	var value = bindings[variable];
	if (value) {
		return value;
	} else {
		return false;
	}
}

function extendBindings(variable, value, bindings) {
	bindings[variable] = value;
	return bindings;
}

var rules = [{rule: {pat: "I WANT", len: 6, left: "?X", right: "?Y"}, responses: ["WHAT WOULD IT MEAN IF YOU GOT ?Y?", "WHY DO YOU WANT ?Y?", "SUPPOSE YOU GOT ?Y SOON?"]}, {rule: {pat: "HELLO", len: 5, left: "?X", right: "?Y"}, responses: ["HOW DO YOU DO. PLEASE STATE YOUR PROBLEM."]}, {rule: {pat: "IF", len: 2, left: "?X", right: "?Y"}, responses: ["DO YOU  REALLY THINK IT'S LIKELY THAT ?Y?", "DO YOU WISH THAT ?Y?", "WHAT DO YOU THINK ABOUT ?Y?", "REALLY -- IF ?Y?"]}, {rule: {pat: "NO ", len: 2, left: "?X", right: "?Y"}, responses: ["WHY NOT?", "YOU ARE BEING A BIT NEGATIVE.", "ARE YOU SAYING NO JUST TO BE NEGATIVE?"]}, {rule: {pat: "I WAS", len: 5, left: "?X", right: "?Y"}, responses: ["WHERE YOU REALLY?", "PERHAPS I ALREADY KNEW YOU WERE ?Y?", "WHY DO YOU TELL ME YOU WERE ?Y NOW?"]}, {rule: {pat: "I FEEL", len: 6, left: "?X", right: "?Y"}, responses: ["DO YOU OFTEN FEEL ?Y?"]}, {rule: {pat: "I FELT", len: 6, left: "?X", right: "?Y"}, responses: ["WHAT OTHER FEELINGS DO YOU HAVE?"]}, {rule: {pat: "COMPUTER", len: 8, left: "?X", right: "?Y"}, responses: ["DO COMPUTERS WORRY YOU?", "WHAT DO YOU THINK ABOUT MACHINES?", "WHY DO YOU MENTION COMPUTERS?", "WHAT DO YOU THINK MACHINES HAVE TO DO WITH YOUR PROBLEM?"]}, {rule: {pat: "NAME", len: 4, left: "?X", right: "?Y"}, responses: ["I AM NOT INTERESTED IN NAMES..."]}, {rule: {pat: "SORRY", len: 5, left: "?X", right: "?Y"}, responses: ["PLEASE DON'T APOLOGIZE.", "APOLOGIES ARE NOT NECESSARY.", "WHAT FEELINGS DO YOU HAVE WHEN YOU APOLOGIZE?"]}, {rule: {pat: "REMEMBER", len: 8, left: "?X", right: "?Y"}, responses: ["DO YOU OFTEN THINK OF ?Y?", "DOES THINKING OF ?Y BRING ANYTHING ELSE TO MIND?", "WHAT ELSE DO YOU REMEMBER?", "WHY DO YOU RECALL ?Y RIGHT NOW?", "WHAT IN THE PRESENT SITUATION REMIND YOU OF ?Y?", "WHAT IS THE CONNECTION BETWEEN ME AND ?Y?"]}, {rule: {pat: "DO YOU REMEMBER", len: 15, left: "?X", right: "?Y"}, responses: ["DID YOU THINK I WOULD FORGET ?Y?", "WHY DO YOU THINK I SHOULD RECALL ?Y NOW?", "WHAT ABOUT ?Y?", "YOU MENTIONED ?Y."]}, {rule: {pat: "I DREAMT", len: 8, left: "?X", right: "?Y"}, responses: ["REALLY -- ?Y?", "HAVE YOU EVER FANTASIZED ?Y WHILE YOU WERE AWAKE?", "HAVE YOU DREAMT ?Y BEFORE?"]}, {rule: {pat: "DREAMT ABOUT", len: 12, left: "?X", right: "?Y"}, responses: ["HOW DO YOU FEEL ABOUT ?Y IN REALITY?"]}, {rule: {pat: "DREAM", len: 5, left: "?X", right: "?Y"}, responses: ["WHAT DOES THIS DREAM SUGGEST TO YOU?", "DO YOU DREAM OFTEN?", "WHAT PERSONS APPEAR IN YOUR DREAMS?", "DON'T YOU BELIEVE THAT DREAM HAS TO DO WITH YOUR PROBLEM?"]}, {rule: {pat: "MY MOTHER", len: 9, left: "?X", right: "?Y"}, responses: ["WHO ELSE IN YOUR FAMILY ?Y?", "TELL ME MORE ABOUT YOUR FAMILY."]}, {rule: {pat: "MY FATHER", len: 9, left: "?X", right: "?Y"}, responses: ["YOUR FATHER?", "DOES HE INFLUENCE YOU STRONGLY?", "WHAT ELSE COMES TO MIND WHEN YOU THINK OF YOUR FATHER?"]}, {rule: {pat: "I AM GLAD", len: 9, left: "?X", right: "?Y"}, responses: ["HOW HAVE I HELPED YOU TO BE ?Y?", "WHAT MAKES YOU HAPPY JUST NOW?", "CAN YOU EXPLAIN WHY YOU ARE SUDDENLY ?Y?"]}, {rule: {pat: "I AM SAD", len: 8, left: "?X", right: "?Y"}, responses: ["I'M SURE IT'S NOT PLEASENT TO BE SAD."]}, {rule: {pat: "ARE LIKE", len: 8, left: "?X", right: "?Y"}, responses: ["WHAT RESEMBLANCE DO YOU SEE BETWEEN ?X AND ?Y?", "COULD THERE REALLY BE SOME CONNECTION?", "HOW?"]}, {rule: {pat: "ALIKE", len: 5, left: "?X", right: "?Y"}, responses: ["IN WHAT WAY?", "WHAT SIMILARITIES ARE THERE?"]}, {rule: {pat: "SAME", len: 4, left: "?X", right: "?Y"}, responses: ["WHAT OTHER CONNECTIONS DO YOU SEE"]}, {rule: {pat: "WAS I", len: 5, left: "?X", right: "?Y"}, responses: ["WHAT IF YOU WERE ?Y?", "DO YOU THINK YOU WERE ?Y?", "WHAT WOULD IT MEAN IF YOU WERE ?Y?"]}, {rule: {pat: "I AM", len: 4, left: "?X", right: "?Y"}, responses: ["IN WHAT WAY ARE YOU ?Y?", "DO YOU WANT TO BE ?Y?"]}, {rule: {pat: "AM I", len: 4, left: "?X", right: "?Y"}, responses: ["DO YOU BELIEVE YOU ARE ?Y?", "WOULD YOU WANT TO BE ?Y?", "YOU WISH I WOULD TELL YOU YOU ARE ?Y?"]}, {rule: {pat: "AM", len: 2, left: "?X", right: "?Y"}, responses: ["I DON'T UNDERSTAND THAT..."]}];

function patternMatcher(pattern, input) {
	var bindings = {};
	var pos = input.indexOf(pattern.pat);
	if (pos == -1) {
		return false;
	} else if (pos !== 0 || pos + pattern.len !== input.length || pos == 0 && input.length == pattern.len) {
		extendBindings(pattern.left, input.slice(0, pos), bindings);
		extendBindings(pattern.right, input.slice(pos + pattern.len, input.length), bindings);
		return bindings;
	}
}

function any(test, array) {
	for (var i = 0; i < array.length; i++) {
		var found = test(array[i]);
		if (found) {
			return found;
		}
	}
	return false;
}

function randomElt(a) {
	return a[Math.floor(a.length*Math.random())];
}

function changeContext(result) {
	var changes = [[" I ", " YOU "], [" ME ", " YOU "], [" AM ", " ARE "], [" MY ", " YOUR "]];
	for (var i = 0; i < changes.length; i++) {
		var elt = changes[i];
		if (result.indexOf(elt[0]) >= 0) {
			result = result.replace(elt[0], elt[1]);
		}
	}
	return result;
}

function removeMarks(result) {
	var marks = [".", "!", "?"];
	for (var i = 0; i < marks.length; i++) {
		if (result.indexOf(marks[i]) >= 0) {
			result = result.replace(marks[i], "");
		}
	}
	return result;
}

function generateAnswer(input) {
	input = removeMarks(input.toUpperCase());
	return any(function(name) {
			var result = patternMatcher(name.rule, input);
			if (result) {
				var answer = randomElt(name.responses);
				if (answer.indexOf("?X") >= 0) {
					answer = answer.replace("?X", changeContext(result["?X"]));
				}
				if (answer.indexOf("?Y") >= 0) {
					answer = answer.replace("?Y", changeContext(result["?Y"]));
				}
				return answer;
			}
	}, rules);
}

var endings = ["IT'S ITERESTING. TELL ME MORE ABOUT IT, PLEASE.", "WELL, WELL...", "WHAT?"];
var starters = ["DON'T BE SHY. TELL ME SOMETHING ABOUT YOUR PROBLEM, PLEASE."];

// UI components implemented in React.js

var BasicButton = React.createClass({
	render: function() {
		var className = "btn";
		if (this.props.className) {
			className = this.props.className;
		}
			return React.DOM.div({onClick: function (e) { return this.props.fn(this.props.data);}.bind(this),
					      className: className,
					      style: this.props.style},
					     this.props.name);
	}
		
});

var ElizaUI = React.createClass({
	getInitialState: function() {
		return {chatList: [], userText: ''};
	},

	makeChatList: function () {
			var makeChatItem = function(text) {
				return React.DOM.li(null, text);
			};
			return React.DOM.ul(null, this.state.chatList.map(makeChatItem));
	},

	handleSubmit: function (e) {
		e.preventDefault();
		var userInput = this.state.userText.toUpperCase();
		var elizaOutput = generateAnswer(userInput);
		if (elizaOutput == false) {
			elizaOutput = randomElt(endings);
		}
		if (userInput == "") {
			userInput = "...";
			elizaOutput = randomElt(starters);
		}
		var chatList = this.state.chatList.concat(["YOU: " + userInput, 'ELIZA: ' + elizaOutput]);
		this.setState({chatList: chatList, userText: ''});
	},

	onChange: function (e) {
		this.setState({userText: e.target.value});
	},
	
	render: function() {
		var chatList = this.makeChatList();
		return React.DOM.div(null, React.DOM.legend('ELIZA PROGRAM'), chatList, 
				     React.DOM.form({className: "pure-form pure-form-stacked", onSubmit: this.handleSubmit},React.DOM.fieldset(null, 
						    React.DOM.input({className: "pure-u-1-2", onChange: this.onChange, value: this.state.userText, type: 'text'}), 
						    React.DOM.button({className: 'pure-u-1-2 pure-button pure-button-primary', type: 'submit'}, 'Say to Eliza'))));
	}
});

React.renderComponent(ElizaUI(), document.getElementById('eliza-ui'));
