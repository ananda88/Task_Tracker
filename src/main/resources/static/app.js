let globalTaskList;


document.getElementById('add-comments').addEventListener('click', () => {
	document.getElementById('comment-creation').classList.toggle('hide');
});

document.getElementById('cancel-comment-button').addEventListener('click', () => {
	document.getElementById('entered-comment').value = '';
	document.getElementById('comment-creation').classList.toggle('hide');
});


document.getElementById('update-task-btn').addEventListener('click', () => {
	const headers = new Headers({
		'Content-Type': 'application/json'
	});
	let updatedTaskDescription = document.getElementById('task-update-description').value;
	let taskId = document.getElementById('taskId').textContent;
	let req ={
		id: taskId,
		description: updatedTaskDescription
	}
	fetch(`http://localhost:8080/api/v1/task/${taskId}`, {
		method: 'PATCH',
		body: JSON.stringify(req),
		headers: headers
		}).then(response => response.json()).then((body) => {
			createElementFromJson(body);
			closeUpdateModal();
		});
	
});


document.getElementById('add-comment-button').addEventListener('click', () => {
	let taskId = document.getElementById('taskId').textContent;
	let comment = document.getElementById('entered-comment').value;
	let req = {
		comment: comment
	}
	const headers = new Headers({
		'Content-Type': 'application/json'
	});
	fetch(`http://localhost:8080/api/v1/task/${taskId}/comment`, {
		method: 'POST',
		body: JSON.stringify(req),
		headers: headers
	}).then((response) =>
		response.json()
	).then((body) => {
		console.log(body);
		document.getElementById('comment-holder').innerHTML = '';
		createElementFromJson(body);
		document.getElementById('entered-comment').value = '';
		document.getElementById('comment-creation').classList.toggle('hide');
	})
})

const createTaskButton = document.getElementById('create-task-button');
createTaskButton.addEventListener('click', () => {
	console.log('captured event');
	document.getElementById('task-addition').classList.remove('hide');
});

const addTaskButton = document.getElementById('add-task-button');
addTaskButton.addEventListener('click', () => {
	const taskSummary = document.getElementById('task-summary').value;
	const taskDescription = document.getElementById('task-description').value;
	const targetDate = document.getElementById('task-target-date').value;
	const priority = document.getElementById('task-priority').value;

	if (!taskSummary || !taskDescription || !targetDate || !priority) {
		if (document.getElementById('error-container').classList.contains('hide')) {
			document.getElementById('error-container').classList.remove('hide');
		}
	} else {
		if (!document.getElementById('error-container').classList.contains('hide')) {
			document.getElementById('error-container').classList.add('hide');
		}


		const req = {
			'summary': taskSummary,
			'description': taskDescription,
			'targetDate': targetDate,
			'status': 'pending',
			'priority': priority
		}
		addTaskFn(req).then(response => {
			console.log(`ID of the task created ${response}`);
			populateTaskList();
			closemodal();
		}).catch(error => console.log(error));
	}
});

function addTaskFn(request) {
	console.log('creating a task...');
	const headers = new Headers({
		'Content-Type': 'application/json'
	});
	return fetch('http://localhost:8080/api/v1/task', {
		method: 'POST',
		body: JSON.stringify(request),
		headers: headers
	}).then(response => {
		result = response.json();
		console.log(result);
		return result;
	});

}



function populateTaskList() {
	fetch('http://localhost:8080/api/v1/task').then(response => {
		response.json().then(tasks => {
			document.getElementById('left-container').innerHTML = '';
			for (let task of tasks) {
				createTaskSummaryList(task);
			}
			globalTaskList = tasks;
			createElementFromJson(tasks[0]);
		});

	});
}

function createTaskSummaryList(task) {
	let parentEl = document.createElement('div');
	parentEl.classList.add('parent-element-class');
	let parentLeftEl = document.createElement('div');
	parentLeftEl.style = 'margin-bottom:10px';
	let parentRightEl = document.createElement('div');
	//parentRightEl.style='display:inline-block;width:45%';

	let taskSummary = document.createElement('a');
	taskSummary.innerHTML = task.summary.toUpperCase();
	taskSummary.style = 'font-size:14px; display:inline-block; text-decoration:none; font-weight: bold';
	taskSummary.setAttribute('href', '#');
	taskSummary.addEventListener('click', (event) => {
		let taskId = event.srcElement.nextSibling.textContent;
		console.log(taskId);
		for (let t of globalTaskList) {
			if (t.id == taskId) {
				createElementFromJson(t);
			}
		}
	});

	let taskIdEl = document.createElement('p');
	taskIdEl.setAttribute('name', 'task-id-el');
	taskIdEl.textContent = task.id;
	taskIdEl.setAttribute('hidden', 'true');

	let taskStatusEl = document.createElement('p');
	taskStatusEl.textContent = task.status.toUpperCase();
	if (task.status == 'pending') {
		taskStatusEl.style = 'color: red; display:inline;margin-right:10px';
	} else {
		taskStatusEl.style = 'color: green; display:inline;margin-right:10px';
	}

	let taskIdLeftEl = document.createElement('p');
	taskIdLeftEl.textContent = task.id;
	taskIdLeftEl.setAttribute('hidden', 'true');
	parentLeftEl.appendChild(taskSummary);
	parentLeftEl.appendChild(taskIdLeftEl);

	parentRightEl.appendChild(taskIdEl);
	parentRightEl.appendChild(taskStatusEl);


	let tasktargetDateEl = document.createElement('p');
	tasktargetDateEl.style = 'display: inline;margin-right:30px';
	if (task.targetDate)
		tasktargetDateEl.textContent = 'DUE DATE : ' + task.targetDate.slice(0, 10);

	//let taskPriorityEl = document.createElement('p');
	//taskPriorityEl.textContent = task.priority;
	let taskPriorityEl = document.createElement('div');
	taskPriorityEl.style = 'text-align: center; display:inline';
	if (task.priority == 'High') {
		taskPriorityEl.innerHTML = '<i class="fa fa-chevron-up" style="color:red"></i>';
	} else if (task.priority == 'Medium') {
		taskPriorityEl.innerHTML = '<i class="fa fa-align-justify" style="color: orange"></i>';
	} else {
		taskPriorityEl.innerHTML = '<i class="fa fa-chevron-down" style="color: rgb(216, 216, 1)"></i>';
	}

	parentRightEl.appendChild(tasktargetDateEl);
	parentRightEl.appendChild(taskPriorityEl);

	parentEl.appendChild(parentLeftEl);
	parentEl.appendChild(parentRightEl);

	document.getElementById('left-container').appendChild(parentEl);
}

function deleteTaskFn(id) {
	console.log('Deleting task with ID : ' + id);

	fetch('http://localhost:8080/api/v1/task/' + id, {
		method: 'DELETE'
	}).then(response => populateTaskList())
		.catch(error => console.log(error));

}

function updateTaskInBackend(task) {
	const headers = new Headers({
		'Content-Type': 'application/json'
	});
	fetch('http://localhost:8080/api/v1/task/', {
		method: 'PATCH',
		body: JSON.stringify(task),
		headers: headers
	}).then(response => response.json())
		.then(body => console.log(body));
}

function closemodal() {
	document.getElementById('task-summary').value = '';
	document.getElementById('task-description').value = '';
	document.getElementById('task-target-date').value = '';
	document.getElementById('task-addition').classList.add('hide');
	if (!document.getElementById('error-container').classList.contains('hide')) {
		document.getElementById('error-container').classList.add('hide');
	}
}

function closeUpdateModal() {
	document.getElementById('task-update-modal').classList.toggle('hide');
}


function createElementFromJson(task) {
	console.log(task);
	document.getElementById('right-container-top').innerHTML = '';
	let div = document.createElement('div');
	div.classList.add('taskContainer');
	let header = document.createElement('div');
	header.textContent = task.summary.toUpperCase();
	header.classList.add('task-header');

	if (task.status !== 'complete') {
		let completeTask = document.createElement('button');
		completeTask.setAttribute('name', 'randomName');
		completeTask.innerHTML = 'Complete Task';
		completeTask.classList.add('completebtn');
		//completeTask.innerHTML = '<i class="fa-solid fa-check-double"></i>';
		completeTask.addEventListener('click', () => {
			let taskId = event.srcElement.nextSibling.textContent;
			for (let taskIdEl of document.getElementsByName('task-id-el')) {
				if (taskIdEl.textContent == taskId) {
					let statusEl = taskIdEl.nextSibling;
					statusEl.textContent = 'COMPLETE';
					statusEl.style = 'color:green;display:inline;margin-right: 10px';
				}
			}
			document.getElementById('current-status').textContent = 'Status : complete';
			event.srcElement.style = 'display: none';
			console.log(taskId);
			let updatedTask = {
				id: taskId,
				status: 'complete'
			}
			updateTaskInBackend(updatedTask);
		});
		header.appendChild(completeTask);
	}
	let deleteTask = document.createElement('button');
	deleteTask.addEventListener('click', () => {
		document.getElementById('task-id-for-deletion').textContent = event.srcElement.previousSibling.textContent;
		document.getElementById('deletion-confirm-modal').classList.toggle('hide');

		//let taskId = event.srcElement.previousSibling.textContent;
		//deleteTaskFn(taskId);
	});
	let taskIdEl = document.createElement('p');
	taskIdEl.setAttribute('id', 'taskId');
	taskIdEl.style = 'margin: 1px solid black';
	taskIdEl.setAttribute('hidden', 'true');
	taskIdEl.textContent = task.id;
	header.appendChild(taskIdEl);
	deleteTask.innerHTML = 'Delete Task';
	deleteTask.classList.add('deletebtn');
	header.appendChild(deleteTask);
	document.getElementById('right-container-top').appendChild(header);

	let taskBody = document.createElement('div');
	taskBody.style = 'display: block';


	let taskBodyLeft = document.createElement('div');
	taskBodyLeft.style = 'width:65%; display:inline-block';

	let taskDetailsheader = document.createElement('div');

	let taskDetailsHeaderText = document.createElement('p');
	taskDetailsHeaderText.style = 'font-size: 14px;display: inline-block; margin-right: 10px;  font-weight: bold';
	taskDetailsHeaderText.textContent = 'DESCRIPTION ';


	

	taskDetailsheader.appendChild(taskDetailsHeaderText);
	
	
	let taskDetailsBody = document.createElement('div');

	let taskDetails = document.createElement('div');
	taskDetails.innerHTML = '<p>' + task.description + '</p>';
	taskDetails.classList.add('taskDetailsBody');
	
	
	let taskDetailsEdit = document.createElement('button');
	taskDetailsEdit.innerHTML = '<i class="fa fa-edit"></i>';
	taskDetailsEdit.classList.add('edit-btn');
	taskDetailsEdit.addEventListener('click', () => {
		document.getElementById('task-update-description').value = task.description;
		document.getElementById('task-update-modal').classList.toggle('hide');
	});
	
	taskDetailsBody.appendChild(taskDetails);
	taskDetailsBody.appendChild(taskDetailsEdit);

	taskBodyLeft.appendChild(taskDetailsheader);
	taskBodyLeft.appendChild(taskDetailsBody);

	let taskBodyRight = document.createElement('div');
	taskBodyRight.style = 'width:30%; display:inline-block';

	let dueDate = document.createElement('p');
	dueDate.style = 'margin:20px; display:block;font-family: Verdana, Geneva, Tahoma, sans-serif;';
	if (task.targetDate)
		dueDate.textContent = 'Due Date : ' + task.targetDate.slice(0, 10);

	let currentStatus = document.createElement('p');
	currentStatus.setAttribute('id', 'current-status');
	currentStatus.style = 'margin:20px; display;font-family: Verdana, Geneva, Tahoma, sans-serif;'
	currentStatus.textContent = 'Status : ' + task.status.toUpperCase();

	let currentPriority = document.createElement('p');
	currentPriority.setAttribute('id', 'current-priority');
	currentPriority.style = 'margin:20px; display;font-family: Verdana, Geneva, Tahoma, sans-serif;'
	console.log(task.priority ? task.priority.toUpperCase() : 'not present ');
	if (task.priority)
		currentPriority.textContent = 'Priority : ' + task.priority.toUpperCase();

	taskBodyRight.appendChild(dueDate);
	taskBodyRight.appendChild(currentStatus);
	taskBodyRight.appendChild(currentPriority);

	taskBody.appendChild(taskBodyLeft);
	taskBody.appendChild(taskBodyRight);

	div.appendChild(taskBody);
	document.getElementById('right-container-top').appendChild(div);


	// add comments if present
	if (task.comments.length > 0) {
		document.getElementById('comment-holder').innerHTML = '';
		for (let comment of task.comments) {
			let commentHolder = document.createElement('div');
			commentHolder.classList.add('comment-holder-class');

			let commentContent = document.createElement('p');
			commentContent.setAttribute('id', 'current-status');
			commentContent.style = 'margin:5px; display:inline-block;font-size: 16px;'
			commentContent.textContent = comment.comment;

			let createdDate = document.createElement('p');
			createdDate.style = 'margin-top:10px; color: darkgrey; font-size: 12px ';
			createdDate.textContent = comment.createdDate.slice(0, 10) + ' ' + comment.createdDate.slice(12, 19) + '(GMT)';

			commentHolder.append(commentContent);
			commentHolder.append(createdDate);

			let eElement = document.getElementById('comment-holder');
			eElement.insertBefore(commentHolder, eElement.firstChild);

		}
	} else {
		console.log('no comment present');
		document.getElementById('comment-holder').innerHTML = '';
	}
}

document.getElementById('delete-confirm').addEventListener('click', () => {
	//let taskId = event.srcElement.previousSibling.textContent;
	let taskId = document.getElementById('task-id-for-deletion').textContent;
	console.log('new delete event', taskId);
	document.getElementById('deletion-confirm-modal').classList.toggle('hide');
	deleteTaskFn(taskId);
});

document.getElementById('delete-cancel').addEventListener('click', () =>
	document.getElementById('deletion-confirm-modal').classList.toggle('hide'));


populateTaskList();

