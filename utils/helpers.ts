import type { ApiOptions, ApiResponse } from './types'

const defaultApiOptions: ApiOptions = {
	method: 'GET',
	headers: {},
	useBackendApi: true,
	sendToken: true
}

async function apiCall(api: string, options: ApiOptions = defaultApiOptions): Promise<ApiResponse> {
	const backend = useRuntimeConfig().public.backend

	options.headers ??= {}
	options.useBackendApi ??= true

	if (options.sendToken !== false) {
		const token = localStorage.getItem('admin-token')
		options.headers.authorization = `Bearer ${token}`
	}

	const config: RequestInit = {
		method: options.method,
		headers: options.headers,
		body: options.body
	}
	if (options.json) {
		options.headers['content-type'] = 'application/json'
		config.body = JSON.stringify(options.json)
	}

	const res = await fetch(options.useBackendApi ? backend + api : api, config)
	const { ok, status: statusCode, statusText: statusMessage } = res
	const json = await res.json()
	if (statusCode === 401) {
		localStorage.removeItem('admin-token')
		navigateTo('/login')
	}
	return { res, ok, statusCode, statusMessage, json }
}

function apiCallXhr(api: string, options = defaultApiOptions): Promise<ApiResponse> {
	const backend = useRuntimeConfig().public.backend

	options.headers = options.headers || {}
	options.useBackendApi ??= true

	if (options.sendToken !== false) {
		const token = localStorage.getItem('admin-token')
		options.headers.authorization = `Bearer ${token}`
	}

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open(options.method ?? 'GET', options.useBackendApi ? backend + api : api)

		xhr.upload.onprogress = function (event) {
			if (options.onUpdate && typeof options.onUpdate === 'function') {
				const percent = (event.loaded / event.total) * 100
				options.onUpdate(percent)
			}
		}

		for (const [header, value] of Object.entries(options.headers ?? {})) {
			xhr.setRequestHeader(header, value)
		}

		xhr.onload = function () {
			const { status: statusCode, statusText: statusMessage } = xhr
			let json: any = xhr.responseText
			try {
				json = JSON.parse(xhr.responseText)
			} catch (error) { }

			if (statusCode === 401) {
				localStorage.removeItem('admin-token')
				navigateTo('/login')
			}

			const response = {
				res: xhr.response,
				ok: xhr.status >= 200 && xhr.status < 300,
				statusCode,
				statusMessage,
				json
			}

			resolve(response)
		}

		xhr.onerror = function () {
			const { status: statusCode, statusText: statusMessage } = xhr
			const json = JSON.parse(xhr.responseText)
			const response = {
				res: xhr.response,
				ok: false,
				statusCode,
				statusMessage,
				json
			}
			resolve(response)
		}

		xhr.onabort = xhr.onerror

		if (options.method === 'GET' || options.method === 'DELETE') {
			xhr.send()
		} else if (options.json) {
			xhr.setRequestHeader('Content-Type', 'application/json')
			xhr.send(JSON.stringify(options.json))
		} else {
			xhr.send(options.body)
		}
	})
}

function logout() {
	const data = useDataStore()
	localStorage.removeItem('admin-token')
	data.admin = undefined
	navigateTo('/login')
}

async function fetchProfile() {
	const token = localStorage.getItem('admin-token')
	if (!token) {
		return navigateTo('/login')
	}

	// Mock auth for development/demo
	if (token === 'dummy-token') {
		const data = useDataStore()
		data.admin = {
			_id: 'mock-id',
			name: 'Demo Admin',
			email: 'demo@example.com'
		}
		return
	}

	const data = useDataStore()
	const { ok, json, statusCode } = await helpers.apiCall('/admin/profile')
	if (!ok && statusCode === 401) {
		return navigateTo('/login')
	}
	data.admin = json.admin
}

function debounce<T extends (...args: any[]) => any>(func: T, delay: number = 500): (...args: Parameters<T>) => void {
	let timerId: NodeJS.Timeout

	return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
		clearTimeout(timerId)
		timerId = setTimeout(() => {
			func.apply(this, args)
		}, delay)
	}
}

const helpers = {
	apiCall,
	apiCallXhr,
	logout,
	fetchProfile,
	debounce
}

export default helpers
