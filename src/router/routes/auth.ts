import AuthLayout from '../../layouts/AuthLayout.vue'
import LoginView from '../../views/login/LoginView.vue'

export default [
	{
		path: '/login',
		component: AuthLayout,
		children: [
			{
				path: '',
				name: 'Login',
				component: LoginView
			}
		]
	}
]

