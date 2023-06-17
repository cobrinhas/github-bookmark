const githubRepoUrlStorageKey = 'github-bookmark.repo-url';
const githubApiTokenStorageKey = 'github-bookmark.api-token';

const memoryStorage = <Record<string, string>>{};

type StatusType = 'info' | 'error' | 'warning' | 'success';

export function load() {
	const websiteUrlInput = document.getElementById('website-url');
	const websiteTitleInput = document.getElementById('website-title');
	const githubRepoUrlInput = document.getElementById('github-repo-url');
	const githubApiTokenInput = document.getElementById('github-api-token');
	const saveButton = document.getElementById('save-button');

	chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
		const activeTab = tabs.find((x) => x.url);

		if (
			websiteUrlInput &&
			activeTab &&
			websiteUrlInput instanceof HTMLInputElement
		) {
			websiteUrlInput.value = `${activeTab.url}`;
		}

		if (
			websiteTitleInput &&
			activeTab &&
			websiteTitleInput instanceof HTMLInputElement
		) {
			websiteTitleInput.value = `${activeTab.title}`;
		}

		loadInMemoryStorage().then((result) => {
			const githubRepoUrl = result[githubRepoUrlStorageKey];
			const githubApiToken = result[githubApiTokenStorageKey];

			if (
				githubRepoUrlInput &&
				githubRepoUrl &&
				githubRepoUrlInput instanceof HTMLInputElement
			) {
				githubRepoUrlInput.value = `${githubRepoUrl}`;
			}

			if (
				githubApiTokenInput &&
				githubApiToken &&
				githubApiTokenInput instanceof HTMLInputElement
			) {
				githubApiTokenInput.value = `${githubApiToken}`;
			}
		});
	});

	if (saveButton && saveButton instanceof HTMLButtonElement) {
		saveButton.onclick = save;
	}
}

export function save() {
	showSpinner();

	const websiteUrlInput = document.getElementById('website-url');
	const websiteTitleInput = document.getElementById('website-title');
	const githubRepoUrlInput = document.getElementById('github-repo-url');
	const githubApiTokenInput = document.getElementById('github-api-token');

	let githubRepoUrl: string | undefined;
	let githubApiToken: string | undefined;

	if (githubRepoUrlInput && githubRepoUrlInput instanceof HTMLInputElement) {
		githubRepoUrl = githubRepoUrlInput.value;
	}

	if (githubApiTokenInput && githubApiTokenInput instanceof HTMLInputElement) {
		githubApiToken = githubApiTokenInput.value;
	}

	const storage = <Record<string, string | undefined>>{};

	storage[githubRepoUrlStorageKey] = githubRepoUrl;
	storage[githubApiTokenStorageKey] = githubApiToken;

	for (const key in storage) {
		const value = storage[key];
		const memoryValue = memoryStorage[key];

		if (!value || memoryValue === value) {
			delete storage[key];
		} else {
			memoryStorage[key] = value;
		}
	}

	if (Object.keys(storage).length > 0) {
		chrome.storage.sync.set(storage);
	}

	if (!githubRepoUrl) {
		setStatusMessage(
			'To proceed, please insert the GitHub repo url to create issues.'
		);

		return;
	}

	if (!githubApiToken) {
		setStatusMessage(
			'To proceed, please insert an API token with permissions to create issues on target repo.'
		);

		return;
	}

	if (!websiteUrlInput || !(websiteUrlInput instanceof HTMLInputElement)) {
		setStatusMessage(
			`oops, looks like Website URL is misssing? ${websiteUrlInput}`
		);

		return;
	}

	if (!websiteTitleInput || !(websiteTitleInput instanceof HTMLInputElement)) {
		setStatusMessage(
			`oops, looks like Website Title is misssing? ${websiteTitleInput}`
		);

		return;
	}

	const repoUrlRegexp = new RegExp(/.*github.com\/(.+)\/(.+).*/g).exec(
		githubRepoUrl
	);

	if (!repoUrlRegexp) {
		setStatusMessage(
			`Make sure the repo url follows this syntax: https://github.com/<owner>/<repo>`
		);

		return;
	}

	if (repoUrlRegexp) {
		const owner = repoUrlRegexp[1];
		const repo = repoUrlRegexp[2];

		fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, <RequestInit>{
			method: 'POST',
			body: JSON.stringify({
				owner: owner,
				repo: repo,
				title: websiteTitleInput.value,
				body: websiteUrlInput.value
			}),
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
				Authorization: `Bearer ${githubApiToken}`
			}
		})
			.then((result) => {
				if (result.ok) {
					result.json().then((json) => setIssueUrl(json.html_url));
				} else {
					const statusType: StatusType = 'error';
					let message: string;

					switch (result.status) {
						case 401:
							message = `Did you misstyped your API token?`;
							break;
						case 403:
							message = `Does your API token have the "Read and Write access to issues" permission for the selected repo?`;
							break;
						case 404:
							message = `Does this repo really exist?`;
							break;
						default:
							message = `I wasn't expecting this error from GitHub API!`;
					}

					setStatusMessage(`${message} (${result.status}) `, statusType);
				}
			})
			.catch((err) => {
				setStatusMessage(err, 'error');
			})
			.finally(hideSpinner);
	}
}

function loadInMemoryStorage() {
	const get = chrome.storage.sync.get([
		githubRepoUrlStorageKey,
		githubApiTokenStorageKey
	]);

	get.then((result) => {
		const githubRepoUrl = result[githubRepoUrlStorageKey];
		const githubApiToken = result[githubApiTokenStorageKey];

		memoryStorage[githubRepoUrlStorageKey] = githubRepoUrl;
		memoryStorage[githubApiTokenStorageKey] = githubApiToken;
	});

	return get;
}

function setStatusMessage(
	message: string | undefined,
	type: StatusType = 'info'
) {
	const formStatusDiv = document.getElementById('form-status');
	const statusP = document.getElementById('status');

	if (!formStatusDiv) {
		return;
	}

	if (!message) {
		formStatusDiv.classList.add('hidden');

		return;
	}

	formStatusDiv.classList.remove('hidden');

	if (statusP instanceof HTMLParagraphElement) {
		statusP.textContent = message;

		const statusTypeCSSClass = `text-${type}`;

		statusP.classList.remove('hidden');

		if (statusP.classList.length > 2) {
			statusP.classList.remove(statusP.classList.item(2) ?? statusTypeCSSClass);
		}

		if (type !== 'info') {
			statusP.classList.add(statusTypeCSSClass);
		}
	}
}

function setIssueUrl(url: string) {
	const formStatusDiv = document.getElementById('form-status');
	const issueA = document.getElementById('issueUrl');

	if (!formStatusDiv) {
		return;
	}

	if (!issueA) {
		formStatusDiv.classList.add('hidden');

		return;
	}

	formStatusDiv.classList.remove('hidden');

	if (issueA instanceof HTMLAnchorElement) {
		issueA.innerText = '🦋 Take me to the issue! 🦋';

		issueA.classList.remove('hidden');

		issueA.setAttribute('href', url);
	}
}

function showSpinner() {
	const formStatusDiv = document.getElementById('form-status');
	const spinnerDiv = document.getElementById('spinner');

	if (!formStatusDiv) {
		return;
	}

	if (formStatusDiv) {
		formStatusDiv.classList.remove('hidden');
	}

	if (spinnerDiv) {
		spinnerDiv.classList.remove('hidden');
	}
}

function hideSpinner() {
	const formStatusDiv = document.getElementById('form-status');
	const spinnerDiv = document.getElementById('spinner');

	if (!formStatusDiv) {
		return;
	}

	if (spinnerDiv) {
		spinnerDiv.classList.add('hidden');
	}
}
