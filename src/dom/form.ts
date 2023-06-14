const githubRepoUrlStorageKey = 'github-bookmark.repo-url';
const githubApiTokenStorageKey = 'github-bookmark.api-token';

const memoryStorage = <Record<string, string>>{};

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
		return;
	}

	if (!githubApiToken) {
		return;
	}

	if (!websiteUrlInput || !(websiteUrlInput instanceof HTMLInputElement)) {
		return;
	}

	if (!websiteTitleInput || !(websiteTitleInput instanceof HTMLInputElement)) {
		return;
	}

	const repoUrlRegexp = new RegExp(/.*github.com\/(.+)\/(.+).*/g).exec(
		githubRepoUrl
	);

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
		}).then((result) => {
			console.log(result);
		});
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
