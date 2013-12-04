var idness = 0;

function reset()
{
	idness = 0;

	document.getElementById('resetbtnattop').style.display = 'none';
	document.getElementById('troubleshooter').innerHTML = "";
	if (window.location.hash != "")
	{
		document.getElementById('resetbtnattop').style.display = 'inline';
	}
	appendQuestionById(document.getElementById('troubleshooter'), window.location.hash.substr(1));
}

function clearedReset()
{
	window.location.hash = "";
	reset();
}

function clicked(btn, parent, ans)
{
	parent.innerHTML = "";

	//setTimeout(function() { window.scrollBy(0, window.innerHeight) } , 0);

	disableBtns(btn);

	if ('message' in ans)
	{
		var newmessage = document.createElement('p');
		newmessage.setAttribute('class', 'message');
		newmessage.innerHTML = ans.message;
		parent.appendChild(newmessage);
	}

	if ('askiffixed' in ans)
	{
		var askq = askiffixed_question;
		askq.answers[1].nextquestion = ans.nextquestion;

		appendQuestion(parent, askq);
		return;
	}

	if (!('nextquestion' in ans))
	{
		var newmessage = document.createElement('p');
		newmessage.setAttribute('class', 'message');
		newmessage.innerHTML = "Thank you for testing the SR Troubleshooter.<br />Have a nice day!";
		parent.appendChild(newmessage);

		// reset button
		/*var resetbutton = document.createElement('button');
		resetbutton.setAttribute('class', 'answer');
		resetbutton.onclick = clearedReset;

		resetbutton.textContent = "Troubleshoot another issue";*/
		document.getElementById('resetbtnattop').style.display = 'inline';

		parent.appendChild(resetbutton);

		return;
	}

	appendQuestionById(parent, ans.nextquestion);
}

function disableBtns(btn)
{
	//var i = 0;
	//var oldbtns = document.getElementsByClassName('answer');
	//for (i = 0; i < oldbtns.length; i++)
	//{
	//	oldbtns[i].setAttribute('disabled', 'disabled');
	//}

	// this needs rethinking if we re-introduce it, so that when you click on buttons in the past we don't get lots of them with this property in the same row
	//btn.setAttribute('class', 'clicked');
	//document.getElementById('resetbtnattop').style.display = 'inline'
}

function genClicked(btn, parent, ans)
{
	return function()
	{
		clicked(btn, parent, ans);
	};
}

function appendQuestionById(parent, questionid)
{
	window.location.hash = "#" + questionid;
	appendQuestion(parent, questions[questionid]);
}

function appendQuestion(parent, question)
{
	var newquestioncont = document.createElement('div');

	var newquestion = document.createElement('div');
	newquestion.setAttribute('class', 'question');

	var questionpara = document.createElement('p');
	questionpara.setAttribute('class', 'question');
	questionpara.innerHTML = question.question;

	newquestion.appendChild(questionpara);

	var questionform = document.createElement('form');

	newquestion.appendChild(questionform);

	var i = 0;
	for (i = 0; i < question.answers.length; i++)
	{
		var ansspan = document.createElement('span');
		ansspan.setAttribute('class', 'rostok');

		var ans = question.answers[i];
		var ansbutton = document.createElement('input');
		ansbutton.setAttribute('type', 'radio');
		ansbutton.setAttribute('class', 'answer');
		ansbutton.id = idness;
		ansbutton.name = "rostok";
		ansbutton.onclick = genClicked(ansbutton, newquestioncont/*parent*/, ans);

		var anstext = document.createElement('label');
		anstext.setAttribute('for', idness);
		anstext.textContent = ans.answer;

		idness++;

		ansspan.appendChild(ansbutton);
		ansspan.appendChild(anstext);
		questionform.appendChild(ansspan);
	}

	parent.appendChild(newquestion);
	parent.appendChild(newquestioncont);
}

reset();
