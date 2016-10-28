(function() {
	var status = document.getElementById('status');
	var joke = document.getElementById('joke');
	var searchField = 	document.getElementById("search-field");
	var firstName = document.getElementById('first-name');
	var lastName = document.getElementById('last-name');

	var time = new Date();
	var hour = time.getHours();
	var nightMode = false;
	if (hour < 6 || hour > 18) {
		nightMode = true;
	}

	if (nightMode) {
		document.body.style['background-color'] = '#111';
		document.body.style.color = '#fff';
	}
	var jokes = [
		'Sorry, Anthony. <span style="color:red">I had to.</span> &#9786;',
		'Where dreams are utterly demolished. With a smile.',
		'The class where the teacher\'s clearly more<br> excited than he has any right to be.',
		'<pre class="code">public class Webproject {\n  public Webproject() {\n    Teacher teacher = (Teacher) new Anthony();\n  }\n}</pre>',
		'<pre class="code">const Webproject = function() {\n  this.teacher = new Anthony();\n}</pre>'
	];
	var index = Math.floor(Math.random() * jokes.length);
	joke.innerHTML = jokes[index];

	searchField.addEventListener("keyup", function(event) {
		    event.preventDefault();
		    if (event.keyCode == 13) {
		        document.getElementById("search-button").click();
		    }
		});
	var cache;
	var get = function(url, cb) {
		if (cache) {
			cb(cache.feed.entry);
			return;
		}
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onload = function() {
			var json = JSON.parse(xhr.response);
			cache = json;
			cb(json.feed.entry);
		};
		xhr.send();
	};
	var carry = function(enteredId, json) {
		var user = json.filter(function(entry) {
			return entry.gsx$studentid.$t === enteredId;
		});
		if (user.length > 1) {
			alert('found more than one user. Assuming you\'re the first one found');
		}
		if (!user.length) {
			status.innerHTML = 'Could not find a student with that ID';
			return;
		}
		user = user[0];

		firstName.innerHTML = user.gsx$firstname.$t;
		lastName.innerHTML = user.gsx$lastname.$t;

		var obligs = [
			'obligpassed',
			'pact',
			'freakyfriday',
			'seeitnowmakeit',
			'mmoscg',
			'snowballchallenge',
			'introductionweek',
			'innovationcamp',
			'tango',
			'accessibilitychallenge'
		];
		var foundObligs = [];
		var i;
		var len;
		var oblig;
		for (i = 0, len = obligs.length; i < len; i += 1) {
			oblig = obligs[i];
			var obligVal = user['gsx$' + oblig];
			if (obligVal){
				obligVal = obligVal.$t;
				if (!obligVal) {
					obligVal = null;
				}
				foundObligs.push({id: oblig, val: obligVal});
			} else {
				foundObligs.push({id: oblig, val: null});
			}
		}

		var el;
		var getParentTr = function(el) {
			if (el.tagName === 'TR') {
				return el;
			}
			return getParentTr(el.parentElement);
		};
		for (i = 0, len = foundObligs.length; i < len; i += 1) {
			oblig = foundObligs[i];
			var val = oblig.val ? oblig.val.toUpperCase() : '';
			if (oblig.id === 'obligpassed') {
				val = oblig.val;
			}
			el = document.getElementById(oblig.id);
			getParentTr(el).classList.remove('ok', 'in-progress', 'fail', 'no');
			el.innerHTML = val;
			if (oblig.val === 'ok') {
				getParentTr(el).classList.add('ok');
			} else if (oblig.val === 'in progress') {
				getParentTr(el).classList.add('in-progress');
			} else if (oblig.val === 'fail') {
				getParentTr(el).classList.add('fail');
			} else {
				getParentTr(el).classList.add('no');
			}

		}
	};
	window.search = function() {
		status.innerHTML = '';
		var enteredId = searchField.value;
		if (enteredId.charAt(0) !== 's') {
			enteredId = 's' + enteredId;
		}
		var spreadsheetID = "1ytexRxojdKsiX2nsvoH857EH3n0o2v3z2lRNqhGY3dE";
		var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";
		var run = carry.bind(null, enteredId);
		get(url, run);
	};
}());
